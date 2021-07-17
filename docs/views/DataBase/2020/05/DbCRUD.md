---
title: '数据库增删查改'
date: 2020-05-18
categories:
- "数据库"
tags:
- 学习笔记
isShowComments: true
isShowIndex: true
---

## Sql Server 分页查询

 ### 1、offset/fetch next

 ```sql
 SELECT B.* FROM 
     (SELECT WR.WONO,WR.WORKORDER,WR.COMPONENT,WR.MATERIALCODE,WR.PRODUCT,WR.SPEC,
      WR.UNIT,WR.INVENTORYQUANTITY,WR.WAREHOUSEGUID,WR.STORAGEGUID,WR.ORDERNO,
      WR.MODIFIEDTIME,SI.Storage AS STORAGENAME,WI.WAREHOUSE AS WAREHOUSENAME
      FROM WareHouse_Real WR
      LEFT JOIN Storage_Info SI ON SI.Id=WR.STORAGEGUID
      LEFT JOIN WareHouse_Info WI ON WI.ID=WR.WAREHOUSEGUID WHERE 1=1) AS B  ORDER BY 1 OFFSET 31 ROWNEXT 15 ROWS ONLY;

      ***************************************参考*****************************************
      -- 设置执行时间开始，用来查看性能的
      set statistics time on ;
      -- 分页查询（通用型）
      select * 
      from (select top pageSize * 
      from (select top (pageIndex*pageSize) * 
      from student 
      order by sNo asc ) -- 其中里面这层，必须指定按照升序排序，省略的话，查询出的结果是错误的。
      as temp_sum_student 
      order by sNo desc ) temp_order
      order by sNo asc
      
      -- 分页查询第2页，每页有10条记录
      select * 
      from (select top 10 * 
      from (select top 20 * 
      from student 
      order by sNo asc ) -- 其中里面这层，必须指定按照升序排序，省略的话，查询出的结果是错误的。
      as temp_sum_student 
      order by sNo desc ) temp_order
      order by sNo asc;
 ```
 <span style="float:left;color:red;font-size:20px">offset A rows,将前A条记录舍去，fetch next B rows only,向后在读取B条数据</span>
 <br>
 <br>
 <br>
 <span style="float:right;color:blue;font-size:12px">引用：https://blog.csdn.net/weixin_37610397/article/details/80892426</span>
 <br>
 <br>

## Oracle 分页查询

 ```sql
    DynamicParameters pars = new DynamicParameters();
    StringBuilder sql = new StringBuilder();
    sql.Append(@"SELECT * FROM (SELECT ROWNUM RN2,TEMP1.* FROM(select rownum RN1, sl.guid,sl.storagename,sl.storagecode,storagetype,
                                   sl.warehouseguid,decode(sl.status,'0','无效','1','有效','无')Status,
                                   sl.remark,sl.creater,sl.createdate,sl.lastupdby,sl.lastupddate,
                                   whl.warehousename,
                                   whl.warehousecode,
                                   ui1.LoginUser as CreaterName,
                                   ui2.LoginUser as LastUpdByName
                                   from H2_StorageList sl
                                   left join H2_UserInfo ui1 on ui1.UserGuid = sl.Creater
                                   left join H2_UserInfo ui2 on ui2.UserGuid = sl.LastUpdBy
                                   join h2_warehouselist whl on whl.guid = sl.warehouseguid) TEMP1 WHERE 1=1 ");
    if (!string.IsNullOrEmpty(qry.StorageName))
    {
        sql.Append(" AND TEMP1.STORAGENAME=:Storagename");
        pars.AddDynamicParams(new { Storagename = qry.StorageName });
    }
    if (!string.IsNullOrEmpty(qry.WareHouseGuid))
    {
        sql.Append(" AND TEMP1.WAREHOUSEGUID=:Warehouseguid");
        pars.AddDynamicParams(new { Warehouseguid = qry.WareHouseGuid });
    }
    if (!string.IsNullOrEmpty(qry.Status))
    {
        sql.Append(" AND TEMP1.STATUS=:Status");
        pars.AddDynamicParams(new { Status = qry.Status });
    }
    sql.Append("  )TEMP2 WHERE TEMP2.RN2 BETWEEN ((:CurPage - 1) * :PageSize + 1) AND (:CurPage * :PageSize)");
    pars.AddDynamicParams(new { CurPage = curPager, PageSize = pagerSize });
    list = (await conn.QueryAsync<VMStorageListInfo>(sql.ToString(), pars)).ToList();
    result.Data = list;
 ```

