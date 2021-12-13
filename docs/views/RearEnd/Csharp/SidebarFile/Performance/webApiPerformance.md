---
title: 'webApi优化'
date: 2021-12-11
categories:
- "Csharp"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: false
isShowDetailImg: true
---

webApi性能优化就是为了缩短客户端请求服务端的时间，提升webApi的性能

## 本地缓存

实现

1. 通过Nuget引入Microsoft.Extensions.Caching.Memory

2. 在Startup.cs文件中，在ConfigureServices方法中配置

```Csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddMemoryCache();
}
```

3. 在控制器中引入IMemoryCache memoryCache

4. 在控制器中将数据库数据写入到本地缓存​  

```Csharp
// 1、查询本地缓存
List<Seckill> seckills = memoryCache.Get<List<Seckill>>("seckills");
if (seckills == null)
{
// 1.1 查询数据库
seckills = SeckillService.GetSeckills().ToList();
// 1.2 添加到缓存
memoryCache.Set<List<Seckill>>("seckills", seckills);
}
return seckills;
```

### 1. 限制MemoryCache增长

条件：

TimeSpan

实现：

存储缓存时设置失效时间

```csharp
List<Seckill> seckills = memoryCache.Get<List<Seckill>>("seckills");
if (seckills == null)
{
    // 1.1 查询数据库
    seckills = SeckillService.GetSeckills().ToList();
    // 1.2 添加到缓存,设置失效时间
    memoryCache.Set<List<Seckill>>("seckills", seckills,TimeSpan.FromDays(1));
}
return seckills;
```

### 2. MemoryCache并发

条件：

TryGetValue

实现：

```csharp
List<Seckill> seckills = null;
//使用TryGetValue获取缓存数据
bool flag = memoryCache.TryGetValue<List<Seckill>>("seckills",out seckills);
if (!flag)
{
    // 1.1 查询数据库
    seckills = SeckillService.GetSeckills().ToList();
    // 1.2 添加到缓存
    memoryCache.Set<List<Seckill>>("seckills", seckills,TimeSpan.FromDays(1));
}
```

### 3. 设置缓存大小

条件：

SizeLimit 

实现：

1. 在Startup.cs文件中，在ConfigureServices方法中配置

```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddMemoryCache(option => {
        option.SizeLimit = 1024;
    });
}
```

2. 在控制器中将缓存写入

```csharp
// 1.1 查询数据库
seckills = SeckillService.GetSeckills().ToList();

var cacheEntryOptions = new MemoryCacheEntryOptions()
// Set cache entry size by extension method.
.SetSize(1)
// Keep in cache for this time, reset time if accessed.
.SetSlidingExpiration(TimeSpan.FromSeconds(3));

// 1.2 添加到缓存
memoryCache.Set<List<Seckill>>("seckills", seckills, cacheEntryOptions);
```

### 4. 后台更新缓存

条件：

IHostedService

实现：

1. 先创建ProductCacheIHostedService

```csharp
/// <summary>
/// 后台更新缓存
/// </summary>
public class ProductCacheIHostedService : IHostedService
{
    private readonly IMemoryCache memoryCache;// 本地缓存
    private readonly ISeckillService seckillService; // 商品Service
    public ProductCacheIHostedService(IMemoryCache memoryCache, ISeckillService seckillService)
    {
        this.memoryCache = memoryCache;
        this.seckillService = seckillService;
    }
    public Task StartAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
```

2. 在Startup文件中配置

```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddHostedService<ProductCacheIHostedService>();
}
```

## 分布式缓存

使用redis来处理分布式缓存

实现：

1. 通过Nuget引入Microsoft.Extensions.Caching.Redis

2. 在startup文件中配置redis

```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddDistributedRedisCache(options =>
    {
        options.Configuration = "localhost:6379";
    });
}
```

3. 在控制器中引入IDistributedCache distributedCache

4. 在控制器中将数据库数据写入到分布式缓存

```csharp
// 1、先查询redis分布式缓存
string seckillsString = distributedCache.GetString("seckills");
List<Seckill> seckills = null;
if (string.IsNullOrEmpty(seckillsString))
{
    // 1.1 查询数据库
    seckills = SeckillService.GetSeckills().ToList();
    seckillsString = JsonConvert.SerializeObject(seckills);
    // 1.2 存储到redis中
    distributedCache.SetString("seckills", seckillsString);
}
// 1.3反序列化成对象
seckills = JsonConvert.DeserializeObject<List<Seckill>>(seckillsString); 
```

## 响应缓存(Http缓存)

条件：

Marvin.Cache.Headers

实现：

1. 通过Nuget引入Marvin.Cache.Headers

2. 在Startup.cs文件中，在ConfigureServices方法中配置

```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddHttpCacheHeaders();
}
```

3. 在Configure方法中配置

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseHttpCacheHeaders();
}
```

### 1. Http缓存原理

工具

1. Cache-Control(http1.1协议以上版本)

2. Expires(http1.0协议版本)

3. Etag

4. Last-Modified

实现：

Http缓存个性化配置，直接在方法上进行配置：HttpCacheExpiration(CacheLocation = CacheLocation.Public, MaxAge = 60, NoStore =false)

## Http响应数据压缩

条件：

ResponseCompression

实现：

1. 在Startup.cs文件中，在ConfigureServices方法中配置

```csharp
public void ConfigureServices(IServiceCollection services)
{
    options.Providers.Add<BrotliCompressionProvider>();
​    options.Providers.Add<GzipCompressionProvider>();
​    options.Providers.Add<CustomCompressionProvider>();
​    options.MimeTypes =ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/svg+xml" });
}
```

2. 在Configure方法中配置

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseResponseCompression();
}
```

[代码优化文档](https://docs.microsoft.com/zh-cn/aspnet/core/performance/performance-best-practices?view=aspnetcore-5.0)