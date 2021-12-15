---
title: 'DockerFile配置'
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

## Dockerfile的指令

FROM：指定基础镜像（FROM是必备的指令，并且必须为第一条指令）。

RUN: 用来执行命令行命令。其基本格式：

	shell格式： RUN  <命令>  ，输入在bash环境中的命令即可，一个dockerfile允许使用RUN不得超过127层，所以，使用一次RUN， 使用 ‘ \ ’ 换行，使用‘ && ’执行下一条命令。一般使用此种格式；

	exec格式： RUN  <"可执行文件", "参数1", "参数2">，此种方式像是函数调用中的格式；

COPY:  复制文件。 其基本格式：

	格式1：COPY <源路径>...<目标路径>

    格式2：COPY [“<源路径1>”,....."<目标路径>"]

ADD: 更高级的复制文件，在COPY的基础上增加了一些功能，如果复制的是压缩包的话，会直接解压，而不需要在使用RUN解压；

CMD：容器启动命令。其基本格式：

	shell格式： CMD <命令>

    exec格式： CMD ["可执行文件", "参数1", "参数2"...]

    参数列表格式： CMD [“参数1”, “参数2”...]，在指定了ENTRYPOINT指令后，用CMD指定具体的参数

ENTRYPOINT: 入口点。其基本格式分为exec和shell，ENTRYPOINT的目的和CMD一样，都是在指定容器启动程序及参数。ENTRYPOINT在运行中可以替代，不过比CMD繁琐，需要通过docker run 的参数--entrypoint 来指定。当指定了ENTRYPOINT后，CMD的含义就发生了改变，不在是直接运行其命令，而是将CMD的内容作为参数传递给ENTRYPOINT指令。其执行时就变成了： \<ENTRYPOINT\> "\<CMD\>"

ENV： 设置环境变量。（都可以使用这里使用的变量）其基本格式：

    格式1：ENV <key> <value>

    格式2：ENV <key1>=<value1> <key2>=<value>...

ARG: 构建参数。构建参数和ENV的效果一样，都是设置环境变量，所不同的是ARG所构建的环境变量在将来容器运行时是不存在的。其基本格式：

    格式1： ARG <参数名> [=<默认值>]

    格式2： 该默认值可以在构建命令 docker build  中用 --build-arg <参数名>=<值> 来覆盖

VOLUME: 定义匿名卷。 其基本格式：

    格式1： VOLUME ["<路径1>", "<路径2>"...]

    格式2： VOLUME <路径>

EXPOSE:  暴露端口。EXPOSE指令是声明运行时容器所提供的端口，在启动容器时不会在因为这个声明而开启端口。 其基本格式：

    格式1： EXPOSE <端口1> [<端口2>...]

WORKDIR： 指定工作目录。其基本格式：

    格式1： WORKDIR <工作目录路径>

USER： 指定当前用户。USER是帮助你切换到指定用户。 其基本格式：

    格式1： USER <用户名>

HEALTCHECK： 健康检查，判断容器的状态是否正常。 其基本格式：

    格式1： HEALTCHECK [选项] CMD <命令> ：设置检查容器健康状况的命令

    格式2： HEALTCHECK NONE： 如果基础镜像有健康检查指令，使用此格式可以屏蔽掉其健康检查指令

## Dockerfile核心命令

1、FROM 指定基础镜像构建 

    写法：FROM 指定基础镜像

2、COPY 复制命令。从上下文目录中复制文件或者目录到容器里指定路径。

    写法：

    COPY 源路径，目标路径

    COPY ["源路径"，"目标路径"]	

3、RUN运行指令。构建的时候运行的指令

    主要在于镜像构建的时候运行，运行build命令的时候 

	后面接的命令就是shell输入的命令

	写法

	RUN  shell命令 参数1 参数2

	RUN ["shell命令 ","参数1"," 参数2"]

	例如：

	RUN ["echo",">"," /usr/share/index.html"]

4、CMD运行指令。运行容器时候运行的指令

    主要在于镜像运行容器的时候生成，运行run的时候运行

	写法

	CMD <shell 命令> 
	CMD ["<可执行文件或命令>","<param1>","<param2>",...] 

	例如：

	CMD ["dotnet","rmcore.dll"]

	缺点：在run 命令后面可以进行覆盖

	docker run -d -P  rmcore dotnet rmcore.dll 进行覆盖掉

5、ENTRYPOINT运行指令。运行容器时候运行的指令(不会被覆盖)

    写法

	ENTRYPOINT ["<executeable>","<param1>","<param2>",...]

	可以和CMD动态结合，设置动态的配置参数

	例如 

	ENTRYPOINT ["nginx", "-c"] 定参

	CMD ["/etc/nginx/nginx.conf"]变参

6、EXPOSE暴露端口指令

    仅仅声明端口，就是指定镜像暴露的端口

	在run 的时候，通过docker run -p 会自动随机映射到EXPOSE端口

	写法

	EXPOSE 端口

	EXPOSE 端口

	例如 

	EXPOSE 5000

	EXPOSE 5001

7、WORKDIR工作目录指令

    用于应用在容器内的工作目录，就好比:ruanmou目录
	
	写法

	WORKDIR <工作目录路径>

	例如

	WORKDIR /rmcore

	或者

	WORKDIR /nginx
