---
title: 'MVC'
date: 2021-04-09
categories:
- "Csharp"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
---

## 概述

### MVC

 - M：models，数据传递模型

 - V：views，视图界面

 - C：controller，决定用户使用哪个视图，调用逻辑计算

MVC(.Net Framework)项目的启动入口在 Global.asax，其中 Application_Start 全局启动时执行，且只执行一次，适合做初始化，也可以静态构造函数初始化

AreaRegistration.RegisterAllAreas()：其实就是把SystemAreaRegistration给注册下---添加url地址规则----请求来了匹配，area匹配在普通的之前

MVC请求的最后是反射调用controller+action，信息是来自url+route，路由匹配时，只能找到action和controller，其实还有个步骤，扫描+存储，在bin里面找Controller的子类，然后把命名空间--类名称+全部方法存储起来

控制器类可以出现在MVC项目之外，唯一的规则就是继承自Controller

Area也可以独立开，规则时必须有个继承AreaRegistration

MVC可返回html、string、json、图片

## Razor语法

cshtml本质时一个类文件，混编了html代码和cs代码

_Layout.cshtml界面：

@RenderBody()就是界面的结合点

@RenderSection("scripts", required: false)

当写的内容在引入的js之前时，可以使用以下方式进行编写

```js
@section scripts
{
    <script>
        $(function () {
            alert(12345);
        })
    </script>
}
```

ViewData是字典传值，里面是object，需要类型转化

ViewBag是dynamic传值，可以随便属性赋值，运行时检测

以上二者是会覆盖的，后者为准

model传值---适合复杂数据的传递，强类型

TempData---临时数据，可以跨action后台传递，

```csharp
public ActionResult Index(int id = 3)
{
    CurrentUser currentUser = _users.FirstOrDefault(u => u.Id == id) ?? _users[0];
    base.ViewData["CurrentUserViewData"] = _users[0];
    base.ViewBag.CurrentUserViewBag = _users[1];
    base.ViewData["TestProp"] = "cs";
    base.ViewBag.TestProp = "xxx";
    base.TempData["TestProp"] = "yyy";   //独立存储
    base.TempData["CurrentUserTempData"] = currentUser;
    if (id == 1 || id == 2 || id == 3)
        return View(this._users[2]);
    //return View();
    else if(id==4)
        return View("~/Views/First/Index1.cshtml");
    else
        return base.RedirectToAction("TempDataShow");
}
```

partialPage局部页---没有自己的action

@{Html.RenderPartial("PartialPage","这里是Html.RenderPartial")}

@Html.Partial("PartialPage","这里是Html.Partial")

子页面,有action，可以传入参数

@Html.Action("ChildAction","Second",new {name=Html.Action})

@{Html.RenderAction("ChildAction","Second",new {name=Html.RenderAction})}

[ChildActionOnly]  只能作为子页面，不能被单独引用


Http请求的本质：

请求--应答式，不同的类型其实方式一样的，只不过有个contenttype的差别

html---text/html

json---application/json

xml---application/xml

js----application/javascript

ico----image/x-icon

image/gif   image/jpeg   image/png

MVC各种Result的事儿

Json方法实际上是new JsonResult 然后ExecuteResult

指定ContentType-application/json  然后将Data序列化成字符串写入stream

## 路由 Route

路由：映射，按照规则进行转发

路由是按照注册顺序匹配的，遇到第一个完全吻合的就结束匹配，每个请求就只会被一个路由匹配上

我们可以根据自己项目的情况来扩展路由

