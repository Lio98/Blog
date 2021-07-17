---
title: 'WebApi'
date: 2021-03-27
categories:
- "Csharp"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
---

## WebService

后缀为.asmx

WebService寄宿在IIS上，必须就是网站项目，遵循Http协议，SOAP协议

协议就是一种封装格式

 - Http传输信道：A服务器到B服务器，数据是什么格式传递的   http协议包含请求地址，请求方式，数据包，header

 - XML的数据格式

 - SOAP协议：在分布式的环境中，描述了如何做数据交换的一个轻量级协议

 - WSDL：属于WebService的标配，标准化描述服务，方便调用

 - UDDI：根据描述查找服务的机制

服务端调用WebService添加服务引用，基于SsvcUtil.exe生成的

WebService安全认证：

- Form认证

- Windows认证

- 服务方法里面添加账号密码参数，SoapHeader验证

 **创建SoapHeader的实现类，添加校验方法**

  ```csharp
  //SoapHeader类
  public class CustomSoapHeader:SoapHeader
  {
      private string userName = string.Empty;
      private string passWord = string.Empty;
      public CustomSoapHeader()//必须有一个无参数的构造函数
      { }

      /// <summary>
      /// 构造函数
      /// </summary>
      /// <param name="userName">用户名</param>
      /// <param name="passWord">密码</param>
      public CustomSoapHeader(string userName, string passWord)
      {
          this.userName = userName;
          this.passWord = passWord;
      }

      /// <summary>
      /// 获取或设置用户用户名
      /// </summary>
      public string UserName
      {
          get { return userName; }
          set { this.userName = value; }
      }

      /// <summary>
      /// 获取或设置用户密码
      /// </summary>
      public string PassWord
      {
          get { return passWord; }
          set { this.passWord = value; }
      }
      public bool Validate()
      {
          return this.UserName.Contains("xxx") && this.PassWord.Contains("123456");
      }
  }
  ```

  **WebService类  MyWebService.asmx**
  ```csharp
  [WebService(Namespace = "http://tempuri.org/")]
  [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
  [System.ComponentModel.ToolboxItem(false)]
  // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
  // [System.Web.Script.Services.ScriptService]
  public class MyWebService : System.Web.Services.WebService
  {

      public CustomSoapHeader SoapHeaderProp { get; set; }

      [WebMethod]
      [SoapHeader("SoapHeaderProp")]
      public int GetValue(int x,int y)
      {
          if (this.SoapHeaderProp.Validate())
          {
              return x + y;
          }
          else
          {
              throw new SoapException("身份验证失败",SoapException.ClientFaultCode);
          }  
      }
  }
  ```

  **服务端调用类**
  ```csharp
  //服务端请求  单元测试
  //添加服务引用到此项目
  [TestClass]
    public class UnitTestWebService
    {
        [TestMethod]
        public void TestMethodAssert()
        {
            using (MyWebServiceTest.MyWebServiceSoapClient client = new MyWebServiceTest.MyWebServiceSoapClient())
            {
                CustomSoapHeader header = new CustomSoapHeader();
                header.UserName = "xxx";
                header.PassWord = "123456";
                Assert.AreEqual(client.GetValue(header,1, 3),4); 
            }

        }
    }
  ```

## WCF

后缀为.svc

WCF支持不同的协议(http,tcp,ipc,MSMQ,P2P)，支持不同的宿主(控制台，网站，winform，windowsService)

 - 接口：需要标注特性 ServiceContract，方法上标注 OperationContract，若是没有在方法上标注特性，则调用的地方找不到该方法

 - 实体：
   
     - 没有任何标记，则数据全部返回(要是无参数构造函数)

     - 如果实体类没有无参数的构造函数，则类上需要标注 DataContract特性

     - 类上面有DataContract特性，那么元素上需要标注DataMember特性，否则用的地方找不到

**Wcf托管在控制台程序**

