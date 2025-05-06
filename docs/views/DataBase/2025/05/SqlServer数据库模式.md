---
title: '数据库模式更改'
date: 2025-05-06
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## Sql Server 单用户模式更改为多用户模式

```sql
USE master;
GO

-- 设置数据库名
DECLARE @dbname NVARCHAR(100) = N'你的数据库名'; -- ← 替换这里

-- 构造 KILL 命令来终止所有该数据库的会话
DECLARE @kill NVARCHAR(MAX) = N'';

SELECT @kill += 'KILL ' + CONVERT(VARCHAR(10), session_id) + ';'
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID(@dbname) AND session_id <> @@SPID;

-- 执行所有 KILL 语句
EXEC (@kill);
GO

-- 设置数据库为多用户模式，立即回滚其他会话
ALTER DATABASE [你的数据库名] SET MULTI_USER WITH ROLLBACK IMMEDIATE;
GO

```