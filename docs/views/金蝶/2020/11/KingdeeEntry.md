---
title: '【金蝶】 单据体'
date: 2020-11-22
categories:
- "金蝶"
tags:
- 工作笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: false
keys: 
- '4dbd8ccf0264bac90c034c2c21a23ef3'
---

## 单据体

 ### 单据体逐行赋值
  ``` csharp
  protected const string EntityKey_FBomChildEntity = "FBottomEntity";
  
  Entity entity = (Entity)this.Model.BillBusinessInfo.GetEntryEntity(EntityKey_FBomChildEntity);
  DynamicObjectCollection detailDataEntities = this.Model.GetEntityDataObject(entity);
  foreach(var item in dataObject)
  {
      DynamicObject addRow = new DynamicObject(detailDataEntities.DynamicCollectionItemPropertyType);
      addRow["RowType"] = BOS.Core.Enums.ENUM_ROWTYPE.ExpandWaiting;
      addRow["EntryId"] = SequentialGuid.NewNativeGuid().ToString("N");
      addRow["ParentEntryId"] = item["EntryId"];
      addRow["Seq"] = 2;
      detailDataEntities.Add(addRow);
  }
  
  this.View.UpdateView(EntityKey_FBomChildEntity);
  ```

 ### 创建一个单据体数据对象
  ``` csharp

  protected const string EntityKey_FBomChildEntity = "FBottomEntity";    //单据体标识
  //方式一
  {
      Entity entity = (Entity)this.Model.BillBusinessInfo.GetEntryEntity(EntityKey_FBomChildEntity); 
      //单据体数据集合
      DynamicObjectCollection detailDataEntities = this.Model.GetEntityDataObject(entity);
      //一行数据对象
      DynamicObject addRow = new DynamicObject(detailDataEntities.DynamicCollectionItemPropertyType);
  }
  //方式二
  {
      DynamicObjectCollection refMdls = newCfgBillObject[EntityKey_FBomChildEntity] as DynamicObjectCollection;
      DynamicObject addRow = new DynamicObject(refMdls.DynamicCollectionItemPropertyType);
  }
  ```