

module.exports = [
  //Home
  { text: "Home", link: "/", icon: "reco-home" }, 
  //TimeLine
  { text: "TimeLine", link: "/timeline/", icon: "reco-date" }, 
  {
    text: "Tools",
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
      },
      {
        text:"Git命令",
        link:"/Tools/gitCommon/"
      }
    ]
  },
  //About
  { text: "About", link: "/about/", icon: "reco-account" }
];
