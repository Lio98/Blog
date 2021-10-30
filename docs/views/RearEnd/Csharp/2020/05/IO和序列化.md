---
title: 'IO 和 序列化'
date: 2020-05-30
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: auto
isFull: true
isShowComments: true
isShowIndex: true
---

## IO 和 序列化

### 文件IO

 - 创建/移动/复制文件夹

    ```csharp
    Directory.CreateDirectory(LogPath);
    Directory.Move(LogPath,LogMovePath);
    Directory.Delete(LogMovePath);
    ```
 - 写文件
    ``` csharp
    //写文件
    using (FileStream fileStream=File.Create(fileName))
    {
        string name = "1111315465154";
        byte[] bytes = Encoding.Default.GetBytes(name);
        fileStream.Write(bytes, 0, bytes.Length);
        fileStream.Flush();
    }
    
    using (FileStream fileStream=File.Create(fileName))
    {
        StreamWriter sw=new StreamWriter(fileStream);
        sw.WriteLine("12345678900");
        sw.Flush();
    }
    
    using (StreamWriter sw=File.AppendText(fileName))
    {
        string name = "今天是2021年1月30日";
        sw.Write(name);
        sw.Flush();
    }
    
    using (StreamWriter sw =File.AppendText(fileName))
    {
        string name = "098765432100";
        byte[] bytes = Encoding.Default.GetBytes(name);
        sw.BaseStream.Write(bytes,0,bytes.Length);
        sw.Flush();
    }
    ```

 - 读文件
    ```csharp
    //read
    foreach (var result in File.ReadAllLines(fileName))
    {
        Console.WriteLine(result);
    }

    string sResult = File.ReadAllText(fileName);   //读出来是字符串
    Byte[] byteContent = File.ReadAllBytes(fileName);   //读出来是字节
    string sResultByte = Encoding.UTF8.GetString(byteContent);  //字节转字符串

    using (FileStream stream=File.OpenRead(fileName))  //分批读取
    {
        int length = 5;
        int result = 0;
        do
        {
            byte[] bytes=new byte[length];
            result = stream.Read(bytes, 0, 5);
            for (int i = 0; i < result; i++)
            {
                Console.WriteLine(bytes[i].ToString());
            }
        } while (length==result);
    }
    ```

 - 递归查找
 <br>
 递归查找的场景是无法知道层数的查找有重复动作<br>
 递归一定要有跳出条件，避免死循环<br>
 递归对内存有压力<br>

    ```csharp
    public static List<DirectoryInfo> GetAllDirectory(string rootPath)
    {
        if(!Directory.Exists(rootPath))
            return new List<DirectoryInfo>();

        List<DirectoryInfo> directoryInfos=new List<DirectoryInfo>();  //容器
        DirectoryInfo directory=new DirectoryInfo(rootPath);
        directoryInfos.Add(directory);

        return GetChildDirectoryInfos(directoryInfos, directory);
    }

    /// <summary>
    /// 完成文件夹找出子目录，子目录再找
    /// </summary>
    /// <param name="directoryInfos"></param>
    /// <param name="directoryCurrent"></param>
    /// <returns></returns>
    private static List<DirectoryInfo> GetChildDirectoryInfos(List<DirectoryInfo> directoryInfos, DirectoryInfo directoryCurrent)
    {
        var childArray = directoryCurrent.GetDirectories();
        if (childArray.Length > 0)
        {
            directoryInfos.AddRange(childArray);
            foreach (var child in childArray)
            {
                GetChildDirectoryInfos(directoryInfos, child);
            }
        }

        return directoryInfos;
    }
    ```

### 序列化

 - BinarySerialize

    ```csharp
    public static void BinarySerialize()
    {
        string fileName = Path.Combine(Constant.SerializeDataPath, "BinarySerialize.txt");
        using (Stream fStream=new FileStream(fileName,FileMode.Create,FileAccess.ReadWrite))
        {
            //需要一个stream，这里是直接写入文件了
            List<Programmer> pList = DataFactory.BuildProgrammerList();
            BinaryFormatter binFormat=new BinaryFormatter(); //创建二进制序列化器
            binFormat.Serialize(fStream,pList);
        }

        using (Stream fStream=new FileStream(fileName,FileMode.Open,FileAccess.ReadWrite))
        {
            BinaryFormatter binFormat=new BinaryFormatter();  //创建二进制序列化器
            //使用二进制反序列化对象
            fStream.Position = 0;  //重置流位置
            List<Programmer> pList = (List<Programmer>) binFormat.Deserialize(fStream);//反序列化对象
        }
    }
    ``` 

 - SoapSerialize

    ```csharp
    public static void SoapSerialize()
    {
        //使用Soap序列化对象
        string fileName = Path.Combine(Constant.SerializeDataPath, "SoapSerizlize.txt");
        using (Stream fStream = new FileStream(fileName, FileMode.Create, FileAccess.ReadWrite))
        {
            List<Programmer> pList = DataFactory.BuildProgrammerList();
            SoapFormatter soapFormat = new SoapFormatter();
            soapFormat.Serialize(fStream, pList.ToArray());
        }

        using (Stream fStream = new FileStream(fileName, FileMode.Open, FileAccess.ReadWrite))
        {
            SoapFormatter soapFormat = new SoapFormatter();
            fStream.Position = 0;
            List<Programmer> pList = ((Programmer[])soapFormat.Deserialize(fStream)).ToList();
        }
    }
    ```

 - XmlSerialize

    ```csharp
    public static void XmlSerialize()
    {
        string fileName = Path.Combine(Constant.SerializeDataPath, "Student.xml");

        if (!Directory.Exists(Constant.SerializeDataPath))
        {
            Directory.CreateDirectory(Constant.SerializeDataPath);
        }
        using (Stream fStream=new FileStream(fileName,FileMode.Create,FileAccess.ReadWrite))
        {
            List<Programmer> pList = DataFactory.BuildProgrammerList();
            XmlSerializer xmlFormat = new XmlSerializer(typeof(List<Programmer>));  //xml序列化器，需要指定对象类型
            xmlFormat.Serialize(fStream,pList);
        }

        using (Stream fStream=new FileStream(fileName,FileMode.Open,FileAccess.ReadWrite))
        {
            XmlSerializer xmlFormat = new XmlSerializer(typeof(List<Programmer>));
            fStream.Position = 0;
            List<Programmer> pList = (List<Programmer>) xmlFormat.Deserialize(fStream);
        }
    }
    ```

 - JsonSerialize: 使用JsonConvert

### .Net Core 读取appsetting.josn文件内容

 ```csharp
 public class Constant
 {
     private static IConfigurationRoot configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
         .AddJsonFile("appsetting.json").Build();

     public static string SerializeDataPath=configuration.GetSection("address")["SerializePath"];
     public static string LogPath = configuration.GetSection("address:LogPath").Value;
     public static string LogPath2 = configuration.GetSection("address:LogPath2").Value;
     public static string LogMovePath = configuration.GetSection("address")["LogMovePath"];
     
 }
 ```

<br>
<br>
<br>

> appsetting.json

 ```json
 {
  "address": {
    "LogPath": "E:\\test\\log",
    "LogPath2": "E:\\test\\hhh",
    "LogMovePath": "E:\\test\\LogMove",
    "SerializePath": "E:\\test\\SerializePath"
  } 
 }
 ```
    
