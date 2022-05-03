---
title: 'MySQL主从同步搭建'
date: 2022-05-02
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: false
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 准备

- 主库与从库数据库版本最好一致

- 主从数据库内数据保持一致，若不一致，可将从库中所有数据删除，并将主库数据全部导入从库

主库：127.0.0.1:3308

从库：127.0.0.1:3309

从库：127.0.0.1:3310

## 操作

### 主库操作

- 进入my.ini文件

    ```
    [mysqld]
    #开启二进制日志
    log-bin=mysql-bin 

    #设置server-id，和从不能一样
    server-id=1 
    ```

- 重启mysql服务

- 登录主库，创建用户并授权

    ```
    CREATE USER 'ltmaster'@'127.0.0.1' IDENTIFIED BY 'Lt863370814..';
    ```

- 分配权限

    ```
    GRANT REPLICATION SLAVE ON *.* TO 'ltmaster'@'127.0.0.1';
    flush privileges;
    ```

- 锁表，禁止写入

    ```
    flush table with read lock;
    ```

- 查看master状态

    ```
    show master status;
    ```
    ![](https://image.xjq.icu/2022/5/2/1651433916324_masterstatus.jpg)

- 将数据导出，命令一直报错，只能用工具将其导出了

- 解锁查看binlog日志 位置，没有变化代表锁定成功，从库将从这个binlog位置开始恢复

    ```
    unlock table;
    ```

### 从库操作

#### 3309

- 导入数据，还是使用工具进行导入

- 修改my.ini文件

    ```
    [mysqld]
    #设置server-id，必须唯一
    server-id=2 
    ```

- 重启mysql服务

- 配置同步

    ```
    CHANGE MASTER TO MASTER_HOST='127.0.0.1',MASTER_PORT=3308, MASTER_USER='ltmaster', MASTER_PASSWORD='Lt863370814..', MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=2895;

    # 开启从库
    start slave;
    ```

- 查看slave状态

    ```
    show slave status
    ```
    ![](https://image.xjq.icu/2022/5/2/1651433920584_slavestate.jpg)

#### 3310

- 导入数据，还是使用工具进行导入

- 修改my.ini文件

    ```
    [mysqld]
    #设置server-id，必须唯一
    server-id=3 
    ```

- 重启mysql服务

- 配置同步

    ```
    CHANGE MASTER TO MASTER_HOST='127.0.0.1',MASTER_PORT=3308, MASTER_USER='ltmaster', MASTER_PASSWORD='Lt863370814..', MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=2895;

    # 开启从库
    start slave;
    ```

- 查看slave状态

    ```
    show slave status
    ```

### 重置从库

- 停止已启动的绑定

    ```
    stop slave
    ```

- 重置绑定

    ```
    reset master
    ```

- 执行绑定主库的命令