```csharp
public class RouteConfig
{
    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");//忽略路由，正则表达式{resource}表示 变量，，，遇到就直接忽略，还是走原始流程
        routes.MapRoute(
            name: "About", 
            url: "About",
            defaults: new {controller = "Home", action = "About", id = UrlParameter.Optional});
        routes.MapRoute(
            name: "Test",
            url: "Test/{action}/{id}",
            defaults: new { controller = "Second", action = "Index", id = UrlParameter.Optional });
        routes.MapRoute(
            name: "Reges",
            url: "{controller}/{action}_{year}_{month}_{day}",
            defaults: new { controller = "Second", action = "Index" },
            constraints:new {year=@"\d{4}", month = @"\d{2}" , day = @"\d{2}" });//constraints  约束
        //常规路由，一般来说，我们不怎么扩展这个路由
        routes.MapRoute(
            name: "Default",//路由名称，RouteCollection是key-value，key避免重复
            url: "{controller}/{action}/{id}",//正则规则
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },//默认值  没有id变量 就是UrlParameter.Optional，没有action就是index ，没有controller就是home
            namespaces:new string[]{ "MyMVC5.Areas.System.Controllers" , "MVC5.plugIns" }
        );
    }
}
```


### 实现依赖注入

路由匹配后得到控制器名称---MVCHandler---ControllerBuilder.GetControllerFactory()---然后创建的控制器的实例

DefaultControllerFactory默认的控制器工厂---那么把工厂换成自己实现的，就可以进行依赖注入---ControllerBuilder.SetControllerFactory()

自己实现依赖注入，主要有以下三步

- 继承继承DefaultControllerFactory

- SetControllerFactory

- 引入第三方容器，将控制器的实例化由容器来创建

```csharp
//自定义容器
public class CustomControllerFactory:DefaultControllerFactory
{
    private Logger logger = new Logger(typeof(CustomControllerFactory));
    protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
    {
        this.logger.Info($"{controllerType.Name}被构造......");
        IUnityContainer unityContainer = DIFactory.GetContainer();
        return (IController)unityContainer.Resolve(controllerType);
    }
}
```

```csharp
public class DIFactory
{
    private static IUnityContainer container = null;
    private  static readonly object _lock=new object();
    public static IUnityContainer GetContainer()
    {
        if (container==null)
        {
            lock (_lock)
            {
                if (container == null)
                {
                    ExeConfigurationFileMap fileMap = new ExeConfigurationFileMap();
                    fileMap.ExeConfigFilename = Path.Combine(AppDomain.CurrentDomain.BaseDirectory + "CfgFiles\\Unity.Config");
                    Configuration configuration = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
                    UnityConfigurationSection section = (UnityConfigurationSection)configuration.GetSection(UnityConfigurationSection.SectionName);
                    container = new UnityContainer();
                    section.Configure(container, "mvcContainer");
                }
            }
        }
        return container;
    }
}
```


之后在网站启动的时候注册进去

```csharp
protected void Application_Start()
{
    AreaRegistration.RegisterAllAreas(); //注册区域
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);//注册全局的filter
    RouteConfig.RegisterRoutes(RouteTable.Routes);//注册路由
    BundleConfig.RegisterBundles(BundleTable.Bundles);//合并压缩，打包工具
    ControllerBuilder.Current.SetControllerFactory(new CustomControllerFactory());
    logger.Info("网站启动了......");
}
```

## 过滤器

