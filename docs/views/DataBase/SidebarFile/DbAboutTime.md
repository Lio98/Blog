---
title: '数据库时间函数'
date: 2020-05-08
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

# 数据库关于时间函数
 ### Oracle 关于时间
  - 五分钟之前
    ```sql
    SELECT SYSDATE-5/(24*60) FROM dual  ---5分钟
    ```
 
  - 下月的第一天
    ```sql
    select TRUNC(add_months(trunc(sysdate),+1),'MM') from dual
    ```
 
  - 15天前的日期时间
    ```sql
    SELECT to_date(to_char(TRUNC(SYSDATE-15),'yyyy-mm-dd') || '00:00:00','yyyy-mm-dd hh24:mi:ss') FROM DUAL;
    ```
 
  - 一段时间内的连续日期
    ```sql
    SELECT TO_CHAR(TO_DATE(to_char(TRUNC(SYSDATE-15),'yyyy-mm-dd'),'yyyy-mm-dd')+ROWNUM,'yyyy-mm-dd') asdaylist
    FROM dual
    CONNECT BY ROWNUM<=TRUNC(TO_DATE(to_char(SYSDATE,'yyyy-mm-dd'),'yyyy-mm-dd')
    -to_date(to_char(TRUNC(SYSDATE-15),'yyyy-mm-dd'),'yyyy-mm-dd'))
    ```
  <br>
  <span style="float:right;font-size:12px;color:blue">引用：https://blog.csdn.net/wangchangpen62/article/details/46548893/</span>
  <br>
 
  ### SqlServer关于时间
  #### 统计天数

  - 统计天数
    ```sql
    SELECT SUM(数量)
    FROM OrderTable
    WHERE DAY(OrderDate)=DAY(GETDATE());
    ```
    **注意**：这里的OrderDate是你新增单据的时间，这句表示过滤单据日期的天数等于当前系统时间的日期的天数
    WHERE DATEDIFF(DAY,OrderDate,GETDATE())=0 这个也可以DATEDIFF()函数表示天数的时间差，比上面那句的更好用，如你要昨天或几天前，只要用'<天数'或IN （0，1，2）代替=0，获取需要的天数过滤
 
  - 获取多少天后的日期
    ```sql
    SELECT DATEADD(DAY,200,DATEDIFF(DAY,0,GETDATE()-118));
    从118天之前往后200天
    ```
 
  - 几天前
    ```sql
    SELECT pt.EndTime >= (SELECT DATEADD(d, -7, GETDATE()))
    ```
 
  - 一天前的00:00:00
    ```sql
    SELECT DATEADD(day, -1, DATEDIFF(day, 0, GETDATE()))
    ```
 
  #### 统计月份
  - 统计月份
    ```sql
    SELECT SUM(数量)
    FROM OrderTable
    WHERE DATEPART(WEEK, OrderDate)=DATEPART(WEEK, GETDATE())
    --用DATEPART()函数，表示过滤单据日期的周数等于当前系统时间的日期的周数
    --WHERE DATEDIFF(WEEK,OrderDate,GETDATE())=0 ，同理，只要用'<周数'或IN（0，1，2）代替=0，过滤需要的周数
    
    SELECT * from ProjectTasks where DATEDIFF(week, EndTime, GETDATE()-7)=0 
    ORDER BY EndTime asc
    
    SELECT * from ProjectTasks where DATEPART(WEEK, EndTime)=DATEPART(WEEK, GETDATE()-7) 
    ORDER BY EndTime asc
       
    ```
 
  #### 统计同期
  
  - 同期是指去年的这个时间,如：今日同期、本周同期、本月同期等
    ```sql
    SELECT SUM(数量) FROM OrderTable WHERE 1=1
    AND YEAR(OrderDate)=YEAR(DATEADD(YEAR,-1,GETDATE()))
    AND MONTH(OrderDate)=MONTH(GETDATE())
    AND DAY(OrderDate)=DAY(GETDATE())
    --DATEADD(YEAR,-1,GETDATE())，表示在当前系统时间下增加-1年时间，即去年，然后根据月份和天数确定去年今日的时间，如2017-12-01的同期为2016-12-01
    --AND YEAR(OrderDate)=YEAR(DATEADD(YEAR,-1,GETDATE()))
    --AND DATEPART(WEEK, OrderDate)=DATEPART(WEEK, GETDATE())这两段表示统计去年本周数量
    --AND YEAR(OrderDate)=YEAR(DATEADD(YEAR,-1,GETDATE()))
    --AND MONTH(OrderDate)=MONTH(GETDATE()) 这两段表示统计去年本月数量
    ```
 
  #### Sql获取日期年月日
  - 获取年月日
    ```sql
    SELECT * FROM ProjectTasks WHERE to_date(CreateTime,'%Y-%m-%d') = to_date(now(),'%Y-%m-%d')
    ```