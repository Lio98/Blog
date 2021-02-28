---
title: 'Async/await'
date: 2021-02-25
categories:
- "Csharp"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
---

## Async/await

 - await/async 是C#的保留关键字，通常是成对出现

 - async修饰方法，可以单独出现，但是通常有警告

 - await在方法体，只能出现在task/async方法前面，只有await会报错

 - 主线程调用async/await方法，主线程遇到await返回执行后续动作,await后面的代码会等着task任务的完成后再继续执行

 - 其实就像把await后面的代码包装成一个continue的回调动作,这个回调动作可能是Task子线程，也或者是主线程，也有可能是一个新线程

 - 一个async方法，如果没有返回值，可以返回Task

 - await/async能够用同步的方式编写代码，但又是非阻塞的

 ```csharp
 /// <summary>
 /// 实际上就是 返回一个long
 /// </summary>
 /// <returns></returns>
 public static async Task<long> SumAsync()
 {
     Console.WriteLine($"SumAsync 111 start ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
     long result = 0;
     await Task.Run(() =>
     {
         for (int i = 0; i < 10; i++)
         {
             Console.WriteLine(
                 $"SumAsync {i} await Task.Run ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
             Thread.Sleep(1000);

         }

         for (long k = 0; k < 999999999; k++)
         {
             result += 1;
         }
     });

     Console.WriteLine($"SumAsync 111 end ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
     //await Task.Run(() =>
     //{
     //    for (int k = 0; k < 10; k++)
     //    {
     //        Console.WriteLine(
     //            $"SumAsync {k} await Task.Run ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
     //        Thread.Sleep(1000);
     //    }
     //})
     return result;
 }

 public async static Task Test()
 {
     Console.WriteLine($"当前主线程id={Thread.CurrentThread.ManagedThreadId.ToString("00")}");

     //NoReturnNoAwait();
     //NoReturn();
     //for (int i = 0; i < 10; i++)
     //{
     //    Thread.Sleep(300);
     //    Console.WriteLine($"Main Thread Task ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}__i={i}");
     //}

     //Console.WriteLine($"Main Thread Task ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
     //Console.ReadKey();
     {
         //Task t = NoReturnTask();
         //Console.WriteLine($"Main Thread Task ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
         //t.Wait();//主线程等待Task完成 阻塞线程
         //await t;//await后的代码会由线程池的线程执行  非阻塞的
     }
     {
         Task<long> t = SumAsync();
         Console.WriteLine($"Main Thread Task ManagedThreadId={Thread.CurrentThread.ManagedThreadId.ToString("00")}");
         long Result = t.Result; //访问result  主线程等待Task的完成  主线程阻塞
         t.Wait();
     }
 }
 ```