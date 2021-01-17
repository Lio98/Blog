---
title: '反射 Reflection'
date: 2020-03-15
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

::: tip
反射调用实例方法、静态方法、重载方法、私有方法、泛型方法

反射字段和属性，分别获取值和设定值
:::
<!-- more -->

## 反射
### 反射调用实例方法
 ``` csharp
 Console.WriteLine("**********Reflection**************");
 //动态加载    一个完整的dll名称，不需要后缀  会从exe所在的路径进行查找
 Assembly assembly = Assembly.Load("DB.MySql");

 //完整路径
 Assembly assemblyFile = Assembly.LoadFile(@"D:\Code\NetMiddle\Reflection\bin\Debug\netcoreapp3.1\DB.MySql.dll");

 //当前路径
 Assembly assemblyForm = Assembly.LoadFrom("DB.MySql.dll");

 foreach (var type in assembly.GetTypes())
 {
     Console.WriteLine(type.Name);   //类名
     foreach (var methodInfo in type.GetMethods())  //所有方法
     {
         Console.WriteLine(methodInfo.Name);
     }
 }

 //通过dll来创建对象
 Assembly assembly = Assembly.Load("DB.MySql"); //动态加载
 Type type = assembly.GetType("DB.MySql.MySqlHelper"); //获取类型 完整类型名称
 if (type != null)
 {
     //dynamic oDbHelper = Activator.CreateInstance(type) ;  //创建对象   dynamic编译器不检查
     IDBHelper oDbHelper = Activator.CreateInstance(type) as IDBHelper;  //不报错，类型不对就返回null

     //调用方法
     oDbHelper?.Query();
 }


 {
     Console.WriteLine("***********Reflection + Factory + appsetting.json**************");
     IDBHelper iDbHelper = SimpleFactory.CreateInstance();
     iDbHelper?.Query();
 }
 //工厂对象
 public class SimpleFactory
 {
     private static string address;
     private static string dllName;
     static SimpleFactory()
     {
         //Directory.GetCurrentDirectory()当前运行环境根目录下
         var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
             .AddJsonFile("appsetting.json").Build();
         address = configuration.GetSection("info")["address"];
         dllName = configuration.GetSection("info:dllName").Value;
     }

     public static IDBHelper CreateInstance()
     {
         Assembly assembly = Assembly.Load(address);
         Type type = assembly.GetType(dllName);
         IDBHelper iDbHelper = Activator.CreateInstance(type) as IDBHelper;
         return iDbHelper;
     }
 }
 ```

### 获取类型构造函数参数
 ``` csharp
 Console.WriteLine("***********ctor & parameter**********");
 Assembly assembly = Assembly.Load("DB.SqlServer");
 Type type = assembly.GetType("DB.SqlServer.ReflectionTest");
 foreach (var constructor in type.GetConstructors())
 {
     Console.WriteLine(constructor.Name);
     foreach (ParameterInfo parameter in constructor.GetParameters())
     {
         //parameter.ParameterType 参数类型    parameter.Name 参数名称
         Console.WriteLine(parameter.ParameterType);  
     }
 }
 //创建对象
 object oTest1 = Activator.CreateInstance(type);
 object oTest2 = Activator.CreateInstance(type, new object[] { 123 });
 object oTest3 = Activator.CreateInstance(type, new object[] { "xmn" });
 object oTest4 = Activator.CreateInstance(type, new object[] { 123, "xmn" });
 ```

### 反射破环单例，调用私有构造函数
 ``` csharp
 //反射破坏单例---反射调用私有构造函数
 Assembly assembly = Assembly.Load("DB.SqlServer");
 Type type = assembly.GetType("DB.SqlServer.Singleton");
 Singleton singleton1 = Activator.CreateInstance(type, true) as Singleton;
 Singleton singleton2 = Activator.CreateInstance(type, true) as Singleton;
 //ReferenceEquals确定指定的object实例是否是相同实例
 Console.WriteLine($"{object.ReferenceEquals(singleton1, singleton2)}");   //输出false

 /// <summary>
 /// 单例模式：类  能保证在整个进程中只有一个实例
 /// </summary>
 public sealed class Singleton
 {
     private static Singleton _singleton = null;
     public Singleton()    //构造函数私有化   不能创建对象
     {
         Console.WriteLine("Singleton被构造");
     } 
     static Singleton()   //静态构造函数只初始化一次
     {
         _singleton=new Singleton();
     } 
     public static Singleton getInstance()
     {
         return _singleton;
     }
 }
 ```

