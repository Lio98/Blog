---
title: '【学习笔记】上传文件'
date: 2020-08-16
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: auto
isFull: true
isShowComments: true
isShowIndex: true
---

:::tip
后台经常遇到上传文件的情况

工作初期遇到这种问题无从下手

记录一下之前写的代码部分
:::
<!-- more -->

## .net farmework上传文件
----------

 ```csharp
 public async Task<JsonResult> UploadFile()
 {
     try
     {
         string rootPath = Server.MapPath("/");
         HttpPostedFileBase file = Request.Files[0];
         if (file.ContentLength > 0)
         {
             string newFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(file.FileName);
             string fullpath = rootPath  + "FileUpload" + "\\" + newFileName;
             if (!Directory.Exists(rootPath + "FileUpload"))
             {
                 Directory.CreateDirectory(rootPath  + "FileUpload");
             }

             file.SaveAs(fullpath);
             log.Debug("UploadFile 上传文件成功！地址：" + fullpath);
             return Json(new
             {
                 status = "success",
                 message = fullpath,
                 date = DateTime.Now.ToString("yyyy-MM-dd")
             });
         }
         return Json(new
         {
             status = "fail",
             message = "文件大小为空",
             date = DateTime.Now.ToString("yyyy-MM-dd")
         });
     }
     catch (Exception ex)
     {
         return Json(new
         {
             status = "fail",
             message = ex.Message,
             date = DateTime.Now.ToString("yyyy-MM-dd")
         });
     }

     //foreach (string fileName in Request.Files)
     //{
     //    HttpPostedFileBase file = Request.Files[fileName];

     //    log.Debug($"传入文件信息====文件名称：{file.FileName}====文件内容：{file.ContentLength}");

     //    if (file.ContentLength > 0)
     //    {
     //        string newFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(file.FileName);
     //        string fullpath = rootPath + "\\" + "FileUpload" + "\\" + newFileName;
     //        if (!Directory.Exists(rootPath + "\\" + "FileUpload"))
     //        {
     //            Directory.CreateDirectory(rootPath + "\\" + "FileUpload");
     //        }

     //        file.SaveAs(fullpath);
     //    }
     //}
 }
 ```


