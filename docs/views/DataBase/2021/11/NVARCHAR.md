---
title: 'NVARCHAR(N)'
date: 2021-11-27
categories:
- "数据库"
tags:
- 学习笔记
sidebar: true
isFull: false
isShowComments: true
isShowIndex: false
---

## NVARCHAR

首先，什么是nvarchar(n)？

::: tip
nvarchar [ ( n | max ) ]
可变长度的 Unicode 字符串数据。n定义字符串长度，可以是 1 到 4,000 之间的值。max表示最大存储大小为 2^31-1 字节（2 GB）。存储大小（以字节为单位）是输入数据实际长度的两倍 + 2 个字节。nvarchar的 ISO 同义词是national char 变化和国家字符变化。
:::

nvarchar(n) 中的“n”定义了从 1 到 4,000 的字符串长度。如果您的字符串超过 4,000 个字符，您可以改为定义 nvarchar(max)。

所以，我想存储一个包含 7 个字符的字符串：“coderky”。nvarchar(7) 和 nvarchar(4000) 有什么区别？

答案是：nvarchar(7) 和 nvarchar(4000) 在性能和存储大小方面没有区别。 

但是，不要使用大的 n。只需使用一个足够小的。因为字符串的实际大小会影响索引的性能。如果您的字符串大于 900 字节（450 个 Unicode 字符），则无法为它编制索引

有一个有趣的事情是：如果将 nvarchar(7) 或 nvarchar(4000) 更改为 nvarchar(max)。在性能和存储大小方面存在差异。 

哇，为什么会这样？这是因为 MS-SQL 中存储方法的不同。

在 MS-SQL Server 中，所有数据行都存储在页面中。


::: tip
数据行按顺序放置在页面上，在标题之后立即开始。行偏移表从页的末尾开始，每个行偏移表包含页上每一行的一个条目。每个条目记录行的第一个字节距页面开头的距离。行偏移表中的条目与页面上的行的顺序相反。
:::

![存储结构](https://image.xjq.icu/2021/11/27/2021.11.27-db.jpg)

在上图中，您可以看到有 3 种类型的分配单元

- **数据 (IN_ROW_DATA)**：包含除大对象 (LOB) 数据之外的所有数据的数据或索引行。

- **LOB (LOB_DATA)**： 以以下一种或多种数据类型存储的大对象数据：text、ntext、image、xml、varchar(max)、nvarchar(max)、varbinary(max)或 CLR 用户定义类型 (CLR UDT) ）。

- **行溢出 (ROW_OVERFLOW_DATA)**：存储在varchar、nvarchar、varbinary或sql_variant列中的可变长度数据超过 8,060 字节行大小限制。

您可以看到：如果我们使用 nvarchar(max)，您的数据将存储在 LOB_DATA 而不是 IN_ROW_DATA或 ROW_OVERFLOW_DATA 中。 

默认情况下，所有行都存储在IN_ROW_DATA 中，这为您提供了出色的性能。但在某些情况下，您的行大于 8KB 或您的数据是 LOB 数据 (nvarchar(max))，然后 MS-SQL 会将您的列拆分到另一个区域（LOB_DATA 或 ROW_OVERFLOW_DATA） 并在 IN_ROW_DATA 中留下一个指针指向 LOB_DATA/ROW_OVERFLOW_DATA。 

原因是什么：nvarchar(max) 会比 nvarchar(n) 慢

关于存储大小，有一点不同：指针的额外字节。因此您无需担心 nvarchar(n) 和 nvarchar(max) 之间的存储影响。

## 结论

#### 为什么我们不总是使用 NVARCHAR(MAX) ？

- nvarchar(max) 比 nvarchar(n) 慢。

- 你不能索引 nvarchar(max) 列

#### NVARCHAR(N) 和 NVARCHAR(MAX) 的存储大小不同吗？

是的， nvarchar(max) 会为指针添加一些额外的字节。但这没什么好担心的（在某些情况下，如果您的行大小大于 8KB，则 nvarchar(n) 也会为指针添加一些额外的字节）