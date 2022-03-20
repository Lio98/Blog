---
title: 'RabbitMQ 启动成功，却无法访问15672'
date: 2021-08-18
categories:
- "Csharp"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 场景

RabbitMQ需要依赖于otp_win64，所以安装RabbitMQ之前需要安装otp_win64,[下载地址](https://www.erlang.org/downloads) 

在学习RabbitMQ的时候,所以在配置RabbitMQ时出现了问题(中间陆陆续续也出现过Erlang与RabbitMQ版本的不对应而导致的问题）

## 问题

RabbitMQ启动成功了，却无法访问15672，翻遍了网上所有的资源,什么说法都有,最后问题还是解决了,这次记录一下解决问题的方法

## 原因分析

- Rabbit MQ 安装路径不可以有中文

- Rabbit MQ 安装路径不可以有空格（我就是因为这个问题）

我的问题是无法访问 http://localhost:15672/ 管理界面
一般出现这个问题有两种情况

没有安装插件,只需安装一下即可
输入命令:rabbitmq-plugins enable rabbitmq_management

然后执行 rabbitmq_server

最后我们就可以正常的访问 http://localhost:15672/







