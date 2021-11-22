---
title: 'Docker Swarm'
date: 2021-10-21
categories:
- "微服务"
tags:
- Docker
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## Docker 集群

### Docker Swarm

Swarm 是提供 Docker 容器集群服务，是 Docker 官方对容器云生态进行支持的核心方案。使用它，用户可以将多个 Docker 主机封装为单个大型的虚拟 Docker 主机，快速打造一套容器云平台

1. 初始化集群

``` bash
docker swarm init
```

2. 加入集群

```bash
docker swarm join --token
```

3. 离开集群，节点离开集群后，状态更改为Down，如果该节点是master，则删除整个集群。

```bash
docker swarm leave
docker swarm leave  -f
```

### Docker Service

应该说docker service是swarm(docker集群)最重要的管理指令，可以实现部署运行服务、服务扩容缩容、删除服务、滚动更新等功能。

在Swarm集群上部署服务，必须在Manager Node上进行操作。先说明一下Service、Task、Container（容器）这个三个概念的关系，如下图（出自Docker官网）非常清晰地描述了这个三个概念的含义：

![DockerSwarm](https://image.xjq.icu/2021/11/22/2021.11.22-DockerSwarm.jpg)

1. 创建服务 docker service create

``` bash
格式： docker service create [OPTIONS] IMAGE [COMMAND] [ARG...]

docker service create --name nginx-service nginx
```

2. 列出正在运行的服务

```bash
docker service ls

# 列出运行的详细信息
docker service ps nginx-service
```

3. 删除服务

``` bash
docker service rm
```

4. 查看服务的详细信息

``` bash
docker service inspect nginx-service
```

5. 更新服务开放一个端口

``` bash
docker service update --publish-add 7099:80 nginx-service
```

6. 查看服务日志

``` bash
docker service logs -f nginx-service
```

### Docker Service Scale

1. 增加实例

``` bash
docker service scale nginx-service=5
```

