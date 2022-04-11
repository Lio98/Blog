---
title: 'CentOS安装Nginx'
date: 2021-10-06
categories:
- "CentOS"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 安装

1. 安装 nginx需要工具：yum -y install gcc make pcre-devel zlib-devel tar zlib

2. 下载nginx：wget  http://nginx.org/download/nginx-1.15.2.tar.gz

3. nginx解压/nginx目录：tar -zxvf  nginx-1.15.2.tar.gz

4. 切换到/nginx/nginx-1.15.2：执行./configure，执行make，make install 进行安装

5. 切换到/usr/local/nginx/sbin：执行 ./nginx 启动nginx

## 启动Nginx

在 /usr/local/nginx/sbin目录下 :

1. 停止

``` bash
./nginx -s stop
```

2. 重启

``` bash
./nginx -s reload
```

有时候执行重启命令会发生以下错误

![NginxError](https://image.xjq.icu/2021/11/22/2021.11.22-NginxError.jpg)

解决办法，执行以下语句即可修复，使用nginx-c参数指定nginx.conf文件的位置

```bash
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

还有一种可能就是nginx.conf的nginx.pid被注释了,将下图中pid前的#去掉,保存退出再次启动nginx
```

此时去logs目录下查看发现nginx.pid文件已经生成了

## 查看进程

``` bash
ps -ef | grep nginx

pkill nginx  #删除nginx进程
```


## windows下启用nginx

在windows下启动nginx报错80端口被占用，通过命令查看被哪个进程占用

```bash
netstat -navo|find /i "listen"|find /i ":80"
```

发现是system占用，右键属性看详情是ntoskrnl.exe，在服务里找到对应的服务停止掉它

![](https://image.xjq.icu/2022/4/4/1649041583574_pid.jpg)
![](https://image.xjq.icu/2022/4/4/1649041592333_worldwideweb.jpg)