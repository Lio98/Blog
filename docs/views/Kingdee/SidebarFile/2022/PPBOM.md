---
title: '生产用料清单数量计算'
date: 2022-01-29
categories:
- "Kingdee"
tags:
- 工作笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: false
---

## 已消耗数量和在制品数量

```
FSTOCKINQUAQTY            2872            基本单位合格品入库数量
FSTOCKINFAILQTY           3000            基本单位不合格品入库数量
FBASESTOCKINSCRAPQTY      0               基本单位报废品入库数量
FBASESTOCKINREMADEQTY     0               基本单位返工品入库数量
BaseStdQty                12000           基本单位标准数量
FBASERPTFINISHQTY         0               基本单位汇报完成数量
FBASEUNITQTY              3000            基本单位数量
FBASERESTKQTY             0               基本单位退库数量

基本单位已消耗数量=(基本单位合格品入库数量=基本单位不合格品入库数量+基本单位报废品入库数量+基本单位返工品入库数量-基本单位退库数量)  * 用料清单基本单位标准数量/生产订单基本单位数量

BasePickedQty             12122   基本单位已领数量
BaseRepickedQty           0       基本单位补领数量
BaseScrapQty              0       基本单位报废数量
BaseConsumeQty            23488   基本单位已消耗数量
BasePrcDefectReturnQty    0       基本单位作业不良退料数量
BaseGoodReturnQty         634     基本单位良品退料数量
BaseIncDefectReturnQty    0       基本单位不良品退料数量

在制品数量=基本单位已领数量+基本单位补领数量-基本单位报废数量-基本单位已消耗数量-基本单位作业不良退料数量-基本单位良品退料数量-基本单位不良品退料数量
```
