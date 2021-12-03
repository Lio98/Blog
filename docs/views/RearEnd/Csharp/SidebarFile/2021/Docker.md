---
title: 'Docker安装'
date: 2021-10-15
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

## Docker安装

### window 安装

条件：
- window 10

- 开启Hyper-V

- 安装Toolbox  最新版 Toolbox 下载地址： https://www.docker.com/get-docker；点击 Download Desktop and Take a Tutorial，并下载 Windows 的版本

### linux 安装

1、 centos7.0以上的版本

2、 安装docker版本仓库

    1.1、设置仓库 : sudo yum install -y yum-utils device-mapper-persistent-data lvm2	
    
    1.2、稳定仓库 : sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo 

3、 安装docker(默认安装最新版本): sudo yum install docker-ce docker-ce-cli containerd.io

::: tip 安装其他版本

要安装特定版本的 Docker Engine-Community，请在存储库中列出可用版本，然后选择并安装：

- 列出并排序您存储库中可用的版本。此示例按版本号（从高到低）对结果进行排序。

yum list docker-ce --showduplicates | sort -r

docker-ce.x86_64  3:18.09.1-3.el7                     docker-ce-stable

docker-ce.x86_64  3:18.09.0-3.el7                     docker-ce-stable

docker-ce.x86_64  18.06.1.ce-3.el7                    docker-ce-stable

docker-ce.x86_64  18.06.0.ce-3.el7                    docker-ce-stable

通过其完整的软件包名称安装特定版本，该软件包名称是软件包名称（docker-ce）加上版本字符串（第二列），从第一个冒号（:）一直到第一个连字符，并用连字符（-）分隔。例如：docker-ce-18.09.1。

sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io -->
:::

4、启动docker： sudo systemctl start docker

5、运行docker(判断docker是否安装成功)：sudo docker run hello-world

## Docker 管理命令介绍

|命令                               |功能                                   |
|:---------------------------------:|:-------------------------------------:|
|builder                            | Manage builds 管理构建                 |
|config                             |Manage Docker configs 管理配置         | 
|container                          |Manage containers 管理容器|
|context                            |Manage contexts 管理上下文|
|engine                             |Manage the docker engine 管理引擎|
|image                              |Manage images 管理镜像|
|network                            |Manage networks 管理网络|
|node                               |Manage Swarm nodes 管理节点(集群)|
|plugin                             |Manage plugins 管理插件|
|secret                             |Manage Docker secrets 管理密钥|
|service                            |Manage services 管理服务|
|stack                              |Manage Docker stacks 管理|
|swarm                              |Manage Swarm 管理集群|
|system                             |Manage Docker管理系统|
|trust                              |Manage trust on Docker images 管理信任|
|volume                             |Manage volumes 管理数据挂载(数据持久化 === 永久保存)|

常用命令

```bash
docker images：查看所有镜像

docker search：查找镜像

docker pull：下载镜像

docker build：构建镜像

docker rmi：删除镜像

docker ps -a:查看仓库
```

## Docker上部署aspnetcore

条件

1、vs2019 asp.net core项目

2、Dockerfile文件

3、mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim 镜像

4、mcr.microsoft.com/dotnet/core/sdk:3.1-buster镜像

## 容器

1. 进入容器

```bash
docker exec -it eded549aef1a /bin/bash

# eded549aef1a为容器ID
```

2. 退出容器

``` bash
exit
```