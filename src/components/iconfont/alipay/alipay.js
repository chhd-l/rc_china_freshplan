Component({
  props: {
    // rccicon-male | rccicon-save | rccicon-footprint | rccicon-timer | rccicon-female | rccicon-location | rccicon-check | rccicon-ship | rccicon-ontime | rccicon-add | rccicon-right | rccicon-edit | rccicon-picture | rccicon-camera | rccicon-close | rccicon-cat1 | rccicon-dog1 | rccicon-dog2 | rccicon-success | rccicon-freshweixuanzhong | rccicon-freshxuanzhong | rccicon-gerenzhongxinxuanzhong | rccicon-a-bianzu16
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
