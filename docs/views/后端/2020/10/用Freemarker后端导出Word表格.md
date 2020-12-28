---
title: 'mysql查询分组显示数据结果之GROUP_CONCAT使用'
date: 2020-10-30
sidebar: false
isShowComment: true
isFull: true
categories:
- '数据库'
publish: false
---

<!-- more -->

## 工作需求

在此前工作中分组显示结果后有一列的数据并不相同但是需要将其全部展示出来。

所以这里用了在语句中将其拼接

## 代码中使用

使用的mybatis中xml文件语句如下~

```xml

<select id="statZhgz" parameterType="String" resultType="statZhgz">
  SELECT DATE_FORMAT(a.tbsj,'%m') yf,GROUP_CONCAT(a.gznr separator '；') as gznr,sum(a.gts) gts,GROUP_CONCAT(a.bz separator '；') bz
  FROM ywsj_gttbxx a
  WHERE a.scxm_id = #{xmid} and DATE_FORMAT( a.tbsj,'%Y') = #{years}
  GROUP BY yf
  ORDER BY yf
</select>
```
## group_concat 函数

### 语法结构

```

GROUP_CONCAT([DISTINCT] expr [,expr ...] [ORDER BY {unsigned_integer | col_name | expr} [ASC | DESC] [,col_name ...]] [SEPARATOR str_val])
```
### 简单解析

DISTINCT：去除重复值

expr [,expr ...]：一个或多个字段（或表达式）

ORDER BY {unsigned_integer | col_name | expr} [ASC | DESC] [,col_name ...]：根据字段或表达式进行排序，可多个

SEPARATOR str_val：分隔符（默认为英文逗号）

### 注意事项

1. 最大长度（字符）限制

系统变量：group_concat_max_len

SET [SESSION | GLOBAL] group_concat_max_len = val;
val必须是无符号整数

用了GROUP_CONCAT函数，SELECT语句中的LIMIT语句起不了任何作用。

2. INT类型陷阱

连接的字段为INT类型时，低版本或出现返回的结果不是逗号分隔的字符串，而是byte[]。

此时，需要用CAST或CONVERT函数进行转换。

## End

Mysql中语句还有很多需要学习的地方，再接再厉！！！