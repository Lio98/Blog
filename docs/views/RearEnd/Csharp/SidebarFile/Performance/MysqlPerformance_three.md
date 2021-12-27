---
title: 'Mysql优化(三)'
date: 2021-12-26
categories:
- "DataBase"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: false
isShowDetailImg: true
---

## 分库分表

使用ShardingSphere-Proxy对mysql数据库进行分库分表

### 分表操作

1. 安装Mysql，[下载地址 ](https://downloads.mysql.com/archives/installer/)

2. 在mysql中创建seckillservices 库 和seckill表

```sql
CREATE TABLE `seckills` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`SeckillType` INT(11) NOT NULL,
	`SeckillName` CHAR(255) NULL,
	`SeckillUrl` CHAR(255) NULL,
	`SeckillPrice` DECIMAL(18,2) NOT NULL,
	`SeckillStock` INT(11) NOT NULL,
	`SeckillPercent` CHAR(255) NULL,
	`TimeId` INT(11) NOT NULL,
	`ProductId` INT(11) NOT NULL,
	`SeckillLimit` INT(11) NOT NULL,
	`SeckillDescription` CHAR(255) NULL,
	`SeckillIstop` INT(11) NOT NULL,
	`SeckillStatus` INT(11) NOT NULL,
	PRIMARY KEY (`Id`),
	INDEX `ProductId` (`ProductId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
; 
```

3. ShardingSphere-Proxy下载及依赖包

    - 因为此工具使用java语言的，所以需要下载jdk，[下载地址](https://www.oracle.com/cn/java/technologies/javase/javase-jdk8-downloads.html)

    - 下载mysql-connector-java-5.1.47.jar，[下载地址](https://repo1.maven.org/maven2/mysql/mysql-connector-java/)

    - 下载apache-shardingsphere-4.1.0-sharding-proxy，[官网地址](https://shardingsphere.apache.org/)，[下载地址](https://archive.apache.org/dist/shardingsphere/4.1.0/)，[文档地址](https://shardingsphere.apache.org/document/current/cn/user-manual/shardingsphere-proxy/usage/startup/)，[开发者文档地址](https://shardingsphere.apache.org/document/current/cn/dev-manual/)

4. 配置apache-shardingsphere-4.1.0-sharding-proxy

    - windows进入到sharding-proxy\apache-shardingsphere-4.1.0-sharding-proxy-bin\conf目录 

    - 配置config-sharding.yaml 
        ```yaml
        # 先配置数据源(用于连接Mysql数据库)
        dataSources: # 数据源配置，可配置多个
        seckills_0: # 与 ShardingSphere-JDBC 配置不同
        url: jdbc:mysql://127.0.0.1:3306/seckillservices?serverTimezone=UTC&useSSL=false 
        username: root
        password: root
        connectionTimeoutMilliseconds: 30000
        idleTimeoutMilliseconds: 60000
        maxLifetimeMilliseconds: 1800000
        maxPoolSize: 50 
        # 然后配置逻辑数据库(用户客户端直接连接)
        schemaName: seckillservices-proxy
        # 然后进行分表配置(seckills分成两张表，一张seckills_0，一张seckills_1) 
        shardingRule:
        tables: #表
            seckills: #逻辑表名
                actualDataNodes: productdatasources_0.seckills_${0..1} #分2张表
                tableStrategy: #分表策越
                    inline:
                        shardingColumn: ProductId #分表字段
                        algorithmExpression: seckills_${ProductId % 2} #对ProductId取模分表 
        ```
    
    - 配置server.yaml准备(身份认证)
    
        ```yaml
        # 先配置访问逻辑库的权限
        authentication:
            users:
                root:
                password: root
            sharding:
                password: sharding 
                authorizedSchemas: seckillservices-proxy 
        ```

5. 启动apache-shardingsphere-4.1.0-sharding-proxy

    - 进入bin目录下，通过cmd启动start.bat 3307 # 3307为端口号

    - 连接逻辑数据库，在逻辑数据库下创建表，会在真实数据库下分别创建2张表

### 分库操作

1. 在mysql中创建两个数据库seckillservices-1,seckillservices-2

2. 在config-sharding.yaml中创建两个数据源

    ```yaml
    dataSources:
        seckills-0:
            url: jdbc:mysql://127.0.0.1:3306/seckillservices-1?serverTimezone=UTC&useSSL=false
            username: root
            password: root
            connectionTimeoutMilliseconds: 30000
            idleTimeoutMilliseconds: 60000
            maxLifetimeMilliseconds: 1800000
            maxPoolSize: 50

    seckills-1:
        url: jdbc:mysql://127.0.0.1:3306/seckillservices-2?serverTimezone=UTC&useSSL=false
            username: root
            password: root
            connectionTimeoutMilliseconds: 30000
            idleTimeoutMilliseconds: 60000
            maxLifetimeMilliseconds: 1800000
            maxPoolSize: 50
    ```

3. 创建分库规则

    ```yaml
    shardingRule: #分片规则
        tables: #表
            seckills: #逻辑表名
                actualDataNodes: seckills-${0..1}.seckillservices #分2库2表
                #tableStrategy: #分表策越
                    #inline:
                        #shardingColumn: ProductId #分表字段
                        #algorithmExpression: seckillservices-${ProductId % 2} #对ProductId取模分表
                #keyGenerator:
                    #type: SNOWFLAKE #雪花算法生成唯一Id
                    #column: ProductId
        defaultDatabaseStrategy:
            inline:
                shardingColumn: Id #分库字段
                algorithmExpression: seckills-${Id % 2}  #对Id取模分库
    ```

### 分库分表操作

1. 先在mysql中创建两个库seckillservices-1,seckillservices-2

2. 在config-sharding.yaml中创建两个数据源

    ```yaml
    dataSources:
        seckills-0:
            url: jdbc:mysql://127.0.0.1:3306/seckillservices-1?serverTimezone=UTC&useSSL=false
            username: root
            password: root
            connectionTimeoutMilliseconds: 30000
            idleTimeoutMilliseconds: 60000
            maxLifetimeMilliseconds: 1800000
            maxPoolSize: 50

        seckills-1:
            url: jdbc:mysql://127.0.0.1:3306/seckillservices-2?serverTimezone=UTC&useSSL=false
                username: root
                password: root
                connectionTimeoutMilliseconds: 30000
                idleTimeoutMilliseconds: 60000
                maxLifetimeMilliseconds: 1800000
                maxPoolSize: 50
    ```

3. 创建分库规则

    ```yaml
    shardingRule: #分片规则
        tables: #表
            seckills: #逻辑表名
                actualDataNodes: seckills-${0..1}.seckillservices-${0..1} #分2库2表
                tableStrategy: #分表策越
                    inline:
                        shardingColumn: ProductId #分表字段
                        algorithmExpression: seckillservices-${ProductId % 2} #对ProductId取模分表
                keyGenerator:
                    type: SNOWFLAKE #雪花算法生成唯一Id
                    column: ProductId
        defaultDatabaseStrategy:
            inline:
                shardingColumn: Id #分库字段
                algorithmExpression: seckills-${Id % 2}  #对Id取模分库
    ```

4. 重启apache-shardingsphere-4.1.0-sharding-proxy，连接逻辑库

    - 在逻辑库下seckillservices-proxy下创建seckillservices表，会在2张真实数据库下分别创建2张seckillservices-0和seckillservices-1表

    - 然后分别在2张真实数据库表下分别添加数据，查看2张真实数据库表

### 分库分表扩展

1. ShardingSphere-Proxy数据基于字符串字段分库分表。工具：ModShardingAlgorithm 基于取模的分片算法

2. ShardingSphere-Proxy数据基于时间字段分库分表。工具：FixedIntervalShardingAlgorithm 基于固定时间范围的分片算法

3. ShardingSphere-Proxy数据基于可变时间字段分库分表。工具：MutableIntervalShardingAlgorithm 基于可变时间范围的分片算法

4. ShardingSphere-Proxy数据基于国定容量分库分表。工具：MutableIntervalShardingAlgorithm 基于可变时间范围的分片算法

## 读写分离