托管在控制台（framework），需要在控制台的配置文件App.config中添加如下配置

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.8" />
    </startup>
  <system.serviceModel>
    <!--<behaviors>
      <serviceBehaviors>
        <behavior name="MathServicebehavior">
          <serviceDebug httpHelpPageEnabled="false"/>
          <serviceMetadata httpGetEnabled="false"/>
          <serviceTimeouts transactionTimeout="00:10:00"/>
          <serviceThrottling maxConcurrentCalls="1000" maxConcurrentInstances="1000" maxConcurrentSessions="1000"/>
        </behavior>

        <behavior name="CalculatorServicebehavior">
          <serviceDebug httpHelpPageEnabled="false"/>
          <serviceMetadata httpGetEnabled="false"/>
          <serviceTimeouts transactionTimeout="00:10:00"/>
          <serviceThrottling maxConcurrentCalls="1000" maxConcurrentInstances="1000" maxConcurrentSessions="1000"/>
        </behavior>
      </serviceBehaviors>
    </behaviors>

    <bindings>
      <netTcpBinding>
        <binding name="tcpbinding">
          <security mode="None">
            <transport clientCredentialType="None" protectionLevel="None"/>
          </security>
        </binding>
      </netTcpBinding>
    </bindings>
    <services>
      <service name="SOA.WCF.Service.CalculatorService" behaviorConfiguration="CalculatorServicebehavior">
        <host>
          <baseAddresses>
            <add baseAddress="net.tcp://localhost:11111/CalculatorService"/>
          </baseAddresses>
        </host>
        <endpoint address="" binding="netTcpBinding" bindingConfiguration="tcpbinding" contract="SOA.WCF.Interface.ICalculatorService"/>
        <endpoint address="mex" binding="mexTcpBinding" contract="IMetadataExchange"/>
      </service>

      <service name="SOA.WCF.Service.MathService" behaviorConfiguration="MathServicebehavior">
        <host>
          <baseAddresses>
            <add baseAddress="net.tcp://localhost:11111/MathService"/>
          </baseAddresses>
        </host>
        <endpoint address="" binding="netTcpBinding" bindingConfiguration="tcpbinding" contract="SOA.WCF.Interface.IMathService"/>
        <endpoint address="mex" binding="mexTcpBinding" contract="IMetadataExchange"/>
      </service>
    </services>-->

    <behaviors>
      <serviceBehaviors>
        <behavior name="MathServicebehavior">
          <serviceDebug httpHelpPageEnabled="false"/>
          <serviceMetadata httpGetEnabled="false"/>
          <serviceTimeouts transactionTimeout="00:10:00"/>
          <serviceThrottling maxConcurrentCalls="1000" maxConcurrentInstances="1000" maxConcurrentSessions="1000"/>
        </behavior>
      </serviceBehaviors>
    </behaviors>
    
    <bindings>
      <basicHttpBinding>
        <binding name="httpbinding"/>
      </basicHttpBinding>
    </bindings>
    
    <services>
      <service name="SOA.WCF.Service.MathService" behaviorConfiguration="MathServicebehavior">
        <host>
          <baseAddresses>
            <add baseAddress="http://localhost:11113/MathService"/>
          </baseAddresses>
        </host>
        <endpoint address="" binding="basicHttpBinding" bindingConfiguration="httpbinding" contract="SOA.WCF.Interface.IMathService"/>
        <endpoint address="mex" binding="mexHttpBinding" contract="IMetadataExchange"/>
      </service>
    </services>

  </system.serviceModel>
