---
title: 'Serilog'
date: 2021-04-06
categories:
- "Csharp"
tags:
- 日志配置
sidebar: true
isFull: false
isShowComments: true
isShowIndex: false
---

## Serilog使用

首先，当然是引用nuget程序包(Serilog.AspNetCore)，然后需要添加log4net的配置文件,该文件在项目中CfgFiles文件夹下创建log4net.xml，并且设置属性如果较新则复制

在配置文件中添加配置

```json
{
    "Serilog": {
    "MinimumLevel": {
      "Default": "Debug",
      "Override": {
        "Microsoft": "Fatal",
        "System": "Fatal"
      }
    },
    "WriteTo": [
      {
        "Name": "Console"
      },
      {
        "Name": "RollingFile",
        "Args": {
          "pathFormat": "logs/{Date}.log",
          "outputTemplate": "{Timestamp:HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
          "shared": true,
          "restrictedToMinimumLevel": "Debug"
        }
      },
      {
        "Name": "MSSqlServer",
        "Args": {
          "connectionString": "Data Source=106.15.94.246;Initial Catalog=TestBlog;Persist Security Info=True;User ID=sa;Password=lt863370814..",
          //"connectionString": "Data Source=106.15.94.246;Initial Catalog=Blog;Persist Security Info=True;User ID=sa;Password=lt863370814..",
          //"schemaName": "EventLogging",
          "tableName": "T_SYS_SERILOGS",
          "autoCreateSqlTable": true,
          "restrictedToMinimumLevel": "Debug",
          "batchPostingLimit": 100,
          "period": "0.00:00:30",
          "columnOptionsSection": {
            "disableTriggers": true,
            "clusteredColumnstoreIndex": false,
            "primaryKeyColumnName": "Id",
            "addStandardColumns": [ "LogEvent" ],
            "removeStandardColumns": [ "MessageTemplate" ],
            "additionalColumns": [
              {
                "ColumnName": "IP",
                "DataType": "varchar",
                "DataLength": 32
              }
            ],
            "id": { "nonClusteredIndex": true },
            "properties": {
              "columnName": "Properties",
              "excludeAdditionalProperties": true,
              "dictionaryElementName": "dict",
              "itemElementName": "item",
              "omitDictionaryContainerElement": false,
              "omitSequenceContainerElement": false,
              "omitStructureContainerElement": false,
              "omitElementIfEmpty": true,
              "propertyElementName": "prop",
              "rootElementName": "root",
              "sequenceElementName": "seq",
              "structureElementName": "struct",
              "usePropertyKeyAsElementName": false
            },
            "timeStamp": {
              "columnName": "Timestamp",
              "convertToUtc": true
            },
            "logEvent": {
              "excludeAdditionalProperties": true,
              "excludeStandardColumns": true
            },
            "message": { "columnName": "message" },
            "exception": { "columnName": "exception" }
          }
        }
      }
    ]
  }
}
```