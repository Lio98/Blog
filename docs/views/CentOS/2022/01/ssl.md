---
title: 'acme.sh申请Let’s Encrypt免费的SSL证书'
date: 2022-01-27
categories:
- "CentOS"
tags:
- 学习笔记
sidebar: true
isFull: true
isShowComments: true
isShowIndex: true
isShowDetailImg: true
---

:::tip
Let’s Encrypt —— 是一个由非营利性组织 互联网安全研究小组（ISRG）提供的免费、自动化和开放的证书颁发机构（CA）。简单的说，就是为网站提供免费的 SSL/TLS 证书。

acme.sh 实现了 acme 协议,可以从letsencrypt生成免费的证书。接下来将为大家介绍怎样申请Let’s Encrypt通配符证书。

:::

::: tip github参考文档
https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E
:::

## 安装acme.sh

```bash
curl  https://get.acme.sh | sh -s email=my@example.com
```
![](https://image.xjq.icu/2022/1/27/1643261058881_installacme.png)

显示这样代表安装成功，理论上会自动添加一个acme.sh别名，但有时候并不会生成，需要手动执行以下命令：

```bash
source ~/.bashrc
```

**注意**：如果提示没有curl，可以运行下面命令安装

```bash
apt update -y          # Debian/Ubuntu 命令
apt install -y curl    #Debian/Ubuntu 命令
yum update -y          #CentOS 命令
yum install -y curl    #CentOS 命令
```

## 生成证书

acme.sh实现了acme协议支持的所有验证协议

一般有两种方式验证：http和dns

### http方式

http方式需要在你的网站根目录下放置一个文件，来验证你的域名所有权，完成验证，然后就可以生成证书了。

```bash
acme.sh --issue -d mydomain.com -d www.mudomain.com --webroot /home/wwwroot/mydomain.com/
```

只需要指定域名，并指定域名所在的网站根目录，acme.sh会全自动的生成验证文件，并放到网站的根目录，然后自动完成验证，最后会聪明的删除验证文件，整个过程没有任何副作用。

如果用的apache服务器，acme.sh还可以智能的从apache的配置中自动完成验证，你不需要指定网站根目录：

```bash
acme.sh --issue -d mydomain.com --apache
```

如果哟个的nginx服务器，或者反代，acme.sh还可以智能的从nginx的配置中自动完成验证，你不需要指定网站根目录：

```bash
acme.sh --issue -d mydomain.com --nginx
```

**无论是apache还是nginx模式，acme.sh在完成验证之后，会恢复到之前的状态，都不会私自更改你本身的配置，好处是你不用担心配置被搞坏，也有一个缺点，你需要自己配置ssl的配置，否则只能成功生成证书，你得网站还是无法访问https，但是为了安全，还是自己手动改配置吧**

[更多用法](https://github.com/Neilpang/acme.sh/wiki/How-to-issue-a-cert)

### dns方式

这种方式的好处是，你不需要任何服务器，不需要任何公网ip，只需要dns的解析记录即可完成验证。坏处是，如果不同时配置Automatic DNS API，使用这种方式acme.sh将无法自动更新证书，每次都需要手动再次重新解析验证域名所有权

```bash
acme.sh --issue --dns -d mydomain.com
```

然后，acme.sh会生成相应的解析记录显示出来，你只需要在你的域名管理面板中添加这条txt记录即可，等待解析完成之后，重新生成证书：

```bash
acme.sh --renew -d mydomain.com
```

dns方式的真正强大之处在于可以使用域名解析商提供的api自行添加txt记录完成验证

以dnspod为例，你需要先登录到dnspod账号, 生成你的 api id 和 api key, 都是免费的. 然后:

```bash
export DP_Id="1234"

export DP_Key="sADDsdasdgdsf"

acme.sh --issue   --dns dns_dp   -d aa.com  -d www.aa.com
```

证书就会自动生成了. 这里给出的 api id 和 api key 会被自动记录下来, 将来你在使用 dnspod api 的时候, 就不需要再次指定了. 直接生成就好了:

```bash
acme.sh  --issue   -d  mydomain2.com   --dns  dns_dp
```

[更详细的api用法](https://github.com/Neilpang/acme.sh/blob/master/dnsapi/README.md)

## 安装证书

前面证书生成以后, 接下来需要把证书 copy 到真正需要用它的地方.

注意, 默认生成的证书都放在安装目录下: ~/.acme.sh/, 请不要直接使用此目录下的文件, 例如: 不要直接让 nginx/apache 的配置文件使用这下面的文件. 这里面的文件都是内部使用, 而且目录结构可能会变化.

正确的使用方法是使用 --install-cert 命令,并指定目标位置, 然后证书文件会被copy到相应的位置, 例如:

**Apache example**

```bash
acme.sh --install-cert -d example.com \
--cert-file      /path/to/certfile/in/apache/cert.pem  \
--key-file       /path/to/keyfile/in/apache/key.pem  \
--fullchain-file /path/to/fullchain/certfile/apache/fullchain.pem \
--reloadcmd     "service apache2 force-reload"
```

**Nginx example**

```bash
acme.sh --install-cert -d example.com \
--key-file       /path/to/keyfile/in/nginx/key.pem  \
--fullchain-file /path/to/fullchain/nginx/cert.pem \
--reloadcmd     "service nginx force-reload"
```

(一个小提醒, 这里用的是 service nginx force-reload, 不是 service nginx reload, 据测试, reload 并不会重新加载证书, 所以用的 force-reload)

Nginx 的配置 ssl_certificate 使用 /etc/nginx/ssl/fullchain.cer ，而非 /etc/nginx/ssl/\<mydomain\>.cer ，否则 SSL Labs 的测试会报 Chain issues Incomplete 错误。

--install-cert命令可以携带很多参数, 来指定目标文件. 并且可以指定 reloadcmd, 当证书更新以后, reloadcmd会被自动调用,让服务器生效。

[详细参数](https://github.com/Neilpang/acme.sh#3-install-the-issued-cert-to-apachenginx-etc)

值得注意的是, 这里指定的所有参数都会被自动记录下来, 并在将来证书自动更新以后, 被再次自动调用。

## 更新证书

目前证书在 60 天以后会自动更新, 你无需任何操作. 今后有可能会缩短这个时间, 不过都是自动的, 你不用关心.

