---
title: 'Quartz定时调度'
date: 2021-04-25
categories:
- "Csharp"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## Quzrtz

三大核心对象：

- Ischeduler：单元/实例，在这里去完成定时任务的配置，只有单元启动，里面的作业才能正常运行

- IJob：任务，定时执行的动作就是Job

- ITrigger：定时策略

传参问题

- jobDetail.JobDataMap.Add("studentName1","xmn1");

- trigger.JobDataMap.Add("studentName4", "xmn4");

- 使用MergedJobDataMap若key相同则会被覆盖

```csharp
public class DiapatcherManager
{
    public static async Task Init()
    {
        #region 自定义的框架日志
        LogProvider.SetCurrentLogProvider(new CustonConsoleLogProvider());
        #endregion
        #region scheduler
        Console.WriteLine("初始化scheduler......");
        //StdSchedulerFactory factory = new StdSchedulerFactory();
        //IScheduler scheduler = await factory.GetScheduler();
        IScheduler scheduler =await ScheduleManager.BuildScheduler();
        scheduler.ListenerManager.AddSchedulerListener(new CustomSchedulerListener());
        scheduler.ListenerManager.AddTriggerListener(new CustomTriggerListener());
        scheduler.ListenerManager.AddJobListener(new CustomJobListener());
        await scheduler.Start();
        #endregion
        {
            //IJob  ITrigger
            IJobDetail jobDetail = JobBuilder.Create<TestJob>().WithIdentity("testJob", "group1")
                .WithDescription("This is TestJob").Build();
            jobDetail.JobDataMap.Add("studentName1", "xmn1");
            jobDetail.JobDataMap.Add("studentName2", "xmn2");
            jobDetail.JobDataMap.Add("studentName3", "xmn3");
            jobDetail.JobDataMap.Add("Year", 2021);
            //创建时间策略
            ITrigger trigger = TriggerBuilder.Create().WithIdentity("testtrigger", "group1").StartAt(new DateTimeOffset(DateTime.Now.AddSeconds(10)))
                .WithCronSchedule("0/10 * * * * ?")  //每隔一分钟
                .WithDescription(" This is testJob Trigger")
                .Build();
            //ITrigger trigger = TriggerBuilder.Create().WithIdentity("testtrigger1", "group1")
            //    .StartAt(new DateTimeOffset(DateTime.Now.AddSeconds(5)))
            //    .WithSimpleSchedule(x => x.WithIntervalInSeconds(20)
            //        .WithRepeatCount(10)
            //        .RepeatForever())
            //    .WithDescription("This is testjob's Trigger").Build();
            trigger.JobDataMap.Add("studentName4", "xmn4");
            trigger.JobDataMap.Add("studentName5", "xmn5");
            trigger.JobDataMap.Add("studentName6", "xmn6");
            trigger.JobDataMap.Add("Year", DateTime.Now.Year + 1);
            await scheduler.ScheduleJob(jobDetail, trigger);
            Console.WriteLine("scheduler任务添加完成.....");
        }
        {
            IJobDetail jobDetail = JobBuilder.Create<GoodJob>().WithIdentity("GoodJob", "Group2")
                .WithDescription("THIS IS GOODJOB").Build();
            ITrigger trigger = TriggerBuilder.Create().WithIdentity("trigger", "Group2")
                .StartAt(new DateTimeOffset(DateTime.Now.AddSeconds(5))).WithCronSchedule("3/20 * * * * ?")
                .WithDescription("This is goodjob Trigger").Build();
            await scheduler.ScheduleJob(jobDetail, trigger);
            Console.WriteLine("scheduler作业添加完成。。。");
        }
    }
}
```

```csharp
public class ScheduleManager
{
    public async static Task<IScheduler> BuildScheduler()
    {
        var properties = new NameValueCollection();
        properties["quartz.scheduler.instanceName"] = "个人监控系统";
        // 设置线程池
        properties["quartz.threadPool.type"] = "Quartz.Simpl.SimpleThreadPool, Quartz";
        properties["quartz.threadPool.threadCount"] = "5";
        properties["quartz.threadPool.threadPriority"] = "Normal";
        // 远程输出配置
        properties["quartz.scheduler.exporter.type"] = "Quartz.Simpl.RemotingSchedulerExporter, Quartz";
        properties["quartz.scheduler.exporter.port"] = "10089";
        properties["quartz.scheduler.exporter.bindName"] = "QuartzScheduler";
        properties["quartz.scheduler.exporter.channelType"] = "tcp";
        var schedulerFactory = new StdSchedulerFactory(properties);
        IScheduler _scheduler = await schedulerFactory.GetScheduler();
        return _scheduler;
    }
}
```

使用配置文件配置定时服务,创建为quartz_jobs.xml的配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<job-scheduling-data xmlns="http://quartznet.sourceforge.net/JobSchedulingData" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="2.0">

  <processing-directives>
    <overwrite-existing-data>true</overwrite-existing-data>
  </processing-directives>
  <schedule>
    <job>
      <name>GoodJob</name>
      <group>Test</group>
      <description>This is GoodJob</description>
      <job-type>DispatcherProject.QuartzNet.CustomJob.GoodJob,DispatcherProject.QuartzNet</job-type>
      <durable>true</durable>
      <recover>false</recover>
    </job>
    <trigger>
      <cron>
        <name>GoodJobTrigger1</name>
        <group>Test</group>
        <job-name>GoodJob</job-name>
        <job-group>Test</job-group>
        <cron-expression>5/10 * * * * ?</cron-expression>
      </cron>
    </trigger>


    <!--<job>
      <name>UpdateInventoryJob</name>
      <group>Update</group>
      <description>定时更新商品库存</description>
      <job-type>TopshelfAndQuartz.UpdateInventoryJob,TopshelfAndQuartz</job-type>
      <durable>true</durable>
      <recover>false</recover>
    </job>
    <trigger>
      <cron>
        <name>UpdateInventoryTrigger</name>
        <group>Update</group>
        <job-name>UpdateInventoryJob</job-name>
        <job-group>Update</job-group>
        <cron-expression>0 0/1 * * * ?</cron-expression>
      </cron>
    </trigger>-->
  </schedule>
</job-scheduling-data>
```

在初始化创建IScheduler的时候使用配置文件

```csharp
public class DiapatcherManager
{
    private static Logger logger=new Logger(typeof(DiapatcherManager));
    
    public static async Task Init()
    {
        #region scheduler
        Console.WriteLine("初始化scheduler......");
        logger.Info("初始化scheduler......");
        //StdSchedulerFactory factory = new StdSchedulerFactory();
        //IScheduler scheduler = await factory.GetScheduler();
        IScheduler scheduler = await ScheduleManager.BuildScheduler();
        {
            //使用配置文件
            XMLSchedulingDataProcessor processor = new XMLSchedulingDataProcessor(new SimpleTypeLoadHelper());
            await processor.ProcessFileAndScheduleJobs("~/CfgFiles/quartz_jobs.xml", scheduler);
        }
        await scheduler.Start();
        #endregion
            Console.WriteLine("scheduler作业添加完成......");
            logger.Info("scheduler作业添加完成......");
    }
}
```