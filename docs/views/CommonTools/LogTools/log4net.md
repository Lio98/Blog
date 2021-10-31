---
title: 'Log4net'
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

## Log4net使用

首先，当然是引用nuget程序包，然后需要添加log4net的配置文件,该文件在项目中CfgFiles文件夹下创建log4net.xml，并且设置属性如果较新则复制

```xml
<?xml version="1.0" encoding="utf-8"?>
<log4net>
  <!-- Define some output appenders -->
  <appender name="rollingAppender" type="log4net.Appender.RollingFileAppender">
    <file value="log\" />

    <!--追加日志内容-->
    <appendToFile value="true" />

    <!--防止多线程时不能写Log,官方说线程非安全-->
    <lockingModel type="log4net.Appender.FileAppender+MinimalLock" />

    <!--可以为:Once|Size|Date|Composite-->
    <!--Composite为Size和Date的组合-->
    <rollingStyle value="Composite" />

    <!--当备份文件时,为文件名加的后缀-->
    <datePattern value="yyyyMMdd/yyyy-MM-dd&quot;-log.txt&quot;" />
    <!--<datePattern value='yyyy-MM-dd/yyyy-MM-dd"_log.txt"'/>-->

    <!--日志最大个数,都是最新的-->
    <!--rollingStyle节点为Size时,只能有value个日志-->
    <!--rollingStyle节点为Composite时,每天有value个日志-->
    <maxSizeRollBackups value="20" />

    <!--可用的单位:KB|MB|GB-->
    <maximumFileSize value="5MB" />

    <!--置为true,当前最新日志文件名永远为file节中的名字-->
    <staticLogFileName value="false" />

    <!--输出级别在INFO和ERROR之间的日志-->
    <filter type="log4net.Filter.LevelRangeFilter">
      <param name="LevelMin" value="INFO" />
      <param name="LevelMax" value="FATAL" />
    </filter>

    <layout type="log4net.Layout.PatternLayout">
      <conversionPattern value="%date [%thread] %-5level %logger - %message%newline"/>
    </layout>
  </appender>

  <!-- levels: OFF > FATAL > ERROR > WARN > INFO > DEBUG  > ALL -->
  <root>
    <priority value="ALL"/>
    <level value="ALL"/>
    <appender-ref ref="rollingAppender" />
  </root>
</log4net>
```

其次，添加Logger公共类

```csharp
public class Logger
{
    static Logger()
    {
        XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CfgFiles\\log4net.xml")));
        ILog Log = LogManager.GetLogger(typeof(Logger));
        Log.Info("系统初始化Logger模块");
    }
    private ILog loger = null;
    public Logger(Type type)
    {
        loger = LogManager.GetLogger(type);
    }
    /// <summary>
    /// Log4日志
    /// </summary>
    /// <param name="msg"></param>
    /// <param name="ex"></param>
    public void Error(string msg = "出现异常", Exception ex = null)
    {
        Console.WriteLine(msg);
        loger.Error(msg, ex);
    }
    /// <summary>
    /// Log4日志
    /// </summary>
    /// <param name="msg"></param>
    public void Warn(string msg)
    {
        Console.WriteLine(msg);
        loger.Warn(msg);
    }
    /// <summary>
    /// Log4日志
    /// </summary>
    /// <param name="msg"></param>
    public void Info(string msg)
    {
        Console.WriteLine(msg);
        loger.Info(msg);
    }
    /// <summary>
    /// Log4日志
    /// </summary>
    /// <param name="msg"></param>
    public void Debug(string msg)
    {
        Console.WriteLine(msg);
        loger.Debug(msg);
    }
}
```

最后，在需要使用的地方创建Logger的实例

```csharp
private Logger logger=new Logger(typeof(DiapatcherManager));
```