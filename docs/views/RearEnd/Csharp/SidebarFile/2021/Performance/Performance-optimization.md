---
title: '性能优化'
date: 2021-12-05
categories:
- "Csharp"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 什么是性能

性能一般指的是系统的性能，常见的系统有web系统和桌面系统。

从系统层面上，衡量系统性能，有两个指标：时间和数量

- 时间：系统执行一次客户端请求响应的时间；

- 数量：系统在单位时间内执行客户端请求的数量；

平均时间：系统在单位时间执行客户端请求数量完成的平均时间。

系统是靠接口执行客户端请求的。所以，一个系统的性能是由接口决定的，接口被执行时间和接口在单位时间内被执行多少次就是接口的性能，接口性能好坏决定了系统性能好坏。

## 系统性能好坏

系统性能好坏是由系统执行客户端请求时间和客户端数量决定的。

执行客户端时间越短，性能越好；

单位时间内执行客户端数量越多，性能越好；

总结：接口的执行时间和在单位时间内能够执行接口的数量，就是接口并发量，直接影响到系统的性能。

## 性能优化

性能优化：

1. 缩短系统接口处理客户端请求的时间；

2. 提升系统接口处理客户端请求的数量(提升吞吐量)。

性能优化的目的：利用有限资源更多的处理客户端请求。

## 性能定位

目的：定位出系统接口执行客户端请求时间。

技术工具：

1. Apache JMeter
 
2. ApacheBench (ab)
 
3. Gatling
 
4. k6
 
5. Locust
 
6. West Wind WebSurge
 
7. Netling
 
8. Vegeta
 
9. NBomber

## 性能排查

目的：通过分析接口执行过程，找到性能瓶颈

性能瓶颈：导致接口执行耗时的原因点。

工具：

VS自带性能探查器

步骤：

1. 先通过vs 选择“调试” > “性能探查器”;

2. 然后选择勾选CPU使用率;

3. 然后启动;

4. 在浏览器执行不同的接口，然后停止收集，就可以看到显示出接口方法被执行的时间;

5. 然后再进一步确认是哪个方法导致的性能瓶颈。

![CPU使用率](https://image.xjq.icu/2021/12/5/2021.12.5-cpuUseRate1.jpg)

![CPU使用率](https://image.xjq.icu/2021/12/5/2021.12.5-cpuUseRate2.jpg)

### 方法中CPU消耗过大原因

1. 方法体中出现了大量的循环代码

​     方案： 预热数据。空间和 换时间  hash表存储。

2. 方法中有文件操作

​       方案：操作文件，CPU空闲就可以了，异步IO。

​       方案：压缩手段。文件转换成为------base64编码

3. 方法中有网络操作

​     方案：DotNetty 异步 IO 多路复用机制。

​     方法：预热+压缩。预热：提前加载数据。

### 方法中CPU消耗过大后果

导致：接口整体的吞吐量降低

因为CPU执行一次导致性能消耗很大，如果执行多次，肯定是会导致性能下降。

所以：为了提升接口的吞吐量，必须减低CPU消耗。

### 内存泄漏导致接口执行时间过长

CPU使用率很低，但是系统就是响应很慢，原因可能是内存泄漏了。

原因：执行一个方法，导致内存增长过快，频繁触发GC(内存对象回收)

触发GC行为需要消耗CPU，如果内存过大，触发大量的GC回收，每次GC都要消耗CPU资源。

就会反过来影响到接口的执行时间和并发出来数量。

## 定位系统内存泄漏

### 生产环境

条件：

1. .NET Core 3.1 SDK 或更高版本。

2. dotnet-counters 检查托管内存的使用情况。

3. dotnet-dump 收集和分析转储文件。

步骤：

```bash
项目准备

1、创建内存溢出的项目

dotnet-counters准备

1、先安装dotnet-counters

     dotnet tool install --global dotnet-counters

2、然后找到进程编号

     dotnet-counters ps

3、然后监视进程

    dotnet-counters monitor --refresh-interval 1 -p  43332(进程编号)

4、最后查看显示统计信息

      找到 GC Heap Size 。然后统计这个程序的增长，为了找出内存泄露的代码

dotnet-dump准备 

1、先安装dotnet-counters

     dotnet tool install --global dotnet-dump

2、然后执行项目接口

     https://localhost:5001/api/diagscenario/memleak/20000

2、然后生成转储文件(内存文件)

     dotnet-dump collect -p 43332(进程编号)

3、然后分析转储文件

    dotnet-dump analyze core_20190430_185145（转储文件名）

    3.1 开始分析

           dumpheap -stat

           找到内存比较大的类型，通过查看内存占用大小和对象数量

    3.2 然后分析类型具体对象

         dumpheap -mt 00007faddaa50f90 为类型编号

    3.3 然后找出的应用根(目的是找出在哪里被应用了)

         gcroot -all 00007f6ad09421f8 对象编号
```

部分结果图如下：

![](https://image.xjq.icu/2021/12/5/2021.12.5-dotnet-counters.jpg)
![](https://image.xjq.icu/2021/12/5/2021.12.5-dump.jpg)
![](https://image.xjq.icu/2021/12/5/2021.12.5-dump-analyze.jpg)
![](https://image.xjq.icu/2021/12/5/2021.12.5-dump-analyze2.jpg)