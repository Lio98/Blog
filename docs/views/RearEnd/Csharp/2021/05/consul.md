---
title: 'Consul进行服务注册与发现'
date: 2021-05-03
categories:
- "Csharp"
tags:
- MicroService
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## Consul简介

### Consul是什么？

Consul本质上是一个Socket通信中间件。

它主要实现了两个功能，服务注册与发现和自身的负载均衡的集群。

我们可以把他理解为一个没有界面的应用程序，因为没有界面，所以想启动Consul就只能使用命令行了；也因为没有界面，一旦使用命令行启动了Consul，那么，执行该命令行的cmd.exe程序，就成了Consul的宿主了；一旦关

闭Cmd窗口，Consul就停止运行了。

### 服务注册与发现的本质

其实服务注册与发现的原理很简单。

当我们在本机运行Consul时，它会自动监听8500端口；然后我们通过一个开源类库（这个开源类库可以在nuget上检索到），调用其下不同的方法来向这个Consul进程发送TCP消息，来注册服务或者发现服务。

Consul进程在接收到注册消息时，就把注册的服务信息存储到本地磁盘或内存。

数据中心：Consul存储数据的地方，官方为其命名尾数据中心，也就是上面说的保存我们注册的服务信息的本地磁盘或者内存。

### Consul提供负载均衡的集群

Consul的集群也很好理解，在我们成功启动Consul以后，它除了监听8500端口以外，它还监听了一个8031端口。

这个8031端口就是用于Consul集群相互通信的。

我们都知道集群是要两台以上的电脑的，所以，我们就必须找到两台或以上的电脑安装Consul中间件。

然后，使用Consul的命令行，将两台电脑连接到一起，这样集群就形成了。

在集群内每台电脑上安装的Consul中间件，我们统称为服务器代理（Agent），当集群启动后，会在多个代理服务器之间选举出一个Leader。

选举Leader自然就是服务器代理之间的通信了，也就是通过上面提到的8031端口通信的。

选举了Leader，服务器代理就可以将自身的负载信息发送给Leader，这样客户端调用Consul检索服务数据时，就可以去性能最优的那台机器上获取信息了。（注：这个是举例说明，并非Consul的负载均衡的真实处理模式）

## Consul代理服务器安装

首先，去官网下载Consul，下载地址：https://www.consul.io/downloads.html

下载完成后，我们需要通过命令行来启动它  consul agent -dev -ui -node=consul-dev -client=127.0.0.1（我是这样启动的）

------

在网上还有看到一种介绍巨详细的，拿过来记录一下

consul agent -server -ui -bootstrap-expect=1 -data-dir=/tmp/consul -node=consul-1 -client=0.0.0.0 -bind=192.168.1.111 -datacenter=dc1

命令解释如下：

其实consul命令大家是可以在网络上搜到它们的定义的，不过我觉得解释的还是太官方，所以，我在这里提供了一份我认为更好的解释。

consul agent：命令头，必须要有。

-server：表面我们现在要启动服务器代理（agent）是服务模式的。Consul Agent的运行模式有两种，Server模式和Client模式。其区别简单来说就是Server模式的Agent可以被选举为Leader，而Client模式的不可以，当然

还有其他区别，有兴趣大家可以自行了解。

-ui：consul运行后，会提供一个http://127.0.0.1:8500/ui/的网站，里面存储了Consul Agent各个节点以及注册的服务等相关信息，即数据中心的网页形式体现。这个参数代表是否创建这个网站，这个参数与这个数据中心

网站有关。

bind：本机的ip地址，集群内其他代理服务器可以通过这个ip来访问这台电脑的consul代理服务器。

bootstrap-expect：是集群启动条件，指当服务器端模式（Server模式）的代理达到这个数目后，才开始运行。

data-dir：是存放数据中心数据的，该目录必须是稳定的，系统重启后也继续存在的。

datacenter：当前agent的中心数据的名称，默认是dc1。

node：节点在集群中的名称，在一个集群中必须是唯一的，默认是该节点的主机名（代表一个机器）。

client：本地ip地址，这里使用 0.0.0.0 ，就表示这个服务器所有IP都可以，即当这台电脑有俩ip，192.168.1.111和192.168.1.112，那么通过这俩IP都可以访问到这台机器的consul代理服务器。


