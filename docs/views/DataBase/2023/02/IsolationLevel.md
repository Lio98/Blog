---
title: '数据库隔离级别和锁'
date: 2023-02-20
categories:
- "DataBase"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 何为脏读，幻读，不可重复读

### 脏读

脏读也称为“读未提交”，顾名思义，就是某一事务A读取到了事务B未提交的数据。

|时间| 会话1|会话2|
|---|------|-----|
||开始事务A|开始事务B|
| T1 |SELECT AGE FROM TABLE WHERE NAME='LT'<br> <font colOr=#FF0000>查询结果：【24】</font>| |
|T2| | UPDATE TABLE SET AGE=25 WHERE NAME='LT'|
|T3|SELECT AGE FROM TABLE WHERE NAME='LT' <br><font colOr=#FF0000>查询结果：【25】</font> ||
|T4|COMMIT|ROLLBACK |

T2时刻，事务B把原来LT的年龄由原数据24改为了25，此后又被T3时刻的事务A读取到了，但是T4时刻事务B发生异常，进行了回滚操作。这个过程，我们称25为脏数据，事务A进行了一次脏读。

### 不可重复读

不可重复读也称为“读已提交”，就是在一个事务里，多次读取同一个数据，却返回了不同的结果。实际上，这是因为在该事务A几次读取数据的期间，有其他事务B对这段数据进行了修改，并且已提交事务，就会发生不可重复读的问题。

|时间| 会话1|会话2|
|---|------|-----|
||开始事务A|开始事务B|
| T1 |SELECT AGE FROM TABLE WHERE NAME='LT'<br> <font colOr=#FF0000>查询结果：【24】</font>| |
|T2| | UPDATE TABLE SET AGE=25 WHERE NAME='LT'|
|T3| |COMMIT|
|T4|SELECT AGE FROM TABLE WHERE NAME='LT' <br><font colOr=#FF0000>查询结果：【25】</font>| |
|T5|COMMIT| |

图示中事务A在T1和T4查询同一语句，却得到了不同的结果，这是因为T2~T3时刻事务B对该数据进行了修改，并提交。这个过程，出现了在一个事务内两次读到的数据却是不一样的，我们称为是不可重复读。

不可重复读和脏读的区别：前者是“读已提交”，后者是“读未提交”

### 幻读

幻读是指当前事务不独立执行时，插入或删除另一个事务当前影响的数据而发生的一种类似幻觉的现象。
出现幻读和不可重复读的原因很像，都是在多次操作数据的时候发现结果和原来的不一致，出现了其他事务干扰的现象。但是，幻读的偏重点是添加或删除数据，多次操作数据得到的记录数不一样；不可重复读的偏重点是修改数据，多次读取数据发现数据的值不一样了

|时间| 会话1|会话2|
|---|------|-----|
||开始事务A|开始事务B|
| T1 |SELECT COUNT(*) FROM TABLE<br> <font colOr=#FF0000>查询结果：【14】</font>| |
|T2| | INSERT INTO TABLE (NAME,AGE) VALUES('LT',24)|
|T3| |COMMIT|
|T4|SELECT COUNT(*) FROM TABLE <br><font colOr=#FF0000>查询结果：【15】</font>| |
|T5|COMMIT| |

## 隔离级别

1、读未提交(Read Uncommitted)：在该隔离级别，所有事务都可以看到其他未提交事务的执行结果。本隔离级别很少用于实际应用，适用于单用户系统。读取未提交的数据，也被称之为脏读(Dirty Read)。

2、读已提交(Read committed)：Sql Server和Oracle数据库的默认隔离级别。它满足了隔离的简单定义：一个事务只能看见已经提交事务所做出的改变。这种隔离级别有所谓的不可重复读问题，一个事务期间可能有其他修改的事务提交，所以同意select可能返回不同结果。

3、可重复读(Repeatable Read)：Mysql的默认事务隔离级别，同一事物的多个实例在并发读取数据时，会看到同样的数据。不过理论上，这会导致另一个问题：幻读(Phantom Read)。

4、快照(SNAPSHOT ISOLATION)：事务访问的时虚拟快照，其他事务Commit的数据对当前事务仍然不可见，也不允许update被其他事务update的数据。

5、可串行化(Serializable)：它通过强制事务排序，是指不可能相互冲突，从而解决脏读，幻读，不可重复读的问题。简言之，它时在每个读的数据行上加上共享锁。在这个级别，可能导致大量的超时现象和锁竞争。

## SqlServer锁