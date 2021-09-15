---
title: '获取下次进入列表的默认过滤方案'
date: 2021-05-23
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

## 概述

有时会有打开列表时检验过滤方案中数据是否满足条件的需求，在此记录一下该方法的使用

``` csharp
public string GetScheme()
{
    string shemeId = UserParamterServiceHelper.GetNextEntrySchemeId(this.View.Context, "ENG_BOM");
    
    FormMetadata schemeMetadata = MetaDataServiceHelper.GetFormMetaData(this.View.Context, FormIdConst.BOS_FilterScheme);
    DynamicObject schemeData = BusinessDataServiceHelper.Load(this.View.Context, new object[] { shemeId }, schemeMetadata.BusinessInfo.GetDynamicObjectType()).FirstOrDefault();
    //说明是默认过滤方案
    if (schemeData.IsNullOrEmptyOrWhiteSpace())
    {
        return string.Empty;
    }
    FilterScheme filterScheme = new FilterScheme(schemeData);
    ListFilterSchemeEntity shemeEntity = (ListFilterSchemeEntity)(new DcxmlSerializer(new PreInsertDataDcxmlBinder()).DeserializeFromString(filterScheme.Scheme));
    string selectEntity = schemeEntity.SelectEntitySetting;
    if (selectEntity.IsEmpty())
    {
        return "61408e53e05df8";
    }
    List<string> selectEntityKey = selectEntity.Split(',').Distinct().ToList();
    //如果不包含子项明细，则指定一个预置的过滤方案
    if (!selectEntityKey.Contains(CONST_ENG_BOM.CONST_FTreeEntity.ENTITY_FTreeEntity.ToUpper()))
    {
        return "61408e53e05df8";
    }
    return string.Empty;
}
```