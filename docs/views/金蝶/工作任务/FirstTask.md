---
title: '【金蝶】 物料单据添加已使用检查'
date: 2020-11-30
categories:
- "金蝶"
tags:
- 工作任务
sidebar: true
isFull: true
# 文章封面 不填为随机
# pic: 'https://zyj_yida.gitee.io/source/img/mdCover/babai.jpg'
isShowComments: true
isShowIndex: false
keys: 
- '4dbd8ccf0264bac90c034c2c21a23ef3'
---


## 物料添加已使用字段
 
 **任务描述**：物料单据添加已使用字段，列表添加使用检查按钮判断对应物料是否已被使用，并更新列表数据

 ----------
 **位置**：Kingdee.K3.BD.App.Common.ServicePlugIn.Material.RefCheck
 ### 代码
 ``` csharp
    [Description("物料-使用检查插件")]
    public class RefCheck : AbstractOperationServicePlugIn
    {
        IBaseDataService bdService 
        {
            get
            {
                return Kingdee.BOS.App.ServiceHelper.GetService<IBaseDataService>();
            }
        }

        public override void OnPreparePropertys(BOS.Core.DynamicForm.PlugIn.Args.PreparePropertysEventArgs e)
        {
            e.FieldKeys.Add("FRefStatus");
        }

        public override void BeginOperationTransaction(BOS.Core.DynamicForm.PlugIn.Args.BeginOperationTransactionArgs e)
        {
            var mtrlIds = e.DataEntitys.Select(dataEntity => dataEntity.GetDynamicValue<long>("Id")).Distinct().ToArray();
            //被使用物料Id
            var usedIds = IsRefByOtherBill(mtrlIds);
            //未被使用物料Id
            var nonUsedIds = mtrlIds.Except(usedIds).ToArray();
            //批量更新Sql语句
            string strSql = 
                @"MERGE INTO T_BD_MATERIAL U1 USING({0}) U2 
                  ON U1.FMATERIALID=U2.FID 
                  WHEN MATCHED THEN
                  UPDATE SET U1.FREFSTATUS='{1}'; ";

            if (!usedIds.IsEmpty())
            {
                var sql = string.Format(strSql, StringUtils.GetSqlWithCardinality(usedIds.Count(), "@ids", 1), 1);
                DBUtils.Execute(this.Context, sql, new SqlParam("@ids", KDDbType.udt_inttable, usedIds));
            }
            if (!nonUsedIds.IsEmpty())
            {
                var sql = string.Format(strSql, StringUtils.GetSqlWithCardinality(nonUsedIds.Count(), "@ids", 1), 0);
                DBUtils.Execute(this.Context, sql, new SqlParam("@ids", KDDbType.udt_inttable, nonUsedIds));
            }
        }

        /// <summary>
        /// 获取已使用物料ID
        /// </summary>
        /// <param name="materialIds"></param>
        /// <returns></returns>
        private Int64[] IsRefByOtherBill(Int64[] materialIds)
        {
            List<BaseDataRefResult> results = new List<BaseDataRefResult>();
            HashSet<Int64> usedMaterialIds = new HashSet<long>();

            var validator = this.BusinessInfo.GetForm().GetOperation(FormOperationEnum.Delete.ToString())
                .Validations.FirstOrDefault(v => v.GetType() == typeof(BaseDataRefValidator));
            if (validator != null)
            {
                //调用检查基础物料使用情况
                results = bdService.CheckBaseDataRefInfo(Context, "BD_MATERIAL",materialIds.OfType<object>().ToArray() ,
                    typeof(Int64), (validator as BaseDataRefValidator).ExceptRefItem, 1);
            }

            foreach (var result in results)
            {
                usedMaterialIds.Add(result.Id.ConvertTo<long>());
            }
            //results.ForEach(result => { usedMaterialIds.Add(result.Id.ConvertTo<long>()); });

            return usedMaterialIds.ToArray();
        }
    }
 ```

 ### 修改数据库结构同步语句
 修改数据库结构之后，需要讲sql脚本添加至对应模块的目录下 （D:\code\7.xdev\K3\BD\DataModel\7.0\PT\Start\BasicData\SimpleData\PT-146863_K3CloudV7.0_BD.sql）开发库，及添加数据库脚本文件的引用信息 （D:\code\7.xdev\K3\BD\DataModel\7.0\PT\meta-v7-pt.pkgdef）
