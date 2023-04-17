---
title: 'Redis'
date: 2021-03-21
categories:
- "Csharp"
tags:
- 学习笔记
isFull: true 
sidebar: true
isShowComments: true
isShowIndex: true
---

## Redis下载安装

### 下载(Windows版)

- github下载地址：https://github.com/MicrosoftArchive/redis/releases
### 安装

- 打开一个命令窗口，进入到解压的目录

- 输入命令：redis-server redis.windows.conf ，启动 Redis，成功后会告诉你端口号为6379 (此步骤为零时服务)

- 部署 redis 为 windows 下的服务，关掉上一个窗口（否则会启动不了服务），再打开一个新的命令窗口，输入命令：redis-server --service-install redis.windows.conf 默认端口6379，如需更改，请在 redis.windows.conf 查找。

- 安装后的启动服务命令：redis-server --service-start

   - 常用的服务命令

      1、卸载服务：redis-server --service-uninstall

      2、开启服务：redis-server --service-start

      3、停止服务：redis-server --service-stop

- 测试Redis，通过 cd 命令进入到你解压的目录，敲击命令redis-cli，通过set，get 命令查看查看是否成功。

**安装Redis到服务器外网访问**

- 修改redis.conf,主要是两个地方

   - 注释绑定的主机地址 #bind 127.0.0.1 ，或修改为 bind 0.0.0.0 原理都一样。原状态只允许本地访问

   - 修改redis的保护模式为no；protected-mode no

### Redis可视化工具 Redis Desktop Manager

- 下载 Redis Desktop Manager

   1、下载地址：https://redisdesktop.com/download

### NoSql

NoSql：非关系型数据库

特点：基于内存，没有严格的数据格式，不是一行数据的列必须一样，具有丰富的类型

Redis：Remote Dictionary Server ---- 远程字典服务器

- 基于内存管理（数据存在内存），速度快，实现了5种数据结构（分别应对各种具体需求），单线程模型的应用程序，单进程单线程，对外提供插入、查询、固化、集群功能

- 支持多个命令

- 不能当作数据库，Redis固化数据的功能，会把数据保存在硬盘上，Snapshot可以保存到硬盘，Down掉会丢失数据

- AOF：数据变化记录数据（很少用）

- Redis不是数据库，只能用来提升性能，不能作为数据的最终依据

- Redis的操作都是原子性的，不用考虑并发的问题

## Redis数据结构

- String：Key - Value结构的缓存，Value不超过512M

   - 利用String类型可以用来做防止超卖

- Hash：Key - Lis\<keyvaluepair\>结构，有HashId，Key，Value三部分，节约空间（zipmap的紧密排放的存储模式）、更新/访问方便，字段是可以随意定制的，没有严格约束的，非常灵活

- Set：key-List\<value\> 就是一个数据集合，无序，去重

   - 利用set可以做投票限制/IP统计去重...

- ZSet：是一个有序集合，去重

- List：key-Linklist\<value\>

   - List可以用来做队列

   - 生产消费模式：一个数据源只能由一个接收者

   - 订阅发布模式：一个数据源，多个接受者

## Redis分布式锁

```csharp
public class RedisLock
{
    // 1、redis连接管理类
    private ConnectionMultiplexer connectionMultiplexer = null;

    // 2、redis数据操作类
    private IDatabase database = null;
    public RedisLock()
    {
        connectionMultiplexer = ConnectionMultiplexer.Connect("192.168.44.4:6379");

        database = connectionMultiplexer.GetDatabase(0);
    }

    /// <summary>
    /// 加锁
    /// 1、key:锁名称
    /// 2、value:谁加的这把锁。线程1
    /// 3、exprie：过期时间：目的是为了防止死锁
    /// </summary>
    public void Lock()
    {
        while (true)
        {
            bool flag = database.LockTake("redis-lock", Thread.CurrentThread.ManagedThreadId, TimeSpan.FromSeconds(60));
            // 1、true 加锁成功 2、false 加锁失败
            if (flag)
            {
                break;
            }
            // 防止死循环。通过等待时间，释放资源
            Thread.Sleep(10);
        }
    }

    /// <summary>
    /// 解锁
    /// </summary>
    public void UnLock()
    {
        bool flag = database.LockRelease("redis-lock", Thread.CurrentThread.ManagedThreadId);

        // true:释放成功  false 释放失败
        // 方案：释放资源
        connectionMultiplexer.Close();
    }
}
```

