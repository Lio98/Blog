---
title: 'Vs F12失效'
date: 2021-07-17
categories:
- "Csharp"
tags:
- 工具类
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
---

今天突然遇到VS2019的F12跳转到定义失效了，变成无规则的向下跳转几行。使用Visual Studio Install工具进行修复也没有效果，经过网上搜索，找到了一个解决方案

**使用管理员权限打开VS开发人员命令行**

**输入 devenv /ResetSettings 命令**

等待系统自动打开VS，然后就可以恢复了。
