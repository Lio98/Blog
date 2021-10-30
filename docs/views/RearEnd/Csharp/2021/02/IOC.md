---
title: 'IOC控制反转'
date: 2021-02-28
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: true
isShowComments: true
isShowIndex: true
---

## 概述

 1. 依赖倒置原则：系统架构时，高层模块 不应该依赖于底层模块，二者通过抽象来依赖，依赖抽象而不是依赖细节

 2. 面向抽象的好处 ：一个方法能满足多种类型；支持下层扩展

 3. IOC控制反转：传统开发，上端依赖(调用)下端对象，会有依赖，而把下端对象的依赖转移到第三方容器(工厂+反射+配置文件)，能够让程序拥有更好的扩展性

 4. (DI)依赖注入：依赖注入就是能够构造某个对象时，将该对象依赖的对象自动初始化并注入
  
  - 三种注入方式：构造函数注入--属性注入--方法注入(按发生时间顺序)

  - 通常构造函数注入用的最多，默认会找参数最多的构造函数，可以不用特性，可以去掉对容器的依赖

 5. IOC是目标效果，需要DI依赖注入的手段

 6. 依赖注入使用Unity容器

## 代码实现

### 创建容器

  ```csharp
  IUnityContainer container = new UnityContainer(); //1、实例化容器
  container.RegisterType<IPhone, AndroidPhone>(); //2、注册类型
  container.RegisterType<AbstractPad, ApplePad>();
  container.RegisterType<ApplePad, ApplePadChild>();
  //container.RegisterInstance<AbstractPad>(new ApplePadChild());
  IPhone phone = container.Resolve<IPhone>(); //3、获取实例
  AbstractPad pad = container.Resolve<AbstractPad>();
  ApplePad applePad = container.Resolve<ApplePadChild>();
  ```

### 对象的声明周期

容器创建的对象生命周期分为以下几种

 - 瞬时(默认)，每次都是构造一个新的 &nbsp;&nbsp;&nbsp;&nbsp;container.RegisterType<AbstractPad, ApplePad>(); 
 
  container.RegisterType<AbstractPad, ApplePad>(new TransientLifetimeManager());

 - 全局单例：全局只有一个该类型实例，非强制性的，只有通过容器创建的才是单例 &nbsp;&nbsp;&nbsp;&nbsp;container.RegisterType<AbstractPad, ApplePad>(new SingletonLifetimeManager());

 - 线程单例：同一个线程只有一个实例，不同线程有不同的实例 &nbsp;&nbsp;&nbsp;&nbsp;container.RegisterType<AbstractPad, ApplePad>(new PerThreadLifetimeManager());

 - 分级容器单例 &nbsp;&nbsp;&nbsp;&nbsp;container.RegisterType<AbstractPad, ApplePad>(new HierarchicalLifetimeManager());

 - 外部可释放单例 &nbsp;&nbsp;&nbsp;&nbsp;container.RegisterType<AbstractPad, ApplePad>(new ExternallyControlledLifetimeManager());

 - 循环引用 &nbsp;&nbsp;&nbsp;&nbsp;container.RegisterType<AbstractPad, ApplePad>(new PerResolveLifetimeManager());

### 配置文件注册

配置文件项目中，依赖关系依赖了很深

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
        <container name="IOCContainer1">
          <extension type="Interception" />
          <!--别名：一个接口多个实例-->
          <register type="IOC.Interface.IPhone,IOC.Interface" mapTo="IOC.Service.ApplePhone,IOC.Service"/>
          <register type="IOC.Interface.IPhone,IOC.Interface" mapTo="IOC.Service.AndroidPhone,IOC.Service" name="Android">
            <!--加上aop的内容-->
            <interceptionBehavior type="AOP.UnityWay.LogBeforeBehavior,IOC.DAL"/>
            <interceptionBehavior type="AOP.UnityWay.ParameterCheckBehavior,IOC.DAL"/>
            <interceptionBehavior type="AOP.UnityWay.LogAfterBehavior,IOC.DAL"/>
            <lifetime type="transient"/>
          </register>
          <register type="IOC.Interface.IHeadphone,IOC.Interface" mapTo="IOC.Service.Headphone,IOC.Service"/>
          <register type="IOC.Interface.IMicrophone,IOC.Interface" mapTo="IOC.Service.Microphone,IOC.Service"/>
          <register type="IOC.Interface.IPower,IOC.Interface" mapTo="IOC.Service.Power,IOC.Service"/>
          <register type="IOC.Service.AbstractPad,IOC.Service" mapTo="IOC.Service.ApplePad,IOC.Service"/>
          <!--构造对象是需要传递具体值，通过param-->
          <register type="IOC.IBLL.IBaseBll,IOC.IBLL" mapTo="IOC.BLL.BaseBll,IOC.BLL">
            <constructor>
              <param name="baseDal" type="IOC.IDAL.IBaseDal,IOC.IDAL"/>
              <param name="i" type="System.Int32" value="5"/>
            </constructor>
          </register>
          <register type="IOC.IDAL.IBaseDal,IOC.IDAL" mapTo="IOC.DAL.BaseDal,IOC.DAL"/>
          <!--泛型  名称带上展位符`1-->
          <register type="IOC.IDAL.IDBContext`1,IOC.IDAL" mapTo="IOC.DAL.DBContext`1,IOC.DAL"/>
        </container>
      </containers>
    </unity>
  </configuration>
  ```

  ```csharp
  ExeConfigurationFileMap fileMap = new ExeConfigurationFileMap();
  fileMap.ExeConfigFilename = Path.Combine(AppDomain.CurrentDomain.BaseDirectory + "CfgFiles\\Unity.Config");//找配文件的路径
  Configuration configuration = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
  UnityConfigurationSection section = (UnityConfigurationSection)configuration.GetSection(UnityConfigurationSectionSectionName);

  IUnityContainer container = new UnityContainer();
  section.Configure(container, "IOCContainer1");

  container.AddNewExtension<Interception>().Configure<Interception>()
  SetInterceptorFor<IPhone>(new InterfaceInterceptor());

  IPhone phone = container.Resolve<IPhone>();
  phone.Call();

  IPhone android = container.Resolve<IPhone>("Android"); //配置文件加了别名，这里通过别名进行选择
  android.Call();

  IDBContext<Program> context = container.Resolve<IDBContext<Program>>();
  context.DoNothing();
  ```

