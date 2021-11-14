---
title: 'ABP vNext'
date: 2021-11-08
categories:
- "Csharp"
tags:
- ABP
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
DetailImgSrc: "https://image.xjq.icu/2021/11/8/2021.11.8-abp.jpg"
---

## 核心根基模块化

### 概述

ABP Vnext是一个基于Asp.Net Core Web应用程序框架，主要目的是用来快速开发Web应用。

可以用于开发任何Web应用程序。为什么Abp.Vnext可以快速开发Web应用？有两个原因

1、ABP Vnext提供完整Web应用程序开发模板。

2、ABP Vnext提供Web应用程序开发所需要的一些基础设施功能。

应用程序：运行在操作系统之上的程序都叫应用程序。例如：QQ 微信，淘宝。这些都是应用程序，应用程序分3类：桌面应用程序，Web应用程序，移动应用程序

### 什么是框架

应用程序组件规范。简单讲就是给应用程序取一个共同的名字

例如：支付宝付款，微信付款。这是两个组件，取一个规范。就是支付。

Asp.Net Core Web应用程序框架就把aspnetcore web相关的所有组件规范起来。

所以：ABP Vnext就是把aspnetcore web相关的所有的组件规范了。

通俗点：给相识的组件取一个共同的名字

例如：AspNetCore mvc ioc autofac redis.....会用到很多组件。所以会取一个共同的名字，名字叫做模块。都叫组件也可以。

但是在ABP Vnext中。叫做Module。

Module：就是对所有组件和业务模块的抽象。取的一个共同的名字。

-----------------

**在ABP中使用依赖注入**：可以在类上继承接口[ITransientDependency]或标注特性[Dependency(ServiceLifetime.Singleton)]，都可以自动注入到IOC容器。

## Console项目中使用Module

ABP可添加插件，并且执行插件的方法

``` csharp
class Program
{
    static void Main(string[] args)
    {
       System.Console.WriteLine("Hello World!");
        CreateHostBuilder(args).RunConsoleAsync().Wait();
    }
    internal static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .UseAutofac()
        .ConfigureAppConfiguration((context, config) =>
        {
        })
        .ConfigureServices((hostContext, services) =>
        {
            //从文件夹注册插件
            services.AddApplication<ConsoleModule>(options =>  
            {
                options.PlugInSources.AddFolder(@"D:\Codes\C#\ABP\MyPlugIns");
            });
        });
}


//插件Module
public class PlugInModule:AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);
        System.Console.WriteLine("加载插件模块");
    }
    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        base.OnApplicationInitialization(context);
        var myService = context.ServiceProvider.GetRequiredService<PlugInService>();
        myService.Plugin();
    }
}
```


## Web项目中使用Module

在web项目中，ABP将原先在StrapUp类中的服务注册和中间件注册，全部移到了Module中。

``` csharp
[DependsOn(typeof(AbpAspNetCoreMvcModule),typeof(AbpAutofacModule),typeof(CommonModule))]
public class WebModule :AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);
        context.Services.AddControllers();
        context.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("V1", new OpenApiInfo { Title = "Abp.Web", Version = "1.0.0" });
        });
    }
    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        base.OnApplicationInitialization(context);
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else 
        {
            app.UseExceptionHandler("/Error");
        }
        app.UseStaticFiles();
        app.UseRouting();
        app.UseConfiguredEndpoints();
    }
}
```

然后在Startup，进行注册Module。

```csharp
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    public IConfiguration Configuration { get; }
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication<WebModule>();
    }
    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.InitializeApplication();
    }
}
```

## 模块执行原理

### 条件

- 反射

- 递归

### 模块总结

**框架的核心模块**：如缓存, 邮件, 主题, 安全, 序列化, 验证, EF Core集成, MongoDB集成... 等. 它们没有应用/业务功能,它们提供了日常开发经常用到的通用基础设施,集成和抽象。

**应用程序模块**：这些模块实现了 特定的应用/业务功能 像博客, 文档管理, 身份管理, 租户管理... 等等。

## ABP CLI 

步骤
```
1、ABP CLI安装

 dotnet tool install -g Volo.Abp.Cli

2、ABP CLI 版本更新

 dotnet tool update -g Volo.Abp.Cli

3、Web模板项目创建

默认MVC项目

abp new  Project.Web -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Web

Mysql mvc项目

abp new  Project.Web --dbms mysql -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Web

Mysql web api项目

abp new  Project.Web --dbms mysql -u none -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Web.Api

4、Console模板项目创建

  abp new  Project.Console -t console -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Console

5、Module模板项目创建

abp new  Project.Module -t module -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Module

Module+无用户界面

abp new  Project.Module.NoUi -t module --no-ui -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Module.NoUi

模块+mysql

abp new  Project.Module.NoUi -t module --no-ui --dbms mysql -o D:\work\net-project\ABP专题\1、核心根基模块化\ Project.Module.NoUi

6、ABP CLI详细用法

  请参考文档。
```

## 运行Abp vNext Web项目

- 首先配置好相应的数据库连接字符串，启动数据迁移项目Project.Web.DbMigrator；

- 修改web项目中数据库连接字符串同上，启动web项目。

---------------

对于数据库的更新，则在EFCore项目下，使用 Add-Migration，然后输入一个想生成迁移文件的后缀名，最后执行Update-Database，即可更新数据库。[参考地址](https://docs.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/?tabs=vs)

<span style="color:red;font-weight:bold">默认登录账号为admin，密码为1q2w3E*。</span>