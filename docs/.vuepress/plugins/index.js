module.exports = {
  // '@vuepress/medium-zoom': {
  //     selector: 'img.zoom-custom-imgs',
  //     // medium-zoom options here
  //     // See: https://github.com/francoischalifour/medium-zoom#options
  //     options: {
  //         margin: 16
  //     }
  // },
  "dynamic-title": {
    showIcon: "https://zyj_yida.gitee.io/source/img/ico/favicon.ico",
    showText: "Welcome Back！",
    hideIcon: "https://zyj_yida.gitee.io/source/img/ico/favicon.ico",
    hideText: "Wait ...",
    recoverTime: 2000
  },
  "vuepress-plugin-nuggets-style-copy":
  {
    copyText: "复制代码",
    tip: {
      content: "复制成功!"
    }
  },
  'meting': {
    // auto: "https://y.qq.com/n/m/detail/taoge/index.html?id=7653249637",
    auto: "https://y.qq.com/n/yqq/playlist/1906732760.html#stat=y_new.profile.create_playlist.love.click&dirid=201",
    meting: {
      server: "tencent",
      type: "playlist",
      mid: "1906732760",
    },          // 不配置该项的话不会出现全局播放器
    aplayer: {
      autoplay: true,
      // 设置 lrc 歌词解析模式 （0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）
      lrcType: 0,
      autoplay: true
    }
  },
  // "ribbon":{
  //     size: 90,     // width of the ribbon, default: 90
  //     opacity: 0.8, // opacity of the ribbon, default: 0.3
  //     zIndex: -1    // z-index property of the background, default: -1
  //   }
  // "cursor-effects":{
  //     size: 2,                    // size of the particle, default: 2
  //     shape: 'star',  // shape of the particle, default: 'star'
  //     zIndex: 999999999           // z-index property of the canvas, default: 999999999
  //   },
  'vuepress-plugin-helper-live2d': {
    // 是否开启控制台日志打印(default: false)
    log: false,
    live2d: {
      // 是否启用(关闭请设置为false)(default: true)
      enable: true,
      // 模型名称(default: hibiki)>>>取值请参考：
      // https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA
      model: 'nipsilon',
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
  "vuepress-plugin-boxx": {}
}