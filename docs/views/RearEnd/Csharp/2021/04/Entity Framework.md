---
title: 'Entity Framework'
date: 2021-04-03
categories:
- "Csharp"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## Entity Framework概述

EF在控制台打印出sql的方式：context.Database.Log += s =\> Console.WriteLine($"当前执行sql{s}")

```csharp
public BaseDBContext() : base("name=BaseDBContext")
{
    this.Database.Log += s => Console.WriteLine($"当前执行sql{s}");
}
```

SaveChanges是以context为标准的，如果监听到任何数据的变化，然后会一次性的保存到数据库去，而且会开启事务

**EntityState的五种状态** （service.Entry(user).State）

- Detached：该实体未由上下文跟踪。刚使用新运算符或某个 System.Data.Entity.DbSet Create 方法创建实体后，实体就处于此状态。

- Unchanged： 实体将由上下文跟踪并存在于数据库中，其属性值与数据库中的值相同。

- Added：实体将由上下文跟踪，但是在数据库中还不存在。

- Deleted：实体将由上下文跟踪并存在于数据库中，但是已被标记为在下次调用 SaveChanges 时从数据库中删除。

- Modified：实体将由上下文跟踪并存在于数据库中，已修改其中的一些或所有属性值。

**映射：**

1、特性映射

2、OnModelCreating()完成链式方式

modelBuilder.Entity\<TSYSUSER\>().ToTable("T_SYS_USER").Property(c=>c.Chinese).HasColumnName("Name")

3、映射类文件


**context使用建议**

DBContext是个上下文环境，里面内置对象跟踪，会开启连接(就等于一个数据库链接)

一次请求，最好是一个context；多个请求/多线程最好是多个实例，用完尽快释放

事务：一个saveChange就是一个事务  使用TransactionScope（）  BaseDBContext.Database.BeginTransaction();

级联删除：主表数据删除，从表数据是删除/不做任何操作/设置为null/设置为默认值   不是强制性约束

**EF执行sql语句**

```csharp
DbContextTransaction trans = null;
trans = service.Database.BeginTransaction();
string sql = "select * from T_Sys_User where id=@id";
SqlParameter parameter=new SqlParameter("@id",1);
var result = service.Database.SqlQuery<T_Sys_User>(sql, parameter).ToList();
trans.Commit();
```

**延迟查询**

var userList = service.Set<T_Sys_User>().Where(i =\> i.Id &lt; 10);

这句话执行完，没有数据库查询

迭代遍历数据才去数据库查询，在真实使用数据时，才去数据库查询的

这就是延迟查询，可以叠加多次查询，一次提交给数据库，可以按需获取数据

延迟查询也要注意：a、迭代使用时，用完了关闭连接  b、脱了了context的作用域


## 导航属性

- 默认情况下，导航属性是延迟查询

  其中，SysUsers是T_Sys_Company中的一个属性，其类型是public ICollection\<T_Sys_User\> SysUsers { get; set; },

  T_Sys_Company与T_Sys_User是主从表的关系

```csharp
using (BaseDBContext service = new BaseDBContext())
{
    var companyList = service.T_Sys_Company.Where(i => i.Id > 10);
    foreach (var company in companyList)
    {
        Console.WriteLine(company.Name);
        foreach (var user in company.SysUsers)
        {
            Console.WriteLine(user.Name);
        }
    }
}
```

- 关闭延迟加载，子表数据就没了

```csharp
using (BaseDBContext service=new BaseDBContext())
{
    service.Configuration.LazyLoadingEnabled = false;//这一句关闭延迟加载
    var companyList = service.T_Sys_Company.Where(i => i.Id > 10);
    foreach (var company in companyList)
    {
        Console.WriteLine(company.Name);
        foreach (var user in company.SysUsers)
        {
            Console.WriteLine(user.Name);
        }
    }
}
```

- 预先加载  Include查询主表时就把子表数据一次性查出来

```csharp
using (BaseDBContext service = new BaseDBContext())
{
    service.Configuration.LazyLoadingEnabled = false;
    var companyList = service.T_Sys_Company.Include("SysUsers").Where(i => i.Id > 10);
    foreach (var company in companyList)
    {
        Console.WriteLine(company.Name);
        foreach (var user in company.SysUsers)
        {
            Console.WriteLine(user.Name);
        }
    }
}
```

- 关闭延迟查询后，如果需要子表数据，可以显示加载

```csharp
using (BaseDBContext service = new BaseDBContext())
{
    service.Configuration.LazyLoadingEnabled = false;
    var companyList = service.T_Sys_Company.Where(i => i.Id > 10);
    foreach (var company in companyList)
    {
        Console.WriteLine(company.Name);
        service.Entry(company).Collection(c => c.SysUsers).Load();
        foreach (var user in company.SysUsers)
        {
            Console.WriteLine(user.Name);
        }
    }
}
```


**事务**

也可以使用如下形式来进行事务管理

```csharp
using (TransactionScope trans=new TransactionScope())
{
    trans.Complete();
}
```