### 创建泛型类对象
 ``` csharp
 //创建泛型对象
 Console.WriteLine("***********GenericClass************");
 Assembly assembly = Assembly.Load("DB.SqlServer");

 //GenericClass`3 中`3是占位符，在编译中泛型类3个类型将会以`3表示
 Type type = assembly.GetType("DB.SqlServer.GenericClass`3"); 

 //创建对象的时候需要指定泛型类型
 Type typeMake = type.MakeGenericType(new Type[] { typeof(string), typeof(int), typeof(DateTime) });
 dynamic oGeneric = Activator.CreateInstance(typeMake);


 //泛型类
 public class GenericClass<T, W, X>
 {
     public void Show(T t, W w, X x)
     {
         Console.WriteLine($"t.type={t.GetType().Name},w.type={w.GetType().Name},x.type={x.GetType().Name}");
     }

     
 }
 ```

### 调用泛型方法
 ``` csharp
 Console.WriteLine("反射调用泛型方法");
 Assembly assembly = Assembly.Load("DB.SqlServer");
 Type type = assembly.GetType("DB.SqlServer.GenericMethod");
 object oGeneric = Activator.CreateInstance(type);
 foreach (MethodInfo methodInfo in type.GetMethods())
 {
     Console.WriteLine(methodInfo.Name);
 }
 MethodInfo method = type.GetMethod("Show");
 var methodNew = method.MakeGenericMethod(new Type[] { typeof(int), typeof(string), typeof(DateTime) });
 methodNew.Invoke(oGeneric, new object[] { 123, "xmn", DateTime.Now });


 public class GenericMethod
 {
     public void Show<T, W, X>(T t, W w, X x)
     {
         Console.WriteLine($"t.type={t.GetType().Name},w.type={w.GetType().Name},x.type={x.GetType().Name}");
     }
 }
 ```

### 反射调用泛型类中的泛型方法
 ``` csharp
 Console.WriteLine("*************反射调用泛型类中泛型方法***************");
 Assembly assembly = Assembly.Load("DB.SqlServer");
 Type type = assembly.GetType("DB.SqlServer.GenericDouble`1").MakeGenericType(typeof(int));
 object oObject = Activator.CreateInstance(type);
 //参数类型顺序一定要对应
 MethodInfo method = type.GetMethod("Show").MakeGenericMethod(typeof(string), typeof(DateTime));
 method.Invoke(oObject, new object?[] { "xmn", 123, DateTime.Now });


 public class GenericDouble<T>
 {
     public void Show<W, X>(W w, T t, X x)
     {
         Console.WriteLine($"t.type={t.GetType().Name},w.type={w.GetType().Name},x.type={x.GetType().Name}");
     }
 }
 ```

### 反射创建了对象实例----有方法名称----反射调用方法
 ``` csharp
 Assembly assembly = Assembly.Load("DB.SqlServer");
 Type type = assembly.GetType("DB.SqlServer.ReflectionTest");

 object oTest1 = Activator.CreateInstance(type);
 foreach (MethodInfo methodInfo in type.GetMethods())
 {
     Console.WriteLine(methodInfo.Name);
     foreach (ParameterInfo parameter in methodInfo.GetParameters())
     {
         Console.WriteLine($"{parameter.Name},{parameter.ParameterType}");
     }
 }

 {
     MethodInfo method = type.GetMethod("Show1");
     method.Invoke(oTest1, null);
 }
 {
     MethodInfo method = type.GetMethod("Show2");
     method.Invoke(oTest1, new object[] { 123 });
 }
 //按照参数类型与个数来区分调用重载方法
 {
     MethodInfo method = type.GetMethod("Show3", new Type[] { });
     method.Invoke(oTest1, null);
 }
 {
     MethodInfo method = type.GetMethod("Show3", new Type[] { typeof(int) });
     method.Invoke(oTest1, new object[] { 123 });
 }
 {
     MethodInfo method = type.GetMethod("Show3", new Type[] { typeof(string) });
     method.Invoke(oTest1, new object[] { "xmn" });
 }
 {
     MethodInfo method = type.GetMethod("Show3", new Type[] { typeof(int), typeof(string) });
     method.Invoke(oTest1, new object[] { 1213, "xmb" });
 }
 //反射调用静态方法
 {
     Console.WriteLine("*********反射调用静态方法***********");
     MethodInfo method = type.GetMethod("Show5", new Type[] { typeof(string) });
     method.Invoke(oTest1, new object[] { "邢" });//静态方法的实例可以要
 }
 {
     MethodInfo method = type.GetMethod("Show5", new Type[] { typeof(string) });
     method.Invoke(null, new object[] { "邢" }); //静态方法的实例也可以不要
 }
 
 //反射调用私有方法
 {
     Console.WriteLine("反射调用私有方法");
     Assembly assembly = Assembly.Load("DB.SqlServer");
     Type type = assembly.GetType("DB.SqlServer.ReflectionTest");
     object test = Activator.CreateInstance(type);
     var method = type.GetMethod("Show4", BindingFlags.Instance | BindingFlags.NonPublic);
     method.Invoke(test, new object[] { "老王" });
 }
 public class ReflectionTest
 {
     public ReflectionTest()
     {
         Console.WriteLine("这里是无参数的构造函数");
     }

     public ReflectionTest(string name)
     {
         Console.WriteLine($"这里是{this.GetType()}有参数构造函数");
     }

     public ReflectionTest(int id)
     {
         Console.WriteLine($"这里是{this.GetType()}有参数构造函数");
     }

     public void Show1()
     {
         Console.WriteLine($"这是{this.GetType().Name}的show1");
     }
     public void Show2(int id)
     {
         Console.WriteLine($"这是{this.GetType().Name}的show2");
     }
     public void Show2(string name)
     {
         Console.WriteLine($"这是{this.GetType().Name}的show2");
     }

     public void Show3(int id, string name)
     {
         Console.WriteLine($"这是{this.GetType().Name}的show3");
     }

     public void Show3(string name, int id)
     {
         Console.WriteLine($"这是{this.GetType().Name}的show3_2");
     }

     public void Show3(int id)
     {
         Console.WriteLine($"这是{this.GetType().Name}的show3_3");
     }

     public void Show3(string name)
     {
         Console.WriteLine($"这是{this.GetType().Name}的show3_4");
     }

     public void Show3()
     {
         Console.WriteLine($"这是{this.GetType().Name}的show3_5");
     }

     public static void Show5(string name)
     {
         Console.WriteLine($"这里是{typeof(ReflectionTest)}的show5");
     }

     private void Show4(string xmn)
     {
         Console.WriteLine($"这里是{this.GetType()}的show4");
     }
 }
 ```

### 反射读取和设值类中属性和字段
 ``` csharp
 Type type = typeof(People);
 object people = Activator.CreateInstance(type);
 foreach (var prop in type.GetProperties())
 {
     Console.WriteLine($"{type.Name}.{prop.Name}={prop.GetValue(people)}");
     if (prop.Name.ToUpper().Equals("ID"))
     {
         prop.SetValue(people, 234);
     }
     else if (prop.Name.ToUpper().Equals("NAME"))
     {
         prop.SetValue(people, "xmn");
     }
     Console.WriteLine($"{type.Name}.{prop.Name}={prop.GetValue(people)}");
 
 foreach (FieldInfo field in type.GetFields())
 {
     Console.WriteLine($"{type.Name}.{field.Name}={field.GetValue(people)}");
     if (field.Name.Equals("Description"))
     {
         field.SetValue(people, "xxxxxxxxxxxx");
     }
     Console.WriteLine($"{type.Name}.{field.Name}={field.GetValue(people)}");
 }
 
 //People类
 public class People
 {
     public People()
     {
         Console.WriteLine($"{this.GetType().FullName}被创建了");
     }
     //属性
     public int  Id { get; set; }

     public string Name { get; set; }

     //字段
     public string Description;

 }
 ```
