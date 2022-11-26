---
title: '数据库触发器'
date: 2022-11-03
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

## Sql Service

查询数据库中已有的触发器

```sql
SELECT  OBJECT_NAME(a.parent_obj) AS [表名] ,
        a.name AS [触发器名称] ,
        ( CASE WHEN b.is_disabled = 0 THEN '启用'
               ELSE '禁用'
          END ) AS [状态] ,
        b.create_date AS [创建日期] ,
        b.modify_date AS [修改日期] ,
        c.text AS [触发器语句]
FROM    sysobjects a
        INNER JOIN sys.triggers b ON b.object_id = a.id
        INNER JOIN syscomments c ON c.id = a.id
--WHERE   a.xtype = 'tr' and c.text like '%bom_weight_wkx%'
ORDER BY [表名];
```
