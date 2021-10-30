---
title: '客户端常用方法'
date: 2021-07-15
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

## 插件

- 获取单据主键：this.View.Model.GetPKValue();

- 获取列表当前选中行的主键：this.ListView.SelectedRowsInfo.GetPrimaryKeyValues();

- 打开界面

| 单据            |           列表   | 动态表单          |
|:---------------:|:----------------:|:-----------------------:|
|BillShowParameter|ListShowParameter|DynamicFormShowParameter|

- 加载界面元数据：FormMetadata formMeta = MetaDataServiceHelper.GetFormMetaData(this.Context,formId);

- 单据数据包类型：DynamicObjectType dataType=formMeta.BusinessInfo.GetDynamicObjectType();

- 根据单据ID和数据包类型加载单据数据包：DynamicObject formData=BusinessDataServiceHelper.LoadSingle(this.Context,Id,dataType);

- 查询单据数据

```csharp
//如果是单据体分录id，则需要添加单据体标识：FENTITY_FID
QueryBuilderParemeter queryParam = new QueryBuilderParemeter()
{
    FormId = "SUB_SupWipStk",
    SelectItems = SelectorItemInfo.CreateItems("FStockId", "FStockLocId"),
    FilterClauseWihtKey = string.Format("FSUPPLIERID=@FSupplierId And FSUBORGID=@FSubOrgId")
};
List<SqlParam> sqlParams = new List<SqlParam>();
sqlParams.Add(new SqlParam("@FSupplierId", KDDbType.Int64, supplierId));
sqlParams.Add(new SqlParam("@FSubOrgId", KDDbType.Int64, purChaseOrgId));
DynamicObjectCollection qureyResult = QueryServiceHelper.GetDynamicObjectCollection(ctx, queryParam, sqlParams);

```

- 辅助属性字段类型：RelatedFlexGroupField auxPropField = this.View.BusinessInfo.GetField(CONST_ENG_BOM.CONST_FTreeEntity.KEY_FAuxPropId) as RelatedFlexGroupField;

- 根据数据包设置字段锁定

```csharp
//1、因数据包中具有表体行信息，固锁定表体中确定某个值的单元格
this.View.StyleManager.SetEnabled(cloumnName, dynamicObject, CONST_ENG_BOM.CONST_FTreeEntity.ENTITY_FTreeEntity, true);
//2、锁定字段
FormUtils.StdLockField(this.View, "FSupplyMode");
```

- 设置字段隐藏：FormUtils.StdHideField(this.View, "FSupplyMode");

### 单据体

- 获取单据体当前行索引：this.Model.CurrentRowIndex(key);//key:单据体标识

- 获取单据体分录行数：this.Model.GetEntryRowCount(key);

- 获取单据体类型：Entity entity=this.Model.BillBusinessInfo.GetEntryEntity(entityKey);

- 获取单据体分录数据包集合：DynamicObjectCollection datas=this.Model.GetEntityDataObject(entity);

- 创建单据体一行数据对象：

    - DynamicObject addRow=new DynamicObject(datas.DynamicCollectionItemPropertyType);

    - DynamicObject addRow=new DynamicObject(entity.DynamicObjectType);

- 单据体数据包整体填充

```csharp
FormMetadata formMetadata = (FormMetadata)MetaDataServiceHelper.GetFormMetaData(this.Context, "ENG_SIMBOMENTRYLIST");
DynamicObjectCollection simBomEntrys = this.Model.GetEntityDataObject(this.View.BusinessInfo.GetEntity("FTreeEntity"));
OperateOption operateOption = OperateOption.Create();
operateOption.SetVariableValue("FormMetadata", formMetadata);
simBomEntrys.FromDataSource(bomEntityData, true, null, null, operateOption);
```

### 制造字段映射

```csharp
public void BomEntityMap(Context ctx, DynamicObject bomEntity, DynamicObject bomData) 
{
    FormMetadata BillFieldLink = (FormMetadata)AppServiceContext.MetadataService.Load(ctx, "MFG_BILLFIELDLINK");
    DynamicObject bomEntityToSimBom = MFGDataManagerUtil.LoadData(ctx, BillFieldLink.BusinessInfo.GetDynamicObjectType(),
        "select fid from t_mfg_billlink where fbillno='ENG_SimBomEntry'").OfType<DynamicObject>().FirstOrDefault();
    List<FieldMapHandle> lstFieldMapHandle = MFGBillFieldLinkUtil.GetFieldMappingHandle(ctx, bomEntityToSimBom);
    MFGBillFieldLinkUtil.DoFieldMapping(lstFieldMapHandle, bomEntity, bomData);
}
```

