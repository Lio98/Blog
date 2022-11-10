---
title: 'SqlServer查询历史死锁/阻塞记录'
date: 2022-07-06
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: false
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

::: tip
最近工作遇到要查数据库历史死锁的sql语句，苦于之前没用过，不懂如何去查，翻阅网上终于找到相关语句
:::

## 死锁

```sql
DECLARE @SessionName SysName 
 
SELECT @SessionName = 'system_health'
 
 
IF OBJECT_ID('tempdb..#Events') IS NOT NULL BEGIN
    DROP TABLE #Events
END
 
DECLARE @Target_File NVarChar(1000)
    , @Target_Dir NVarChar(1000)
    , @Target_File_WildCard NVarChar(1000)
 
SELECT @Target_File = CAST(t.target_data as XML).value('EventFileTarget[1]/File[1]/@name', 'NVARCHAR(256)')
FROM sys.dm_xe_session_targets t
    INNER JOIN sys.dm_xe_sessions s ON s.address = t.event_session_address
WHERE s.name = @SessionName
    AND t.target_name = 'event_file'
 
SELECT @Target_Dir = LEFT(@Target_File, Len(@Target_File) - CHARINDEX('\', REVERSE(@Target_File))) 
 
SELECT @Target_File_WildCard = @Target_Dir + '\'  + @SessionName + '_*.xel'
 
--Keep this as a separate table because it's called twice in the next query.  You don't want this running twice.
SELECT DeadlockGraph = CAST(event_data AS XML)
    , DeadlockID = Row_Number() OVER(ORDER BY file_name, file_offset)
INTO #Events
FROM sys.fn_xe_file_target_read_file(@Target_File_WildCard, null, null, null) AS F
WHERE event_data like '<event name="xml_deadlock_report%'
 
;WITH Victims AS
(
    SELECT VictimID = Deadlock.Victims.value('@id', 'varchar(50)')
        , e.DeadlockID 
    FROM #Events e
        CROSS APPLY e.DeadlockGraph.nodes('/event/data/value/deadlock/victim-list/victimProcess') as Deadlock(Victims)
)
, DeadlockObjects AS
(
    SELECT DISTINCT e.DeadlockID
        , ObjectName = Deadlock.Resources.value('@objectname', 'nvarchar(256)')
    FROM #Events e
        CROSS APPLY e.DeadlockGraph.nodes('/event/data/value/deadlock/resource-list/*') as Deadlock(Resources)
)
SELECT *
FROM
(
    SELECT e.DeadlockID
        , TransactionTime = Deadlock.Process.value('@lasttranstarted', 'datetime')
        , DeadlockGraph
        , DeadlockObjects = substring((SELECT (', ' + o.ObjectName)
                            FROM DeadlockObjects o
                            WHERE o.DeadlockID = e.DeadlockID
                            ORDER BY o.ObjectName
                            FOR XML PATH ('')
                            ), 3, 4000)
        , Victim = CASE WHEN v.VictimID IS NOT NULL 
                            THEN 1 
                        ELSE 0 
                        END
        , SPID = Deadlock.Process.value('@spid', 'int')
        , ProcedureName = Deadlock.Process.value('executionStack[1]/frame[1]/@procname[1]', 'varchar(200)')
        , LockMode = Deadlock.Process.value('@lockMode', 'char(1)')
        , Code = Deadlock.Process.value('executionStack[1]/frame[1]', 'varchar(1000)')
        , ClientApp = CASE LEFT(Deadlock.Process.value('@clientapp', 'varchar(100)'), 29)
                        WHEN 'SQLAgent - TSQL JobStep (Job '
                            THEN 'SQLAgent Job: ' + (SELECT name FROM msdb..sysjobs sj WHERE substring(Deadlock.Process.value('@clientapp', 'varchar(100)'),32,32)=(substring(sys.fn_varbintohexstr(sj.job_id),3,100))) + ' - ' + SUBSTRING(Deadlock.Process.value('@clientapp', 'varchar(100)'), 67, len(Deadlock.Process.value('@clientapp', 'varchar(100)'))-67)
                        ELSE Deadlock.Process.value('@clientapp', 'varchar(100)')
                        END 
        , HostName = Deadlock.Process.value('@hostname', 'varchar(20)')
        , LoginName = Deadlock.Process.value('@loginname', 'varchar(20)')
        , InputBuffer = Deadlock.Process.value('inputbuf[1]', 'varchar(1000)')
    FROM #Events e
        CROSS APPLY e.DeadlockGraph.nodes('/event/data/value/deadlock/process-list/process') as Deadlock(Process)
        LEFT JOIN Victims v ON v.DeadlockID = e.DeadlockID AND v.VictimID = Deadlock.Process.value('@id', 'varchar(50)')
) X
ORDER BY DeadlockID DESC;
```

