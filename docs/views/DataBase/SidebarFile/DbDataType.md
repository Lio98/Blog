---
title: '数据表数据类型'
date: 2020-05-03
categories:
- "DataBase"
tags:
- 学习笔记
sidebar: true
isFull: false
isShowComments: true
isShowIndex: true
---

## Oracle常用数据类型

 ### 数值类型

    1. NUMBER(P,S)：数字类型，P为有效数字的位数，最多不能超过38个有效数字；S为小数位。
    
    2. INTEGER：是NUMBER的子类型，它等同于NUMBER(38,0)，用来存储整数。若插入、更新的数值有小数，则会被四舍五入。
    
    3. FLOAT(n)：是NUMBER的子类型，n表示位的精度，可以存储的值的数目。N值的范围可以是1到126。

 ### 字符串类型<br>
   字符串数据类型可以依据存储空间分为固定长度类型（CHAR/NCHAR）和可变长度类型（VARCHAR2/NVARCHAR2）两种。<br><br>
   固定长度：是指虽然输入的字段值<span style="color:red">小于</span>该字段的限制长度，但是实际存储数据时，<span style="color:red">会先自动向右补足空格后</span>，才将字段值的内容存储到数据块中。<span style="color:red">这种方式虽然比较浪费空间，但是存储效率较可变长度类型要好</span>。同时还能减少数据行迁移情况发生。<br><br>
   可变长度：是指当输入的字段值小于该字段的限制长度时，直接将字段值的内容存储到数据块中，而不会补上空白，这样可以节省数据块空间。<br>
   
   ----

    1. CHAR类型：定长字符串，会用空格填充来达到其最大长度。CHAR字段最多可以存储2000字节的信息，<span style="color:red">如果不指定CHAR长度，则默认为1</span>。

    2. NCHAR类型：这是一个包含UNICODE格式数据的定长字符串，最多可以存储2000字节的信息。<span style="color:red">查询时如果字段是NCHAR类型，该字段前需要加上'N'</span>。

    3. VARCHAR类型：不要使用VARCHAR数据类型。使用VARCHAR2数据类型。虽然VARCHAR数据类型目前是VARCHAR2的同义词，VARCHAR数据类型将计划被重新定义为一个单独的数据类型用于可变长度的字符串相比，具有不同的比较语义。

    4. VARCHAR2类型：变长字符串，与CHAR类型不同，它不会使用空格填充至最大长度。VARCHAR2最多可以存储4000字节的信息。VARCHAR2区分中英文，中文占两个字节，英文占一个字节。

    5. NVARCHAR2类型：这是一个包含UNICODE格式数据的变长字符串。 NVARCHAR2最多可以存储4,000字节的信息。NVARCHAR2不区分中英文，都占两个字节。
   
 ### 日期类型
    1. DATA类型：DATE是最常用的数据类型，日期数据类型存储日期和时间信息。虽然可以用字符或数字类型表示日期和时间信息，但是日期数据类型具有特殊关联的属性。为每个日期值，Oracle 存储以下信息： 世纪、 年、 月、 日期、 小时、 分钟和秒。一般占用7个字节的存储空间。

    2. TIMESTAMP类型：这是一个7字节或12字节的定宽日期/时间数据类型。它与DATE数据类型不同，因为TIMESTAMP可以包含小数秒，带小数秒的TIMESTAMP在小数点右边最多可以保留9位。

 ### LOB类型
    1. CLOB数据类型：它存储单字节和多字节字符数据。支持固定宽度和可变宽度的字符集。CLOB对象可以存储最多4G的字符。

    2.NCLOB数据类型：它存储UNICODE类型的数据，支持固定宽度和可变宽度的字符集，NCLOB对象可以存储最多4G大小的文本数据。

    3. BLOB数据类型：它存储非结构化的二进制数据大对象，它可以被认为是没有字符集语义的比特流，一般是图像、声音、视频等文件。BLOB对象最多存储4G的二进制数据。

    4. BFILE数据类型：二进制文件，存储在数据库外的系统文件，只读的，数据库会将该文件当二进制文件处理。BFILE对象最多存储4G的数据。

 ### RAW & LONG RAW 类型
    1. LONG类型：它存储变长字符串，最多达2G的字符数据（2GB是指2千兆字节， 而不是2千兆字符），与VARCHAR2 或CHAR 类型一样，存储在LONG 类型中的文本要进行字符集转换。ORACLE建议开发中使用CLOB替代LONG类型。支持LONG 列只是为了保证向后兼容性。CLOB类型比LONG类型的限制要少得多。 LONG类型的限制如下：
        1. 一个表中只有一列可以为LONG型。

        2. LONG列不能定义为主键或唯一约束，

        3. 不能建立索引

        4. LONG数据不能指定正则表达式。

        5. 函数或存储过程不能接受LONG数据类型的参数。

        6. LONG列不能出现在WHERE子句或完整性约束（除了可能会出现NULL和NOT NULL约束）。
    2. LONG RAW类型：能存储2GB的原始二进制数据

    3. RAW类型：用于存储二进制或字符类型数据，变长二进制数据类型，这说明采用这种数据类型存储的数据不会发生字符集转化。这种类型最多可以存储2000字节的信息。

## SqlServer常用的数据类型
 
 - int:整形

 - bigint:长整形

 - smallint：短整型

 - char(8000): 固定长度的字符型 = string

 - varchar(8000): 可变长度,汉字占 2 个字节，英文字母占 1 个字节

 - nvarchar(8000): unicode 可变长度字符型，中文和英文都占 2 个字节

 - datetime: 时间日期型

 - money: =decimal