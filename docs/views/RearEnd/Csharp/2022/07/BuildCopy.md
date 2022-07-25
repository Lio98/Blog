---
title: 'VS编译后将程序集复制到其他文件夹'
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


有时候需要在代码编译之后将程序集复制到其他文件夹，命令如下

```bash
copy "$(ProjectDir)bin\Debug\net5.0\DbTest.dll" "$(ProjectDir)bin\Release\net5.0\publish\DbTest.dll"  /y
```

![](https://image.xjq.icu/2022/7/24/1658647881188_BuildCopy.jpg)