#### 死锁发生时，还未被数据库层面牺牲掉一个的时候查询死锁信息

```sql
select t1.resource_type                                [资源锁定类型]
     , DB_NAME(resource_database_id)                as 数据库名
     , t1.resource_associated_entity_id                锁定对象
     , t1.request_mode                              as 等待者请求的锁定模式
     , t1.request_session_id                           等待者SID
     , t2.wait_duration_ms                             等待时间
     , (select TEXT
        from sys.dm_exec_requests r
               cross apply
             sys.dm_exec_sql_text(r.sql_handle)
        where r.session_id = t1.request_session_id) as 等待者要执行的SQL
     , t2.blocking_session_id                          [锁定者SID]
     , (select TEXT
        from sys.sysprocesses p
               cross apply
             sys.dm_exec_sql_text(p.sql_handle)
        where p.spid = t2.blocking_session_id
)                                                      锁定者执行语句
from sys.dm_tran_locks t1,
     sys.dm_os_waiting_tasks t2
where t1.lock_owner_address = t2.resource_address;
```

```sql
SELECT request_session_id spid,OBJECT_NAME(resource_associated_entity_id)tableName
FROM  sys.dm_tran_locks
WHERE resource_type='OBJECT ' ;
```

## 阻塞

```sql
-- 查询阻塞情况
-- 查询结果需要截图，text字段的值要另外复制下做记录保存。
SELECT
    t1.resource_type AS [锁类型],
    DB_NAME(resource_database_id) AS [数据库名],
    t1.resource_associated_entity_id AS [阻塞资源对象],
    t1.resource_description AS [资源描述信息],
    t1.request_mode AS [请求的锁],
    t1.request_session_id AS [等待会话],
    t2.wait_duration_ms AS [等待时间],
    (SELECT [text] FROM sys.dm_exec_requests AS r 
    WITH (NOLOCK) CROSS APPLY sys.dm_exec_sql_text(r.[sql_handle])    
    WHERE r.session_id = t1.request_session_id) AS [等待会话执行的批SQL],
    (SELECT SUBSTRING(qt.[text],r.statement_start_offset/2, 
    (CASE WHEN r.statement_end_offset = -1 
    THEN LEN(CONVERT(NVARCHAR(max), qt.[text])) * 2 
    ELSE r.statement_end_offset END )/2) FROM sys.dm_exec_requests AS r 
    WITH (NOLOCK) CROSS APPLY sys.dm_exec_sql_text(r.[sql_handle]) AS qt   
    WHERE r.session_id = t1.request_session_id) AS [等待会话执行的SQL],
    t2.blocking_session_id AS [阻塞会话],
    (SELECT [text] FROM sys.sysprocesses AS p CROSS APPLY sys.dm_exec_sql_text(p.[sql_handle]) 
    WHERE p.spid = t2.blocking_session_id) AS [阻塞会话执行的批SQL]
    FROM
    sys.dm_tran_locks AS t1 WITH (NOLOCK) 
    INNER JOIN sys.dm_os_waiting_tasks AS t2 WITH (NOLOCK) ON t1.lock_owner_address = t2.resource_address
OPTION (RECOMPILE);


-- 查询阻塞
Select spid,blocked from master..sysprocesses where blocked<>0
-- 查询spid对应的SQL
dbcc inputbuffer(spid)
```