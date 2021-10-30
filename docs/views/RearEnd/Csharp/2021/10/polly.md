---
title: 'polly'
date: 2021-10-10
categories:
- "微服务"
tags:
- Polly
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
---

# 容错机制

## 什么是容错机制

客户端在调用微服务时，当调用微服务出现故障时，能够自动进行故障转移就是容错机制

容错机制的目的是保证微服务的高可用

## 实现扩展性的容错机制

条件

1、FailOverCluster

2、ICluster

步骤

1、创建ICluster接口

2、创建FailOverCluster实现类

```c#
/// <summary>
/// 故障转移容错机制
/// </summary>
public class FailOverCluster : ICluster
{
    private readonly IServiceDiscovery serviceDiscovery;
    private readonly ILoadBalance loadBalance;
    private readonly IHttpClientFactory httpClientFactory;
    private readonly IServiceCollection _services;
    public FailOverCluster(IServiceDiscovery serviceDiscovery,
                                ILoadBalance loadBalance,
                                IHttpClientFactory httpClientFactory)
    {
        this.serviceDiscovery = serviceDiscovery;
        this.loadBalance = loadBalance;
        this.httpClientFactory = httpClientFactory;
    }
    public async Task<T> GetExecute<T>(string Serviceshcme, string ServiceName, string serviceLink)
    {
        // 故障重试次数
        int retryCount = 0;
        HttpResponseMessage response =null;
        for(int i = 0; i<3;i++)
        {
                // 1、获取服务
                IList<ServiceUrl> serviceUrls = await serviceDiscovery.Discovery(ServiceName);
                // 2、负载均衡服务
                ServiceUrl serviceUrl = loadBalance.Select(serviceUrls);
                if (serviceUrl == null)
                {
                    throw new Exception("服务地址不存在");
                }
            try
            {
                HttpClient httpClient = httpClientFactory.CreateClient("mrico");
                response = await httpClient.GetAsync(serviceUrl.Url + serviceLink);
                // 3.1、json转换成对象
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    break;
                } else
                {
                    throw new Exception($"{await response.Content.ReadAsStringAsync()}");
                }

            }
            catch (HttpRequestException e)
            {
                if (retryCount == 3)
                {
                    throw new Exception($"{ServiceName}微服务请求异常");
                }
                Console.WriteLine($"{e.GetType()}");
                // 1、故障重试+1
                ++retryCount;
                Console.WriteLine($"服务请求异常:{e.Message},故障转移{retryCount}次");
            }

        }
        // 4、返回结果
        string json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<T>(json);
    }
}
```

3、然后 进入到startup文件中讲将ICluster，FailOverCluster注入到IOC容器,

```c#
public void ConfigureServices(IServiceCollection services)
{
    .....
    services.AddSingleton<ICluster, FailOverCluster>();

    services.AddControllers();
}                   
```

4、然后ConsulHttpClient依赖注入

ICluster FailOverCluster

缺陷：当微服务集群宕机之后，微服务并发量起来之后，所有的微服务都在重试一个微服务的时候，会影响到性能急剧下降。

## 实现熔断机制

条件

1、Polly

步骤

1、在微服务core项目中，添加Polly程序集

Microsoft.Extensions.Http.Polly

2、然后在startup文件中，在services.AddHttpClient()方法上添加

```c#
services.AddHttpClient("mrico")
        .AddPolicyHandler(Policy<HttpResponseMessage>.Handle<Exception>().CircuitBreakerAsync(3, TimeSpan.FromSeconds(60), (ex, ts) =>
        {
            Console.WriteLine($"断路器开启，异常消息：{ex.Exception.Message}");
            Console.WriteLine($"断路器开启时间：{ts.TotalSeconds}s");
        }, () =>
        {                
          Console.WriteLine($"断路器重置");
        }, () =>
        {
            Console.WriteLine($"断路器半开启(一会开，一会关)");
        }))
```