const nav = require("./config/nav");
const pluginsConf = require('./plugins/index')

module.exports = {
  base: "/",
  title: "昏喽喽",
  description: "三人行，必有我师焉，择其善者而从之，其不善者而改之。",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["script", {"language": "javascript","type": "text/javascript","src": "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"}],
    ["script", {"language": "javascript","type": "text/javascript","src": "/js/mouseClick.js"}],
    ["script", {"language": "javascript","type": "text/javascript","src": "/js/bg.js"}],
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
    modePicker: false,
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
    // valineConfig: {
    //   appId: '',// your appId
    //   appKey: '', // your appKey
    //   recordIP:true,
    //   placeholder:'Lio同学需要你的评论...',
    //   visitor:true,
    // },
    nav,
    // logo: 'https://zyj_yida.gitee.io/source/img/ico/logo.png',
    // authorAvatar: "https://zyj_yida.gitee.io/source/img/ico/head.jpg",
    authorAvatar: "/head.png",
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    sidebar: "auto",
    displayAllHeaders: true,
    // 最后更新时间
    // lastUpdated: "Last Updated",
    // 作者
    author: "Lio",
    // 备案号
    record: '陇ICP备2020004133号',
    // 项目开始时间
    startYear: "2020",
    /**
     * 密钥 (if your blog is private)
     */
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com",
      },
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar:
          "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
      {
        title: 'ToFutureSelf',
        desc: '花有重开日，人无再少年',
        link: 'https://zhangfish.gitee.io/'
      }
    ],
    // vssueConfig: {
    //   platform: "github",
    //   owner: "Saszr",
    //   repo: "blog",
    //   clientId: process.env.VSSUEID,
    //   clientSecret: process.env.VSSUESECRET,
    // },
  },
  plugins: pluginsConf
};
