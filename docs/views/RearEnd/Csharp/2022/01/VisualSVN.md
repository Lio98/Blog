---
title: 'VisualSvn下载及破解'
date: 2022-01-02
categories:
- "Csharp"
tags:
- 工具问题
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## VisualSvn 下载

VisualSvn是Visual Studio 中svn的插件。[下载](https://www.visualsvn.com/visualsvn/download/)自己Visual Studio 对应版本的插件即可 

![](https://image.xjq.icu/2022/1/2/1641097059572_visualsvnDol.jpg)

## VisualSvn破解

此过程需要反编译修改VisualSVN.Core.L.dll程序集，故需要反编译工具dnSpy。[下载](https://github.com/dnSpy/dnSpy/releases)

找到插件的安装位置，一般在用户目录下，如下：

![安装位置](https://image.xjq.icu/2022/1/2/1641096353405_visualsvn.jpg)

需要修改的文件位置

![修改程序集](https://image.xjq.icu/2022/1/2/1641096464078_visualsvn2.jpg)