</configuration>
```

**控制台主程序**

```csharp
static void Main(string[] args)
{
    try
    { 
        ServiceInit.Process();
    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        throw;
    }
}
```

```csharp
public class ServiceInit
{
    public static void Process()
    {
        //ServiceHost对象
        List<ServiceHost> hosts = new List<ServiceHost>()
        {
            new ServiceHost(typeof(MathService)),
            // new ServiceHost(typeof(CalculatorService))
        };
        foreach (var host in hosts)
        {
            host.Opening += (s, e) => Console.WriteLine($"{host.GetType().Name} 准备打开");
            host.Opened += (s, e) => Console.WriteLine($"{host.GetType().Name} 已经正常打开");
            host.Closing += (s, e) => Console.WriteLine($"{host.GetType().Name} 准备关闭");
            host.Closed += (s, e) => Console.WriteLine($"{host.GetType().Name} 准备关闭");
            host.Open();
        }
        Console.WriteLine("输入任何字符，就停止");
        Console.Read();
        foreach (var host in hosts)
        {
            host.Close();
        }
        Console.Read();
    }
    private static void Host_Closing(object sender, EventArgs e)
    {
        throw new NotImplementedException();
    }
}
```
<br>

---------------------------

以下为WCF服务内容：

**模型**

```csharp
[DataContract]
public class WCFUser
{
    //[DataMember]
    public int Id { get; set; }
    [DataMember]
    public int Age { get; set; }
    [DataMember]
    public int Sex { get; set; }
    [DataMember]
    public string Name { get; set; }
    [DataMember]
    public string Description { get; set; }
}
public enum WCFUserSex
{
    Famale,
    Male,
    Other
}
```

**定义接口**

```csharp
[ServiceContract]
public interface IMathService
{
    [OperationContract]
    int PlusInt(int x, int y);
    int Minus(int x, int y);
    [OperationContract]
    WCFUser GetUser(int x, int y);
    [OperationContract]
    List<WCFUser> UserList();
}
```

**接口实现**

```csharp
public class MathService : IMathService
{
    public int PlusInt(int x, int y)
    {
        return x + y;
    }
    public WCFUser GetUser(int x, int y)
    {
        return new WCFUser()
        {
            Id = 13,
            Name = "慕冬",
            Age = 22,
            Description = "这里是WCFServie",
            Sex = (int)WCFUserSex.Famale
        };
    }
    public List<WCFUser> UserList()
    {
        return new List<WCFUser>(){
            new WCFUser()
            {
                Id = 1,
                Name = "只想简简单单的活着",
                Sex = (int)WCFUserSex.Male,
                Age = 12,
                Description = "123456678990"
            },
             new WCFUser()
            {
                Id = 2,
                Name = "謹記妳容顏",
                Sex = (int)WCFUserSex.Male,
                Age = 12,
                Description = "123456678990"
            },
             new WCFUser()
            {
                Id = 3,
                Name = "雅牛",
                Sex = (int)WCFUserSex.Famale,
                Age = 112,
                Description = "123456678990"
            }
        };
    }
    public int Minus(int x, int y)
    {
        return x - y;
    }
}
```

**服务端调用**

远端调用首先需要添加服务引用，命名为 MyConsoleWcfHttp
```csharp
[TestClass]
public class UnitTestWCFHttp
{
    [TestMethod]
    public void TestMethod1()
    {
        MyConsoleWcfHttp.MathServiceClient client = null;
        try
        {
            client = new MyConsoleWcfHttp.MathServiceClient();
            var vResult = client.GetUser(2, 3);
            var info = client.PlusInt(1, 5);
            client.Close();
        }
        catch (Exception e)
        {
            if (client != null)
            {
                client.Abort();//是为了应对网络断掉异常
            }
            throw;
        }
    }
}
```
## WebApi

### 1、 .Net Framework

项目启动时，就会执行Application_Start，给Routes增加路由规则--请求进来时，经过路由匹配找到合适的控制器

找Action？

 1、根据HttpMethod方法---用方法名字开头，Get就找对应Get请求

 2、如果名字不是以Get开头，可以加上[HttpGet]

 3、按照参数找最吻合

**特性路由：**

1、注册的时候在 WebApiConfig类 增加 config.MapHttpAttributeRoutes();

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // Web API 配置和服务，替换框架原有容器
        config.DependencyResolver=new UnityDependencyResolver(ContainerFactory.CreateContainer());
        // Web API 路由,注册特性路由则添加此句
        config.MapHttpAttributeRoutes();
        config.Routes.MapHttpRoute(
            name: "DefaultApi",//默认的api路由
            routeTemplate: "api/{controller}/{id}",//正则规则，以api开头，第二个是控制器，第三个是参数
            defaults: new { id = RouteParameter.Optional }
        );
    }
}
```

2、标记特性