## Oracle查锁表以及解锁

 - 使用如下语句可以查出锁表的具体原因,这个语句将查找到数据库中所有的DML语句产生的锁，还可以发现，任何DML语句其实产生了两个锁，一个是表锁，一个是行锁。
    
    ```sql
    SELECT S.SID, S.SERIAL#, S.USERNAME,S.SCHEMANAME,S.OSUSER,S.PROCESS,
    S.MACHINE,S.TERMINAL,S.LOGON_TIME,L.TYPE
    FROM V$SESSION S, V$LOCK L
    WHERE S.SID = L.SIDAND S.USERNAME IS NOT NULL
    ORDER BY SID;
    ```

 - 杀掉进程sid，serial#，这两个内容可以利用"v$locked_obiect"和"v$session"两个数据字典查询得到
    ```sql
     ALTER SYSTEM KILL SESSION'210,11562';
     ```
<br>
<span style="float:right;font-size:12px;color:blue">引用：https://www.cnblogs.com/chinas/p/8253451.html</span>
<br>

## Oracle恢复删除的数据

**分为两种方法：scn和时间戳两种方式恢复**

 ### 1、 通过scn恢复

  - 获得当前数据库的scn号
     ```sql
     select current_scn from v$database; (切换到sys用户或system用户查询)

     查询到的scn号为：1499223
     ```
  - 查询当前scn号之前的scn
     ```sql
     select * from 表名 as of scn 1499220; 

     (确定删除的数据是否存在，如果存在，则恢复数据；如果不是，则继续缩小scn号)
     ```
  - 恢复删除且已提交的数据
     ```sql
     flashback table 表名 to scn 1499220;
     ```

 ### 2、 通过时间恢复

  - 查询当前系统时间
     ```sql
     select to_char(sysdate,'yyyy-mm-dd hh24:mi:ss') from dual;
     ```

  - 查询删除数据的时间点的数据
     ```sql
     select * from 表名 as of timestamp to_timestamp('2013-05-29 15:29:00','yyyy-mm-dd hh24:mi:ss');
     ```

  - 恢复删除且已提交的数据
     ```sql
     lashback table 表名 to timestamp to_timestamp('2013-05-29 15:29:00','yyyy-mm-dd hh24:mi:ss');

     注意：如果在执行上面的语句，出现错误。可以尝试执行 alter table 表名 enable row movement; //允许更改时间戳
     ```

<br>
<span style="float:right;font-size:12px;color:blue">引用：https://www.cnblogs.com/kangxuebin/archive/2013/05/29/3106183.html</span>
<br>

## 索引
 ### 1、创建索引

  1. 创建索引 <br>
    create index 索引名 on 表名(列名);
   
  2. 删除索引<br>
    drop index 索引名;
   
  3. 创建组合索引<br>
    create index 索引名 on 表名(列名1,,列名2);

 ### 2、查看索引
  1. 在数据库中查找表名 <br> 
    select * from user_tables where  table_name like 'tablename%';
  2. 查看该表的所有索引 <br> 
    select * from all_indexes where table_name = 'tablename';
  3. 查看该表的所有索引列 <br>
    select* from all_ind_columns where table_name = 'tablename';

   <br>
   <span style="float:right;color:blue;font-size:12px">引用: https://www.cnblogs.com/superming/p/10978639.html</span> 

## 删除所有数据表

**方便删除数据库中的所有的数据表，清空数据库，有些有约束，不能直接delete，需要先删除库中的约束，代码如下：**

 - 删除所有约束
    ```sql
    DECLARE c1 cursor for
    select 'alter table ['+ object_name(parent_obj) + '] drop constraint ['+name+']; '
    from sysobjects
    where xtype = 'F'
    open c1
    declare @c1 varchar(8000)
    fetch next from c1 into @c1
    while(@@fetch_status=0)
    begin
    exec(@c1)
    fetch next from c1 into @c1
    end
    close c1
    deallocate c1
    ```
 - 删除数据库所有表
    ```sql
    declare @tname varchar(8000)
    set @tname=''
    select @tname=@tname + Name + ',' from sysobjects where xtype='U'
    select @tname='drop table ' + left(@tname,len(@tname)-1)
    exec(@tname)
    ```

然后清空数据库中的所有表：<br>
如果需要删除存储过程等只需要将上面的做如下修改就行了的**where xtype='U' 改成 where xtype='P'，drop table 改成 drop Procedure**
