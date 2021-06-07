---
title: 'Linux命令'
date: 2021-06-07
categories:
- "CentOS"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## ls

- ls -a：查看隐藏文件

- ls -l：查看详细信息

- ls -d：查看某个目录的详细信息

- ls -h：文件大小以单位表示出来，常与-l搭配使用

- ls -i：查看 i 节点

## 文件权限

- 文件类型（- 表示二进制文件  d 表示目录 l 表示软链接二文件）

- u 所有者  g 所属组  o 其他人

- r 读  w 写   x 可执行

## 目录处理命令

###  mkdir：创建一个目录

- mkdir -p /tmp/japan/xxx：加上-p可递归创建

### pwd：显示当前所在的工作目录

### rmdir：删除空目录

### cp：复制

- cp -rp [原文件或目录] [目标目录]

- -r：复制目录

- -p：保留文件属性


### mv：剪切文件、改名 

- mv [原文件或目录] [目标目录]

### rm：删除文件

- rm -rf：[文件或目录]

## 文件处理命令

### touch：创建空文件

### cat：查询或浏览一个文件

- cat -n：可以显示行号

### tac：反向列示

### more：分页显示文件内容

- more [文件名]

- （空格）或f：翻页

- （Enter）：换行

- q或Q：退出

### less：分页显示文件内容（可向上翻页）

- less [文件名]

- 按Pgup可向上翻页，上箭头向上换行

- 可以搜索，输入/和要搜索的内容，按n可向下搜索

## head：显示文件前几行

- head -n *（几行） [文件名]  eg：head -n 7 /etc/services

## tail：显示文件末尾几行

- -f：动态显示文件末尾内容