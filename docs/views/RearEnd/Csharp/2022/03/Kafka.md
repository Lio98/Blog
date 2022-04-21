---
title: 'Kafka使用'
date: 2022-03-26
categories:
- "Csharp"
tags:
- MicroService
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

## 什么是Kafka

Kafka是消息队列。简称：MQ。MQ全称为Message Queue, 消息队列（MQ）是一种应用程序对应用程序的通信方法。应用程序通过读写出入队列的消息（针对应用程序的数据）来通信，而无需专用连接来链接它们。消息传递指的是程序之间通过在消息中发送数据进行通信，而不是通过直接调用彼此来通信，直接调用通常是用于诸如远程过程调用的技术。排队指的是应用程序通过队列来通信。队列的使用除去了接收和发送应用程序同时执行的要求。

## Kafka落地

### 准备环境

- 下载：[Kafka下载地址](https://archive.apache.org/dist/kafka/)

- 运行Kafka，需要先运行zookeeper

    ```bash
    zookeeper-server-start.bat ../../config/zookeeper.properties
    ```

- 运行Kafka

    ```bash
    kafka-server-start.bat ../../config/server.properties
    ```

### 项目实现

- 添加Nuget包：Confluent.Kafka

- 创建生产者

    ```csharp
    public ProducerBuilder<string, string> CreateProducer(IConfiguration configuration, bool tansactional,string groupId = "test")
    {
        var kafkaConfig = configuration.GetSection("KafKaConfig").Get<KafkaConfig>();
        // 1、创建连接工厂
        var factory = new ProducerConfig()
        {
            BootstrapServers = kafkaConfig.BootstrapServers,
            MessageTimeoutMs = kafkaConfig.MessageTimeoutMs,
            EnableIdempotence = kafkaConfig.EnableIdempotence, // 保证消息：不重复发送，失败重试
        };
        if (tansactional) 
        {
            factory.TransactionalId = Guid.NewGuid().ToString();
        }
        return new ProducerBuilder<string, string>(factory) ;
    }
    ```

- 创建消费者

    ```csharp
    /// <summary>
    /// 创建消费者构建器
    /// </summary>
    /// <param name="groupId"></param>
    /// <param name="enableAutoCommit">bool类型转为string,是否自提交</param>
    /// <returns></returns>
    public  ConsumerBuilder<string,string> CreateConsume(IConfiguration configuration, string groupId= "test", stringenableAutoCommit=null)
    {
        var kafkaConfig = configuration.GetSection("KafKaConfig").Get<KafkaConfig>();
        // 1、创建连接工厂
        var factory = new ConsumerConfig()
        {
            BootstrapServers = kafkaConfig.BootstrapServers,
            AutoOffsetReset = kafkaConfig.AutoOffsetReset,
            GroupId = groupId,
            EnableAutoCommit = string.IsNullOrWhiteSpace(enableAutoCommit) ? kafkaConfig.EnableAutoCommit : Convert.ToBoolean(enableAutoCommit),//自动消息确认
            FetchMinBytes = kafkaConfig.FetchMinBytes, //批量获取最小字节数
            FetchMaxBytes = kafkaConfig.FetchMaxBytes //批量获取最大字节数
        };
        return new ConsumerBuilder<string, string>(factory);
    }
    ```

- 分区轮询算法

    ```csharp
    /// <summary>
    /// 分区随机算法
    /// </summary>
    /// <param name="topic"></param>
    /// <param name="partitionCount"></param>
    /// <param name="keyData"></param>
    /// <param name="keyIsNull"></param>
    /// <returns></returns>
    public Partition RandomPartitioner(string topic, int partitionCount, ReadOnlySpan<byte> keyData, bool keyIsNull)
    {
        Random random = new Random();
        int partition = random.Next(partitionCount - 1);
        return new Partition(partition);
    }

    /// <summary>
    /// 分区轮询算法。两个分区得到消息是一致的
    /// </summary>
    /// <param name="topic"></param>
    /// <param name="partitionCount"></param>
    /// <param name="keyData"></param>
    /// <param name="keyIsNull"></param>
    /// <returns></returns>
    static int requestCount = 0;
    public Partition RoundRobinPartitioner(string topic, int partitionCount, ReadOnlySpan<byte> keyData, bool keyIsNull)
    {
        int partition = requestCount % partitionCount;
        requestCount++;
        return new Partition(partition);
    }
    ```

- 生产者发送消息

    ```csharp

    [HttpPost]
    [Route("CreateOrder")]
    public IEnumerable<OrderCreateDto> CreateOrder(OrderCreateDto orderCreateDto) 
    {
        #region 生产者，根据Message.Key使用hash一致性指定分区，可集群向多个分区发送消息，一个node固定只能往一个分区发送============
        var orderJson = JsonConvert.SerializeObject(orderCreateDto);
        var builder = _kafkaConnectionFactory.CreateProduce(_configuration, false);
        builder.SetDefaultPartitioner(_kafkaConnectionFactory.RoundRobinPartitioner);//设置默认的分区器
        var producer = builder.Build();
        try
        {
            //默认根据key使用hash一致性指定分区
            var dr = producer.ProduceAsync("Order_Create", new Message<string, string> { Key = "order-1", Value = orderJson }).GetAwaiter().GetResult();
            _logger.LogInformation("发送事件 {0} 到 {1} 成功", dr.Value, dr.TopicPartitionOffset);
        }
        catch (ProduceException<string, string> ex)
        {
            _logger.LogError(ex, "发送事件到 {0} 失败，原因 {1} ", "order", ex.Error.Reason);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "发送事件失败，失败原因 {0}，错误堆栈{1} ", "order", ex.Message, ex.StackTrace);
        }
        #endregion


        #region 生产者---带事务---多消息发送
        var orderJson = JsonConvert.SerializeObject(orderCreateDto);
        var builder = _kafkaConnectionFactory.CreateProducer(_configuration,true);
        var producer = builder.Build();
        //初始化事务
        producer.InitTransactions(TimeSpan.FromSeconds(60));  //带事务需要在ProducerConfig中设置TransactionalId，设置了TransactionalId不初始化事务会报错
        try
        {
            //开启事务
            producer.BeginTransaction();
            for (int i = 0; i < 10; i++)
            {
                //默认根据key使用hash一致性指定分区
                var dr = producer.ProduceAsync("Order_Create", new Message<string, string> { Key = "order-1", Value = orderJson }).GetAwaiter().GetResult();
                _logger.LogInformation("发送事件 {0} 到 {1} 成功", dr.Value, dr.TopicPartitionOffset);
            }

            //提交事务
            producer.CommitTransaction();
        }
        catch (ProduceException<string, string> ex)
        {
            _logger.LogError(ex, "发送事件到 {0} 失败，原因 {1} ", "order", ex.Error.Reason);
            //关闭事务
            producer.AbortTransaction();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "发送事件失败，失败原因 {0}，错误堆栈{1} ", "order", ex.Message, ex.StackTrace);
        }
        #endregion


        #region 固定分区发送
        var orderJson = JsonConvert.SerializeObject(orderCreateDto);
        var builder = _kafkaConnectionFactory.CreateProducer(_configuration, true);
        var producer = builder.Build();
        //初始化事务
        producer.InitTransactions(TimeSpan.FromSeconds(60));  //带事务需要在ProducerConfig中设置TransactionalId，设置了TransactionalId不初始化事务会报错
        try
        {
            //开启事务
            producer.BeginTransaction();
            TopicPartition topicPartition = new TopicPartition("Order_Create", 0);//指定分区发送消息
            for (int i = 0; i < 10; i++)
            {
                //固定分区发送
                var dr = producer.ProduceAsync(topicPartition, new Message<string, string> { Key = "order", Value = orderJson }).GetAwaiter().GetResult();
                _logger.LogInformation("发送事件 {0} 到 {1} 成功", dr.Value, dr.TopicPartitionOffset);
            }

            //提交事务
            producer.CommitTransaction();
        }
        catch (ProduceException<string, string> ex)
        {
            _logger.LogError(ex, "发送事件到 {0} 失败，原因 {1} ", "order", ex.Error.Reason);
            //关闭事务
            producer.AbortTransaction();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "发送事件失败，失败原因 {0}，错误堆栈{1} ", "order", ex.Message, ex.StackTrace);
        }
        #endregion
    }
    
    ```

- 消费者接收消息

    ```csharp
    [HttpGet]
    [Route("GetOrder")]
    public async Task<Order> GetOrder()
    {
        //用异步线程来消息消息，不阻塞主线程
        new Task(() =>
        {
            try
            {
                #region 工作队列(单消费者) Consumer
                var builder = _kafkaConnectionFactory.CreateConsumer(_configuration);
                var consumer = builder.Build();
                //订阅
                consumer.Subscribe("Order_Create");
                while (true)
                {
                    try
                    {
                        //消费(自动确认)
                        var result = consumer.Consume();

                        //执行业务逻辑---->执行失败，消息会丢失
                        string key = result.Message.Key;
                        string value = result.Message.Value;

                        _logger.LogInformation($"创建商品：Key:{key}");
                        _logger.LogInformation($"创建商品：Order:{value}");

                    }
                    catch (Exception ex)
                    {
                        _logger.LogInformation($"异常：Order:{ex}");
                    }
                }
                #endregion

                #region 工作队列(单消费者) -- 手动确认消息
                var builder = _kafkaConnectionFactory.CreateConsumer(_configuration, "Order", "false");
                var consumer = builder.Build();
                //订阅
                consumer.Subscribe("Order_Create");
                while (true)
                {
                    //消费
                    var result = consumer.Consume();
                    //业务逻辑
                    string key = result.Message.Key;
                    var value = result.Message.Value;

                    _logger.LogInformation($"创建商品：Key:{key}");
                    _logger.LogInformation($"创建商品：Order:{value}");

                    //手动提交(向kafka确认消息)  --偏移量--消息的序列号
                    consumer.Commit(result);
                }
                #endregion

                #region 重置偏移量
                var builder = _kafkaConnectionFactory.CreateConsumer(_configuration,"Order", "true");
                var consumer = builder.Build();
                consumer.Subscribe("Order_Create");
                //重置偏移量
                consumer.Assign(new TopicPartitionOffset(new TopicPartition("Order_Create", 0), 9));

                while (true)
                {
                    //消费
                    var result = consumer.Consume();
                    //获取偏移量
                    _logger.LogInformation($"订单消息偏移量：Offset{result.Offset}");
                    //业务处理
                    string key = result.Message.Key;
                    var value = result.Message.Value;

                    _logger.LogInformation($"创建商品：Key:{key}");
                    _logger.LogInformation($"创建商品：Order:{value}");

                    //consumer.Commit();
                }
                #endregion

                #region 订阅发布，存储偏移量，重置偏移量
                var builder = _kafkaConnectionFactory.CreateConsumer(_configuration,"Order", "true");
                var consumer = builder.Build();
                consumer.Subscribe("Order_Create");

                string offset = _distributedCache.GetString("Order_Create");
                if (string.IsNullOrWhiteSpace(offset))
                {
                    offset = "-1";
                }
                consumer.Assign(new TopicPartitionOffset(new TopicPartition("Order_Create", 0), int.Parse(offset)));

                while (true)
                {
                    //消费
                    var result = consumer.Consume();
                    //获取偏移量
                    _logger.LogInformation($"订单消息偏移量：Offset{result.Offset}");
                    //业务处理
                    string key = result.Message.Key;
                    var value = result.Message.Value;

                    _logger.LogInformation($"创建商品：Key:{key}");
                    _logger.LogInformation($"创建商品：Order:{value}");
                    _distributedCache.SetString("Order_Create", result.Offset.Value.ToString());
                }
                #endregion

                #region 订阅发布（广播消费） 创建订单  发送短信 ---GroupId  集群消费消息，一个消费者只能对应一个分区
                var builder = _kafkaConnectionFactory.CreateConsumer(_configuration,"Order", "true");
                var consumer = builder.Build();
                consumer.Subscribe("Order_Create");

                string offset = _distributedCache.GetString("Order_Create");
                if (string.IsNullOrWhiteSpace(offset))
                {
                    offset = "-1";
                }
                consumer.Assign(new TopicPartitionOffset(new TopicPartition("Order_Create", 0), int.Parse(offset) + 1));//设置分区和偏移量

                while (true)
                {
                    //消费
                    var result = consumer.Consume();
                    //获取偏移量
                    _logger.LogInformation($"订单消息偏移量：Offset{result.Offset}");
                    //业务处理
                    string key = result.Message.Key;
                    var value = result.Message.Value;

                    _logger.LogInformation($"创建商品：Key:{key}");
                    _logger.LogInformation($"创建商品：Order:{value}");
                    _distributedCache.SetString("Order_Create", result.Offset.Value.ToString());
                }
                #endregion

                #region 订单延时消费  
                // 原理：
                //1、生产者调用consumer.Pause（）。暂定消费 var result = consumer.Consume();
                //2、然后使用定时器Timer每隔5秒钟调用consumer.Resume。重新消费
                var builder = _kafkaConnectionFactory.CreateConsumer(_configuration, "Order", "false");
                var consumer = builder.Build();
                //订阅
                consumer.Subscribe("Order_Create");
                string offset = _distributedCache.GetString("Order_Create");
                if (string.IsNullOrWhiteSpace(offset))
                {
                    offset = "-1";
                }
                consumer.Assign(new TopicPartitionOffset(new TopicPartition("Order_Create", 0), int.Parse(offset) + 1));//设置分区和偏移量
                while (true)
                {
                    //恢复消息
                    new Timer((s) =>
                    {
                        consumer.Resume(new List<TopicPartition> { new TopicPartition("Order_Create", 0) });
                    }, null, Timeout.Infinite, Timeout.Infinite).Change(5000, 5000);
                    //暂停消费
                    consumer.Pause(new List<TopicPartition> { new TopicPartition("Order_Create", 0) });
                    var result = consumer.Consume();//批量获取消息，根据字节数
                    try
                    {
                        // 2.1、获取偏移量
                        _logger.LogInformation($"订单消息偏移量：Offset:{result.Offset}");
                        // 3、业务处理
                        string key = result.Message.Key;
                        string value = result.Message.Value;
                        _logger.LogInformation($"创建商品：Key:{key}------{DateTime.Now}");
                        _logger.LogInformation($"创建商品：Order:{value}------{DateTime.Now}");

                        // 2.2、把kafka队列中偏移量存起来。redis mysql
                        // 2.3、重置kafka队列的偏移量
                        _distributedCache.SetString("create-order-1", result.Offset.Value.ToString());
                        // 3、手动提交
                        consumer.Commit(result);


                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        consumer.Pause(new List<TopicPartition> { new TopicPartition("Order_Create", 0) });
                        Console.WriteLine($"暂停消费----{DateTime.Now}");

                    }
                }
                #endregion
            }
            catch (Exception ex) 
            {
                Console.WriteLine(ex.ToString());
            }
        }).Start();

        Console.WriteLine("Order监听订单......");
        return null;
    }
    ```