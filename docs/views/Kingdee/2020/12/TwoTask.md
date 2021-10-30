---
title: '【金蝶】 根据单据编号打开单据'
date: 2020-12-8
categories:
- "金蝶"
tags:
- 工作任务
# 显示侧边栏
sidebar: true
# 顶部是否有图片
isFull: true
isShowComments: true
# 是否显示在首页
isShowIndex: false
keys: 
- '4dbd8ccf0264bac90c034c2c21a23ef3'
---

## 根据单据编号查看单据详情

 ``` csharp
    [Description("缺料分析列表插件")]
    public class LackAnalyeBillList : BaseControlList          //BaseControlList : AbstractListPlugIn
    {
        public override void EntryButtonCellClick(EntryButtonCellClickEventArgs e)
        {
            base.EntryButtonCellClick(e);
            switch (e.FieldKey.ToUpperInvariant())
            {
                case "FMOBILLNO":
                    //单据体选中信息集合
                    ListSelectedRowCollection rowsDataList = this.ListView.CurrentPageRowsInfo;
                    if (e.Row == -1)
                    {
                        break;
                    }
                    ListSelectedRow rowData = rowsDataList[e.Row - 1];
                    //获取单据体主键信息
                    long entryId = rowData.EntryPrimaryKeyValue.ConvertTo<Int64>();
                    ShowBill(entryId);
                    break;
            };
        }

        private void ShowBill(long lackEntryId)
        {
            QueryBuilderParemeter queryParam = new QueryBuilderParemeter
            {
                //单据ID
                FormId = "PRD_LackAnalyeBill",
                //select的字段
                SelectItems = SelectorItemInfo.CreateItems("FSelOrderType", "FMoId"),
                //where条件
                FilterClauseWihtKey = string.Format("FEntity_FENTRYID=@entryId")
            };
            List<SqlParam> sqlParam = new List<SqlParam>();
            sqlParam.Add(new SqlParam("@entryId", KDDbType.Int64, lackEntryId));
            DynamicObjectCollection qureyResult = QueryServiceHelper.GetDynamicObjectCollection(this.Context, queryParam, sqlParam);
            if (qureyResult.IsEmpty()) return;
            var data = qureyResult.First();
            string selOrderType = data.GetDynamicValue<string>("FSelOrderType");
            var moId = data.GetDynamicValue<string>("FMoId");
            if (moId.ConvertTo<long>(0) == 0) return; 
            string formid = "";
            switch (selOrderType)
            {
                case "A":
                    formid = MFGFormIdConst.SubSys_PRD.MOBill;
                    break;//显示生产订单
                case "B":
                    formid = MFGFormIdConst.SubSys_SUB.SubReqOrder;
                    break;//显示委外订单
                case "C":
                    formid = MFGFormIdConst.SubSys_PLN.RequirementOrderBill;
                    break;//显示组织间需求单
            }
            if (formid.IsNullOrEmptyOrWhiteSpace()) return;
            //BillShowParameter bp = new BillShowParameter()
            //{
            //    Status = OperationStatus.VIEW,   //打开状态
            //    FormId = formid,                 //表单ID
            //    PKey = moId                      //订单ID
            //};
            string msg = string.Empty;

            //查看表单打开权限  表单的形式显示
            BillShowParameter bp = MFGCommonUtil.CreateBillShowParameterByPermission(this.Context, formid, moId, out msg);
            if (bp != null)
            {
                bp.Status = OperationStatus.VIEW;
                this.View.ShowForm(bp);
                return;
            }
            this.View.ShowMessage(msg);
            
        }
    }
 ```