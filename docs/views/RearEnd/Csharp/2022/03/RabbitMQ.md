---
title: 'RabbitMQ使用'
date: 2022-03-19
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

## 什么是RabbitMQ

RabbitMQ是消息队列。简称：MQ。MQ全称为Message Queue, 消息队列（MQ）是一种应用程序对应用程序的通信方法。应用程序通过读写出入队列的消息（针对应用程序的数据）来通信，而无需专用连接来链接它们。消息传递指的是程序之间通过在消息中发送数据进行通信，而不是通过直接调用彼此来通信，直接调用通常是用于诸如远程过程调用的技术。排队指的是应用程序通过队列来通信。队列的使用除去了接收和发送应用程序同时执行的要求。

### 微服务系统中使用RabbitMQ

在微服务系统中，微服务之间通信，主要是通过Http或者gRPC通信。由于http/gRPC通信方式是同步通信，如果遇到了高并发，同步通信就会导致微服务系统性能瓶颈，所以，为了解决微服务性能瓶颈问题。需要将同步通信换成异步通信方式。因此。就选用使用消息队列。

## RabbitMQ落地

### 准备环境

- 下载：[RabbitMQ下载地址](https://github.com/rabbitmq/rabbitmq-server/releases)、[RabbitMQ 运行环境erlang下载地址](https://github.com/erlang/otp/releases)

- 运行RabbitMQ

    1. 安装RabbitMQ管理插件

    ```bash
    rabbitmq-plugins enable rabbitmq_management
    ```

    2. 启动RabbitMQ

    ```bash
    rabbitmq-server 
    ```

    3. 查看RabbitMQ运行状态

    ```bash
    rabbitmqctl status
    ```

- 访问RabbitMQ管理界面。（http://localhost:15672）

### 项目实现

- 添加Nuget包：RabbitMQ.Client

- 创建RabbitMQ连接

    ```csharp
    public static IConnection CreateRabbitMQConnection(IConfiguration configuration) 
    {
        RabbitMQConfig rabbitMQConfig = configuration.GetSection("RabbitMQConfig").Get<RabbitMQConfig>();
        // 1、创建连接工厂
        var factory = new ConnectionFactory()
        {
            HostName = rabbitMQConfig.HostName,
            Port = rabbitMQConfig.Port,
            Password = rabbitMQConfig.Password,
            UserName = rabbitMQConfig.UserName,
            VirtualHost = rabbitMQConfig.VirtualHost
        };
        return factory.CreateConnection();
    }
    ```

- 生产者发送消息

    ```csharp
    var connection = RabbitMQConnectionFactory.CreateRabbitMQConnection(_configuration);
    var channel = connection.CreateModel();

    string productJson = JsonConvert.SerializeObject(productCreateDto);
    var body = Encoding.UTF8.GetBytes(productJson);

    #region 生产者
    //2、定义队列
    channel.QueueDeclare(queue: "Product_create",
                         durable: true, //消息持久化（防止rabbitmq宕机导致队列丢失风险）
                         exclusive: false,
                         autoDelete: false,
                         arguments: null);


    //3、发送消息
    var properties = channel.CreateBasicProperties();
    properties.Persistent = true;//设置消息持久化
    channel.BasicPublish(exchange: "",
                         routingKey: "Product_create",
                         basicProperties: properties,
                         body: body);
    ```

- 消费者接受消息

    ```csharp
    var connection = RabbitMQConnectionFactory.CreateRabbitMQConnection(_configuration);
    var channel = connection.CreateModel();

    //工作队列(单消费者)
    channel.QueueDeclare(queue: "Product_create", durable: true, exclusive: false, autoDelete: false, arguments: null);
    var consumer = new EventingBasicConsumer(channel);
    consumer.Received += (model, ea) =>
    {
        Console.WriteLine($"model:{model}");
        var body = ea.Body;
        var message = Encoding.UTF8.GetString(body.ToArray());
        Console.WriteLine(" [x] 创建商品 {0}", message);
        // 业务逻辑执行完成后，手动消息确认
        // 自动确认机制缺陷：
        // 1、消息是否正常添加到数据库当中,所以需要使用手工确认
        channel.BasicAck(ea.DeliveryTag, true);

    };
    //有多个消费者时，如果不设置，则采用轮询的方式来消费
    channel.BasicQos(0, 1, false);//Qos(防止多个消费者，能力不一致，导致的系统质量问题，每一次一个消费者只能成功消费一个)
    channel.BasicConsume(queue: "Product_create",
                         autoAck: false,//关闭自动消息确认
                         consumer: consumer); 
    ```

- 扇形交换机(fanout)：扇形交换机，就是订阅发布，生产者把消息发给给RabbitMQ---->RabbitMQ再把消息发送给交换机----->然后再发送给所有队列----->发送给消费者

- 直连交换机(direct)：直连交换机，就是指定订阅发布，生产者把消息发送给RabbitMQ---->RabbitMQ再把消息发送给交换机----->然后再发送给指定队列(通过routingKey匹配)----->发送给消费者

- 主题交换机(topic)：主题交换机，就是不同生产者匹配到相同消费者，生产者把消息发送给RabbitMQ---->RabbitMQ再把消息发送给交换机----->然后再发送给指定队列----->发送给消费者。* 号的缺陷：只能匹配一级，# 能够匹配一级及多级以上。

- RPC回调：客户端发送请求（消息）时，在消息的属性（MessageProperties，在AMQP协议中定义了14中properties，这些属性会随着消息一起发送）中设置两个值replyTo（一个Queue名称，用于告诉服务器处理完成后将通知我的消息发送到这个Queue中）和correlationId（此次请求的标识号，服务器处理完成后需要将此属性返还，客户端将根据这个id了解哪条请求被成功执行了或执行失败）；
服务器端收到消息并处理；服务器端处理完消息后0，0将生成一条应答消息到replyTo指定的Queue，同时带上correlationId属性；客户端之前已订阅replyTo指定的Queue，从中收到服务器的应答消息后，根据其中的correlationId属性分析哪条请求被执行了，根据执行结果进行后续业务处理。

    ```csharp
    //生产者
    var connection = RabbitMQConnectionFactory.CreateRabbitMQConnection(_configuration);
    var channel = connection.CreateModel();

    string productJson = JsonConvert.SerializeObject(productCreateDto);
    var body = Encoding.UTF8.GetBytes(productJson);
    //定义队列
    var queueName = channel.QueueDeclare().QueueName;
    var properties=channel.CreateBasicProperties();
    var correlationId = Guid.NewGuid().ToString();
    properties.CorrelationId = correlationId;
    properties.ReplyTo = queueName;
    properties.Persistent = true;//消息持久化
    //发送消息
    channel.BasicPublish("","Product_Create2",properties,body);

    //消息回调
    var consumer = new EventingBasicConsumer(channel);
    consumer.Received += (model, ea) =>
    {
        Console.WriteLine($"model:{model}");
        var body = ea.Body;
        // 1、业务逻辑处理
        var message = Encoding.UTF8.GetString(body.ToArray());
        if (ea.BasicProperties.CorrelationId == correlationId)
        {
            Console.WriteLine(" [x] 回调成功 {0}", message);
        }

    };

    channel.BasicQos(0, 1, false);
    channel.BasicConsume(queueName, true, consumer);

    ======================================================================

    //消费者
    var connection = RabbitMQConnectionFactory.CreateRabbitMQConnection(_configuration);
    var channel = connection.CreateModel();
    var queue = channel.QueueDeclare("Product_Create2", false, false, false, null);
    var consumer = new EventingBasicConsumer(channel);
    consumer.Received += (model, ea) =>
    {
        Console.WriteLine($"model:{model}");
        var body = ea.Body;

        var props = ea.BasicProperties;
        var replyProps = channel.CreateBasicProperties();
        replyProps.CorrelationId = props.CorrelationId;

        try
        {
            // 1、执行业务
            var message = Encoding.UTF8.GetString(body.ToArray());
            Console.WriteLine(" [x] 创建商品 {0}", message);

        }
        catch (Exception ex)
        {
            Console.WriteLine(" [.] " + ex.Message);
        }
        finally
        {
            Console.WriteLine("发送回调消息");
            var responseBytes = Encoding.UTF8.GetBytes("商品回调成功");
            channel.BasicPublish("", props.ReplyTo, basicProperties: replyProps, body: responseBytes);
        }
    };
    channel.BasicQos(0, 1, false);// Qos(防止多个消费者，能力不一致，导致的系统质量问题。每一次一个消费者只成功消费一个)

    channel.BasicConsume("Product_Create2", true, consumer); 
    ```