### AuthorizeAttribute

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class CustomAuthorizeAttribute : AuthorizeAttribute
{
    private Logger logger = new Logger(typeof(CustomAuthorizeAttribute));
    private string _LoginUrl = null;
    public CustomAuthorizeAttribute(string loginUrl = "~/Home/Login")
    {
        this._LoginUrl = loginUrl;
    }
    public override void OnAuthorization(AuthorizationContext filterContext)
    {
        var httpContext = filterContext.HttpContext;//能拿到httpcontext 就可以为所欲为
        if (filterContext.ActionDescriptor.IsDefined(typeof(CustomAllowAnonymousAttribute), true))
        {
            return;
        }
        else if (filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(CustomAllowAnonymousAttribute), true))
        {
            return;
        }
        else if (httpContext.Session["CurrentUser"] == null
            || !(httpContext.Session["CurrentUser"] is CurrentUser))//为空了，
        {
            //这里有用户，有地址 其实可以检查权限
            if (httpContext.Request.IsAjaxRequest())
            {
                filterContext.Result = new NewtonJsonResult(
                    new AjaxResult()
                    {
                        Result = DoResult.OverTime,
                        DebugMessage = "登陆过期",
                        RetValue = ""
                    });
            }
            else
            {
                httpContext.Session["CurrentUrl"] = httpContext.Request.Url.AbsoluteUri;
                filterContext.Result = new RedirectResult(this._LoginUrl);
                //短路器：指定了Result，那么请求就截止了，不会执行action
            }
        }
        else
        {
            CurrentUser user = (CurrentUser)httpContext.Session["CurrentUser"];
            return;//继续
        }
    }
}
```

### HandleErrorAttribute

```csharp
public class CustomHandleErrorAttribute:HandleErrorAttribute
{
    private Logger logger =new Logger(typeof(CustomAllowAnonymousAttribute));
    public override void OnException(ExceptionContext filterContext)
    {
        var httpContext = filterContext.HttpContext;
        if (!filterContext.ExceptionHandled)//没有被别的HandleErrorAttribute处理
        {
            this.logger.Error($"在响应{httpContext.Request.Url.AbsoluteUri}时出现异常，异常信息：{filterContext.Exception.Message}");
            if (httpContext.Request.IsAjaxRequest())
            {
                filterContext.Result=new NewtonJsonResult(
                    new AjaxResult()
                {
                    Result = DoResult.Failed,
                    DebugMessage = filterContext.Exception.Message,
                    RetValue = "",
                    PromptMsg = "发生错误，请联系管理员"
                    });
            }
            
            filterContext.Result = new ViewResult()//断路器
            {
                ViewName = "~/Views/Shared/Error.cshtml",
                ViewData = new ViewDataDictionary<string>(filterContext.Exception.Message)
            };
            filterContext.ExceptionHandled = true;
        }
    }
}
```

### ActionFilterAttribute

```csharp
public class CustomActionFilterAttribute:ActionFilterAttribute
{
    private Logger logger=new Logger(typeof(CustomActionFilterAttribute));
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        logger.Info($"开始调用{filterContext.RouteData.Values["Action"]} 接口，传入的参数为：{JsonConvert.SerializeObject(filterContext.ActionParameters)}");
        //base.OnActionExecuting(filterContext);
        //foreach (var parameter in filterContext.ActionParameters)
        //{
            
        //}
        var request = filterContext.HttpContext.Request;
        var response = filterContext.HttpContext.Response;
        string acceptEncoding = request.Headers["Accept-Encoding"];//检测支持格式
        if (!acceptEncoding.IsNullOrWhiteSpace()&&acceptEncoding.ToUpper().Contains("GZIP"))
        {
            response.AddHeader("Content-Encoding","gzip");
            response.Filter=new GZipStream(response.Filter,CompressionMode.Compress);//压缩类型指定
        }
    }
    public override void OnActionExecuted(ActionExecutedContext filterContext)
    {
        var actionResultresult = (filterContext.Result as JsonResult)?.Data !=null? JsonConvert.SerializeObject((filterContext.Result as JsonResult)?.Data) :"";
        logger.Info($"调用{filterContext.RouteData.Values["Action"]} 接口完成，执行结果：{actionResultresult}");
    }
}
```


## 用户登录

### 验证码

验证码在前端就是一张图片的形式，点击刷新之后是重新请求一张验证码，两个方法效果是一样的

```csharp
public ActionResult VerifyCode()
{
    string code = "";
    Bitmap bitmap = VerifyCodeHelper.CreateVerifyCode(out code);
    base.HttpContext.Session["CheckCode"] = code;//Session识别用户，为单一用户有效
    MemoryStream stream = new MemoryStream();
    bitmap.Save(stream, ImageFormat.Gif);
    return File(stream.ToArray(), "image/gif");//返回FileContentResult图片
}

