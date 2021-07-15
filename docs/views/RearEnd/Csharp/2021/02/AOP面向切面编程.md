---
title: 'AOP 面向切面编程'
date: 2021-02-16
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: true
isShowComments: true
isShowIndex: true
---

::: tip 
  POP面向过程编成

  OOP面向对象编成

  AOP面向切面编成
:::

## AOP 

  AOP是一种编程思想，是OOP思想的补充，允许开发者动态的修改静态的OO模型，就像现实生活中对象在生命周期中会不断的改变自身。
  
  正是因为能够动态的扩展功能，所以在程序设计中就可以有以下好处：

  1、聚焦核心业务逻辑，对于权限/异常/日志/缓存，通用功能可以通过AOP方式添加，使得程序设计简单；

  2、功能的动态扩展，集中管理，代码复用，规范化。

## AOP的多种实现方式

### 1、静态实现

  静态实现可以通过两种方式 -- 装饰器模式和代理模式

  基础部分代码

  ```csharp
  public interface IUserProcessor
  {
      void RegUser(User user);
  }

  public class UserProcessor : IUserProcessor
  {
      public void RegUser(User user)
      {
          Console.WriteLine($"用户已完成注册。Name={user.Name},Password={user.Password}");
      }
  }

  public void BeforeProceed(User user)
  {
      Console.WriteLine("方法执行前");
  }

  public void AfterProceed(User user)
  {
      Console.WriteLine("方法执行后");
  }
  ```
  (1)、装饰器模式
 
  ```csharp
  public class DecoratorAOP
  {
    public static void Show()
    {
        User user = new User()
        {
            Name = "xxx",
            Password = "111111111111"
        };

        IUserProcessor processor=new UserProcessor();
        processor.RegUser(user);

        Console.WriteLine("************");
        
        processor=new UserProcessorDecorator(processor);
        processor.RegUser(user);
    }
  }
  public class UserProcessorDecorator : IUserProcessor
  {
      private IUserProcessor _userProcessor { get; set; }

      public UserProcessorDecorator(IUserProcessor userProcessor)
      {
          this._userProcessor = userProcessor;
      }

      public void RegUser(User user)
      {
          BeforeProceed(user);
          this._userProcessor.RegUser(user);
          AfterProceed(user);
      }
  }
  ```

  (2)、代理模式

  ```csharp
  public class ProxyAOP
  {
      public static void Show()
      {
          User user = new User()
          {
              Name = "xxx",
              Password = "111111111111"
          };

          IUserProcessor processor = new UserProcessor();
          processor.RegUser(user);

          Console.WriteLine("************");

          processor = new ProxyUserProcesser();
          processor.RegUser(user);
      }
  }

  public class ProxyUserProcesser : IUserProcessor
  {
      private readonly IUserProcessor _userProcessor = new UserProcessor();

      public void RegUser(User user)
      {
          BeforeProceed(user);
          this._userProcessor.RegUser(user);
          AfterProceed(user);
      }
  }
  ```
### 2、动态实现
  
  动态实现可以通过两种方式 -- Remoting和Castle，Castle方式相对简单一些

  (1)、Remoting

  (2)、Castle

  Castle方式需要引入名称为<span style="color:red">Castle.Core</span> 的Nuget包；需要在方法前面加上virtual关键字。
  
  ```csharp
  public class CastleProxyAOP
  {
    public static void Show()
    {
        User user = new User()
        {
            Name = "xxx",
            Password = "111111111111"
        };

        ProxyGenerator generator=new ProxyGenerator();
        MyInterceptor interceptor=new MyInterceptor();
        UserProcessor userProcessor = generator.CreateClassProxy<UserProcessor>(interceptor);
        userProcessor.RegUser(user);
    }

    public interface IUserProcessor
    {
        void RegUser(User user);
    }

    public class UserProcessor:IUserProcessor
    {
        public virtual void RegUser(User user)
        {
            Console.WriteLine($"用户已完成注册。Name={user.Name},Password={user.Password}");
        }
    }
  }

  public class MyInterceptor : IInterceptor
  {
      public void Intercept(IInvocation invocation)
      {
          PreProceed(invocation);
          invocation.Proceed();
          PostProceed(invocation);
      }

      public void PreProceed(IInvocation invocation)
      {
          Console.WriteLine("方法执行前");
      }

      public void PostProceed(IInvocation invocation)
      {
          Console.WriteLine("方法执行后");
      }
  }
  ```

