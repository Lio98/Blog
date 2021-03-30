---
title: '数据库优化'
date: 2021-03-03
categories:
- "数据库"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

## 索引

索引不能运算，不能like '% %',索引条件放在前面

### 聚集索引(聚簇索引)

把数据有序的摆放

sqlServer自增主键int型，默认自动创建聚集索引，所以默认按照主键排序，一张表聚集索引只有一个，但是该索引可以有多个列

换聚集索引，很耗时，很多硬盘操作，生产环境要注意

一般聚集索引是自增主键/创建时间

### 非聚集索引

不影响数据的物理排序，但是会重复存储一个数据和位置

找数据：先找索引--快速定位--拿到数据

查找快，但是有维护索引的成本

非聚集索引，可以多个，每个索引也可以多个字段

适合经常查询的字段

### 建立索引的原则

 - 主键是必须建立索引的(推荐数值主键，性能最高)

 - 外键列也需要索引

 - 经常查询的建立索引

 - 经常在where里面的建立索引

 - Order by / Group By / distinct

 - 聚合运算/where条件时，优先索引字段

**不建立索引**

 - 重复值比较多的不要建索引(sex/state)

 - text/image 不要索引

 - 索引不要太多

## 执行计划 

执行计划就是提交sql语句，数据库查询优化器，经过分析生成

数据库制定执行计划是按照使用资源最少，而不是时间最短

 - Table Scan：全表扫描  性能最差

 - Clustered Scan 有聚集索引，其实也是全表扫描  性能最差，同上

 - Index Seek（NonClustered）：使用非聚集索引，性能非常高

 - Index Scan：先index，在扫描

 - Cluster Index Seek：性能最高


**Sql Service Profiler可以查看sql执行情况**

### 常规的sql优化建议：

- 对列的计算要避免，进行计算会对索引失效

- in 查询  or查询，索引会失效

- in 换exists

- 不要用not in，完全不走索引

- is null 和 is not null都不走索引，索引不会为空

- join时，链接越少性能越高，连接字段要求带索引


### 分词存储和查询