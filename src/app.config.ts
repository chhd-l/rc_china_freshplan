// import { useGlobalIconFont } from './components/iconfont/helper'

export default defineAppConfig({
  pages: [
    'pages/subscription/index',
    'pages/account/index',
    'pages/foodRecom/index',
    'pages/freshPlanDetails/index',
    'pages/schedule/index',
  ],
  subPackages: [
    {
      root: 'pages/packageA',
      pages: [
        'elencoOrdini/index',
        'orderDetail/index',
        'addressManage/index',
        'newAddress/index',
        'petList/index',
        'petEdit/index',
        'petDetail/index',
        'breedList/index',
        'checkout/index',
        'petDiet/index',
        'choosePet/index',
        'customerService/index',
        'invoiceManage/index',
        'invoiceDetail/index',
      ],
    }
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
        text: '智能推荐',
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // usingComponents: Object.assign(useGlobalIconFont()),
})

