---
title: '数据库设计'
date: 2021-03-01
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: false
isShowComments: true
isShowIndex: true
---

## 建表

### 面向对象的思想来建表

 - 一对一：人----身份证 -\> 垂直分表；相同主键/外键
 
 - 一对多：省----市 -\>  主外键
 
 - 多对多：老师----学生 -\> 关系表/中间表/映射表 

### 三大范式

 - 每一列保持原子性，不可分割

 - 每一列都跟主键相关，一张表只应该描述一个对象

 - 每一列都得跟主键直接相关，而不是间接相关

## 数据库事务

 - 多条sql语句作为一个整体提交给数据库系统，要么全部执行完成，要么全部取消。是一个不可分割的逻辑单元

 - begin tran -- rollback/commit

 - ACID

   1. 原子性：要么都成功，要么都失败

   2. 一致性：事务执行完成，数据都是正确的

   3. 隔离性：两个事务同时操作一张表，B事务要么是在A事务前完成，要么在A事务完成会执行(锁表)

   4. 持久性：数据提交后，就固化下来

### 锁

 多个用户同时访问一个数据资源

 出现状况：
 
 1. 修改丢失

 2. 不可重复读

 3. 脏读/幻读

 锁保证访问同一资源时，有个先后顺序管理，处理并发问题

 - 乐观锁 -- 认为没有并发，读取数据 -- 更新 -- 保存 （没有锁），更新的时候做一个判断 -- 时间戳/更新字段；数据库增加一列TimeSpan，long；每次查询拿出来；更新时+1；保存时判断此值是否大于数据库当前值

 - 悲观锁 -- 认为任意时候都可能多事务并发，读数据别人恰好在改，基于数据库锁的机制来完成

   1. 共享锁（S锁）-- 读锁，允许别的事务来读数据，但是不能修改数据；读完就释放，锁定数据页，（除非加holdlock就一直锁定）

   2. 排他锁（X锁）-- 写锁，准备写数据，不允许读也不允许写

   3. 更新锁（U锁）-- 先查询，再更新

   4. 行锁 where id=3

   5. 表锁 where 1=1

 - 如何避免死锁（高并发情况下死锁是不可能避免的，只能减少）

   1. 不用锁就不会死锁，乐观锁

   2. 统一操作顺序

   3. 最小单元锁，锁里面的操作尽量减少

   4. 避免事务中等待用户输入

   5. 减少数据库并发

   6. 分库分表表分区

   7. 降低事务级别

   8. 设置死锁时间

### 数据库函数

 不推荐使用自定义函数，因为计算交给数据库，没法使用索引

## 数据库负载均衡

利用多态服务器的读写能力，但是数据同步和访问分配交给第三方的软件

读的压力分摊到不同的服务器，写其实是多态服务器都得完成，对外只有一个IP，使用者是不知道细节的

## 读写分离

读写分离基于二八原则，80%的操作时读，20%的操作是写

实现原理：就是把读和写的压力分开，降低IO压力，一主多从，主库写从库读

数据同步，从主库到从库，同步方式：

- 数据库里连接别的数据库，link到主库 + 定时job

- 日志传送: 备份--复制--恢复，简单但是有局限性（局域网，只能共享文件夹）

- 镜像

- 数据复制(发布订阅)

  - 发布订阅后，从数据库是可以水平扩展的

### 分库分表表分区

- 分库

  - 垂直分库：按业务拆分库

  - 水平分库：每个库结构一致数据不一致（地域/时间/业务类别/随机算法区分）

- 分表

  - 垂直分表：按字段区分，减小表的体积，提升增删改查的效率

  - 水平分表：（地域/时间/随机算法区分）

- 分完之后，数据查询：

   - 特殊情况，查询所有 -\> 同步一个汇总库(表)，专门满足需求

   - 跨库跨表join--不推荐

- 表分区
 
  -也就是水平分表的意思