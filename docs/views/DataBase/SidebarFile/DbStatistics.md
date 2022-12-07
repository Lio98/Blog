---
title: 'SqlServer数据库统计信息'
date: 2022-11-28
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: false
isShowComments: true
isShowIndex: true
---

## SqlServer数据库统计信息的操作

```sql
SqlServer数据库统计信息的操作
一、创建/开启统计信息
统计信息会在每个新创建的索引中自动创建统计信息。
如果数据库中AUTO_CREATE_STATISTICS被设置为ON，SQLServer将会自动对查询中用到的，且没有索引的列自动创建统计信息。
--查看数据库统计信息配置情况
SELECT  name,is_auto_update_stats_async_on,  
        is_auto_create_stats_on,  
        is_auto_update_stats_on 
FROM    sys.databases  
WHERE   name = 'Baike'; --指定数据库名
--启用自动统计信息创建功能（这个选项默认为ON）
ALTER  DATABASE[你的库名]
SET AUTO_CREATE_STATISTICS ON
--开启自动更新统计信息：（这个选项默认为ON）
ALTER  DATABASE[你的库名]
SET AUTO_UPDATE_STATISTICS ON
--开启异步更新统计信息：（这个选项默认为OFF）
ALTER  DATABASE[你的库名]
SET AUTO_UPDATE_STATISTICS_ASYNC ON
如果开启了这个选项，查询优化器将先执行一次查询，然后更新过期的统计信息。
当你把这个选项设为OFF时，查询优化器将在编译查询之前更新过期统计信息。
这个选项在OLTP环境下很有用，但在数据仓库中有负面影响。
--手动创建统计信息:
CREATE STATISTICS 统计名称 ON 表名 (列名 [,...n])
示例：
CREATE STATISTICS [filter_statistics]
ON [dbo].[SalesOrderDetail] (OrderQty,ProductID)
WHERE SpecialOfferID = 1;--加上这段就成了过滤统计信息了。

二、查询统计信息
----查看某个统计信息 ：
DBCC SHOW_STATISTICS('表名','索引名')
DBCC SHOW_STATISTICS('[dbo].[SalesOrderDetail]','_WA_user_00000001_00000001')  
--通过系统视图sys.stats查看统计信息：
SELECT  object_id ,  
        OBJECT_NAME(object_id) AS TableName ,  
        name AS StatisticsName ,  
        auto_created  
FROM    sys.stats
where object_id=OBJECT_ID('dbo.SalesOrderHeader')  --表名
where objectproperty(object_id,'IsUserTable')=1
ORDER BY object_id DESC;
--查看索引的统计信息更新时间  
SELECT name AS index_name,STATS_DATE(object_id, index_id) AS update_date  
FROM sys.indexes 
WHERE object_id = OBJECT_ID('[dbo].[SalesOrderDetail]');  
--查看所有统计信息更新时间  
select s.name,STATS_DATE(s.object_id, stats_id) AS update_date  
from sys.stats s   
WHERE s.object_id = OBJECT_ID('[dbo].[SalesOrderDetail]'); 
--查看所有统计信息更新时间  
sp_helpstats 'dbo.SalesOrderHeader';
exec sp_helpstats N'[dbo].[SalesOrderDetail]', 'ALL'

三、更新统计信息
需要用到sys.sysindexes
系统表sysindexes的列rowmodctr，它记录自上次更新统计信息后插入、删除、更新行的累计总次数
SELECT name,rows,rowmodctr FROM sys.sysindexes
自动更新统计规则：
•表中行范围rows=0行增长rows>0行；
•表中行范围 0<rows<=500行，只要变化的次数rowmodctr>500；
•表中行范围rows>500行，只要变化的次数rowmodctr>500+20%rows；
•临时表行数rows<6，只要变化的次数rowmodctr>6；
--手动更新指定表名的统计信息：
UPDATE STATISTICS 表名[索引名]
UPDATE STATISTICS [dbo].[SalesOrderDetail] [_WA_user_00000001_00000001] WITH FULLSCAN  
UPDATE STATISTICS  dbo.SalesOrderDetail
--更新数据库中所有可用的统计信息  
EXEC sys.sp_updatestats;
--手动更新SQL Server实例中所有数据库表的统计信息 
DECLARE @sql nvarchar(300)
DECLARE UpdateStatsForAllDBs CURSOR
READ_ONLY
FOR select name from sysdatabases
DECLARE @name nvarchar(255)
OPEN UpdateStatsForAllDBs
FETCH NEXT FROM UpdateStatsForAllDBs INTO @name
WHILE (@@fetch_status <> -1)
BEGIN
    IF (@@fetch_status <> -2)
    BEGIN
        SET @sql = N'EXEC ' + QUOTENAME(@name) + N'.sys.sp_updatestats'
        EXEC sp_executesql @sql
    END
    FETCH NEXT FROM UpdateStatsForAllDBs INTO @name
END
CLOSE UpdateStatsForAllDBs
DEALLOCATE UpdateStatsForAllDBs
GO

四、关闭/删除统计信息
--手动删除统计信息  
DROP STATISTICS table.statistics_name | view.statistics_name [ ,...n ]
    --参数
    --table | view
    --其删除统计信息的目标表或索引视图的名称。 表和视图的名称必须符合数据库标识符规则。 可以选择是否指定表或视图所有者名称。
    --statistics_name
    --要删除的统计信息组的名称。 统计信息名称必须符合有关标识符的规则。
来源：https://learn.microsoft.com/zh-cn/sql/t-sql/statements/drop-statistics-transact-sql?source=recommendations&view=sql-server-ver16

DROP STATISTICS dbo.SalesOrderHeader.st_DueDate_SalesOrderHeader;
DROP STATISTICS [dbo].[SalesOrderDetail].[_WA_user_00000001_00000001];
--关闭SQLServer自动更新统计信息:
1、使用sp_autostats来在表、索引或者统计对象上显式并更改自动更新统计信息选项。
2、在表级别中，可以使用NORECOMPUTEoption of the UPDATE STATISTICS命令。
3、你也可以在CREATESTATISTICS命令中使用NORECOMPUTE选项，但之后需要删除并重建统计信息。
4、在CREATE INDEX命令中使用STATISTICS_NORECOMPUTE。
5、在数据库级别，可以使用以下命令来禁用：
ALTER DATABASE[你的库名]
SET AUTO_UPDATE_STATISTICS OFF
当使用数据库级别的禁用时，表、索引或者统计对象的设置将全部失效。

五、统计信息的应用
--快速查询指定表名的总记录数
SELECT rows FROM sysindexes WHERE id= OBJECT_ID('rpt2014' ) AND indid< 2
--快速统计所有表中的记录总数
SELECT object_name(i.id) TableName,  
       rows as RowCnt
FROM sysindexes i   
INNER JOIN sysObjects o   
    ON (o.id = i.id AND o.xType = 'U ')   
WHERE indid < 2   
ORDER BY TableName 
--利用sys.indexes表也可以查看所有表的记录总数
SELECT o.name,
 ddps.row_count 
FROM sys.indexes AS i 
 INNER JOIN sys.objects AS o ON i.OBJECT_ID = o.OBJECT_ID
 INNER JOIN sys.dm_db_partition_stats AS ddps ON i.OBJECT_ID = ddps.OBJECT_ID
 AND i.index_id = ddps.index_id 
WHERE i.index_id < 2 
 AND o.is_ms_shipped = 0 
ORDER BY o.NAME
```