```csharp
[RoutePrefix("api/values")]// action就可以去掉这一节（api/values/），如果某个方法有不要了，可以在路由前面加个~
                           // [Route("~api/values/{id:int}/typeId/{typeId:int}")]
public class ValuesController : ApiController
{
    [Route("{id:int}")]
    public string Get(int id)
    {
        return "value";
    }

    [Route("~api/values/{id:int}/typeId/{typeId:int}")]
    public string Get(int id, int typeId)
    {
        return $"value_{typeId}";
    }

    [Route("{id:int?}")]//可空参数
    [Route("{id:int=10}")]
    public string GetId(int id=10)
    {
        return "value"+id;
    }

    [Route("{id}/V2")]
    public string GetV2(int id)
    {
        return "value_V2_controller";
    }
}
```

**WebApi依赖注入和面向切面**

1、IOC容器+配置文件初始化

2、控制器里面注入--完成容器和WebApi框架的融合,实现IDependencyResolver,将容器放进去，初始化时将config.DependencyResolver换成自定义的Resolver

添加Unity配置文件 Unity.Config

```xml
<!--文件目录：项目根目录/CfgFiles/Unity.Config-->
<configuration>
  <configSections>
    <!--这里添加一个unity扩展-->
    <section name="unity" type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection, Unity.Configuration" />
  </configSections>
  <unity>
    <sectionExtension type="Microsoft.Practices.Unity.InterceptionExtension.Configuration.InterceptionConfigurationExtension, Unity.Interception.Configuration" />
    <containers>
      <!--这里最好起一个名字 方便代码查找-->
      <container name="WebApiContainer">
        <extension type="Interception" />
        <!-- 在这里配置好依赖关系 -->
        <register type="Soa.Interface.IUserService,Soa.Interface" mapTo="Soa.Service.UserService,Soa.Service"/>
      </container>
    </containers>
  </unity>
</configuration>
```

创建一个方法类

```csharp
public class ContainerFactory
{
    public static IUnityContainer CreateContainer()
    {
        //get
        //{
            return _container;
        //}
    }
    private static IUnityContainer _container = null;
    static ContainerFactory()
    {
        ExeConfigurationFileMap fileMap=new ExeConfigurationFileMap();
        fileMap.ExeConfigFilename = Path.Combine(AppDomain.CurrentDomain.BaseDirectory + "CfgFiles\\Unity.Config");
        Configuration configuration =
            ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
        UnityConfigurationSection section =
            (UnityConfigurationSection) configuration.GetSection(UnityConfigurationSection.SectionName);
        _container = new UnityContainer();
        section.Configure(_container, "WebApiContainer");
    }
}
```

依赖关系注入容器类

```csharp
public class UnityDependencyResolver : IDependencyResolver
{
    private IUnityContainer _container = null;
    public UnityDependencyResolver(IUnityContainer container)
    {
        this._container = container;
    }
    public IDependencyScope BeginScope()//作用域
    {
        return  new UnityDependencyResolver(this._container.CreateChildContainer());
    }
    public void Dispose()
    {
        this._container.Dispose();
    }
    public object GetService(Type serviceType)
    {
        try
        {
            return this._container.Resolve(serviceType);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return null;
        } 
    }
    public IEnumerable<object> GetServices(Type serviceType)
    {
        try
        {
            return this._container.ResolveAll(serviceType);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }
}
```

在WebApiConfig类中添加config.DependencyResolver=new UnityDependencyResolver(ContainerFactory.CreateContainer()); 替换掉原有的容器

控制器中，通过构造函数注入进来

```csharp
public class IOCController : ApiController
{
    private IUserService _userService = null;
    public IOCController(IUserService userService)
    {
        this._userService = userService;
    }
    [HttpGet]
    public string Get(int id)
    {
        //IUserService service=new UserService();
        //IUserService service = ContainerFactory.CreateContainer().Resolve<IUserService>();
        return JsonConvert.SerializeObject(_userService.Query(id));
    }
}
```

#### WebApi过滤器

- ActionFilterAttribute

在此过滤器中可以添加日志记录，请求头数据构造等功能,可以在Action前/后分别增加逻辑

```csharp
public class CustomActionFilterAttribute:ActionFilterAttribute
{
    public override void OnActionExecuting(HttpActionContext actionContext)
    {
        Console.WriteLine("12345");
        actionContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    }
    public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
    {
        Console.WriteLine("23456");
        
    }
}
```

- AuthorizeAttribute

在此过滤器中可以进行权限的校验

