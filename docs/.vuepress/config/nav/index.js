

module.exports = [
  //Home
  { text: "主页", link: "/", icon: "reco-home" }, 
  //TimeLine
  { text: "时间轴", link: "/timeline/", icon: "reco-date" }, 
  //grilFriend
  {
    text: "工具类库",
    link: "/Tools/",
    icon: "reco-suggestion",
    items:
    [
      {
        text: "Http请求",
        link: "/Tools/Web/HttpRequest/"
      }
    ]
  },
  {
    text: "女朋友专区",
    link: "/grilFriend/",
    icon: "reco-message",
    items:
    [
      {
        text: "First",
        link: "/grilFriend/About/"
      }
    ]
  },
  //About
  { text: "关于我", link: "/about/", icon: "reco-account" }, 
  //Contact
  // {
  //   text: "联系我", 
  //   icon: "reco-message",
  //   items: [
  //     {
  //       text: "GitHub",
  //       link: "https://github.com/yida-zyj",
  //       icon: "reco-github",
  //     }
  //   ],
  // },
];
