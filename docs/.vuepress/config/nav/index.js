

module.exports = [
  //Home
  { text: "主页", link: "/", icon: "reco-home" }, 
  //TimeLine
  { text: "时间轴", link: "/timeline/", icon: "reco-date" }, 
  {
    text: "工具类库",
    icon: "reco-suggestion",
    items:
    [
      {
        text: "Http请求",
        link: "/Tools/HttpRequest/"
      },
      {
        text:"日志配置",
        link:"/views/CommonTools/LogTools/log4net"
      },
      {
        text: "加密解密",
        link: "/Tools/Encrypt/",       
      },
      {
        text: "验证码",
        link: "/Tools/VerifyCode/",       
      }
    ]
  },
  //About
  { text: "关于我", link: "/about/", icon: "reco-account" }
];
