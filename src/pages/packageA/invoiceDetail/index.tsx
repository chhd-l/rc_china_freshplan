import { WebView } from '@tarojs/components'
import { useAtom } from 'jotai'
import { consumerAtom } from '@/store/consumer'
import { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'

const InvoiceDetail = () => {
  const [consumer] = useAtom(consumerAtom);
  const [url, setUrl] = useState<string>('');
  const { router } = getCurrentInstance();

  Taro.useDidShow(async () => {
    const appSecret = '5ate975gpiv9we6p', appKey = 'N790KtqEKXZujq08';
    const orderNo = router?.params?.orderno ?? '';
    const res = await Taro.request({
      url: 'https://fapiao-api.easyapi.com/access-token',
      data: {
        appKey,
        appSecret,
        username: consumer?.id,
      }
    });
    setUrl(`https://fapiao-h5.easyapi.com/make/single-query?accessToken=${res?.data?.content?.accessToken ?? ''}&outOrderNo=${orderNo}`);
  });

  return (
    url ? <WebView src={url} /> : null
  )
}

export default InvoiceDetail;
