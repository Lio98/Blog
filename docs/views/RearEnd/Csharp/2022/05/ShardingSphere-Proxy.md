---
title: 'ShardingSphere-Proxy使用'
date: 2022-05-04
categories:
- "Csharp"
tags:
- MicroService
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## ShardingSphere-Proxy

ShardingSphere-Proxy是跨语言的数据库代理服务端，主要目的：对数据库实现分库分表和读写分离。

### 为什么使用

一个表的能够存储的容量是有限的，如果超过了一定的数据量，表的处理数据的性能就会下降，是因为表是通过InnoDB来处理数据的，InnoDB通过B+树结构来进行存储，如果超过了一定的阀值，就会导致一张表性能下降。

## 实践落地

### 环境

- jdk。[下载地址](https://www.oracle.com/cn/java/technologies/javase/javase-jdk8-downloads.html)

- apache-shardingsphere-5.1.0-shardingsphere-proxy。[官网地址](https://shardingsphere.apache.org/)，[下载地址](https://archive.apache.org/dist/shardingsphere/5.1.0/)，[文档地址](https://shardingsphere.apache.org/document/current/cn/user-manual/shardingsphere-proxy/usage/startup/)，[开发者文档地址](https://shardingsphere.apache.org/document/current/cn/dev-manual/)

- 下载mysql-connector-java-****.jar，拷贝到 lib 目录下。[下载地址](https://downloads.mysql.com/archives/c-j/)

### 配置文件

1. server.yaml中放开rules
![](https://image.xjq.icu/2022/5/4/1651677153795_shardingsphere.jpg)

2. config-sharding.yaml

```yaml
#逻辑库名
schemaName: ebusiness

dataSources:
  #读写分离
  productdatasources_0:
    url: jdbc:mysql://127.0.0.1:3308/ebusiness_product?serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
  productdatasources_0_read0:
    url: jdbc:mysql://127.0.0.1:3309/ebusiness_product?serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
  productdatasources_0_read1:
    url: jdbc:mysql://127.0.0.1:3310/ebusiness_product?serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
  #分库分表读写分离
  productddata_0:
    url: jdbc:mysql://localhost:3308/ebusiness_0?serverTimezone=UTC&useSSL=false
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1 
  productddata_0_read0:
    url: jdbc:mysql://localhost:3309/ebusiness_0?serverTimezone=UTC&useSSL=false
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1 
  productddata_0_read1:
    url: jdbc:mysql://localhost:3310/ebusiness_0?serverTimezone=UTC&useSSL=false
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
  productddata_1:
    url: jdbc:mysql://localhost:3308/ebusiness_1?serverTimezone=UTC&useSSL=false
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1 
  productddata_1_read0:
    url: jdbc:mysql://localhost:3309/ebusiness_1?serverTimezone=UTC&useSSL=false
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1 
  productddata_1_read1:
    url: jdbc:mysql://localhost:3310/ebusiness_1?serverTimezone=UTC&useSSL=false
    username: root
    password: Lt863370814..
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
#  ds_1:
#    url: jdbc:mysql://127.0.0.1:3306/demo_ds_1?serverTimezone=UTC&useSSL=false
#    username: root
#    password: Lt863370814..
#    connectionTimeoutMilliseconds: 30000
#    idleTimeoutMilliseconds: 60000
#    maxLifetimeMilliseconds: 1800000
#    maxPoolSize: 50
#    minPoolSize: 1
#
rules:
- !READWRITE_SPLITTING
  dataSources:
    readwrite_ds:
      type: Static
      props:
        write-data-source-name: productdatasources_0
        read-data-source-names: productdatasources_0_read0,productdatasources_0_read1
      loadBalancerName: loadBalancer_ROUND_ROBIN
    readwrite_ds1:
      type: Static
      props:
        write-data-source-name: productddata_0
        read-data-source-names: productddata_0_read0,productddata_0_read1
      loadBalancerName: loadBalancer_ROUND_ROBIN
    readwrite_ds2:
      type: Static
      props:
        write-data-source-name: productddata_1
        read-data-source-names: productddata_1_read0,productddata_1_read1
      loadBalancerName: loadBalancer_ROUND_ROBIN
  # 负载均衡算法配置
  loadBalancers:
    loadBalancer_ROUND_ROBIN: # 负载均衡算法名称
#      type: ROUND_ROBIN
       #随机访问算法
       type: RANDOM
#      props: # 负载均衡算法属性配置
        # ...
- !SHARDING
  tables:
    productinfo:
      actualDataNodes: productdatasources_0.productinfo_${0..1}
      tableStrategy:
        standard:
          shardingColumn: ProductId
          shardingAlgorithmName: Product_MOD
    product:
      actualDataNodes: productddata_${0..1}.product_${0..1}
      #分表
      tableStrategy:
        standard:
          shardingColumn: ProductId
          shardingAlgorithmName: Product_MOD
      #分库
      databaseStrategy:
        standard:
          shardingColumn: ProductId
          shardingAlgorithmName: Product_MOD
      #主键生成
      keyGenerateStrategy:
        column: Id
        keyGeneratorName: snowflake
    productimage:
      actualDataNodes: productddata_${0..1}.productimage_${0..1}
      tableStrategy:
        standard:
          shardingColumn: ProductId
          shardingAlgorithmName: Product_MOD
      databaseStrategy:
        standard:
          shardingColumn: ProductId
          shardingAlgorithmName: Product_MOD
      keyGenerateStrategy:
        column: Id
        keyGeneratorName: snowflake
  #绑定表：分片规则一致的主表和子表
  bindingTables:
    - product,productimage
#  defaultDatabaseStrategy:
#    standard:
#      shardingColumn: user_id
#      shardingAlgorithmName: database_inline
  defaultTableStrategy:
    none: 
  shardingAlgorithms:
    Product_MOD:
      type: MOD
      props:
        sharding-count: 2
    product_HASH_MOD:
      type: HASH_MOD
      props:
        sharding-count: '2'
    product_BOUNDARY_RANGE:
      type: BOUNDARY_RANGE
      props:
        sharding-ranges: 2,5
    product_VOLUME_RANGE:
      type: VOLUME_RANGE
      props:
        range-lower: '5'
        range-upper: '10'
        # 分片的区间的数据的间隔
        sharding-volume: '5'
    product_AUTO_INTERVAL:
      type: AUTO_INTERVAL
      props:
        datetime-lower: '2022-01-01 23:59:59'
        datetime-upper: '2022-01-02 23:59:59'
        # 以1年度为单位进行划分
        sharding-seconds: '31536000'  
        # 以1个月为单位进行划分
        #sharding-seconds: '2678400'   
        # 以1天为单位进行划分
        #sharding-seconds: '86400' 
#    t_order_inline:
#      type: INLINE
#      props:
#        algorithm-expression: t_order_${order_id % 2}
#    t_order_item_inline:
#      type: INLINE
#      props:
#        algorithm-expression: t_order_item_${order_id % 2}
#  
  keyGenerators:
    snowflake:
      type: SNOWFLAKE
      props:
        worker-id: 123
```

