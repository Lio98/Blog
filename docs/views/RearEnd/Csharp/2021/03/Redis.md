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

## Redis


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

### Redis 5种数据结构

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
