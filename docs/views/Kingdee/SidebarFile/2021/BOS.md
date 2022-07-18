---
title: 'BOS常用方法类库记录'
date: 2021-11-22
categories:
- "Kingdee"
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

- ConvertPlugInProxy.cs 单据转化代理插件 

- EntityRule.cs 实体服务规则类，其中Execute()方法是执行实体服务规则

- DynamicSqlBuilder.cs 构建sql类，其中BuildExtJoinSQLFROM()是拼接join表

- AbstractDynamicFormModel.cs 动态表单数据模型，其中SetValue()更改字段值，SummaryDataAndFill()表体字段汇总到指定表头字段/子单据体汇总到指定父分录字段

### Kingdee.BOS.App.Core

- ServicePlugInProxy.cs 服务端代理插件

- ConvertService.cs  单据转化服务  Push()下推

- ExecuteFormBusinessAction 单据转化表单服务策略执行类，原文件名为ConvertFormBusinessAction

- AbstractOprerationService.cs 操作服务类，DoExcete()是操作真正执行的过程

- BusinessFlowWriteBack.cs 反写规则实现类， DoWriteBakc()是实现入口

- MetadataXmlReader.cs 获取元数据Metadata，Load()是实现入口
### Kingdee.BOS.Business.Bill

- EntityExport.cs 单据体引出

- ImportData.cs 引入

- AbstractEntryOperation.cs 单据体操作，此文件中包含NewEntry新增分录，ModifyEntry修改分录，BatchInsertEntry批量插入分录，InsertEntry插入分录，CopyEntryRow复制分录行，DeleteEntry删除分录行，BatchFill批量填充

### Kingdee.BOS.DataEntity

- DynamicObjectType.RegisterSimpleProperty() 注册属性

## WebApi

### WebAPI url格式

- http://ServerIp/K3Cloud/接口命名空间.接口实现类名.方法,组件名.common.kdsvc

### Kingdee.BOS.WebApi.ServicesStub

- DynamicFormService.cs WebApi接口到Form之间连接

### Kingdee.BOS.WebApi.Client

- K3CloudApiClient.cs  使用Kingdee.BOS.WebApi.Client程序集调用WebApi入口