## .net core上传文件
----------------
 ```csharp
 using System;
 using System.Collections.Generic;
 using System.IO;
 using System.Linq;
 using System.Net.Http.Headers;
 using System.Threading.Tasks;
 using Microsoft.AspNetCore.Hosting;
 using Microsoft.AspNetCore.Http;
 using Microsoft.AspNetCore.Mvc;
 using Microsoft.Extensions.Logging;
 using NPOI.SS.Formula.Functions;
 using YH.ASM.DataAccess;
 using YH.ASM.Entites.CodeGenerator;
 
 namespace YH.ASM.Web.WebApi
 {
     [Route("api/[controller]")]
     [ApiController]
     public class UploadController : ControllerBase.ComControllerBase
     {
         private readonly IWebHostEnvironment _hostingEnvironment;
         private readonly ILogger<UploadController> logger;
 
         public UploadController(IWebHostEnvironment hostingEnvironment, ILogger<UploadController> _logger)
         {
             _hostingEnvironment = hostingEnvironment;
             logger = _logger;
         }
 
 
         [HttpPost("UploadFile")]
         public IActionResult UploadFile(string SigningKey)
         {
 
             string userid= Request.Form["userid"].ToString();
 
             TASM_ATTACHMENTManager manager = new TASM_ATTACHMENTManager();
 
             try
             {
 
                 this.logger.LogInformation("LogInformation:开始上传文件");
 
                 #region
 
                 var path = "/FileUpload/Support/" + userid + "/";
                 var files = Request.Form.Files;
 
                 if (files.Count <= 0)
                 {
                     return FailMessage("请选择要上传的文件");
                 }
 
                 var file = files[0];
 
 
                 var filename = ContentDispositionHeaderValue
                                 .Parse(file.ContentDisposition)
                                 .FileName
                                 .Trim('"');
                 string fileExt = Path.GetExtension(file.FileName);
 
 
                 string newFileName =  DateTime.Now.ToString("yyyyMMddHHmmss") + fileExt;
 
 
                 string filepath = path + newFileName;
                 string fullpath = _hostingEnvironment.WebRootPath + $@"\{filepath}";
 
                 string dirpath = _hostingEnvironment.WebRootPath + path;
 
 
 
                 if (!Directory.Exists(dirpath))
                 {
                     Directory.CreateDirectory(dirpath);
                 }
 
 
                 using (FileStream fs = System.IO.File.Create(fullpath))
                 {
                     file.CopyTo(fs);
                     fs.Flush();
                 }
                 path = "/FileUpload/Support/" + userid + "/" + newFileName;
 
 
 
                 #endregion
 
                 TASM_ATTACHMENT model = new TASM_ATTACHMENT();
 
                 model.FILENAME = newFileName;
                 model.URL = path;
                 model.TYPE = 1;
 
 
 
                 manager.Db.BeginTran();
 
                 var newid = manager.Db.Insertable(model).ExecuteReturnIdentity();
 
                 manager.Db.CommitTran();
 
 
 
                 var json =  new  { ID = newid, FILENAME = newFileName, URL = path };
 
                 return SuccessResult(json);
 
             }
             catch (Exception e)
             {
                 manager.Db.RollbackTran();
                 logger.LogInformation("异常：" + e);
                 return FailMessage(e.ToString());
             }
 
         }
 
 
         [HttpPost("UploadFileBySid")]
         public IActionResult UploadFileBySid(string SigningKey)
         {
 
             string userid = Request.Form["userid"].ToString();
             int  sid =int.Parse( Request.Form["sid"].ToString());
 
             TASM_ATTACHMENTManager manager = new TASM_ATTACHMENTManager();
 
             try
             {
 
                 this.logger.LogInformation("LogInformation:开始上传文件");
 
                 #region
 
                 var path = "/FileUpload/Support/" + userid + "/";
                 var files = Request.Form.Files;
 
                 if (files.Count <= 0)
                 {
                     return FailMessage("请选择要上传的文件");
                 }
 
                 var file = files[0];
 
 
                 var filename = ContentDispositionHeaderValue
                                 .Parse(file.ContentDisposition)
                                 .FileName
                                 .Trim('"');
                 string fileExt = Path.GetExtension(file.FileName);
 
 
                 string newFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + fileExt;
 
 
                 string filepath = path + newFileName;
                 string fullpath = _hostingEnvironment.WebRootPath + $@"\{filepath}";
 
                 string dirpath = _hostingEnvironment.WebRootPath + path;
 
 
 
                 if (!Directory.Exists(dirpath))
                 {
                     Directory.CreateDirectory(dirpath);
                 }
 
 
                 using (FileStream fs = System.IO.File.Create(fullpath))
                 {
                     file.CopyTo(fs);
                     fs.Flush();
                 }
                 path = "/FileUpload/Support/" + userid + "/" + newFileName;
 
 
 
                 #endregion
 
                 TASM_ATTACHMENT model = new TASM_ATTACHMENT();
 
                 model.FILENAME = newFileName;
                 model.URL = path;
                 model.TYPE = 1;
                 model.PID = sid;
 
 
                 manager.Db.BeginTran();
 
                 var newid = manager.Db.Insertable(model).ExecuteReturnIdentity();
 
                 manager.Db.CommitTran();
 
 
 
                 var json = new { ID = newid, FILENAME = newFileName, URL = path };
 
                 return SuccessResult(json);
 
             }
             catch (Exception e)
             {
                 manager.Db.RollbackTran();
                 logger.LogInformation("异常：" + e);
                 return FailMessage(e.ToString());
             }
 
         }
 
     }
 }
 ```