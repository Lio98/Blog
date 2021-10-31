---
title: 'Nlog'
date: 2021-04-06
categories:
- "Csharp"
tags:
- 日志配置
sidebar: true
isFull: false
isShowComments: true
isShowIndex: false
---

# Nlog使用

首先，当然是引用nuget程序包(NLog.Web.AspNetCore)，然后需要添加Nlog的配置文件,该文件在项目中CfgFiles文件夹下创建nlog.config，并且设置属性如果较新则复制

其次，在项目Project.cs中添加使用Nlog （.UseNLog()）

``` csharp
public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            }).UseNLog();
}
```

nlog.config配置文件内容

``` xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     autoReload="true"
       internalLogLevel="Warn"
       internalLogFile="${basedir}/logs/internal-nlog.txt">
	<!--define various log targets  keepConnection-->
	<targets>



		<!--ElasticSearch发送-->
		<!--<target name="elastic" xsi:type="BufferingWrapper" flushTimeout="5000">
      <target xsi:type="ElasticSearch" includeAllProperties="true" index="logstash-20200805"  uri="http://localhost:9200" />
    </target>-->

		<!--发送到RabbitMQ-->
		<extensions>
			<add assembly="Nlog.RabbitMQ.Target" />
		</extensions>
		<targets async="true">
			<target name="RabbitMQTarget"
				xsi:type="RabbitMQ"
			   username="guest"
					   password="guest"
					   hostname="localhost"
			   port="5672"
					   vhost="/"
			   appid="NLog.RabbitMQ.DemoApp"
			   topic="DemoApp.Logging.${level}"
				exchange="aggregationservice-log"
						exchangeType="topic"
				useJSON="true"
				layout="${longdate}|${logger}|${uppercase:${level}}|${message} ${exception" />
		</targets>

		<!---文件发送
		<target xsi:type="File" name="allfile" fileName="${shortdate}.log"
		layout="${longdate}|${logger}|${uppercase:${level}}|${message} ${exception}" />-->

		<!--网络发送
		<target name="logstash" xsi:type="Network" address="tcp://127.0.0.1:9999"  keepConnection="false"
			 layout="${longdate}|${logger}|${uppercase:${level}}|${message} ${exception}"/>-->
	</targets>
	<rules>
		<logger name="*" level="Info,Error" writeTo="RabbitMQTarget" />
	</rules>
</nlog>
```