---
title: 'BOS常用方法类库记录'
date: 2021-11-22
categories:
- "金蝶"
tags:
- 学习笔记
sidebar: auto
# isFull: true
isShowComments: true
isShowIndex: false
keys: 
- '4dbd8ccf0264bac90c034c2c21a23ef3'
---

## Form 

### Kingdee.BOS.Core

在此工程下，存在如下类文件及其中方法

- DynamicFormViewPlugInProxy.cs 动态表单View层代理插件

- BillViewPlugInProxy.cs 单据View代理插件

- EntityRule.cs 实体服务规则类，其中Execute()方法是执行实体服务规则

- DynamicSqlBuilder.cs 构建sql类，其中BuildExtJoinSQLFROM()是拼接join表

### Kingdee.BOS.App.Core

- ServicePlugInProxy.cs 服务端代理插件

### Kingdee.BOS.Business.Bill

- EntityExport.cs 单据体引出

### Kingdee.BOS.DataEntity

- DynamicObjectType.RegisterSimpleProperty() 注册属性

## WebApi

### Kingdee.BOS.WebApi.ServicesStub

- DynamicFormService.cs WebApi接口到Form之间连接

### Kingdee.BOS.WebApi.Client

- K3CloudApiClient.cs  使用Kingdee.BOS.WebApi.Client程序集调用WebApi入口
