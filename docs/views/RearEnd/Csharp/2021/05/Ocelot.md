---
title: '.Net Core + Oeclot: API网关'
date: 2021-05-03
categories:
- "Csharp"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## Ocelot简介

### Ocelot是什么？

Ocelot是一个用 .NET Core实现并且开源的API网关，它功能强大，包括了：路由、请求聚合、服务发现、认证、鉴权、限流熔断、并内置了负载均衡器与Service Fabric、Butterfly Tracing集成。

外网访问 Ocelot API 网关服务（单实例），通过配置的规则（configuration.json），路由到下游的两个微服务实例（Http Service），这也就是最基本的转发能力。

## 配置路由转发

首先，创建了一个 . Net Core 的 WebApi的项目，在Nuget中引入了Ocelot包；

创建配置文件 configuration.json，内容如下：

```json
{
  "Routes": [
    {
      "DownstreamPathTemplate": "/api/{url}", //服务地址--url变量
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "localhost",
          "Port": 2019 //服务端口
        },
        {
          "Host": "localhost",
          "Port": 2020 //服务端口
        }
      ],
      "LoadBalancerOptions": {
        "Type": "RoundRobin" //轮询  LeastConnection-最少连接数的服务器  NoLoadBalance-不负载均衡
      },
      "UpstreamPathTemplate": "/T2019/{url}", //网关地址--url变量
      "UpstreamHttpMethod": [ "Get", "Post" ]
    },
    {
      "DownstreamPathTemplate": "/api/{url}", //服务地址--url变量
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "localhost",
          "Port": 2020 //服务端口
        }
      ],
      "UpstreamPathTemplate": "/T2020/{url}", //网关地址--url变量
      "UpstreamHttpMethod": [ "Get", "Post" ]
    }
  ]
}
```

在 Program.CreateHostBuilder 中添加 Ocelot 配置文件引用：

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureAppConfiguration(cfg =>
        {
            cfg.AddJsonFile("configuration.json", optional: false, reloadOnChange: true);
        })
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```

在 Startup.cs 中注册服务与管道配置：

```csharp
public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddOcelot(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseOcelot().Wait();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
```

通过以上服务搭建，一个简单的路由转发功能已经配置完成，即当访问上有路由地址自动转发到下游任意一个服务实例中相匹配的路由地址，例如：当访问/T2020/{url}都将转发到http://localhost:2020/{url}上。

## 路由发现 (Ocelot + Consul)

Ocelot 支持与具备 服务发现功能的一些框架相结合，如：Consul、Eureka，下游服务地址可直接从服务注册中心进行获取。

首先，在Nuget中引入 Ocelot.Provider.Consul 包,如果要使用熔断，则还需要添加 Ocelot.Provider.Polly NuGet 包，需要在StratUp.cs中添加服务注册

修改配置文件为如下：

```json
{
  "Routes": [
    {
      "DownstreamPathTemplate": "/api/{url}", //服务地址--url变量
      "DownstreamScheme": "http",
      "UpstreamPathTemplate": "/consul/{url}", //网关地址--url变量
      "UpstreamHttpMethod": [ "Get", "Post" ],
      "UseServiceDiscovery": true,
      "ServiceName": "apiserviceTest", //consul服务名
      "LoadBalancerOptions": {
        "Type": "RoundRobin" //轮询  LeastConnection-最少连接数的服务器
      },
      //"FileCacheOptions": {
      //  "TtlSeconds": 10 //10s  仅对get请求生效，同地址就同结果
      //},
      //"RateLimitOptions": {    //限流
      //  "ClientWhitelist": [], //白名单
      //  "EnableRateLimiting": true,  //是否开启限流
      //  "Period": "1m", //1s，1m，1h，1d
      //  "PeriodTimespan": 5, //多少秒之后客户端可以重试
      //  "Limit": 5 //统计时间段内允许的最大请求数量 
      //},
      "QoSOptions": {
        "ExceptionsAllowedBeforeBreaking": 3, //允许多少个异常请求
        "DurationOfBreak": 10000, //熔断时间，单位为ms
        "TimeoutValue": 5000 //如果下游请求的处理时间超过多少则自动将请求设置为，单位为ms
      }
    }
  ],
  "GlobalConfiguration": {
    "BaseUrl": "http://127.0.0.1:9529/",
    "ServiceDiscoveryProvider": {
      "Host": "localhost",
      "Port": 8500,
      //由Consul提供服务发现
      "Type": "Consul"
    },
    "RateLimitOptions": {
      "QuotaExceededMessage": "您的请求量超过了配额1/5分钟", //限流以后的提示信息
      "HttpStatusCode": 666  //超出配额时，返回的http状态码
    } 
  }
}
```


添加服务注册和中间件

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    services.AddOcelot(Configuration).AddConsul().AddPolly();
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    app.UseOcelot().Wait();
    app.UseRouting();
    app.UseAuthorization();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

至此，Ocelot + Consul 搭配使用已经配置完毕。