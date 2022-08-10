import { aliRegisterAndLogin } from '@/framework/api/consumer/consumer';

export function loginWithAlipay(callback?: Function) {
  my.getAuthCode({
    scopes: 'auth_user',
    success: ({ authCode }) => {
      aliRegisterAndLogin(authCode).then(consumer => {
        callback && callback(consumer);
      }).catch(() => {
        my.showToast({
          type: 'fail',
          content: '操作失败',
        })
      })
    },
  });
}
