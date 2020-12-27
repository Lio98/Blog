---
title: '[Jacob]使用以及Maven引入本地jar包和打包'
date: 2020-08-11
sidebar: false
isShowComment: true
isFull: true
tags:
- 'Jacob'
- 'Maven'
categories:
- 'Back-end'
---

::: tip
最近工作中是编写了对复杂报表的导出

后面针对表格有一个导入功能

Mark一些问题...
:::

<!-- more -->

## 序

### 前因

工作中需求是对各类表格进行导出，由于此处表格复杂多样，采用了freemarker模板引擎导出

后续针对每类表格有一个导入功能，这里我们使用了对上传的excel文档进行内容读取并将数据存入数据库

然后我想用导出的excel进行修改数据后将其导入，这里问题就出现了 ...

### 后果

经过不断打磨消磨时光测试，最终发现！！！

这里用freemarker模板引擎导出的excel实际上并不是真正的xlxs格式

由于模板用xml格式语言在填充数据，导致导出来的文档还是xml格式

所以再进行导入时候，用读取excel文档的形式并不能获取到该文档

所以这里用到了jacob

## 介绍

如果我们可以在 Java 中调用 COM 组件，就可以充分利用您的 Java 技能和现有的成熟 COM 工具包，大大简化应用开发的过程。

COM 组件提供了一种与其他语言的互操作方式，叫做自动化（Automation）。

现有的 Java COM 互操作的解决方案有很多种，由于设计目的的不同，在性能、易用性等方面都有很大的区别。

JACOB 开源项目提供的是一个 JVM 独立的自动化服务器实现，其核心是基于 JNI 技术实现的 Variant, Dispatch 等接口。

设计参考了 Microsoft VJ++ 内置的通用自动化服务器。

但是 Microsoft 的实现仅仅支持自身的 JVM。通过 JACOB，您可以方便地在 Java 语言中进行晚期绑定方式的调用。


## JACOB的jar包（1.17）

jacob-1.17-M2[点此下载](https://wws.lanzous.com/id6A1g0jeuj)

支持64位和32位

## 如何使用

### Maven依赖引入本地jar包

```xml
<dependency>
	<groupId>com.jacob</groupId>
	<artifactId>jacob</artifactId>
	<version>1.17</version>
	<scope>system</scope>
	<systemPath>${basedir}/src/main/resources/lib/jacob.jar</systemPath>
</dependency>
```
将下载的jar包放入systemPath标签所包含的目录下。

### 注意事项

1、把dll文件放在%JAVA_HOME%\bin下（注意系统是32位还是64位），也可以放在C:\Windows\System32下，如果是64位应该放在C:\Windows\SysWOW64 下。建议放在jdk的bin目录下

2、如果是在eclipse下开发，需要重新引入jdk（Preference/Java/Installed JREs）

3、开发时将jacab.jar包放在项目lib下并add到liabraries中即可。

### 将外部引入的jar包打进war包中

在Maven配置中plugins加入如下配置

```xml
<!--设置maven-war-plugins插件，否则外部依赖无法打进war包-->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-war-plugin</artifactId>
  <configuration>
    <webResources>
      <resource>
        <!--本地jar包路径-->
        <directory>lib</directory> 
        <targetPath>WEB-INF/lib/</targetPath>
        <includes>
          <include>**/*.jar</include>
        </includes>
      </resource>
    </webResources>
  </configuration>
</plugin>
```
## 项目中使用

在项目中我是调用com组件用代码对导出之后的xml格式的excel进行了另存为操作

代码如下

```java
public static final int EXCEL_XML_2_XLSX = 51;
//xmlfile 原文件
//xlsxfile 另存为文件
public static void xml2xlsx(String xmlfile, String xlsxfile)   {
  // COM组件初始化
  ComThread.InitSTA();
  // 启动word
  ActiveXComponent app = new ActiveXComponent("Excel.Application");
  try  {
    app.setProperty("Visible", new Variant(false));
    Dispatch excels = app.getProperty("Workbooks").toDispatch();
    //调用组件打开execl文件
    Dispatch excel = Dispatch.invoke(excels,
      "Open",
      Dispatch.Method,
      new Object[] { xmlfile,
        new Variant(false),
        new Variant(true)
      },new int[1]).toDispatch();
    //另存为操作
    Dispatch.invoke(excel,
      "SaveAs",
      Dispatch.Method,
      new Object[] { xlsxfile,
        new Variant( EXCEL_XML_2_XLSX )
      },new int[1]);
    Variant f = new Variant(false);
    //关闭组件
    Dispatch.call(excel, "Close", f);
  }  catch (Exception e)   {
    e.printStackTrace();
  }  finally   {
    app.invoke("Quit", new Variant[] {});
    ComThread.Release();
  }
}
```