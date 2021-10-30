---
title: 'SqlServer常用函数大全'
date: 2021-05-10
categories:
- "数据库"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

## 字符串函数

- datalength(Char_expr): 返回字符串包含字符数，但不包含后面的空格

- substring(expression,start,length)：取子串

- right(char_expr,int_expr)：返回字符串右边int_expr个字符

- left(char_expr,int_expr)：返回字符串左边int_expr个字符

- ltrim('char_expr')：去掉字符左边的空格

- rtrim('char_expr')：去掉字符右边的空格

- rtrim(ltrim('char_expr'))：去掉字符串左右两边的空格

- replace('char_expr',' ','')：去掉计算字段列值中的所有空格

- upper('char_expr')：将字符串转为大写

- lower('char_expr')：将字符串转为小写

- isnull(null,'0.00')：如果结果为空，替换为第2参数值

- isdate('2021-05-13 20:13:25')：判断是否为时间格式，true返回1  else返回0

## 日期函数

- datediff(day,'2021-05-12 20:13:25',getdate())：返回两个时间的差，后面 - 前面 = 返回值，参数day可以改为month，year等日期对应的值

- dateadd(day,12,getdate())：在原有时间加时间，得到再当前日期加12天之后的时间(day为可变日期属性参数)

- datepart(day,getdate())：获取日期的某个部位整数，day为可变日期属性参数

## 日期转化函数

Select CONVERT(varchar(100), GETDATE(), 0): 05 16 2006 10:57AM

Select CONVERT(varchar(100), GETDATE(), 1): 05/16/06

Select CONVERT(varchar(100), GETDATE(), 2): 06.05.16

Select CONVERT(varchar(100), GETDATE(), 3): 16/05/06

Select CONVERT(varchar(100), GETDATE(), 4): 16.05.06

Select CONVERT(varchar(100), GETDATE(), 5): 16-05-06

Select CONVERT(varchar(100), GETDATE(), 6): 16 05 06

Select CONVERT(varchar(100), GETDATE(), 7): 05 16, 06

Select CONVERT(varchar(100), GETDATE(), 8): 10:57:46

Select CONVERT(varchar(100), GETDATE(), 9): 05 16 2006 10:57:46:827AM

Select CONVERT(varchar(100), GETDATE(), 10): 05-16-06

Select CONVERT(varchar(100), GETDATE(), 11): 06/05/16

Select CONVERT(varchar(100), GETDATE(), 12): 060516

Select CONVERT(varchar(100), GETDATE(), 13): 16 05 2006 10:57:46:937

Select CONVERT(varchar(100), GETDATE(), 14): 10:57:46:967

Select CONVERT(varchar(100), GETDATE(), 20): 2006-05-16 10:57:47

Select CONVERT(varchar(100), GETDATE(), 21): 2006-05-16 10:57:47.157

Select CONVERT(varchar(100), GETDATE(), 22): 05/16/06 10:57:47 AM

Select CONVERT(varchar(100), GETDATE(), 23): 2006-05-16

Select CONVERT(varchar(100), GETDATE(), 24): 10:57:47

Select CONVERT(varchar(100), GETDATE(), 25): 2006-05-16 10:57:47.250

Select CONVERT(varchar(100), GETDATE(), 100): 05 16 2006 10:57AM

Select CONVERT(varchar(100), GETDATE(), 101): 05/16/2006

Select CONVERT(varchar(100), GETDATE(), 102): 2006.05.16

Select CONVERT(varchar(100), GETDATE(), 103): 16/05/2006

Select CONVERT(varchar(100), GETDATE(), 104): 16.05.2006

Select CONVERT(varchar(100), GETDATE(), 105): 16-05-2006

Select CONVERT(varchar(100), GETDATE(), 106): 16 05 2006

Select CONVERT(varchar(100), GETDATE(), 107): 05 16, 2006

Select CONVERT(varchar(100), GETDATE(), 108): 10:57:49

Select CONVERT(varchar(100), GETDATE(), 109): 05 16 2006 10:57:49:437AM

Select CONVERT(varchar(100), GETDATE(), 110): 05-16-2006

Select CONVERT(varchar(100), GETDATE(), 111): 2006/05/16

Select CONVERT(varchar(100), GETDATE(), 112): 20060516

Select CONVERT(varchar(100), GETDATE(), 113): 16 05 2006 10:57:49:513

Select CONVERT(varchar(100), GETDATE(), 114): 10:57:49:547

Select CONVERT(varchar(100), GETDATE(), 120): 2006-05-16 10:57:49

Select CONVERT(varchar(100), GETDATE(), 121): 2006-05-16 10:57:49.700

Select CONVERT(varchar(100), GETDATE(), 126): 2006-05-16T10:57:49.827

Select CONVERT(varchar(100), GETDATE(), 130): 18 ???? ?????? 1427 10:57:49:907AM

Select CONVERT(varchar(100), GETDATE(), 131): 18/04/1427 10:57:49:920AM

## 统计函数

AVG()：求平均值

COUNT()：统计数目

MAX()：求最大值

MIN()：求最小值

SUM()：求和

STDEV()：STDEV()函数返回表达式中所有数据的标准差

STDEVP()：STDEVP()函数返回总体标准差

VAR()：VAR()函数返回表达式中所有值的统计变异数

VARP()：VARP()函数返回总体变异数

## 算数函数

### 三角函数

SIN(float_expression)：返回以弧度表示的角的正弦

COS(float_expression)：返回以弧度表示的角的余弦

TAN(float_expression)：返回以弧度表示的角的正切

COT(float_expression)：返回以弧度表示的角的余切

### 反三角函数

ASIN(float_expression)：返回正弦是FLOAT 值的以弧度表示的角

ACOS(float_expression)：返回余弦是FLOAT 值的以弧度表示的角

ATAN(float_expression)：返回正切是FLOAT 值的以弧度表示的角

ATAN2(float_expression1,float_expression2)：
返回正切是float_expression1 /float_expres-sion2的以弧度表示的角

DEGREES(numeric_expression)
：把弧度转换为角度返回与表达式相同的数据类型可为INTEGER/MONEY/REAL/FLOAT 类型
RADIANS(numeric_expression) --把角度转换为弧度返回与表达式相同的数据类型可为INTEGER/MONEY/REAL/FLOAT 类型

EXP(float_expression)：返回表达式的指数值

LOG(float_expression)：返回表达式的自然对数值

LOG10(float_expression)：返回表达式的以10 为底的对数值

SQRT(float_expression)：返回表达式的平方根

### 取近似值函数

CEILING(numeric_expression)：返回大于或等于表达式的最小整数返回的数据类型与表达式相同可为INTEGER/MONEY/REAL/FLOAT 类型

FLOOR(numeric_expression)：返回小于或等于表达式的最小整数返回的数据类型与表达式相同可为INTEGER/MONEY/REAL/FLOAT 类型

ROUND(numeric_expression)：返回以integer_expression 为精度的四舍五入值返回的数据类型与表达式相同可为INTEGER/MONEY/REAL/FLOAT 类型

ABS(numeric_expression)：返回表达式的绝对值返回的数据类型与表达式相同可为INTEGER/MONEY/REAL/FLOAT 类型

SIGN(numeric_expression)：测试参数的正负号返回0 零值1 正数或-1 负数返回的数据类型与表达式相同可为INTEGER/MONEY/REAL/FLOAT 类型

PI()：返回值为π 即3.1415926535897936

RAND([integer_expression])：用任选的[integer_expression]做种子值得出0-1 间的随机浮点数




