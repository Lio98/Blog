---
title: 'Mysql优化(二)'
date: 2021-12-20
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

## 分区

分区就是把一张表的数据分块存储

目的：提升索引的查询效率

### 范围分区

```sql
CREATE TABLE `product_Partiton_Range` (
	`Id` BIGINT(8) NOT NULL,
	`ProductName` CHAR(245) NOT NULL DEFAULT '1',
	`ProductId` CHAR(255) NOT NULL DEFAULT '1',
	`ProductDescription` CHAR(255) NOT NULL DEFAULT '1',
	`ProductUrl` CHAR(255) NOT NULL DEFAULT '1',
	PRIMARY KEY (`Id`),
	INDEX `ProductId` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY RANGE (Id) PARTITIONS 3 (
PARTITION part0 VALUES LESS THAN (12980), 
PARTITION part1 VALUES LESS THAN (25960), 
PARTITION part2 VALUES LESS THAN MAXVALUE);
```

分区原理：客户端请求--\>Id和分区键进行比较--\>找到指定分区--\>查询

缺陷：

1. 必须使用分区字段才行，不然分区查询就是失败，查询所有分区

2. RANGE是范围分区，但是分区大小是静态的，需要在创建的时候指定，会存在分区不均的情况。

### Hash分区

```sql
CREATE TABLE `product_Partiton_Hash` (
	`Id` BIGINT(8) NOT NULL,
	`ProductName` CHAR(245) NOT NULL DEFAULT '1',
	`ProductId` CHAR(255) NOT NULL DEFAULT '1',
	`ProductDescription` CHAR(255) NOT NULL DEFAULT '1',
	`ProductUrl` CHAR(255) NOT NULL DEFAULT '1',
	PRIMARY KEY (`Id`),
	INDEX `ProductId` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY HASH (Id) PARTITIONS 3;
```

缺陷：只能使用主键和整形字段进行分区，无法进行字符字段但分区。

### Key分区

```sql 
# 建立复合主键
CREATE TABLE `product_Partiton_Key` (
	`Id` BIGINT(8) NOT NULL,
	`ProductName` CHAR(245) NOT NULL DEFAULT '1',
	`ProductId` CHAR(255) NOT NULL DEFAULT '1',
	`ProductDescription` CHAR(255) NOT NULL DEFAULT '1',
	`ProductUrl` CHAR(255) NOT NULL DEFAULT '1',
	PRIMARY KEY (`Id`),
	INDEX `ProductId` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY KEY (ProductName) PARTITIONS 3;
```

缺陷：不支持 text，blob类型做分区。

### List分区

```sql
CREATE TABLE `product_Partiton_List` (
	`Id` BIGINT(8) NOT NULL,
	`ProductName` CHAR(245) NOT NULL DEFAULT '1',
	`ProductId` CHAR(255) NOT NULL DEFAULT '1',
	`ProductDescription` CHAR(255) NOT NULL DEFAULT '1',
	`ProductUrl` CHAR(255) NOT NULL DEFAULT '1',
	`ProductStatus` int NOT NULL DEFAULT 0,
	PRIMARY KEY (`Id`,`ProductStatus`),
	INDEX `ProductId` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY LIST(ProductStatus) (
    PARTITION a VALUES IN (1,5,6),
    PARTITION b VALUES IN (2,7,8)
);
```

### 组合分区

```sql
CREATE TABLE `product-Partiton-flex` (
	`Id` BIGINT(8) NOT NULL,
	`ProductName` CHAR(245) NOT NULL DEFAULT '1',
	`ProductId` CHAR(255) NOT NULL DEFAULT '1',
	`ProductDescription` CHAR(255) NOT NULL DEFAULT '1',
	`ProductUrl` CHAR(255) NOT NULL DEFAULT '1',
	PRIMARY KEY (`Id`,`ProductName`),
	INDEX `ProductId` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY RANGE (Id) PARTITIONS 3
SUBPARTITION BY KEY(ProductName)
  SUBPARTITIONS 2 (
    PARTITION p0 VALUES LESS THAN (12980),
    PARTITION p1 VALUES LESS THAN (25960),
    PARTITION p2 VALUES LESS THAN MAXVALUE
);
```

### 管理分区

#### 删除分区

```sql
ALERT TABLE users DROP PARTITION p0; #删除分区 p0
```

#### 重建分区

- RANGE分区重建

```sql
ALTER TABLE users REORGANIZE PARTITION p0,p1 INTO (PARTITION p0 VALUES LESS THAN (6000000));  #将原来的 p0,p1 分区合并起来，放到新的 p0 分区中。
```

