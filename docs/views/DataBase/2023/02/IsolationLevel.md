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

### 锁机制

锁是处理SQL Server中并发问题的最有效手段，当多个事务访问同一资源时，能很好的保证数据完整性和一致性；
在很多数据库系统中(DB2、MySql、Oracle、SQL Server)都有锁机制，其规则也是大同小异；
在SQL Server中采用系统来管理锁，SQL Server中采用的是动态加锁的机制；
SQL Server中有一套默认的锁机制，若用户在使用数据库的过程中不设置任何锁，系统将自动对管理；

### 锁模式

在SQL Server中有不同的锁，在各种锁的类型中有些是能相互兼容的，锁的类型决定了并发发生时数据资源的范文模式，在SQL Server中常用的锁有以下5种：

1、**共享锁(S锁)**：共享锁允许多个事务同时访问同一资源，但不允许其他事务修改当前事务所使的数据，一旦已经读取数据，便立即释放资源上的共享锁，除非将事务隔离级别设置为可重复读或跟高级别，或者在事务生存周期内用锁定提示保留共享锁<b style="color:red">多个共享锁之间可以共存，共享锁和更新锁之间可以共存，但只允许有一个更新锁，享锁不能和排他锁共存</b>。

2、**更新锁(U锁)**：一般使用于可更新数据，能防止并发访问中的脏读情况以及在数据更新时可能出现的  情况，更新锁一般会在数据进行查询更新时使用；若事务修改资源，更新锁会转为排他锁否则会转换为共  享锁；**在SQL Server中，当一个事务访问资源时获得更新锁，其他事务能够对源进行访问，但不允许排他式访问**；

3、**排他锁(X锁)**：在事务对资源进行数据更改操作(如INSERT UPDATE DELETE)时使用，排他锁能保证同一数据不会被多个事务同时进行更改操作；

4、**意向锁**：用于建立锁的层次结构。意向锁的类型为：意向共享 (IS)、意向排它 (IX) 以及与意向排它共享 (SIX)；

5：**架构锁**：数据库引擎在表数据定义(DDL)操作(如添加列或删除表)的过程中使用架构修改锁，保持该锁期间，架构锁将阻止对表进行并发访问；即架构锁在释放前将阻止所有外围操作。

### 锁的粒度

SQL Server数据库引擎具有多粒度锁定，允许一个事务锁定不同类型的资源；
为了减少锁定的开销，数据库引擎自动将资源锁定在适合任务的级别，锁定在较小的粒度(如行)能提高并发度，但开销较高，因为锁定了许多行，就需要持有更多的锁；
锁定在加大的粒度(如表)会降低并发，因为锁定整个表限制了其他事务对表中任意部分的访问，但其开销较低，因为需要维护的锁较少；

锁的粒度
|资源|说明|
|---|----|
|RID|用于锁定堆中的单个行的行标识符|
|KEY|索引中用于保护可序列化事务中的键范围的行锁|
|PAGE|数据库中的8KB页，如数据页或索引页|
|EXTENT|一组连续的八页，如数据页或索引页|
|HoBT|堆或B树，用户保护没有聚集索引的表中的B树(索引)或堆数据页的锁|
|TABLE|包括所有数据和索引的整个表|
|FILE|数据库文件|
|APPLICATION|应用程序专用的资源|
|METADATA|元数据锁|
|ALLOCATION_UNIT|分配单元|
|DATABASE|整个数据库|

数据库引擎通常必须获取多粒度级别上才能完整地保护资源，多粒度级别上的锁成为层次结构。

### 查看锁

在SQL Server数据库中，能通过查看sys.dm_tran_locks返回数据库中有关当前活动的锁的管理信息；
向锁管理器发出的已授予锁或正等待授予锁的每个当前活动请求分别对应一行；结果集中的列大体分为两组，资源组和请求组

### 死锁

在两个或多个任务中，若每一个任务都锁定了其他的资源，就会造成永久的阻塞，这种情况就是死锁

形成死锁有以下4个必要条件：

 - 互斥条件：资源不能被共享，只能被一个进程使用

 - 请求与保持条件：已获得资源的进程能同时申请其他资源

 - 非剥夺条件：已分配的资源不能从该进程中被剥夺

 - 循环等待条件：多个进程构成环路，且每个进程都在等待相邻进程正在使用的资源

在一个复杂的数据库系统中很难百分百避免死锁，但能按照以下的访问策略减少死锁的发生：

 - 所有事务中以相同的次序使用资源，避免出现循环

 - 减少事务持有资源的时间，避免事务中的用户交互

 - 让事务保持在一个批处理中

 - 由于锁的隔离级别越高共享锁的时间就越长，因此能降低隔离级别来达到减少竞争的目的

 - 使用绑定连接。