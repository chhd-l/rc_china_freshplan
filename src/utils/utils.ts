import pickBy from 'lodash/pickBy'
import moment from 'moment'

export const getCurrencyCode = () => {
  return '￥'
}

export const formatDateToApi = (date: string): string => {
  return new Date(date).toISOString()
}

export const formatMoney = (price: number) => {
  return getCurrencyCode() + (price || 0).toFixed(2)
}

export const getCycleItem = (sku, cycle) => {
  let discount = 1;
  switch (cycle) {
    case 'QUARTER':
      discount = 0.85;
      break;
    case 'HALF_YEAR':
      discount = 0.8;
      break;
    case 'YEAR':
      discount = 0.75;
      break;
  }
  let originalPrice = sku.subscriptionPrice * sku.num;
  let quarterCycle = {
    cycle,
    originalPrice: originalPrice,
    discountPrice: Math.ceil(originalPrice * discount),
    feedingDays: sku.feedingDays * sku.num,
  };
  return quarterCycle;
};

export const dealDatasForApi = (feData, apiKeies, feKies) => {
  //字段sort需要保持一致(只能处理简单对象字段)
  let apiData = {} as any
  apiKeies.forEach((key, idx) => {
    apiData[key] = feData[feKies[idx]]
  })
  return apiData
}

export const pickForUpdate = (data, primaryData) => {
  //data:传入的数据,primaryData：修改前接口获取的数据
  let updatedObj = pickBy(data, function (value, key) {
    console.info(value !== primaryData[key], value, primaryData[key])
    return value !== primaryData[key]
  })
  // updatedObj.id = primaryData.id //id需要一直存在
  return updatedObj
}

export const getAge = (birthdayStr) => {
  if (!birthdayStr) {
    return ''
  }
  let birthday = birthdayStr.split('-')
  // 新建日期对象
  let date = new Date()
  // 今天日期，数组，同 birthday
  let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  // 分别计算年月日差值
  let age = today.map((value, index) => {
    return value - birthday[index]
  })
  console.info('age', age)
  //月份需要+1
  age[1] += 1
  // 当天数为负数时，月减 1，天数加上月总天数
  if (age[2] < 0) {
    // 简单获取上个月总天数的方法，不会错
    let lastMonth = new Date(today[0], today[1], 0)
    // age[1]--
    age[2] += lastMonth.getDate()
  }
  // 当月数为负数时，年减 1，月数加上 12
  if (age[1] < 0) {
    age[0]--
    age[1] += 12
  }
  let yearStr = age[0] ? `${age[0]}年 ` : ''
  let monthStr = age[1] ? `${age[1]}月 ` : ''
  let ageStr = age[0] > 0 ? yearStr : monthStr
  if (!ageStr) {
    ageStr = '1月'
  }
  return ageStr
}

export const getAgeYear = (birthdayStr) => {
  if (!birthdayStr) {
    return ''
  }
  let birthday = birthdayStr.split('-')
  // 新建日期对象
  let date = new Date()
  // 今天日期，数组，同 birthday
  let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  // 分别计算年月日差值
  let age = today.map((value, index) => {
    return value - birthday[index]
  })

  let yearStr = age[0] ? `${age[0]}岁` : ''
  let ageStr = age[0] > 0 ? yearStr : '不到一岁'
  return ageStr
}

export const handleReturnTime = (time: any) => {
  if (time !== null && time !== undefined && time !== '') {
    return moment(new Date(time)).format('YYYY-MM-DD HH:mm:SS')
  } else {
    return ''
  }
}

export const getDateDiff = (startTime, endTime, orderCancelMinute) => {
  //将日期字符串转换为时间戳
  let sTime = new Date(startTime).getTime() //开始时间
  let eTime = new Date(endTime).getTime() //结束时间
  sTime = Number(sTime)
  eTime = Number(eTime)
  //作为除数的数字
  let divNumSecond = 1000
  let divNumMinute = 1000 * 60
  let divNumHour = 1000 * 3600
  let divNumDay = 1000 * 3600 * 24

  const day = parseInt(String((eTime - sTime) / parseInt(String(divNumDay))))
  const hour = parseInt(String(((eTime - sTime) % parseInt(String(divNumDay))) / parseInt(String(divNumHour))))
  const minute = parseInt(
    String(
      parseInt(String(((eTime - sTime) % parseInt(String(divNumDay))) % parseInt(String(divNumHour)))) /
      parseInt(String(divNumMinute)),
    ),
  )
  const second =
    (parseInt(String(((eTime - sTime) % parseInt(String(divNumDay))) % parseInt(String(divNumHour)))) %
      parseInt(String(divNumMinute))) /
    parseInt(String(divNumSecond))
  const str = day + '天' + hour + '小时' + minute + '分' + second + '秒'
  console.log(str)
  return {
    day,
    hour,
    minute:
      day > 0 || hour > 0 || minute >= orderCancelMinute
        ? 0
        : second > 0
          ? orderCancelMinute - 1 - Number(minute.toFixed(0))
          : orderCancelMinute - Number(minute.toFixed(0)),
    second: day > 0 || hour > 0 || minute >= orderCancelMinute ? 0 : 60 - Number(second.toFixed(0)),
  }
}