这个启动完成后，再去启动另一台电脑，运行如下命令：

consul agent -server -ui -bootstrap-expect=1 -data-dir=d:\consul -node=consul-2 -client=0.0.0.0 -bind=192.168.80.112 -datacenter=dc1 -join 192.168.80.111

可以看到，我们在命令行最后面追加了一个join 192.168.80.111；通过这个命令，我们把这台电脑的代理服务器成功的加入到了上文中的consul集群。


## 服务注册与发现

### Consul的服务注册

首先，创建了一个 . Net Core 的 WebApi的项目，在Nuget中引入了Consul，顺带添加log4net包，并且在Program.CreateHostBuilder中将其添加进去

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureLogging((context, loggingbuilder) =>
        {
            //该方法需要引入Microsoft.Extensions.Logging名称空间

            loggingbuilder.AddFilter("System", LogLevel.Warning); //过滤掉系统默认的一些日志
            loggingbuilder.AddFilter("Microsoft", LogLevel.Warning);//过滤掉系统默认的一些日志

            //添加Log4Net

            //var path = Directory.GetCurrentDirectory() + "\\log4net.config"; 
            //不带参数：表示log4net.config的配置文件就在应用程序根目录下，也可以指定配置文件的路径
            loggingbuilder.AddLog4Net();
        })
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```

然后，我们写了一个发现与注册服务的方法，将其添加到Startup.Configure()中

```csharp
public static class ConsulRegister
{
    public static void RegistConsul(this IConfiguration configuration)
    {
        string ip = configuration["ip"] ?? "Localhost";
        //部署到不同服务器的时候不能写成127.0.0.1或者0.0.0.0，因为这是让服务消费者调用的地址
        //int.Parse(configuration["Consul:ServicePort"]);//服务端口
        int port = string.IsNullOrWhiteSpace(configuration["port"]) ? 44308 : int.Parse(configuration["port"]);
        ConsulClient client = new ConsulClient(obj =>
        {
            obj.Address = new Uri("http://127.0.0.1:8500");
            obj.Datacenter = "dcl";
        });
        //向consul注册服务
        Task<WriteResult> result = client.Agent.ServiceRegister(new AgentServiceRegistration()
        {
            ID = "apiserviceTest_"+Guid.NewGuid(),//服务编号，不能重复
            Name = "apiserviceTest",
            Address = ip,
            Port = port,
            Tags = new string[]{configuration["weight"]},//可以用来设置权重--不同的实例不同的值
            Check = new AgentServiceCheck()
            {
                DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(5),//服务定制多久后反注册
                Interval = TimeSpan.FromSeconds(10),//健康检查时间间隔，或者称为心跳间隔
                HTTP = $"http://{ip}:{port}/api/health",//健康检查地址
                Timeout = TimeSpan.FromSeconds(5)
            }
        });
    }
}
```

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Home/Error");
    }
    app.UseStaticFiles();
    app.UseRouting();
    app.UseAuthorization();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
    });
    //将写好的服务注册与发现方法添加进来
    this.Configuration.RegistConsul();
}
```

心跳检查接口

```csharp
[Route("api/[controller]")]
[ApiController]
public class HealthController : ControllerBase
{
    private ILogger<HealthController> _logger = null;
    private IConfiguration _iConfiguration = null;
    public HealthController(IConfiguration configuration, ILogger<HealthController> logger)
    {
        this._iConfiguration = configuration;
        this._logger = logger;
    }
    [HttpGet]
    public IActionResult Check()
    {
        this._logger.LogInformation($"{this._iConfiguration["port"]}_ Health Check！");
        return Ok();
    }
}
```

服务注册完后，可以访问本地数据中心的网站:http://127.0.0.1:8500/ui/dc1/services来查看注册服务的状态。

### Consul的服务发现

服务注册完成后，我们再控制器来进行服务发现。

代码编写如下：

