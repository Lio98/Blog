---
title: 'Redis'
date: 2021-03-21
categories:
- "Csharp"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## Redis下载安装

### 下载(Windows版)

- github下载地址：https://github.com/MicrosoftArchive/redis/releases
### 安装

- 打开一个命令窗口，进入到解压的目录

- 输入命令：redis-server redis.windows.conf ，启动 Redis，成功后会告诉你端口号为6379 (此步骤为零时服务)

- 部署 redis 为 windows 下的服务，关掉上一个窗口（否则会启动不了服务），再打开一个新的命令窗口，输入命令：redis-server --service-install redis.windows.conf 默认端口6379，如需更改，请在 redis.windows.conf 查找。

- 安装后的启动服务命令：redis-server --service-start

   - 常用的服务命令

      1、卸载服务：redis-server --service-uninstall

      2、开启服务：redis-server --service-start

      3、停止服务：redis-server --service-stop

- 测试Redis，通过 cd 命令进入到你解压的目录，敲击命令redis-cli，通过set，get 命令查看查看是否成功。

**安装Redis到服务器外网访问**

- 修改redis.conf,主要是两个地方

   - 注释绑定的主机地址 #bind 127.0.0.1 ，或修改为 bind 0.0.0.0 原理都一样。原状态只允许本地访问

   - 修改redis的保护模式为no；protected-mode no

### Redis可视化工具 Redis Desktop Manager

- 下载 Redis Desktop Manager

   1、下载地址：https://redisdesktop.com/download

### NoSql

NoSql：非关系型数据库

特点：基于内存，没有严格的数据格式，不是一行数据的列必须一样，具有丰富的类型

Redis：Remote Dictionary Server ---- 远程字典服务器

- 基于内存管理（数据存在内存），速度快，实现了5种数据结构（分别应对各种具体需求），单线程模型的应用程序，单进程单线程，对外提供插入、查询、固化、集群功能

- 支持多个命令

- 不能当作数据库，Redis固化数据的功能，会把数据保存在硬盘上，Snapshot可以保存到硬盘，Down掉会丢失数据

- AOF：数据变化记录数据（很少用）

- Redis不是数据库，只能用来提升性能，不能作为数据的最终依据

- Redis的操作都是原子性的，不用考虑并发的问题

## Redis数据结构

- String：Key - Value结构的缓存，Value不超过512M

   - 利用String类型可以用来做防止超卖

- Hash：Key - Lis\<keyvaluepair\>结构，有HashId，Key，Value三部分，节约空间（zipmap的紧密排放的存储模式）、更新/访问方便，字段是可以随意定制的，没有严格约束的，非常灵活

- Set：key-List\<value\> 就是一个数据集合，无序，去重

   - 利用set可以做投票限制/IP统计去重...

- ZSet：是一个有序集合，去重

- List：key-Linklist\<value\>

   - List可以用来做队列

   - 生产消费模式：一个数据源只能由一个接收者

   - 订阅发布模式：一个数据源，多个接受者

## Redis分布式锁

```csharp
public class RedisLock
{
    // 1、redis连接管理类
    private ConnectionMultiplexer connectionMultiplexer = null;

    // 2、redis数据操作类
    private IDatabase database = null;
    public RedisLock()
    {
        connectionMultiplexer = ConnectionMultiplexer.Connect("192.168.44.4:6379");

        database = connectionMultiplexer.GetDatabase(0);
    }

    /// <summary>
    /// 加锁
    /// 1、key:锁名称
    /// 2、value:谁加的这把锁。线程1
    /// 3、exprie：过期时间：目的是为了防止死锁
    /// </summary>
    public void Lock()
    {
        while (true)
        {
            bool flag = database.LockTake("redis-lock", Thread.CurrentThread.ManagedThreadId, TimeSpan.FromSeconds(60));
            // 1、true 加锁成功 2、false 加锁失败
            if (flag)
            {
                break;
            }
            // 防止死循环。通过等待时间，释放资源
            Thread.Sleep(10);
        }
    }

    /// <summary>
    /// 解锁
    /// </summary>
    public void UnLock()
    {
        bool flag = database.LockRelease("redis-lock", Thread.CurrentThread.ManagedThreadId);

        // true:释放成功  false 释放失败
        // 方案：释放资源
        connectionMultiplexer.Close();
    }
}
```

## Redis-cluster集群

redis-cluster架构说明

- 6个redis实例。redis-cluster运行需要的角色实例

- redis-trib.rb。分配redis主从角色

### 部署

总体需要用到的文件结构
![](https://image.xjq.icu/2022/5/4/1651675852702_redis.jpg)

- 在redis文件夹中创建6个配置文件，添加如下内容

   ```conf
   port 6380
   bind 127.0.0.1        
   appendonly yes
   appendfilename "appendonly.6380.aof"   
   cluster-enabled yes                                    
   cluster-config-file nodes.6380.conf
   cluster-node-timeout 15000
   cluster-slave-validity-factor 10
   cluster-migration-barrier 1
   cluster-require-full-coverage yes
   ```
![](https://image.xjq.icu/2022/5/4/1651675215343_redis-conf.jpg)

- 启动6个redis实例：逐一如下命令，需要修改配置文件名

   ```bash
   redis-server.exe redis.6380.conf
   ```

- redis-cluster 主从角色分配

   1. ruby 安装。[下载地址](https://rubyinstaller.org/downloads/)，下载exe文件后进行安装。

   2. redis-3.2.2.gem 下载。[下载地址](https://rubygems.org/gems/redis)，下载后进入ruby的安装目录bin文件夹下，通过gem命令文件安装

      ```bash
      gem install –local D:\Codes\Csharp\Net_Architecture\LT.Business\Redis-cluster\redis-4.6.0.gem
      ```
      ![](https://image.xjq.icu/2022/5/4/1651675329098_gem.jpg)

   3. redis-trib.rb 下载。[下载地址](https://github.com/beebol/redis-trib.rb)，进入到redis-trib.rb目录下，通过cmd使用redis-trib.rb

   4. redis-trib.rb 搭建redis集群主从

      ![](https://image.xjq.icu/2022/5/4/1651675573461_redis-trib-options.jpg)

      ```bash
      ruby redis-trib.rb create --replicas 1 127.0.0.1:6380 127.0.0.1:6381 127.0.0.1:6382 127.0.0.1:6383 127.0.0.1:6384 127.0.0.1:6385
      ```
      ![](https://image.xjq.icu/2022/5/4/1651675497871_redis-trib.jpg)

   5. redis-cluster 集群状态检查

      ```bash
      ruby redis-trib.rb check 127.0.0.1:6380
      ```
      ![](https://image.xjq.icu/2022/5/4/1651675419991_redis-trib-check.jpg)




