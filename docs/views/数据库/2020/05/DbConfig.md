---
title: '【学习笔记】数据库相关配置'
date: 2020-05-08
categories:
- "数据库"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

## 端口代理

&nbsp;&nbsp;&nbsp;**设置代理端口详细操作：**

- 列出所有的端口转发记录
netsh interface portproxy show all

- 通过代理服务器和代理端口，替代目标服务器和目标端口
netsh interface portproxy add v4tov4 listenaddress="代理服务器" listenport=代理端口 connectaddress="目标服务器"  connectport=目标端口

- 取消代理服务器的代理端口
netsh interface portproxy delete v4tov4 listenaddress="代理服务器" listenport=代理端口

******

## web.config配置项目
 ```xml
 <configSections>
<section name="dataConfiguration" type="Microsoft.Practices.EnterpriseLibrary.Data.Configuration.DatabaseSettings, Microsoft.Practices.EnterpriseLibrary.Data" />
<!--<section name="oracle.manageddataaccess.client" type="OracleInternal.Common.ODPMSectionHandler, Oracle.ManagedDataAccess, Version=4.122.19.1, Culture=neutral, PublicKeyToken=89b483f429c47342" />-->
</configSections>
<connectionStrings>
<!--SQLServer数据库的连接字符串-->
<add name="sqlserver" providerName="System.Data.SqlClient" connectionString="Server=192.168.**.***;Database=WinFramework;User Id=sa;Password=*******;" />
<!--SQLite数据库的连接字符串 本地路径：|DataDirectory| 统一路径：d:\Code\GitHub\MES\MES.Framework\Doc\MESFramework.db-->
<add name="sqlite" providerName="System.Data.SQLite" connectionString="Data Source=d:\Code\GitHub\MES\MES.Framework\Doc\xxxxxFramework.db;Version=3;" />
<!--Oracle数据库的连接字符串-->
<!--<add name="oracle" providerName="Oracle.ManagedDataAccess.Client" connectionString="Data Source=127.0.0.1:1521/XE;User Id=sa;Password=xxxxxxxxx;" />-->
<add name="oracle" providerName="Oracle.ManagedDataAccess.Client" connectionString="Data Source=192.168.8.***:1521/hh01;User Id=******;Password=*******;" />
</connectionStrings>
<dataConfiguration defaultDatabase="oracle">
<providerMappings>
<!--SQLServer 不需要设置默认支持-->
<!--SQLite 数据库-->
<add databaseType="EntLibContrib.Data.SQLite.SQLiteDatabase, EntLibContrib.Data.SQLite" name="System.Data.SQLite" />
<!--Oracle 数据库-->
<add databaseType="EntLibContrib.Data.ManagedOdpNet.OracleDatabase, EntLibContrib.Data.ManagedOdpNet" name="Oracle.ManagedDataAccess.Client" />
</providerMappings>
 ```