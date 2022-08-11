import { aliRegisterAndLogin } from '@/framework/api/consumer/consumer';

export function loginWithAlipay(callback?: Function) {
  my.getAuthCode({
    scopes: 'auth_user',
    success: ({ authCode }) => {
      console.log(authCode);
      my.getPhoneNumber({
        success: ({ response }) => {
          console.log('phone encrypt:', JSON.parse(response).response);
          aliRegisterAndLogin(authCode, JSON.parse(response).response).then(consumer => {
            console.log('login response:', consumer);
            callback && callback(consumer);
          }).catch(() => {
            my.showToast({
              type: 'fail',
              content: '操作失败',
            })
          })
        }
      })

    },
  });
}
