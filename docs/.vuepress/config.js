const nav = require("./config/nav");
const pluginsConf = require('./plugins/index')

module.exports = {
  base: "/",
  title: "昏喽喽",
  description: "三人行，必有我师焉，择其善者而从之，其不善者而改之。",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["script", {"language": "javascript","type": "text/javascript","src": "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"}],
    // ["script", {"language": "javascript","type": "text/javascript","src": "/js/mouseClick.js"}],
    // ["script", {"language": "javascript","type": "text/javascript","src": "/js/bg.js"}],
    ["meta", {name: "viewport",content: "width=device-width,initial-scale=1,user-scalable=no"}]
  ],
  theme: "reco",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    //首页样式
    indexTitle:"我们可以一次次的撞南墙，我们不能一个个失去理想。",
    indexDes:"We can be frustrated again and again, but we cannot lose our ideals one by one.",
    //是否全屏样式 true，false
    fullscreen: true,
    //全屏模式下才应用 分类图片 不填或者默认为随机
    categoryPic: null,
    tagPic: null,
    timePic: null,
    modePicker: true,
    mode: 'light',
    type: "blog",
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "博客分类" // 默认 “分类”Category
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "标签" // 默认 “标签”Tag
      },
    },
    nav,
    // sidebar:
    // {
    //   "/Tools/Encrypt/":
    //   [
    //     "DesEncrypt",
    //     "MD5Encrypt",
    //     "RsaEncrypt"
    //   ]
    // },
    authorAvatar: "/head.png",
    // 搜索设置
    search: true,
    // 自动形成侧边导航
    sidebar: "auto",
    sidebarDepth: 3,
    // 作者
    author: "Lio",
    // 备案号
    record: '陇ICP备2020004133号',
    // 项目开始时间
    startYear: "2020",
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com",
      },
      {
        title:'张益达',
        desc:'',
        link:'https://zhangyujie.top/'
      },
      {
        title:'饭团也有春天',
        desc:'',
        link:'http://www.zpzpup.com/blog/'
      }
    ],
  },
  plugins: pluginsConf
};
