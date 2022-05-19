Component({
  properties: {
    // yishiyong | jiduka | bannianka | nianka | changjianwenti | fahuoyizhan | buzhoujiange | dingzhitaocan | querentaocan | dingzhitaocan0 | buzhoujiange0 | xuanzechongwu | querentaocan0 | xuanzechongwu0 | yiguoqi | yilingqu | a-ShopVoucher | a-ProductVoucher | a-bianzu2 | a-bianzu2beifen | Discount | Campaigns | a-LiveStreaming | Vouchers | weilingqu | kapian | xianjin | Frame5 | Frame-31 | Frame-21 | Frame-12 | Frame3 | Frame-11 | Frame-3 | Frame-5 | Frame-2 | a-Frame21 | Lamp | morendizhi | jiahao | group52 | a-edit | a-bianzu67beifen3 | riqizujiantubiao | a-User | a-bianzu8 | a-More | a-prompt | rc-edit | a-bianzu3 | a-bianzu21 | bianzu1 | a-bianzu4 | a-bianzu5 | a-bianzu7 | a-bianzu6 | a-bianzu70 | a-sort | xiajia | Edit | Frame4 | preview | a-WechatSetting | a-bianzu14 | a-bianzu12-1 | a-bianzu13 | a-bianzu18beifen-1 | a-bianzu15 | a-bianzu18 | a-bianzu10 | a-bianzu11 | a-bianzu11-1 | a-bianzu12 | dingdan | bianzu3 | a-Frame2 | bianzu2 | delete | Frame-1 | a-xingzhuangjiehe2 | a-xingzhuangjiehe3 | bianzu-1 | Frame2 | a-Group437 | bianzu | xingzhuangjiehe | kjafg | Frame1 | Vector | Frame | dabaodaifahuo | rili | Order
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
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
