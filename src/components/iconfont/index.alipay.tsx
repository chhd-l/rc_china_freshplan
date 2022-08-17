/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';

export type IconNames = 'icon-shuaxin' | 'icon-fanhui' | 'icon-riqi' | 'icon-biaoqian' | 'icon-jine' | 'icon-shouye1' | 'icon-baogao1' | 'icon-logoshuexin' | 'icon-shuexinlogo' | 'icon-zuoxia' | 'icon-youxia' | 'icon-zuoshang' | 'icon-youshang' | 'icon-paizhao' | 'icon-zhengque' | 'icon-cuowu' | 'icon-fanhuidingbu' | 'icon-tishi1' | 'icon-sanjiaoxing' | 'icon-yuanxing' | 'icon-shourufenxi1' | 'icon-shouji' | 'icon-weixin' | 'icon-sousuo' | 'icon-chakanbaogao' | 'icon-dianhua' | 'icon-guanzhu1' | 'icon-jiankong' | 'icon-tishi' | 'icon-zhuanlixinxi' | 'icon-ruanjianzhuzuoquan' | 'icon-zuopinzhuzuoquan' | 'icon-wangzhanbeian' | 'icon-shangbiaoxinxi' | 'icon-zizhizhengshu' | 'icon-chouchajiancha' | 'icon-hangzhengxuke' | 'icon-zhaiquanxinxi' | 'icon-tudizhuanrang' | 'icon-jinchukouxinyong' | 'icon-shuiwuxinyong' | 'icon-dikuaigongshi' | 'icon-sifapaimai' | 'icon-jianyizhuxiao' | 'icon-qingsuanxinxi' | 'icon-gonggaocuigao' | 'icon-guquanchuzhi' | 'icon-tudizhiya' | 'icon-hangzhengchufa' | 'icon-dongchandiya' | 'icon-jingyingyichang' | 'icon-yanzhongweifa' | 'icon-lianxinxi' | 'icon-xianzhigaoxiaofei' | 'icon-kaitinggonggao' | 'icon-beizhihangren' | 'icon-caipanwenshu' | 'icon-fayuangonggao' | 'icon-zhongbenanjian' | 'icon-shixinbeizhihangren' | 'icon-zhuyaorenyuan' | 'icon-duiwaitouzi' | 'icon-biangengxinxi' | 'icon-yingyezhizhaoxinxi' | 'icon-gudongxinxi' | 'icon-fapiaoshuju' | 'icon-guanwangdizhi' | 'icon-lianxikefu' | 'icon-yonghuxieyi' | 'icon-farentouxiang' | 'icon-qiyerenzheng' | 'icon-shourufenxi' | 'icon-shangpinfenxi' | 'icon-xiayoukehu' | 'icon-zhuce' | 'icon-yanzhengma' | 'icon-guanzhu' | 'icon-shouye' | 'icon-baogao' | 'icon-xiala' | 'icon-sousuoyesousuo' | 'icon-shanchu' | 'icon-qingchu' | 'icon-jiantou' | 'icon-morenshijian' | 'icon-sousuoshijian' | 'icon-xihuanweidianji' | 'icon-buxihuanweidianji' | 'icon-xihuanyidianji' | 'icon-buxihuanyidianji' | 'icon-qiyetouxiang' | 'icon-liebiaoshouqi' | 'icon-liebiaozhankai' | 'icon-guanyuwomen' | 'icon-beishouquanjilu' | 'icon-zizhushouquan' | 'icon-shouquanshenhe1' | 'iconwodeyidianji' | 'icon-jiankongyidianji' | 'icon-shouyeyidianji' | 'icon-wodeweidianji' | 'icon-shouyeweidianji' | 'icon-jiankongweidianji';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  // @ts-ignore
  return <iconfont name={name} size={parseFloat(Taro.pxTransform(size))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
