module.exports = {
  "dynamic-title": {
    showIcon: "/favicon.ico",
    showText: "Welcome Back！",
    hideIcon: "/favicon.ico",
    hideText: "Wait ...",
    recoverTime: 2000
  },
  // "vuepress-plugin-nuggets-style-copy": {
  //   copyText: "复制",
  //   tip: {
  //     content: "复制成功!"
  //   }
  // },
  // 'meting': {
  //   // auto: "https://y.qq.com/n/m/detail/taoge/index.html?id=7653249637",
  //   auto: "https://y.qq.com/n/yqq/playlist/1906732760.html#stat=y_new.profile.create_playlist.love.click&dirid=201",
  //   meting: {
  //     server: "tencent",
  //     type: "playlist",
  //     mid: "1906732760",
  //   }, // 不配置该项的话不会出现全局播放器
  //   aplayer: {
  //     autoplay: true,
  //     // 设置 lrc 歌词解析模式 （0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）
  //     lrcType: 0,
  //     // autoplay: true
  //   }
  // },
  'vuepress-plugin-code-copy':{
    color:"#8A7F7D",
    successText: "复制成功!"
  },
  'vuepress-plugin-helper-live2d': {
    // 是否开启控制台日志打印(default: false)
    log: false,
    live2d: {
      // 是否启用(关闭请设置为false)(default: true)
      enable: true,
      // 模型名称(default: hibiki)>>>取值请参考：
      // https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA 
      model: 'koharu',//'nipsilon'
      display: {
        position: "right", // 显示位置：left/right(default: 'right')
        width: 135, // 模型的长度(default: 135)
        height: 300, // 模型的高度(default: 300)
        hOffset: 65, //  水平偏移(default: 65)
        vOffset: 0, //  垂直偏移(default: 0)
      },
      mobile: {
        show: false // 是否在移动设备上显示(default: false)
      },
      react: {
        opacity: 0.8 // 模型透明度(default: 0.8)
      }
    }
  },
  "sakura": {
    num: 20, // 默认数量
    show: true, //  是否显示
    zIndex: -1, // 层级
    img: {
      replace: false, // false 默认图 true 换图 需要填写httpUrl地址
      httpUrl: '...' // 绝对路径
    }
  },
  "cursor-effects": {
    size: 3, // 大小
    shape: ['circle'], // 散落形状, default: 'star'
    zIndex: 999999999 // z-index property of the canvas, default: 999999999
  },
  // "vuepress-plugin-boxx": {}
  "ribbon-animation": {
    size: 90,   // 默认数据
    opacity: 0.3,  //  透明度
    zIndex: -1,   //  层级
    opt: {
      // 色带HSL饱和度
      colorSaturation: "80%",
      // 色带HSL亮度量
      colorBrightness: "60%",
      // 带状颜色不透明度
      colorAlpha: 0.65,
      // 在HSL颜色空间中循环显示颜色的速度有多快
      colorCycleSpeed: 6,
      // 从哪一侧开始Y轴 (top|min, middle|center, bottom|max, random)
      verticalPosition: "center",
      // 到达屏幕另一侧的速度有多快
      horizontalSpeed: 200,
      // 在任何给定时间，屏幕上会保留多少条带
      ribbonCount: 2,
      // 添加笔划以及色带填充颜色
      strokeSize: 0,
      // 通过页面滚动上的因子垂直移动色带
      parallaxAmount: -0.5,
      // 随着时间的推移，为每个功能区添加动画效果
      animateSections: true
    },
    ribbonShow: false, //  点击彩带  true显示  false为不显示
    ribbonAnimationShow: true  // 滑动彩带
  }
  // "vueperss-plugin-auto-sidebar": {}
}