### 插件中实体服务规则

-  插件中添加实体服务规则

```csharp
public override void OnInitialize(BOS.Core.DynamicForm.PlugIn.Args.InitializeEventArgs e)
{
    base.OnInitialize(e);
    this.View.RuleContainer.AddPluginRule(CONST_ENG_BOM.CONST_FTreeEntity.ENTITY_FTreeEntity,
        RaiseEventType.Initialized | RaiseEventType.ItemAdded | RaiseEventType.ItemAdding | RaiseEventType.ValueChanged,
        this.SetIsabledAuxProp, new string[] { CONST_ENG_BOM.CONST_FTreeEntity.KEY_FMATERIALIDCHILD });
}
```

- 在插件中使用this.Model.BeginIniti()和this.Model.EndIniti()包起来的部分不会触发实体服务规则


### 验证权限

- 验证某一用户对单据的操作权限

```csharp
PermissionAuthResult isViewAuthResult = PermissionServiceHelper.FuncPermissionAuth(this.View.Context,
    //构建BusinessObject对象的时候可以传入需要验证权限的组织ID，就会验证此组织下的权限
    //如果不传，则会验证所有组织下的权限
  new BusinessObject() 
  { 
      Id = "ENG_BOM", SubSystemId = this.View.Model.SubSytemId 
  },
  PermissionConst.Modify);
  if (isViewAuthResult.Passed == false)
  {
      this.View.ShowMessage(string.Format("您在【{0}】组织下没有【物料清单】的【修改】权限，请联系系统管理员", this.View.Context.CurrentOrganizationInfo.Name));
      e.Cancel = true;
      return;
  }

```

- 验证是否有打开单据的权限

```csharp
//此操作可以在列表中点击单据编号打开相应单据的时候用，返回该用户的最高权限
BillShowParameter bp = MFGCommonUtil.CreateBillShowParameterByPermission(this.Context, formid, moId, out msg);
```

### 网控

- 开启网控

```csharp
private List<long> StartNetworkCtrl(Context ctx, string operationKey, string operationName, List<long> bomIds, out List<NetworkCtrlResult> networkCtrlResults)
{
    //operationKey需要在数据库中查,表名：T_BAS_NETWORKCTRLOBJECT
    string filter = string.Format(@" FMetaObjectID = '{0}' and FoperationID = '{1}'  and ftype={2}  and FStart = '1'  ", MFGFormIdConst.SubSys_ENG.BomBill, operationKey, (int)NetworkCtrlType.BusinessObjOperateMutex);
    NetworkCtrlObject netCtrlObj = AppServiceContext.NetworkCtrlService.GetNetCtrlList(ctx, filter).FirstOrDefault();
    List<NetWorkRunTimeParam> networkParams = new List<NetWorkRunTimeParam>();
    foreach (var bomId in bomIds)
    {
        NetWorkRunTimeParam param = new NetWorkRunTimeParam();
        param.BillName = new LocaleValue(Kingdee.BOS.Resource.ResManager.LoadKDString("物料清单", "015070000014358", Kingdee.BOS.Resource.SubSystemType.MFG), 2052);
        param.InterID = bomId.ToString();
        param.OperationDesc = Kingdee.BOS.Resource.ResManager.LoadKDString("物料清单", "015070000014358", Kingdee.BOS.Resource.SubSystemType.MFG) + "-" + "BillNo" + "-" + operationName;
        param.OperationName = new LocaleValue(operationName, 2052);
        networkParams.Add(param);
    }
    networkCtrlResults = AppServiceContext.NetworkCtrlService.BatchBeginNetCtrl(ctx, netCtrlObj, networkParams);
    return (from c in networkCtrlResults
            where c.StartSuccess == true
            select Convert.ToInt64(c.InterID)).ToList();
}
```

- 释放网控

```csharp
protected virtual void CommitNetworkCtrl(Context ctx, List<NetworkCtrlResult> networkCtrlResults)
{
    AppServiceContext.NetworkCtrlService.BatchCommitNetCtrl(ctx, networkCtrlResults);
}
```