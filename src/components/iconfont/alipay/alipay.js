Component({
  props: {
    // icon-shuaxin | icon-fanhui | icon-riqi | icon-biaoqian | icon-jine | icon-shouye1 | icon-baogao1 | icon-logoshuexin | icon-shuexinlogo | icon-zuoxia | icon-youxia | icon-zuoshang | icon-youshang | icon-paizhao | icon-zhengque | icon-cuowu | icon-fanhuidingbu | icon-tishi1 | icon-sanjiaoxing | icon-yuanxing | icon-shourufenxi1 | icon-shouji | icon-weixin | icon-sousuo | icon-chakanbaogao | icon-dianhua | icon-guanzhu1 | icon-jiankong | icon-tishi | icon-zhuanlixinxi | icon-ruanjianzhuzuoquan | icon-zuopinzhuzuoquan | icon-wangzhanbeian | icon-shangbiaoxinxi | icon-zizhizhengshu | icon-chouchajiancha | icon-hangzhengxuke | icon-zhaiquanxinxi | icon-tudizhuanrang | icon-jinchukouxinyong | icon-shuiwuxinyong | icon-dikuaigongshi | icon-sifapaimai | icon-jianyizhuxiao | icon-qingsuanxinxi | icon-gonggaocuigao | icon-guquanchuzhi | icon-tudizhiya | icon-hangzhengchufa | icon-dongchandiya | icon-jingyingyichang | icon-yanzhongweifa | icon-lianxinxi | icon-xianzhigaoxiaofei | icon-kaitinggonggao | icon-beizhihangren | icon-caipanwenshu | icon-fayuangonggao | icon-zhongbenanjian | icon-shixinbeizhihangren | icon-zhuyaorenyuan | icon-duiwaitouzi | icon-biangengxinxi | icon-yingyezhizhaoxinxi | icon-gudongxinxi | icon-fapiaoshuju | icon-guanwangdizhi | icon-lianxikefu | icon-yonghuxieyi | icon-farentouxiang | icon-qiyerenzheng | icon-shourufenxi | icon-shangpinfenxi | icon-xiayoukehu | icon-zhuce | icon-yanzhengma | icon-guanzhu | icon-shouye | icon-baogao | icon-xiala | icon-sousuoyesousuo | icon-shanchu | icon-qingchu | icon-jiantou | icon-morenshijian | icon-sousuoshijian | icon-xihuanweidianji | icon-buxihuanweidianji | icon-xihuanyidianji | icon-buxihuanyidianji | icon-qiyetouxiang | icon-liebiaoshouqi | icon-liebiaozhankai | icon-guanyuwomen | icon-beishouquanjilu | icon-zizhushouquan | icon-shouquanshenhe1 | iconwodeyidianji | icon-jiankongyidianji | icon-shouyeyidianji | icon-wodeweidianji | icon-shouyeweidianji | icon-jiankongweidianji
    name: null,
    // string | string[]
    color: '',
    size: 18,
  },
  data: {
    colors: '',
    quot: '"',
    svgSize: 18,
    isStr: true,
  },
  didMount() {
    const size = this.props.size;
    const color = this.props.color;

    this.setData({
      colors: this.fixColor(color),
      isStr: typeof color === 'string',
    });

    if (size !== this.data.svgSize) {
      this.setData({
        svgSize: size / 750 * my.getSystemInfoSync().windowWidth,
      });
    }
  },
  disUpdate(prevProps) {
    const size = this.props.size;
    const color = this.props.color;

    if (color !== prevProps.color) {
      this.setData({
        colors: this.fixColor(color),
        isStr: typeof color === 'string',
      });
    }

    if (size !== prevProps.size) {
      this.setData({
        svgSize: size / 750 * my.getSystemInfoSync().windowWidth,
      });
    }
  },
  methods: {
    fixColor: function() {
      var color = this.props.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