```csharp
[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private ILogger<TestController> _logger = null;
    private IConfiguration _iConfiguration = null;
    public TestController(IConfiguration configuration, ILogger<TestController> logger) 
    {
        this._iConfiguration = configuration;
        this._logger = logger;
    }
    [HttpGet]
    public IActionResult Get()
    {
        this._logger.LogInformation("TestController - Get 执行");
        string msg = null;
        //实例化当前的consul 中注册的所有服务
        using (ConsulClient consulClient=new ConsulClient(c=>c.Address=new Uri("http://127.0.0.1:8500")))
        {
            //consulClient.Agent.Services()获取consul中注册的所有的服务
            Dictionary<string, AgentService> services = consulClient.Agent.Services().Result.Response;
            foreach (KeyValuePair<string, AgentService> kv in services)
            {
                this._logger.LogWarning($"key={kv.Key},{kv.Value.Address},{kv.Value.ID}," +
                                        $"{kv.Value.Service},{kv.Value.Port}{string.Join(",",kv.Value.Tags)}");
            }
            //获取所有服务名字是apiserviceTest所有的服务
            var agentServices = services
                .Where(s => s.Value.Service.Equals("apiserviceTest", StringComparison.CurrentCultureIgnoreCase))
                .Select(s => s.Value);
            //根据当前TickCount对服务器个数取模，“随机”取一个机器出来，避免轮询的负载均衡策略需要计数枷锁问题
            //可以根据tag--根据用户ip--等各种因素来做调度
            //var agentService = agentServices.ElementAt(Environment.TickCount % agentServices.Count());
            //随机获取--均衡调度
            //权重--某台服务器厉害点，就多承担一点
            var serviceWeight = agentServices.Select(s =>
            {
                int weight = 1; //不设置就是1
                if (s.Tags != null && s.Tags.Length > 0 && int.TryParse(s.Tags[0], out weight))
                {
                }
                KeyValuePair<AgentService, int> keyValuePair = new KeyValuePair<AgentService, int>(s, weight);
                return keyValuePair;
            });
            List<AgentService> serviceList = new List<AgentService>();
            foreach (var sw in serviceWeight)
            {
                for (int i = 0; i < sw.Value; i++)
                {
                    serviceList.Add(sw.Key);
                }
            }
            int total = serviceWeight.Sum(s => s.Value);
            int index = new Random().Next(0,total);
            var agentService = serviceList[index];
            
            msg = $"{agentService.Address},{agentService.ID},{agentService.Service},{agentService.Port}";
            this._logger.LogWarning(msg);
        }
        return new JsonResult(new
        {
            Id=133,
            Name="xx",
            Remark=msg
        });
    }
    [HttpGet]
    [Route("invoke")]
    public IActionResult Invoke()
    {
        this._logger.LogWarning("TestController - Invoke 执行");
        string urlDefault = $"http://apiserviceTest/api/values";
        string urlTarget = this.ResolveUrlAsync(urlDefault);
        using (HttpClient httpClient=new HttpClient())
        {
            HttpRequestMessage requestMessage = new HttpRequestMessage();
            requestMessage.Method=HttpMethod.Get;
            requestMessage.RequestUri = new Uri(urlTarget);
            var result = httpClient.SendAsync(requestMessage).Result;
            return new JsonResult(new
            {
                Id = 123,
                Name = "xxx",
                result.StatusCode,
                urlTarget,
                Content = result.Content.ReadAsStringAsync().Result
            });
        }
    }
    private string ResolveUrlAsync(string url)
    {
        Uri uri = new Uri(url);
        string serviceName = uri.Host;
        string rootUrl = this.GetServiceAddress(serviceName);
        return uri.Scheme + "://" + rootUrl + uri.PathAndQuery;
    }
    private string GetServiceAddress(string name) 
    {
        using (ConsulClient consulClient = new ConsulClient(c=>c.Address=new Uri("http://127.0.0.1:8500")))
        {
            Dictionary<string, AgentService> services = consulClient.Agent.Services().Result.Response;
            var agentServices = services
                .Where(s => s.Value.Service.Equals(name, StringComparison.CurrentCultureIgnoreCase))
                .Select(s => s.Value);
            var agentService = agentServices.ElementAt(Environment.TickCount % agentServices.Count());
            return $"{agentService.Address}:{agentService.Port}";
        }
    }
}
```