首先需要在登录的时候获取到一个令牌

```csharp
public string Login(string account, string password)
{
    if ("Admin".Equals(account) && "123456".Equals(password))//应该数据库校验
    {
        FormsAuthenticationTicket ticketObject = new FormsAuthenticationTicket(0, account, DateTime.Now, DateTime.Now.AddHours(1), true, string.Format("{0}&{1}", account, password), FormsAuthentication.FormsCookiePath);
        var result = new
        {
            Result = true,
            Ticket = FormsAuthentication.Encrypt(ticketObject)
        };
        return JsonConvert.SerializeObject(result);
    }
    else
    {
        var result = new { Result = false };
        return JsonConvert.SerializeObject(result);
    }
}
```

前端请求将令牌信息添加到请求头

```js
$("#btnGet1").on("click", function () {
    $.ajax({
        url: "/api/users/GetUserByName", type: "get", data: { "username": "Superman" },
        beforeSend: function (XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + ticket);
        },
        success: function (data) {
            alert(data);
        }, datatype: "json"
    });
});
```

```csharp
public class CustonBasicAuthorizeAttribute:AuthorizeAttribute
{
    /// <summary>
    /// action前会先来这里完成权限校验
    /// </summary>
    /// <param name="actionContext"></param>
    public override void OnAuthorization(HttpActionContext actionContext)
    {
        var authorization = actionContext.Request.Headers.Authorization;
        if (actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>(true).Count != 0 || actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>(true).Count != 0)
        {
            //如果有Anonymous
            base.OnAuthorization(actionContext);
        }
        else if (authorization != null && authorization.Parameter != null)
        {
            //验证用户逻辑
            if (ValidateTicket(authorization.Parameter))
            {
                base.IsAuthorized(actionContext);
            }
            else
            {
                this.HandleUnauthorizedRequest(actionContext);
            }
        }
        else
        {
            this.HandleUnauthorizedRequest(actionContext);
        }
    }
    protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
    {
        var challengeMessage=new HttpResponseMessage(HttpStatusCode.Unauthorized);//告诉浏览器要验证
        challengeMessage.Headers.Add("WWW-Authenticate","Basic");
        base.HandleUnauthorizedRequest(actionContext);  //返回没有授权
    }
    private bool ValidateTicket(string encryptTicket)
    {
        try
        {
            var strTicket = FormsAuthentication.Decrypt(encryptTicket).UserData;
            var isExpired = FormsAuthentication.Decrypt(encryptTicket).Expired;
            return string.Equals(strTicket, string.Format("{0}&{1}", "Admin", "123456"));
        }
        catch (Exception e)
        {
            return false;
        } 
    }
}
```

- ExceptionFilterAttribute

在此校验器中可以对异常进行处理

```csharp
public class CustomExceptionFilterAttribute:ExceptionFilterAttribute
{
    public override void OnException(HttpActionExecutedContext actionExecutedContext)
    {
        Console.WriteLine(actionExecutedContext.Exception.Message);
        actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, new
        {
            Result = true,
            Msg = "出现异常"
        });//创造一个返回
        //base.OnException(actionExecutedContext);
    }
}
```

- ExceptionHandler (WebApi全局异常处理)

使用全局异常处理，则需要在WebApi的WebApiConfig文件中替换框架自带的全局异常处理类

```csharp
config.Services.Replace(typeof(IExceptionHandler),new CustomExceptionHandler());//替换全局异常处理类
```

#### 跨域

1、为什么会出现跨域

出于浏览器的同源策略限制。

同源策略是一种约定，它是浏览器最核心也是最基本的安全功能。所谓同源（即指在同一个域）就是两个页面具有相同的协议，域名和端口号

2、 解决跨域

- 使用CROS


CORS 跨域资源共享，允许服务器在响应头里面指定Access-Control-Allow-Origin，浏览器按照响应来操作 nuget引用CORS

自定义actionFilter--response增加 actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin","*");

需要在项目中引用Nuget包 "Microsoft.AspNet.WebApi.Cors"

在WebApi的WebApiConfig文件中添加如下

```csharp
config.EnableCors(new EnableCorsAttribute("*","*","*"));
```