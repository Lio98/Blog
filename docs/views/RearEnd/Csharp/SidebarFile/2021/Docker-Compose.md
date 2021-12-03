---
title: 'Docker-Compose'
date: 2021-10-16
categories:
- "Csharp"
tags:
- Docker
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 安装

linux上我们可以从github上下载它的二进制包来使用，最新发行的版本地址：https://github.com/docker/compose/releases。

1. 运行以下命令可以下载docker compose的当前稳定版本：

``` bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

要安装其他版本的compose，需要替换1.21.1

2. 给二进制文件添加可执行权限:

```bash
$ sudo chmod +x /usr/local/bin/docker-compose
```

3. 创建软链接:

```bash
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

4. 测试是否安装成功

```bash
$ docker-compose --version
```

**注意**：对于alpine，需要安装以下依赖包：py-pip，python-dev，libffi-dev，openssl-dev，gcc，libc-dev，和 make。

## 使用

### 创建docker-compose.yml

```yaml
version: '3'
services:
 ltcore:
  build: /tmp/lttmp/aspnetproject/aspnetcoredocker
  ports:
   - 6066:80
   - 6067:443
  networks:
   - lt-micro
 ltnginx:
  build: ../nginx
  ports:
   - 6068:80
  networks:
   - lt-micro
  volumes:
   - ./nginx.conf:/usr/local/nginx/conf/nginx.conf
networks:
 lt-micro:
  external: true
```

该文件中定义了两个服务，一个ltcore,一个ltnginx，使用了同一个为lt-micro的网络。

### docker compose命令

1. 删除容器

```bash
docker-compose -f docker-compose.yml  down
```

2. 创建并启动容器

在后台执行该服务可以加上 -d 参数

``` bash
docker-compose -f docker-compose.yml up -d
```