## 哨兵模式

哨兵模式的主要作用：自动故障转移，一旦发现主库宕机，则在从库中通过选举新的master进行故障转移

一个哨兵模式集群中，可以运行多个哨兵进程，这些进程使用流言协议来接受关于master是否下线的信息，并使用投票协议来决定是否执行自动故障转移，以及选择那个slave作为新的master。
每个哨兵会向其他哨兵定时发送消息，以确认对方是否活着，如果发现对方在指定时间内未回应，则暂时认为对方宕机了


redis.conf配置文件各参数详解
```yaml
# redis进程是否以守护进程的方式运行，yes为是，no为否(不以守护进程的方式运行会占用一个终端)。
daemonize no
# 指定redis进程的PID文件存放位置
pidfile /var/run/redis.pid
# redis进程的端口号
port 7001
#是否开启保护模式，默认开启。要是配置里没有指定bind和密码。开启该参数后，redis只会本地进行访问，拒绝外部访问。要是开启了密码和bind，可以开启。否则最好关闭设置为no。
protected-mode yes
# 绑定的主机地址
bind 0.0.0.0
# 客户端闲置多长时间后关闭连接，默认此参数为0即关闭此功能
timeout 300
# redis日志级别，可用的级别有debug.verbose.notice.warning
loglevel verbose
# log文件输出位置，如果进程以守护进程的方式运行，此处又将输出文件设置为stdout的话，就会将日志信息输出到/dev/null里面去了
logfile stdout
# 设置数据库的数量，默认为0可以使用select <dbid>命令在连接上指定数据库id
databases 16
# 指定在多少时间内刷新次数达到多少的时候会将数据同步到数据文件
save <seconds> <changes>
# 指定存储至本地数据库时是否压缩文件，默认为yes即启用存储
rdbcompression yes
# 指定本地数据库文件名
dbfilename dump.db
# 指定本地数据问就按存放位置
dir ./
# 指定当本机为slave服务时，设置master服务的IP地址及端口，在redis启动的时候他会自动跟master进行数据同步
replicaof <masterip> <masterport>
# 当master设置了密码保护时，slave服务连接master的密码
masterauth <master-password>
# 设置redis连接密码，如果配置了连接密码，客户端在连接redis是需要通过AUTH<password>命令提供密码，默认关闭
requirepass footbared
# 设置同一时间最大客户连接数，默认无限制。redis可以同时连接的客户端数为redis程序可以打开的最大文件描述符，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis会关闭新的连接并向客户端返回 max number of clients reached 错误信息
maxclients 128
# 指定Redis最大内存限制，Redis在启动时会把数据加载到内存中，达到最大内存后，Redis会先尝试清除已到期或即将到期的Key。当此方法处理后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis新的vm机制，会把Key存放内存，Value会存放在swap区
maxmemory<bytes>
# 指定是否在每次更新操作后进行日志记录，Redis在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为redis本身同步数据文件是按上面save条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为no。
appendonly no
# 指定跟新日志文件名默认为appendonly.aof
appendfilename appendonly.aof
# 指定更新日志的条件，有三个可选参数 - no：表示等操作系统进行数据缓存同步到磁盘(快)，always：表示每次更新操作后手动调用fsync()将数据写到磁盘(慢，安全)， everysec：表示每秒同步一次(折衷，默认值)；
appendfsync everysec
```

主机配置
```yaml
bind：0.0.0.0
port：7001
protected-mode：no
daemonize：yes
logfile：./redis.log
requirepass：123456
masterauth：123456
```

从机配置
```yaml
bind：0.0.0.0
port：7002
protected-mode：no
daemonize：yes
logfile：./redis.log
replicaof 127.0.0.1 7001
masterauth：123456
```

启动redis
```bash
./redis-server ./7001/redis7001.conf
```

