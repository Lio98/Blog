---
title: 'csharp基础'
date: 2020-02-25
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: auto
isFull: true
isShowComments: true
isShowIndex: true
---

## 值类型和引用类型

 - 值类型：整形、浮点型、字符、布尔、日期、枚举、结构，值类型分配在栈上，值类型的长度是确定的，如果在一个值类型的变量里面，如果出现引用类型的字段，该字段出现在堆中

 - 引用类型：字符串、数组、类、接口、委托，引用类型分配在堆上，引用类型的长度是不确定的，如果一个引用类型的变量中包含值类型的属性，该属性会随着对象的位置而存储

 - 装箱：从值类型到引用类型

 - 拆箱：从引用类型到值类型

 - 字符串内存分类是共享的，具有不可变性，因为在堆上是连续摆放，如果变化，会导致其他变量全部移动，成本太高，所以new一个新的

## 集合和数组

集合，纯粹的数据集合

线性结构：数据之间一对一的（数组/队列/栈）

树形结构：数据之间一对多的（菜单/文件夹/树形控件/表达书目录树）

图状结构(网状)：多对多的（地图应用）

-------------------

**集合**

内存连续存储,可以节约空间，可以索引访问，读取快但是增删慢

 - Array：再内存上连续分配的，而且元素类型是一样的，可以坐标访问 读取快--增删慢，长度不变

 - ArrayList：不定长，连续分配的，类型是object的，会有装箱的操作

 - List：也是Array,内存上连续的，不定长的，泛型，保证类型安全，避免装箱拆箱


**链表**

非连续摆放，存储数据+地址，找数据只能顺序查找，读取慢--增删快

 - LinkedList \<T\>：泛型的特点，元素不连续分配，每个元素都有记录前后节点；节点值可能重复；不能访问下标，找元素只能遍历，查找不方便；增删就比较方便

   ```csharp
   LinkedList<int> linkedList = new LinkedList<int>();
   linkedList.AddFirst(123);
   linkedList.AddLast(456);
   
   bool isContain = linkedList.Contains(123);
   LinkedListNode<int> node123 = linkedList.Find(123);
   linkedList.AddBefore(node123, 123);
   linkedList.AddBefore(node123, 123);
   linkedList.AddAfter(node123, 234);
   
   linkedList.Remove(456);
   linkedList.Remove(node123);
   linkedList.RemoveFirst();
   linkedList.RemoveLast();
   linkedList.Clear();
   ```

 - Queue：队列，先进先出

   ```csharp
   Queue<string> numbers=new Queue<string>();
   numbers.Enqueue("one");
   numbers.Enqueue("two");
   numbers.Enqueue("third");
   numbers.Enqueue("four");
   numbers.Enqueue("five");
   numbers.Enqueue("six");
   
   foreach (var number in numbers)
   {
       Console.WriteLine(number);
   }
   
   Console.WriteLine($"Dequeuing '{numbers.Dequeue()}'");
   Console.WriteLine($"Peek at next item to dequeue:{numbers.Peek()}");
   Queue<string> queueCopys=new Queue<string>(numbers.ToArray());
   
   foreach (var queueCopy in queueCopys)
   {
       Console.WriteLine(queueCopy);
   }
   ```

 - Stack：栈，先进后出

   ```csharp
   Stack<string> stacks=new Stack<string>();
   stacks.Push("one");
   stacks.Push("two");
   stacks.Push("third");
   stacks.Push("four");
   stacks.Push("five");
   
   foreach (var stack in stacks)
   {
       Console.WriteLine(stack);
   }
   
   Console.WriteLine($"Pop '{stacks.Pop()}'");
   Console.WriteLine($"Peek at next item to dequeue:{stacks.Peek()}");
   Console.WriteLine($"Pop '{stacks.Pop()}'");
   
   Stack<string> stackCopys=new Stack<string>(stacks.ToArray());
   foreach (var stackCopy in stackCopys)
   {
       Console.WriteLine(stackCopy);
   }
   ```

**Set集合**

 set是纯粹的集合，容器，东西丢进去,具有唯一性、无序性；

 - HashSet：hash分布，元素之间没有关系，动态增加容量  去重,重复的数据会自动覆盖

 - SortedSet：排序的集合，去重，而且排序

**Key--Value**

Key--Value ，一段连续有限的空间放value(开辟的空间比用到的多，hash是用空间换性能），基于key散列计算得到地址索引，这样读取快

增删也快，删除时也是计算位置，增加也不影响别人

肯定会出现两个key（散列冲突），散列结果一致，可以让第二次的+1，可能会造成效率的降低，尤其是数据量大的情况下

 - Hashtable：保存的都是object类型，所以会有很多的装箱拆箱

 - Dictionary：字典

 - SortedDictionary：排序字典

 - SortedList：排序列表

**IEnumerable**

是一个迭代器，任何数据集合，都实现了IEnumerable，为不同的数据结构，提供了统一的数据访问方式，这个就是迭代器模式

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

   - Take(int)：获取前多少条

   - Skip(int)：跳过多少条
    
   - InsertRange(int,Array)：将数组一次性插入
    
   - Sort()：元素排序（升序）
    
   - Reverse()：将所有元素的位置颠倒
    
   - ToArray()：将集合元素导入新数组
    
   - ArrayList.Contains()：判断指定的元素是否包含在集合中
    
   - ArrayList.Clear()：清除集合所有元素

   #### 泛型集合 List\<T\>

   - 使用拉姆达表达式代替循环操作  List.Where(pro=>pro.属性==查询条件): 在List中查询元素 //拉姆达表达式

## 堆栈

 - 堆Heap：一个程序运行时，该进程存放引用类型变量的一块内存，全局唯一

 - 栈Stack：先进后出的数据结构，线程栈，一个线程存放变量的内存，随着线程生命周期

## 垃圾回收

### 托管堆垃圾回收 -- CLR提供GC

1、什么样的对象需要垃圾回收?

托管资源 + 引用类型

2、托管资源和非托管资源

- 托管的就是CLR控制的，new的对象，string字符串  变量

- 非托管不是CLR能控制的，数据库连接、文件流、句柄、打印机连接，只要是手动释放的，都是非托管资源

3、哪些对象的内存，能被FC回收?

对象访问不到了，那就可以被回收了

4、什么时候执行GC

  - new对象时--临界点

  - GC.Collect  强制GC

  - 程序退出时会GC

5、垃圾回收策略

 对象分代：3代

 0代：第一次分配到堆，就是0代

 1代：经历了一次GC，已然还在的

 2代：经历了两次或以上GC，已然还在的

 垃圾回收时，优先回收0代，提升效率，最多也最容易释放

 0代不够  --- 找1代不够才找2代
