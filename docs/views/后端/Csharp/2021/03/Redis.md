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