//将验证码信息保存到response
public void Verify()
{
    string code = "";
    Bitmap bitmap = VerifyCodeHelper.CreateVerifyCode(out code);
    base.HttpContext.Session["CheckCode"] = code;
    bitmap.Save(base.Response.OutputStream,ImageFormat.Gif);
    base.Response.ContentType = "image/gif";
}
```

```html
<div class="col-md-10">
    <img alt="验证码图片" class="img" onclick="refresh(this)" src="/Fifth/VerifyCode" title="点击刷新">
</div>

<!-- 添加一个随机数的作用是为了能够每次都请求进去 -->
function refresh(obj) {
        $(obj).attr("src", "/Fifth/Verify?random=" + Math.random());
    }
```

### 登录

```csharp
public ActionResult Login(string name, string password, string verify)
{
    string formName = base.HttpContext.Request.Form["Name"];
    var result = base.HttpContext.Login(name, password, verify);
    if (result == UserManager.LoginResult.Success)
    {
        if (base.HttpContext.Session["CurrentUrl"] != null)
        {
            string url = base.HttpContext.Session["CurrentUrl"].ToString();
            base.HttpContext.Session.Remove("CurrentUrl");
            return base.Redirect(url);
        }
        else
            return base.Redirect("/Home/Index");
    }
    else
    {
        ModelState.AddModelError("failed", result.GetRemark());
        return View();
    }
}
```

验证用户信息，将信息存到session中

```csharp
public static class UserManager
{
    private static Logger logger = new Logger(typeof(UserManager)); //Logger.CreateLogger(typeof(UserManager));
    /// <summary>
    /// 用户登录验证
    /// </summary>
    /// <param name="name"></param>
    /// <param name="password"></param>
    /// <param name="verifyCode"></param>
    /// <returns></returns>
    public static LoginResult Login(this HttpContextBase context, string name, string password, string verifyCode) 
    {
        if (context.Session["CheckCode"] != null
            && !string.IsNullOrWhiteSpace(context.Session["CheckCode"].ToString())
            && context.Session["CheckCode"].ToString().Equals(verifyCode, StringComparison.CurrentCultureIgnoreCase))
        {
            using (IUserCompanyService service = DIFactory.GetContainer().Resolve<IUserCompanyService>())
            {
                T_Sys_User user = service.Set<T_Sys_User>().FirstOrDefault(u => u.Name.Equals(name) || u.Account.Equals(name) || u.Mobile.Equals(name) || u.Email.Equals(name));//账号查找
                if (user == null)
                {
                    return LoginResult.NoUser;
                }
                else if (!user.Password.Equals(MD5Encrypt.Encrypt(password)))
                {
                    return LoginResult.WrongPwd;
                }
                else if (user.State == 1)
                {
                    return LoginResult.Frozen;
                }
                else
                {
                    //登录成功  写cookie session
                    CurrentUser currentUser = new CurrentUser()
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Account = user.Account,
                        Email = user.Email,
                        Password = user.Password,
                        LoginTime = DateTime.Now
                    };
                    //都是asp.net解析的
                    #region Request
                    //context.Request
                    //Request 获取请求个各种参数，
                    //Header里面的各种信息
                    //InputStream上传的文件
                    #endregion
                    #region Response
                    //context.Response
                    //Response响应的 跨域、压缩、缓存、cookie、output + contentType
                    #endregion
                    #region Server
                    //辅助类 Server
                    string encode = context.Server.HtmlEncode("<我爱我家>");
                    string decode = context.Server.HtmlDecode(encode);
                    string physicalPath = context.Server.MapPath("/home/index");//只能做物理文件的映射
                    string encodeUrl = context.Server.UrlEncode("<我爱我家>");
                    string decodeUrl = context.Server.UrlDecode(encodeUrl);
                    #endregion
                    #region Application
                    context.Application.Lock();//ASP.NET 应用程序内的多个会话和请求之间共享信息
                    context.Application.Lock();
                    context.Application.Add("try", "die");
                    context.Application.UnLock();
                    object aValue = context.Application.Get("try");
                    aValue = context.Application["try"];
                    context.Application.Remove("命名对象");
                    context.Application.RemoveAt(0);
                    context.Application.RemoveAll();
                    context.Application.Clear();
                    context.Items["123"] = "123";//单一会话，不同环境都可以用
                    #endregion
                    #region Cookie
                    //context.Request.Cookies
                    HttpCookie myCookie = new HttpCookie("CurrentUser");
                    myCookie.Value = JsonHelper.ObjectToString<CurrentUser>(currentUser);
                    myCookie.Expires = DateTime.Now.AddMinutes(5);
                    //5分钟后  硬盘cookie
                    //不设置就是内存cookie--关闭浏览器就丢失
                    //改成过期 -1 过期
                    //修改cookie：不能修改，只能起个同名的cookie
                    //myCookie.Domain//设置cookie共享域名
                    //myCookie.Path//指定路径能享有cookie
                    context.Response.Cookies.Add(myCookie);//一定要输出
                    
                    //前端只能获取name-value
                    #endregion Cookie
                    #region Session
                    //context.Session.RemoveAll();
                    var sessionUser = context.Session["CurrentUser"];
                    context.Session["CurrentUser"] = currentUser;
                    context.Session.Timeout = 3;//minute  session过期等于Abandon
                    #endregion Session
                    logger.Debug(string.Format("用户id={0} Name={1}登录系统", currentUser.Id, currentUser.Name));
                    return LoginResult.Success;
                }
            }
            //服务端是只靠session--安全
            //cookie一直做登陆
            //cookie+session：验证用session，没有session就看cookie(cookie写个时间)
        }
        else
        {
            return LoginResult.WrongVerify;
        }
    }
    public enum LoginResult
    {
        /// <summary>
        /// 登录成功
        /// </summary>
        [Remark("登录成功")]
        Success = 0,
        /// <summary>
        /// 用户不存在
        /// </summary>
        [RemarkAttribute("用户不存在")]
        NoUser = 1,
        /// <summary>
        /// 密码错误
        /// </summary>
        [RemarkAttribute("密码错误")]
        WrongPwd = 2,
        /// <summary>
        /// 验证码错误
        /// </summary>
        [RemarkAttribute("验证码错误")]
        WrongVerify = 3,
        /// <summary>
        /// 账号被冻结
        /// </summary>
        [RemarkAttribute("账号被冻结")]
        Frozen = 4
    }
    public static void UserLogout(this HttpContextBase context)
    {
        #region Cookie
        HttpCookie myCookie = context.Request.Cookies["CurrentUser"];
        if (myCookie != null)
        {
            myCookie.Expires = DateTime.Now.AddMinutes(-1);//设置过过期
            context.Response.Cookies.Add(myCookie);
        }
        #endregion Cookie
        #region Session
        var sessionUser = context.Session["CurrentUser"];
        if (sessionUser != null && sessionUser is CurrentUser)
        {
            CurrentUser currentUser = (CurrentUser)context.Session["CurrentUser"];
            logger.Debug(string.Format("用户id={0} Name={1}退出系统", currentUser.Id, currentUser.Name));
        }
        context.Session["CurrentUser"] = null;//表示将制定的键的值清空，并释放掉，
        context.Session.Remove("CurrentUser");
        context.Session.Clear();//表示将会话中所有的session的键值都清空，但是session还是依然存在，
        context.Session.RemoveAll();//
        context.Session.Abandon();//就是把当前Session对象删除了，下一次就是新的Session了   
        #endregion Session
    }
}
```



