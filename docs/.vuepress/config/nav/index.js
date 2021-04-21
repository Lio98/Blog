

module.exports = [
  //Home
  { text: "主页", link: "/", icon: "reco-home" }, 
  //TimeLine
  { text: "时间轴", link: "/timeline/", icon: "reco-date" }, 
  {
    text: "工具类库",
    link: "/Tools/",
    icon: "reco-suggestion",
    items:
    [
      {
        text: "Http请求",
        link: "/Tools/HttpRequest/"
      },
      {
        text:"Log4net",
        link:"/Tools/Log4net/"
      },
      {
        text: "加密解密",
        link: "/Tools/Encrypt/",       
      }
    ]
  },
  // {
  //   text: "女朋友专区",
  //   link: "/grilFriend/",
  //   icon: "reco-message",
  //   items:
  //   [
  //     {
  //       text: "First",
  //       link: "/grilFriend/About/"
  //     }
  //   ]
  // },
  //About
  { text: "关于我", link: "/about/", icon: "reco-account" }, 
];
