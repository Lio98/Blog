---
title: '【学习笔记】DateTime 序列化为json后带字母T'
date: 2020-05-09
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: auto
isFull: true
isShowComments: true
isShowIndex: true
---

::: tip
后端向前端传时间格式的数据时，通常会遇到传到前端的数据带有T时区

导致前端会显示出来

记录一下后端传值的时候直接格式化去掉时区内容
:::
<!-- more -->

## .net core 中 DateTime 序列化为json后带字母T问题
-------
当实体类中的类型为DateTime类型时
 ```csharp
 //实体
 class Model{
    //...
    //创建时间
    public DateTime CreateTime{get;set;}
    //...
 }
 ```
 再进行json序列化后，前端收到的结果为xxxx-xx-xxT xx:xx:xx 如：2018-11-03T15:20:20

 原因是core版本中的Newtonsoft.Json默认使用的是ISO格式

### 后端指定序列化为时间戳，前端自己根据需要转换格式
----------

- 打开Startup.cs文件，在ConfigureServices方法中添加如下代码
 ``` csharp
  public void ConfigureServices(IServiceCollection services){
    //....其他代码
    //需要添加的代码开始
    services.AddMvc().AddJsonOptions(option=>{
        //配置大小写问题，默认是首字母小写,该配置根据项目需要更改,我是怕忘了,所以写在这里
        //option.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
        //配置序列化时时间格式为时间戳
        option.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.MicrosoftDateFormat;
    })
    //需要添加的代码开始
 }
 ```

- 前端格式化时间格式代码
 ```js
 (function () {
 //日期扩展
 Date.prototype.format = function (fmt) {
     var o = {
         "M+": this.getMonth() + 1, //月份  
         "d+": this.getDate(), //日  
         "H+": this.getHours(), //小时  
         "m+": this.getMinutes(), //分  
         "s+": this.getSeconds(), //秒  
         "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
         "S": this.getMilliseconds() //毫秒  
     };
     if (/(y+)/.test(fmt))
         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
     for (var k in o) {
         if (o.hasOwnProperty(k)) {
             if (new RegExp("(" + k + ")").test(fmt))
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
         }
     }
     return fmt;
 };
 //字符串扩展
 String.prototype.getDate = function () {
     console.log(this)
     var res = /\d{13}/.exec(this);
     var date = new Date(parseInt(res));
     return date.format("yyyy-MM-dd HH:mm:ss");
 }
 })();
 ```

- 前端接收到后台的时间戳字符串后调用
 ``` js
 let timeString="1541243166"//该值应该为后台传过来的时间戳，为演示，这里指定固定值
 console.log(timeString.getDate();)//输出结果为：2018-11-03 19:06:06
 
 ```

### 后端更改为指定字符串格式如：yyyy-MM-dd HH-mm-ss
----------

- 打开Startup.cs文件，在ConfigureServices方法中添加如下代码
 ``` csharp
 public void ConfigureServices(IServiceCollection services
 {
   //....其他代码
   //需要添加的代码开始
   services.AddMvc().AddJsonOptions(option=>{
       //配置大小写问题，默认是首字母小写
       option.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
       //配置序列化时时间格式为yyyy-MM-dd HH:mm:ss
       option.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
   })
   //需要添加的代码开始
}
 ```
