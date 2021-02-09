---
title: '【金蝶】 单据体'
date: 2020-11-22
categories:
- "金蝶"
tags:
- 工作笔记
sidebar: true
isShowComments: true
isShowIndex: false
keys: 
- '4dbd8ccf0264bac90c034c2c21a23ef3'
---

## 单据体

### 常用方法

1. 判断一个对象是否为空使用IsEmpty()方法&nbsp;&nbsp;&nbsp;命名空间为 Kingdee.BOS.Util

2. 获取分录行数量 this.Model.GetEntryRowCount("FTreeEntity");

3. 获取系统参数 
    ```csharp
    //ctx:上下文  OrgId:当前组织  IDCategory:单据标识  Key:字段ORM属性  DefValue:默认返回值<br>
    int para = MFGServiceHelper.GetSystemProfile(Context ctx, long OrgId, string Category, string Key, T DefValue = null)
    ```
4. 获取单据体当前行索引 this.Model.GetEntryCurrentRowIndex(key); //key:单据体标识 

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

 ### 创建单据体分录数据实例
  ``` csharp

  protected const string EntityKey_FBomChildEntity = "FBottomEntity";    //单据体标识
  //方式一
  {
      Entity entity = (Entity)this.Model.BillBusinessInfo.GetEntryEntity(EntityKey_FBomChildEntity); 
      //单据体数据集合对象
      DynamicObjectCollection detailDataEntities = this.Model.GetEntityDataObject(entity);
      //一行数据对象
      DynamicObject addRow = new DynamicObject(detailDataEntities.DynamicCollectionItemPropertyType);
  }
  //方式二
  {
      DynamicObjectCollection refMdls = newCfgBillObject[EntityKey_FBomChildEntity] as DynamicObjectCollection;
      DynamicObject addRow = new DynamicObject(refMdls.DynamicCollectionItemPropertyType);
  }

   //方式三  单据体一行数据对象
  {
      Entity entity=this.View.Business.GetEntryEntity("FTreeEntity");
      DynamicObject data=new DynamicObject(entity.DynamicObjectType);
  }
  ```
<br>


