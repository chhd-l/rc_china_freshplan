import { PickerView, PickerViewColumn, View } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import { useState, useEffect } from 'react'
import { genSeriesNumberArr } from '@/utils/utils'
import moment from 'moment'

interface IProps {
  visible: boolean;
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const fvalue = (val: string) => Number(val) < 10 ? `0${val}` : `${val}`;

const RccDatePicker = ({ visible, value, onChange, onClose, onConfirm }: IProps) => {
  const [years] = useState<string[]>(genSeriesNumberArr(1980, moment().year()));
  const [months, setMonths] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [selected, setSelected] = useState([0,0,0]);

  useEffect(() => {
    const date = moment((value || moment().format('YYYY-MM-DD')), 'YYYY-MM-DD');
    const dateArr = date.format('YYYY-MM-DD').split('-');
    const monthArr = genSeriesNumberArr(1, date.year() === moment().year() ? (moment().month() + 1) : 12).map(item => fvalue(item));
    const dayArr = genSeriesNumberArr(1, date.format('YYYY-MM') === moment().format('YYYY-MM') ? moment().date() : moment(date.format('YYYY-MM'), 'YYYY-MM').daysInMonth()).map(item => fvalue(item));
    setMonths(monthArr);
    setDays(dayArr);
    setSelected([years.indexOf(dateArr[0]), monthArr.indexOf(dateArr[1]), dayArr.indexOf(dateArr[2])]);
  }, [value])

  const handChange = (e: any) => {
    const val = e?.detail?.value;
    console.log(e?.detail?.value);
    if (moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').year(Number(years[val[0]])).month(val[1]).date(val[2] + 1).isAfter(moment().format('YYYY-MM-DD'))) {
      onChange(moment().format('YYYY-MM-DD'));
    } else {
      onChange(years[val[0]] + '-' + months[val[1]] + '-' + days[val[2]]);
    }
  }

  const handleConfirm = () => {
    if (!value) {
      onChange(moment().format('YYYY-MM-DD'));
    }
    onConfirm();
  }

  return (
    <AtFloatLayout
      isOpened={visible}
      onClose={onClose}
    >
      <View className="upload-avatar">
        <View className="mt-2 text-32 font-bold text-center">选择爱宠生日</View>
        <View>
          <PickerView
            value={selected}
            onChange={handChange}
            className="my-1"
          >
            <PickerViewColumn>
              {years.map(item => <View className="text-28 font-bold">{item}年</View>)}
            </PickerViewColumn>
            <PickerViewColumn>
              {months.map(item => <View className="text-28 font-bold">{item}月</View>)}
            </PickerViewColumn>
            <PickerViewColumn>
              {days.map(item => <View className="text-28 font-bold">{item}日</View>)}
            </PickerViewColumn>
          </PickerView>
        </View>
        <View className="mb-3">
          <View onClick={handleConfirm} className="poper-btn rounded-full text-center bg-color-primary text-32 font-bold text-white">确 定</View>
        </View>
      </View>
    </AtFloatLayout>
  )
}

export default RccDatePicker;