### 3、静态织入

  静态织入采用PostSharp(收费)，扩展编译工具，生成的时候加入额外的代码。

### 4、Unity

  首先需要安装Unity相关的Nuget包，包含："Unity", "Unity.Abstractions", "Unity.Configuration", "Unity.Container", "Unity.Interception", "Unity.Interception.Configuration"

  然后添加Unity配置文件,其中配置文件的注册顺序是调用顺序，然后才是业务方法，

  接口某个方法不需要某个AOP扩展，通过判断方法名称或者使用特性(接口声明的地方添加)来区别

  ```xml
  <!--文件目录：项目根目录/CfgFiles/Unity.Config-->
  <configuration>
    <configSections>
      <!--这里添加一个unity扩展-->
      <section name="unity" type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection, Unity.Configuration" />
    </configSections>
    <unity>
      <sectionExtension type="Microsoft.Practices.Unity.InterceptionExtension.Configuration.InterceptionConfigurationExtension, Unity.  Interception.Configuration" />
      <containers>
        <!--这里最好起一个名字 方便代码查找-->
        <container name="aopContainer">
          <extension type="Interception" />
          <!--设置接口的实现类-->
          <register type="AOP.UnityWay.IUserProcessor,AOP" mapTo="AOP.UnityWay.UserProcessor,AOP">
            <!--InterfaceInterceptor：继承接口的方法都会被拦截。
                TransparentProxyInterceptor：继承类使用的方法都会被拦截。
                VirtualMethodInterceptor：继承的方法必须是虚方法且必须是公开的方法才会被拦截。-->
            <interceptor type="InterfaceInterceptor"/>
            <!--配置文件的注册顺序是调用顺序，然后才是业务方法，但是扩展逻辑也可以在业务方法之后-->
            <!--计算耗时-->
            <interceptionBehavior type="AOP.UnityWay.MonitorBehavior,AOP"/>
            <!--应该把捕捉异常的拦截器放到第一位，这样还可以捕捉其他拦截器内的异常-->
            <interceptionBehavior type="AOP.UnityWay.ExceptionLoggingBehavior,AOP"/>
            <!--日志-->
            <interceptionBehavior type="AOP.UnityWay.LogBeforeBehavior,AOP"/>
            <!--参数检查-->
            <interceptionBehavior type="AOP.UnityWay.ParameterCheckBehavior,AOP"/>
            <!--缓存-->
            <interceptionBehavior type="AOP.UnityWay.CachingBehavior,AOP"/>
            <interceptionBehavior type="AOP.UnityWay.LogAfterBehavior,AOP"/>
          </register>
        </container>
      </containers>
    </unity>
  </configuration>
  ```

  程序调用过程

  ```csharp
  public interface IUserProcessor
  {
      void RegUser(User user);

      
      User GetUser(User user);
  }

  public class UserProcessor : IUserProcessor
  {
      public User GetUser(User user)
      {
          return user;
      }

      public void RegUser(User user)
      {
          Console.WriteLine("用户已注册");
      }
  }

  public class UnityConfigAOP
  {
      public static void Show()
      {
          User user = new User()
          {
              Name = "xxx",
              Password = "1111111111111111111"
          };
          //配置UnityContainer
          IUnityContainer container=new UnityContainer();
          ExeConfigurationFileMap fileMap=new ExeConfigurationFileMap();
          fileMap.ExeConfigFilename = 
              Path.Combine(AppDomain.CurrentDomain.BaseDirectory + "CfgFiles\\Unity.Config");
          Configuration configuration =
              ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);

          UnityConfigurationSection configurationSection =
              (UnityConfigurationSection)configuration.GetSection(UnityConfigurationSection.SectionName);
          configurationSection.Configure(container, "aopContainer");

          IUserProcessor processor = container.Resolve<IUserProcessor>();

          processor.RegUser(user);
          var info=processor.GetUser(user);
      }
  }
  ```

  拦截器

  拦截器的类要实现：IInterceptionBehavior接口

  ```csharp
  ///性能计算
  public class MonitorBehavior : IInterceptionBehavior
  {
      public bool WillExecute => true;

      public IEnumerable<Type> GetRequiredInterfaces()
      {
          return Type.EmptyTypes;
      }

      public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
      {
          Console.WriteLine(this.GetType().Name);
          string methodName = input.MethodBase.Name;
          Stopwatch stopwatch=new Stopwatch();
          stopwatch.Start();
          IMethodReturn methodReturn = getNext().Invoke(input, getNext);
          stopwatch.Stop();
          Console.WriteLine($"{this.GetType().Name}统计方法{methodName}执行耗时{stopwatch.ElapsedMilliseconds}ms");
          return methodReturn;
      }
  }
  ```

  ```csharp
  //异常拦截
  public class ExceptionLoggingBehavior : IInterceptionBehavior
  {
      public bool WillExecute => true;

      public IEnumerable<Type> GetRequiredInterfaces()
      {
          return Type.EmptyTypes;
      }

      public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
      {
          Console.WriteLine("ExceptionLoggingBehavior");

          IMethodReturn methodReturn = getNext().Invoke(input, getNext);

          if (methodReturn.Exception==null)
          {
              Console.WriteLine("无异常");
          }
          else
          {
              Console.WriteLine("出现异常"+methodReturn.Exception.Message);
          }

          return methodReturn;
      }
  }
  ```

  ```csharp
  //开始日志记录
  public class LogBeforeBehavior : IInterceptionBehavior
  {
      public bool WillExecute => true;

      public IEnumerable<Type> GetRequiredInterfaces()
      {
          return Type.EmptyTypes;
      }

      public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
      {
          Console.WriteLine("LogBeforeBehavior");
          //foreach (var item in input.ToString()) //反射获取更多信息
          //{
          //    Console.WriteLine(item.ToString());
          //}
          return getNext().Invoke(input, getNext);
      }
  }
  ```

  ```csharp
  // 参数检查
  public class ParameterCheckBehavior : IInterceptionBehavior
  {
      public bool WillExecute => true;

      public IEnumerable<Type> GetRequiredInterfaces()
      {
          return Type.EmptyTypes;
      }

      public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
      {
          Console.WriteLine("ParameterCheckBehavior");
          User user=input.Inputs[0] as User;
          if (user==null)
          {
              return input.CreateExceptionMethodReturn(new Exception("用户信息不能为空"));
          }
          if (user.Password.Length<10)
          {
              return input.CreateExceptionMethodReturn(new Exception("密码长度不能小于10位"));
          }
          else
          {
              Console.WriteLine("密码检查无误");
              return getNext().Invoke(input, getNext);
          }
          
      }
  }
  ```

  ```csharp
  //缓存检查
  public class CachingBehavior : IInterceptionBehavior
  {
      public bool WillExecute
      {
          get { return true; }
      }

      public IEnumerable<Type> GetRequiredInterfaces()
      {
          return Type.EmptyTypes;
      }

      public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
      {
          Console.WriteLine("CachingBehavior");

          if (input.MethodBase.Name.Equals("GetUser"))
          {
              return input.CreateMethodReturn(new User() {Id = 111, Name = "2222"});
          }

          return getNext().Invoke(input, getNext);
      }
  }
  ```

  ```csharp
  //结束日志记录
  public class LogAfterBehavior:IInterceptionBehavior
  {
      public bool WillExecute => true;

      public IEnumerable<Type> GetRequiredInterfaces()
      {
          return Type.EmptyTypes;
      }

      public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
      {
          Console.WriteLine("LogAfterBehavior");
          //foreach (var item in input.ToString()) //反射获取更多信息
          //{
          //    Console.WriteLine(item.ToString());
          //}

          IMethodReturn methodReturn = getNext()(input, getNext);
          Console.WriteLine("LogAfterBehavior" + methodReturn.ReturnValue);
          return methodReturn;
      }
  }
  ```
### 5、MVC的Filter -- 特性标记

