// import { useGlobalIconFont } from './iconfont/helper'

export default defineAppConfig({
  pages: [
    'pages/subscription/index',
    'pages/account/index',
    'pages/addressManage/index',
    'pages/newAddress/index',
    'pages/elencoOrdini/index'
  ],
  subPackages: [
    {
      root: 'pages/packageA',
      pages: [
        'orderList/index',
        'orderDetail/index',
      ],
    },
    {
      root: 'pages/packageB',
      pages: [
        'breedList/index',
        'petList/index',
        'petEdit/index',
        'createSubscription/index',
      ],
    },
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
        text: '订阅',
        iconPath: 'assets/icons/icon-subscription.svg',
        selectedIconPath: 'assets/icons/icon-subscription-selected.svg',
      },
      {
        pagePath: 'pages/account/index',
        text: '我的',
        iconPath: 'assets/icons/icon-account.svg',
        selectedIconPath: 'assets/icons/icon-account-selected.svg',
      },
    ],
  },
})

