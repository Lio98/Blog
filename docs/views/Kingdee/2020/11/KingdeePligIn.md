---
title: '【金蝶】 插件开发'
date: 2020-11-28
categories:
- "Kingdee"
tags:
- 工作笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: false
keys: 
- '4dbd8ccf0264bac90c034c2c21a23ef3'
---

## 插件开发

 ### 表单插件

  - 表单插件取值赋值
    ``` csharp
    //获取备注FNote的值,并强制转换成字符串.ToString()
    string FNote = this.View.Model.GetValue("FNote").ToString();
    
    //给单据体物料FMaterialId编码,第0行,赋值
    this.View.Model.SetItemValueByNumber("FMaterialId", "003", 0);
    
    //给单据体物料内码ID,第1行,赋值
    this.View.Model.SetItemValueByID("FMaterialId", "310992", 1);
    ```

  - 获取单据内码
    ``` csharp
    //获取单据内码,并转换成字符串.ToString()
    string FormTitle = this.View.Model.DataObject["Id"].ToString();
    
    //获取单据内码,并转换成字符串.ToString()
    string FormTitle = this.View.Model.GetPKValue().ToString();
    
    //获取单据体某一行内码FENTRYID 0代表行
    this.View.Model.GetEntryPKValue("FSaleOrderEntry", 0);
    ```

  - 字段锁定、可见
    ``` csharp
    //单据头字段锁定
    this.View.GetControl("FNote").Enabled = false;
    
    //单据体字段行锁定
    this.View.GetFieldEditor("FEntryNote",0).Enabled = false;
    
    //字段可见性
    this.View.GetControl("FNote").Visible = false;
    ```

 - 按钮锁定、可见
    ``` csharp
    //锁定按钮    
    this.View.GetMainBarItem("tbSplitSave").Enabled = false;
    
    //隐藏按钮
    this.View.GetMainBarItem("tbSplitSave").Visible = false;
    ```

 - 表单插件刷新
    ``` csharp
    //前台刷新，和服务器不交互
    this.View.UpdateView("FNote");
    
    //整个界面刷新，交互服务器
    this.View.Refresh();
    ```

  - 单据体按钮点击
    ``` csharp
    //事件 EntryBarItemClick（）
    
    //删除单据体数据
    this.View.Model.DeleteEntryData("FSaleOrderEntry");
    
    //删除单据体某一行数据，0代表第1行
    this.View.Model.DeleteEntryRow("FSaleOrderEntry", 0);
    
    //刷新单据体界面
    this.View.UpdateView("FSaleOrderEntry");
    ```

  - 单据体新增行
    ``` csharp
    //新增行 
    this.View.Model.CreateNewEntryRow("FSaleOrderEntry");
    
    //复制行  0代表第1行;  1代表复制到第2行; false代表不携带源单关系
    this.View.Model.CopyEntryRow("FSaleOrderEntry", 0, 1, false);
    ```

  - 获取单据体行数
    ``` csharp
    //获取单据体总行数
    this.View.Model.GetEntryRowCount("FSaleOrderEntry");
    ```

  - 询问式提示框
    ``` csharp
    this.View.ShowMessage("错误提示,是否继续？",
    //提示信息：是、否
    MessageBoxOptions.YesNo,
    new Action<MessageBoxResult>((result) =>
    {
        if (result == MessageBoxResult.Yes)
        {
            //如果选择的是,给备注赋值,是
            this.View.Model.SetValue("FNote", "您选择--是");
        }
        else if (result == MessageBoxResult.No)
        {
            //如果选择的否,给备注赋值,否
            this.View.Model.SetValue("FNote", "您选择--否");
        }
    }));
    //刷新一下备注
    this.View.UpdateView("FNote");
    ```

  - F7事件
    ``` csharp
    public override void BeforeF7Select(BOS.Core.DynamicForm.PlugIn.Args.BeforeF7SelectEventArgs e)
    {
        base.BeforeF7Select(e);
        if(e.FieldKey.Equals("FCustId"))
        {
            //过滤条件,限定,只能选择某些客户
            e.ListFilterParameter.Filter = "FNumber ='003'";
        }
    }
    ```

  - 打开外部链接
    ```csharp
    public override void BarItemClick(BOS.Core.DynamicForm.PlugIn.Args.BarItemClickEventArgs e)
    {
        base.BarItemClick(e);
        if(e.BarItemKey ==("YDIE_tbTest"))
        {
            JSONObject webobj = new JSONObject();
            webobj["source"] = @"http://www.baidu.com";
            webobj["height"] = 600;
            webobj["width"] = 910;
            //是否新窗口打开
            webobj["isweb"] = true;
            webobj["title"] = "百度";
            this.View.AddAction("ShowKDWebbrowseForm", webobj);
            this.View.SendAynDynamicFormAction(this.View);
        }
    }
    ```
 ### 列表插件

  - 获取FID内码
    ``` csharp
    //选择的行,获取所有信息,放在listcoll里面
    ListSelectedRowCollection listcoll=  this.ListView.SelectedRowsInfo;
  
    //获取所选行的主键,赋值给一个数组listKey
    //接收返回的数组值,单据头FID内码
    string[] listKey = listcoll.GetPrimaryKeyValues();
  
    //单据体分录行FID内码
    string[] listKey = listcoll.GetEntryPrimaryKeyValues();
    ```

  - 获取单据编码
    ``` csharp
    ListSelectedRowCollection listcoll=  this.ListView.SelectedRowsInfo;
  
    //获取行选择信息
    this.ListModel.GetData(listcoll);
    string info = "";
    //定义字段,赋值
    //通过循环,读取数据
    for(int i =0;i<dycoll.Count;i++)
    {
        info = info + "," + dycoll[i]["FBillNo"];
        info = info + "," + dycoll[i]["FDate"];
    }
    ```

  - 设置行高
    ``` csharp
    //设置行高50
    this.View.GetControl<EntryGrid>("FLIST").SetRowHeight(50);
    ```
 ### 操作插件

## 常用方法

 ### 获取DB系统日期
  ``` csharp
  MFGServiceHelper.GetSysDate(this.Context)
  ```

 ### 获取表单ID
  ``` csharp
  this.View.BillBusinessInfo.GetForm().Id
  ```

 ### 获取焦点
  ``` csharp
  //获取焦点,备注
  this.View.GetControl("FNote").SetFocus();
  ```