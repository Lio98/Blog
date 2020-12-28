---
title: '【学习笔记】csharp基础'
date: 2020-2-25
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

## 值类型和引用类型

 - 值类型：整形、浮点型、字符、布尔、日期、枚举、结构
 - 引用类型：字符串、数组、类、接口、委托

## 集合和数组

 **集合和数组的比较**

  - 集合：ArrayList，有序元素，长度可变，元素类型可以不相同

  - 数组: 长度固定，元素类型必须相同

  ### 集合

   #### 集合的分类
   - 集合的分类 = 传统集合 + 泛型集合
    
   - 集合的分类 = 有序集合 + 键值对集合
    
   - ArrayList(动态数组)：有序集合，元素类型可以不相同
    
   - HashTable(哈希表)：键值对集合，无序，元素类型可以不相同
    
   - List &lt; T &gt;：元素类型必须相同
    
   - Dictionary &lt; K,V &gt;：元素类型必须相同

   #### 集合常用方法
   - Add(Object)：插入元素，排队
    
   - AddRange(Array)：排队批量插入数据元素
    
   - Insert(int,object)：插队
    
   - InsertRange(int,Array)：将数组一次性插入
    
   - Sort()：元素排序（升序）
    
   - Reverse()：将所有元素的位置颠倒
    
   - ToArray()：将集合元素导入新数组
    
   - ArrayList.Contains()：判断指定的元素是否包含在集合中
    
   - ArrayList.Clear()：清除集合所有元素

   #### 泛型集合 List\<T\>

   - 使用拉姆达表达式代替循环操作  List.Where(pro=>pro.属性==查询条件): 在List中查询元素 //拉姆达表达式
