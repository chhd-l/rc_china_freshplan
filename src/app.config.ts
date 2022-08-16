// import { useGlobalIconFont } from './iconfont/helper'

export default defineAppConfig({
  pages: [
    'pages/account/index',
    'pages/subscription/index',
    'pages/elencoOrdini/index',
    'pages/orderDetail/index',
    'pages/addressManage/index',
    'pages/newAddress/index',
    'pages/petList/index',
    'pages/petEdit/index',
    'pages/petDetail/index',
    'pages/breedList/index',
    'pages/foodRecom/index',
    'pages/checkout/index',
    'pages/testView/index',
  ],
  window: {
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Alipay',
  },
  tabBar: {
    color: '',
    selectedColor: '#96CC39',
    backgroundColor: '',
    list: [
      {
        pagePath: 'pages/subscription/index',
        text: 'Fresh Plan',
        iconPath: 'assets/icons/icon-subscription.png',
        selectedIconPath: 'assets/icons/icon-subscription-selected.png',
      },
      {
        pagePath: 'pages/account/index',
        text: '我的',
        iconPath: 'assets/icons/icon-account.png',
        selectedIconPath: 'assets/icons/icon-account-selected.png',
      },
    ],
  },
})