- List分区重建

```
ALTER TABLE users REORGANIZE PARTITION p0,p1 INTO (PARTITION p0 VALUES IN(0,1,4,5,8,9,12,13));#将原来的 p0,p1 分区合并起来，放到新的 p0 分区中。
```

- Hash/key分区重建

```sql
ALTER TABLE users REORGANIZE PARTITION COALESCE PARTITION 2; #用 REORGANIZE 方式重建分区的数量变成2，在这里数量只能减少不能增加。想要增加可以用 ADD PARTITION 方法。
```

## 索引

### 索引失效

1. 查询条件中有or

    ```sql
    # 建表语句
    CREATE TABLE `user` (
      `name` varchar(255) DEFAULT NULL,
      `age` int(11) DEFAULT NULL,
      `address` varchar(255) DEFAULT NULL,
      `id` int(11) NOT NULL AUTO_INCREMENT,
      PRIMARY KEY (`id`),
      KEY `index_name` (`name`),
      KEY `index_age` (`age`),
      KEY `index_address` (`address`)
    ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    CREATE TABLE `job` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `userId` int(11) DEFAULT NULL,
      `job` varchar(255) DEFAULT NULL,
      `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `name_index` (`name`)
    ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    ```

2. like查询以'%'开头

    ```sql
    explain
    select * from product where ProductId like'%226'   # type 为 all

    # 如果想让以'%'开头仍然使用索引，则需要使用覆盖索引，即只查询带索引字段的列：
    explain
    select ProductId from product where ProductId like'%226' #查询计划里的key用到了index_name。
    ```

3. 查询的列有运算或函数

    ```sql
    explain
    select * from product where substr(ProductId,-2)='226'
    ```

4. 查询条件类型和字段值类型不匹配，不走索引

    ```sql
    explain
    select * from product where ProductId=1226 # ProductId为CHAR类型
    ```

5. 关联查询关联字段编码格式不一致

    建表语句

    ```sql
    CREATE TABLE `user` (
      `name` varchar(255) DEFAULT NULL,
      `age` int(11) DEFAULT NULL,
      `address` varchar(255) DEFAULT NULL,
      `id` int(11) NOT NULL AUTO_INCREMENT,
      PRIMARY KEY (`id`),
      KEY `index_name` (`name`),
      KEY `index_age` (`age`),
      KEY `index_address` (`address`)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
    CREATE TABLE `job` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `userId` int(11) DEFAULT NULL,
      `job` varchar(255) DEFAULT NULL,
      `name` varchar(255) CHARACTER SET gbk COLLATE gbk_bin DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `index_name` (`name`)
    ) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;
    ```

    注意user 表的name字段编码是utf8mb4，而job表的name字段编码为gbk。执行左外连接查询：

    ```sql
    EXPLAIN 
    select a.name,b.name,b.job
    from user a
    left JOIN job b ON a.name =b.name
    ```

6. mysql估计使用全表扫描要比使用索引快

    ```sql
    CREATE TABLE `user` (
      `name` varchar(255) DEFAULT NULL,
      `age` int(11) DEFAULT NULL,
      `address` varchar(255) DEFAULT NULL,
      `id` int(11) NOT NULL AUTO_INCREMENT,
      PRIMARY KEY (`id`),
      KEY `index_name` (`name`),
      KEY `index_age` (`age`),
      KEY `index_address` (`address`)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    INSERT INTO `test`.`user`(`name`, `age`, `address`, `id`) VALUES ('光头强', 12, '狗熊岭', 1);
    INSERT INTO `test`.`user`(`name`, `age`, `address`, `id`) VALUES ('熊大', 9, '狗熊岭2', 2);
    CREATE TABLE `job` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `userId` int(11) DEFAULT NULL,
      `job` varchar(255) DEFAULT NULL,
      `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `index_name` (`name`)
    ) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    INSERT INTO `test`.`job`(`id`, `userId`, `job`, `name`) VALUES (1, 1, 'java', '光头强');
    INSERT INTO `test`.`job`(`id`, `userId`, `job`, `name`) VALUES (2, 2, 'php', '熊大');

    EXPLAIN 
    select a.name,b.name,b.job from
    user a
    left JOIN job b ON a.name =b.name
    ```

    ![](https://image.xjq.icu/2021/12/20/1640013789702_webp.jpg)
    此时，由于要查询b.name，mysql需要回表，mysql认为走全表扫描会快一些，所以即使b表的name有索引，也不会走。

7. 连接查询中，按照优化器顺序的第一张表不走索引

    ```sql
    CREATE TABLE `user` (
      `name` varchar(255) DEFAULT NULL,
      `age` int(11) DEFAULT NULL,
      `address` varchar(255) DEFAULT NULL,
      `id` int(11) NOT NULL AUTO_INCREMENT,
      PRIMARY KEY (`id`),
      KEY `index_name` (`name`),
      KEY `index_age` (`age`),
      KEY `index_address` (`address`)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    INSERT INTO `test`.`user`(`name`, `age`, `address`, `id`) VALUES ('光头强', 12, '狗熊岭', 1);
    INSERT INTO `test`.`user`(`name`, `age`, `address`, `id`) VALUES ('熊大', 9, '狗熊岭2', 2);
    CREATE TABLE `job` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `userId` int(11) DEFAULT NULL,
      `job` varchar(255) DEFAULT NULL,
      `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    ```

    插入数据的insert语句就不写了，要多插入一些，否则下面演示会失效，因为数据少mysql认为走全表扫面快一些，就怎么都用不到索引了。
    执行查询：

    ```sql
    EXPLAIN 
    select a.name,a.age,b.name,b.job
    from user a
    left JOIN job b ON a.name =b.name
    ```
    此时a表user上的name是有索引的，b表name无索引，看下执行计划

    ![](https://image.xjq.icu/2021/12/20/1640013789702_webp2.jpg)

    a表，b表都是全表扫描，而建表语句不变，把左外连接改为右外连接，可以看到，a表用到了索引

    ```sql
    EXPLAIN 
    select a.name,a.age,b.name,b.job
    from user a
    right JOIN job b ON a.name =b.name
    ```

    ![](https://image.xjq.icu/2021/12/20/1640014005939_webp3.jpg)

    同样，将右连接改为内连接再看下，a表也是用到了索引

    ```sql
    EXPLAIN 
    select a.name,a.age,b.name,b.job
    from user a
    inner JOIN job b ON a.name =b.name
    ```

    ![](https://image.xjq.icu/2021/12/20/1640014005939_webp4.jpg)

    从上面三个连接查询来看只有左外连接a表没有用到索引的，这就是因为由于是左外连接，所以优化器的执行顺序是a表、b表，也就是说首先全表扫描a表，再根据a表的name查询b表的值，所以a   表无法用到索引。用段伪代码解释下：

    ```sql
    //mysql代码
    select a.name,a.age,b.name,b.job
    from
    user a
    left JOIN job b
    ON a.name =b.name
    //相当于执行以下循环
    List<Map<String,Object>> resultA=select a.name,a.age from user a
    for(Map<String,Object> map: resultA)
    {
        List<Map<String,Object>> resultB=select b.name,b.job from job b where b.name=map.get("name")
    }
    ```

    从这段伪代码可以看到a表没有where语句，所以根本无法用到name上的索引，而b表此时name上若无索引的话，导致两个表都是全表扫描，所以一般这种连接查询，A表关联B表，要在将优化器 顺序的第二张表上关联的字段上加索引，而第一张表则无需加索引，无用的索引也会影响性能。而第三个例子中内连接就不一样了，如果是内连接优化器本身就会根据索引情况，连接表的大小等   去选择执行顺序了，所以上例中的内连接执行顺序是b、a，这样仍然可以用到a的索引。

8. 查询中没有用到联合索引的第一个字段

    ```sql
    explain
    select * from product where ProductDescription = '22'
    ```
    ![](https://image.xjq.icu/2021/12/20/1640014295022_webp5.jpg)

    - 联合索引OR失效

        ```sql
        explain
        select * from product where ProductName ='22' or ProductDescription = '22'
        ```

    - 联合索引 范围查询 \> 部分索引失效

        ```sql
        explain
        select * from product 
        where ProductName ='22' and ProductDescription = '22' and ProductId > '22' 
        ```

9. IS NULL和IS NOT NULL

    - 如果字段不允许为空，则is null 和 is not null这两种情况索引都会失效。

    - 如果字段允许为空，则is null走 ref 类型的索引，而is not null索引失效。

### 索引创建原则

1. 优先使用唯一索引，能够快速定位

2. 为常用查询字段建索引

3. 为排序、分组和联合查询字段建索引

4. 一张表的索引数量不超过5个

5. 表数据量少，可以不用建索引

6. 尽量使用占用空间小的字段建索引

7. 用idx_或unx_等前缀命名索引，方面查找

8. 删除没用的索引，因为它会占一定空间