sentinel.conf配置文件各参数详解

```yaml
# 哨兵sentinel实例运行的端口，默认26379  
port 27001
# 哨兵sentinel的工作目录
dir ./
# 是否开启保护模式，默认开启。
protected-mode:no
# 是否设置为后台启动。
daemonize:yes
# 哨兵sentinel的日志文件
logfile:./sentinel.log
# 哨兵sentinel监控的redis主节点的 
## ip：主机ip地址
## port：哨兵端口号
## master-name：可以自己命名的主节点名字（只能由字母A-z、数字0-9 、这三个字符".-_"组成。）
## quorum：当这些quorum个数sentinel哨兵认为master主节点失联 那么这时 客观上认为主节点失联了  
# sentinel monitor <master-name> <ip> <redis-port> <quorum>  
sentinel monitor mymaster 127.0.0.1 7001 1
# 当在Redis实例中开启了requirepass，所有连接Redis实例的客户端都要提供密码。
# sentinel auth-pass <master-name> <password>  
sentinel auth-pass mymaster 123456 
# 指定主节点应答哨兵sentinel的最大时间间隔，超过这个时间，哨兵主观上认为主节点下线，默认30秒  
# sentinel down-after-milliseconds <master-name> <milliseconds>
sentinel down-after-milliseconds mymaster 30000  
# 指定了在发生failover主备切换时，最多可以有多少个slave同时对新的master进行同步。这个数字越小，完成failover所需的时间就越长；反之，但是如果这个数字越大，就意味着越多的slave因为replication而不可用。可以通过将这个值设为1，来保证每次只有一个slave，处于不能处理命令请求的状态。
# sentinel parallel-syncs <master-name> <numslaves>
sentinel parallel-syncs mymaster 1  
# 故障转移的超时时间failover-timeout，默认三分钟，可以用在以下这些方面：
## 1. 同一个sentinel对同一个master两次failover之间的间隔时间。  
## 2. 当一个slave从一个错误的master那里同步数据时开始，直到slave被纠正为从正确的master那里同步数据时结束。  
## 3. 当想要取消一个正在进行的failover时所需要的时间。
## 4.当进行failover时，配置所有slaves指向新的master所需的最大时间。不过，即使过了这个超时，slaves依然会被正确配置为指向master，但是就不按parallel-syncs所配置的规则来同步数据了
# sentinel failover-timeout <master-name> <milliseconds>  
sentinel failover-timeout mymaster 180000
# 当sentinel有任何警告级别的事件发生时（比如说redis实例的主观失效和客观失效等等），将会去调用这个脚本。一个脚本的最大执行时间为60s，如果超过这个时间，脚本将会被一个SIGKILL信号终止，之后重新执行。
# 对于脚本的运行结果有以下规则：  
## 1. 若脚本执行后返回1，那么该脚本稍后将会被再次执行，重复次数目前默认为10。
## 2. 若脚本执行后返回2，或者比2更高的一个返回值，脚本将不会重复执行。  
## 3. 如果脚本在执行过程中由于收到系统中断信号被终止了，则同返回值为1时的行为相同。
# sentinel notification-script <master-name> <script-path>  
sentinel notification-script mymaster /var/redis/notify.sh

# 这个脚本应该是通用的，能被多次调用，不是针对性的。
# sentinel client-reconfig-script <master-name> <script-path>
sentinel client-reconfig-script mymaster /var/redis/reconfig.sh
```

哨兵配置文件设置
```yaml
#端口默认为26379。
port:26379
#关闭保护模式，可以外部访问。
protected-mode:no
#设置为后台启动。
daemonize:yes
#日志文件。
logfile:./sentinel.log
#指定主机IP地址和端口，并且指定当有2台哨兵认为主机挂了，则对主机进行容灾切换。
sentinel monitor mymaster 127.0.0.1 7001 1
#当在Redis实例中开启了requirepass，这里就需要提供密码。
sentinel auth-pass mymaster 123456
#这里设置了主机多少秒无响应，则认为挂了。
sentinel down-after-milliseconds mymaster 3000
#主备切换时，最多有多少个slave同时对新的master进行同步，这里设置为默认的1。
sentinel parallel-syncs mymaster 1
#故障转移的超时时间，这里设置为三分钟。
sentinel failover-timeout mymaster 180000
```

