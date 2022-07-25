---
title: 'IIS发布报错500.19'
date: 2022-07-24
categories:
- "Csharp"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

最近创建了一个net5.0的项目，今天发布到IIS遇到了HTTP错误500.19，然而开发环境是正常运行的，通过网上百度解决后整理了一下解决方法。

- 首先，报错信息如下图所示
  ![](https://image.xjq.icu/2022/7/24/1658647874004_IISError.jpg)

- [查看官方文档](https://docs.microsoft.com/zh-CN/troubleshoot/developer/webapps/iis/health-diagnostic-performance/http-error-500-19-webpage)，对比错误代码看，是配置文件或者IIS Url重写模块的原因。
![](https://image.xjq.icu/2022/7/24/1658647878026_IIS500.jpg)

- 那么就是安装IIS URL重写相关模块，[URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)。
![](https://image.xjq.icu/2022/7/24/1658647884198_IISUrlRewrite.jpg)

- 安装完成后重启IIS，发现还是同样的错误，经过排查，最终发现是IIS的【模块】没有安装，开发环境装了SDK，之前记得是包含Runtime的，但是莫名奇妙模块还是为空，确实安装Runtime之后就有模块了。根据dotnet --info查看自己net的版本是5.0.17，那么就安装5.0.17的Runtime。[下载地址](https://dotnet.microsoft.com/en-us/download/dotnet/5.0)
![](https://image.xjq.icu/2022/7/24/1658647967771_Runtime.jpg)

- 安装完成后重启IIS，这下发布的项目就正常运行了。
