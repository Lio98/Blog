---
title: '泛型 Generic'
date: 2020-03-12
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

## 泛型
### 泛型约束
    
  #### 基类约束 where T: BaseModel

   - 可以把T当成基类

   - T必须是BaseModel或其子类

   ```csharp
   public T Get<t>() where T: BaseModel
   {
      
   }
   ``` 

  #### 接口约束 where T: IBaseInterface

   ``` csharp
   public T Get<t>() where T: IBaseInterface
   {
       
   }
   ``` 

  #### 引用类型约束 where T：class
   ``` csharp
   public T Get<t>():where T: class
   {
       return null;
   }
   ``` 

  #### 值类型约束 where T：struct 
   ``` csharp
   public T Get<t>():where T: struct
   {
       return default(T);   //default是个关键字，会根据T的类型去获得一个默认值
   }
   ``` 

  #### 无参数构造函数约束：where new T()
   ```  csharp
   public T Get<t>():where T: new()
   {
       return new T();   
   }
   ``` 

  ### 泛型协变逆变

   - out 协变 covariant 修饰返回值，协变后T只能做 为返回值，不能当做参数

   - in 逆变 contravariant 修饰传入参数，逆变后T只能做为参数，不能做返回值