启动哨兵命令

```bash
./redis-sentinel ./7001/sentinel27001.conf
```
通过下面命令查看集群启动情况

```bash
./redis-cli -p 27001
```
![](https://image.xjq.icu/2023/3/18/1679117904324_Snipaste_2023-03-18_13-37-49.jpg)

C#代码连接集群模式

```csharp
using StackExchange.Redis;

namespace RedisDemo.Utils
{
    public class RedisUtils
    {
        private static ConfigurationOptions configurationOptions = null;
        private static readonly object Locker = new object();
        private static ConnectionMultiplexer _redisConn;

        public static ConnectionMultiplexer RedisConn
        {
            get
            {
                if (_redisConn == null)
                {
                    // 锁定某一代码块，让同一时间只有一个线程访问该代码块
                    lock (Locker)
                    {
                        if (_redisConn == null || !_redisConn.IsConnected)
                        {
                            if (configurationOptions == null) 
                            {
                                configurationOptions = new ConfigurationOptions();
                                configurationOptions.Password = "123456";
                                configurationOptions.EndPoints.Add("192.168.88.12", 7001);
                                configurationOptions.EndPoints.Add("192.168.88.12", 7002);
                                configurationOptions.EndPoints.Add("192.168.88.12", 7003);
                            }
                            _redisConn = ConnectionMultiplexer.Connect(configurationOptions);
                        }
                    }
                }
                return _redisConn;
            }
        }
    }
}

```

## Redis-cluster集群

redis-cluster架构说明

- 6个redis实例。redis-cluster运行需要的角色实例

- redis-trib.rb。分配redis主从角色

### 部署

总体需要用到的文件结构
![](https://image.xjq.icu/2022/5/4/1651675852702_redis.jpg)

- 在redis文件夹中创建6个配置文件，添加如下内容

   ```yuml
   port 6380
   bind 127.0.0.1        
   appendonly yes
   appendfilename "appendonly.6380.aof"   
   cluster-enabled yes                                    
   cluster-config-file nodes.6380.conf
   cluster-node-timeout 15000
   cluster-slave-validity-factor 10
   cluster-migration-barrier 1
   cluster-require-full-coverage yes
   ```
![](https://image.xjq.icu/2022/5/4/1651675215343_redis-conf.jpg)

- 启动6个redis实例：逐一如下命令，需要修改配置文件名

   ```bash
   redis-server.exe redis.6380.conf
   ```

- redis-cluster 主从角色分配

   1. ruby 安装。[下载地址](https://rubyinstaller.org/downloads/)，下载exe文件后进行安装。

   2. redis-3.2.2.gem 下载。[下载地址](https://rubygems.org/gems/redis)，下载后进入ruby的安装目录bin文件夹下，通过gem命令文件安装

      ```bash
      gem install –local D:\Codes\Csharp\Net_Architecture\LT.Business\Redis-cluster\redis-4.6.0.gem
      ```
      ![](https://image.xjq.icu/2022/5/4/1651675329098_gem.jpg)

   3. redis-trib.rb 下载。[下载地址](https://github.com/beebol/redis-trib.rb)，进入到redis-trib.rb目录下，通过cmd使用redis-trib.rb

   4. redis-trib.rb 搭建redis集群主从

      ![](https://image.xjq.icu/2022/5/4/1651675573461_redis-trib-options.jpg)

      ```bash
      ruby redis-trib.rb create --replicas 1 127.0.0.1:6380 127.0.0.1:6381 127.0.0.1:6382 127.0.0.1:6383 127.0.0.1:6384 127.0.0.1:6385
      ```
      ![](https://image.xjq.icu/2022/5/4/1651675497871_redis-trib.jpg)

   5. redis-cluster 集群状态检查

      ```bash
      ruby redis-trib.rb check 127.0.0.1:6380
      ```
      ![](https://image.xjq.icu/2022/5/4/1651675419991_redis-trib-check.jpg)




