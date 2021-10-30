---
title: 'abp基础'
date: 2021-07-17
categories:
- "Csharp"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: false
isShowIndex: false
---

## 概述

ABP是一套开源的基于ASP NET CORE，实现了大部分DDD思想的框架。

## ABP启动

ABP启动模块是最后一个加载

1. 注册ABP基础设施与核心服务

2. 加载整个应用的所有模块，按照依赖性进行排序

3. 按顺序遍历所有模块，执行每一个模块的配置方法（3个）

    - 模块配置生命周期

        (1). PreConfigureServices()

        (2). ConfigureServices()

        (3). PostConfigureServices()

4. 按顺序遍历所有模块，执行每一个模块的初始化方法