---
title: 'Linux命令'
date: 2021-06-07
categories:
- "CentOS"
tags:
- 学习笔记
isFull: false 
sidebar: true
isShowComments: true
isShowIndex: true
---

## ls

- ls -a：查看隐藏文件

- ls -l：查看详细信息

- ls -d：查看某个目录的详细信息

- ls -h：文件大小以单位表示出来，常与-l搭配使用

- ls -i：查看 i 节点

## 文件权限

- 文件类型（- 表示二进制文件  d 表示目录 l 表示软链接二文件）

- u 所有者  g 所属组  o 其他人

- r 读  w 写   x 可执行

## 目录处理命令

###  mkdir：创建一个目录

- mkdir -p /tmp/japan/xxx：加上-p可递归创建

### pwd：显示当前所在的工作目录

### rmdir：删除空目录

### cp：复制

- cp -rp [原文件或目录] [目标目录]

- -r：复制目录

- -p：保留文件属性


### mv：剪切文件、改名 

- mv [原文件或目录] [目标目录]

### rm：删除文件

- rm -rf：[文件或目录]

## 文件处理命令

### touch：创建空文件

### cat：查询或浏览一个文件

- cat -n：可以显示行号

### tac：反向列示

### more：分页显示文件内容

- more [文件名]

- （空格）或f：翻页

- （Enter）：换行

- q或Q：退出

### less：分页显示文件内容（可向上翻页）

- less [文件名]

- 按Pgup可向上翻页，上箭头向上换行

- 可以搜索，输入/和要搜索的内容，按n可向下搜索

### head：显示文件前几行

- head -n *（几行） [文件名]  eg：head -n 7 /etc/services

### tail：显示文件末尾几行

- -f：动态显示文件末尾内容

### 链接

- ln：硬链接 [原文件] [生成硬链接文件名]

    - 硬链接相当于cp -p + 同步更新
    -
    - 硬链接和原文件i节点相同
    -
    - 硬链接不能跨分区

- ln -s：软链接 [原文件] [生成软链接文件名]

    - 软链接相当与快捷方式

## 权限管理命令

### chomd：修改目录或文件权限(root和文件所有者可修改)

- chmod [{ugoa}{+-=}] [文件或目录]

- chmod [mode=777] [文件或目录]

- chmod -R 递归修改

**删除一个文件的权限是对此文件所在的目录有写权限**

| 权限  | 权限名称 | 对文件   | 对文件所在目录 |
|  :--:|:-------:|:------- |:---------------|
|  r   | 读权限   |可以查看文件内容 | 可以列出目录中的内容 |
|  w   | 写权限   |可以修改文件内容 | 可以在目录中创建删除文件 |
|  x   | 执行权限 |可以执行文件     | 可以进入目录 |

### chown：改变文件或目录的所有者

- chown [用户] [文件或目录]

### chgrp：改变文件或目录的所属组 

- chgrp [用户组] [文件或目录]

### umask [-S]：以rwx形式显示新建文件缺省权限

- 缺省创建的文件没有可执行权限

## 文件搜索命令

搜索会占用很大的系统资源

### find：文件搜索

- find [搜索范围] [匹配条件]

- find /etc -name init：在目录 /etc中查找文件init， -iname不区分大小写

- find / -size +204800：在根目录下找大于100MB的文件， +n 大于；-n 小于；n 等于。 n表示数据块，1数据库 = 512字节 = 0.5k

- find /home -user liutao：在根目录下查找所有者为liutao的文件  -group：根据所属组查找

- find /etc -cmin -5：在/etc下查找5分钟内被修改过属性的文件或目录

    - -amin：访问时间 access

    - -cmin：文件属性 change

    - -mmin：文件内容 modify

- find /etc -size +163840 -a -size -204800：在/etc下查找大于80mb小于100mb的文件

    - -a：两个条件同时满足

    - -o: 两个条件满足一个即可

- find /etc -name init -exec ls -l {} \：在/etc下查找init文件并显示其详细信息， -exec/-ok命令{}\；对搜索结果执行操作

- find /etc -type f：根据类型查找

    - f：文件

    - d：目录

    - l：软链接文件

- find /etc -inum：根据i节点查找

### locate：在文件资料库中查找文件

- locate 文件名

- updatedb：更新文件资料库

### which：搜索命令所在目录及别名信息

### whereis：搜索命令所在目录及帮助文档路径

### grep：在文件中搜索字符串匹配的行并输出

- grep -iv [指定字串] [文件]

- -i：不区分大小写

- -v：排除指定字串

## 帮助命令

### man：获得帮助信息

- man ls：查看ls命令的帮助信息

### whatis [命令]：查看命令的简短信息

### apropos [配置文件]：查看配置文件的简短信息

## 用户管理命令

### useradd：添加用户

### passwd：修改/设置 密码

### who：查看登录用户信息

### w：查看登录用户详细信息

## 压缩解压文件

### gzip(只能压缩文件，不能压缩目录，且压缩后原文件不在了)

- gzip [压缩文件]

- gunzip/gizp -d [解压缩文件]

### tar 选项[-zcf] [压缩后文件名] [目录]：打包目录

- 打包语法

    - -c 打包

    - -v 显示详细信息

    - -f 指定文件名

    - -z 打包同时压缩

- 解包语法

    - -x 解包

    - -v 显示详细信息

    - -f 指定文件名

    - -z 解压缩

### zip 选项[-r] [压缩后文件名] [文件或目录]

- r 压缩目录

- 解压缩：unzip [压缩文件]

### bzip2 选项 [-k] [文件]

- k 产生压缩文件后保留原文件

- 使用tar压缩目录：tar -cjf xxx.tar.bz2 [目录名称]

- 解压缩：bunzip2 [-k] [解压缩文件]

- 使用tar解压缩目录：tar -xjf xxx.tar.bz2

| 后缀名|压缩命令|解压缩命令        |备注                           |
|:-----  |:------- |:--------     |:---                          |
|.gz     |gzip     |gunzip/gzip -d|不能压缩目录，不能保留原文件     |
|.tar    |tar -cf  |tar -cf       |                              |
|.tar.gz |tar -zcf |tar -zxf      |                              |
|.zip    |zip      |unzip         | -r：保留原文件，可压缩文件或目录|
|.bz2    |bzip2    |bunzip2       |只能压缩文件                    |
|.tar.bz2| tar -cjf| tar -xjf     |可压缩目录                      |


## 网络命令

### write\<用户名\>：

- 给指定的在线用户发送信息，以Ctrl+D保存结束

### wall [message]

- 发送广播信息

### ping 选项 IP地址：测试网络连通性

- -c 指定发送次数 

### ifconfig 查看网络状态

### mail [用户名]：查看发送电子邮件

### last：列出目前与过去登入系统的用户信息

### traceroute：显示数据包到主机间的路径

### netstat：显示网络相关信息

- -t：TCP协议

- -u：UDP协议

- -l：监听

- -r：路由

- -n：显示IP地址和端口号

- netstat -tlun：查看本机监听的端口

- netstat -an：查看本机所有的网络链接

- netstat -rn：查看本机路由表

### setup：配置网络

### mount：挂载命令

- mount [-t 文件系统] 设备文件名挂载点

## 关机重启命令

- shutdown [选项] 时间

    - -c：取消前一个关机命令 

    - -h：关机

    - -r：重启


## vim

### 定位命令 

| 命令     | 作用 |
|:---     |:-----|
|:set nu  |设置行号|
|:set nonu|取消行号|
| gg      |到第一行|
|G|到最后一行|
|nG|到第n行|
|:n|到第n行|
|$|移至行尾|
|0|移至行首|

### 删除命令

| 命令    | 作用                     |
|:---     |:-----                   |
|X        |删除光标所在处字符         |
|nX       |删除光标所在处后n个字符     |
|dd       |删除光标所在行，ndd删除n行  |
|dG       |删除光标所在行到文件末尾内容 | 
|D        |删除光标所在处到行尾内容     |
|:nl,n2d  |删除指定范围的行            |

### 复制剪切命令

| 命令    | 作用                     |
|:---     |:-----                   |
|yy       |复制当前行                |
|nyy      |复制当前行以下n行          |
|dd       |剪切当前行                 |
|ndd      |删除光标所在行到文件末尾内容 | 
|p、P     |粘贴在当前光标所在行下或行上 |

### 替换和取消命令

| 命令    | 作用                             |
|:---     |:-----                           |
|r        |取代光标坐在处字符                 |
|R        |从光标所在处开始替换字符，按ESC结束  |
|u        |取消上一步操作                     |

## 软件包管理

### RPM安装

- rpm -ivh 包全名

    - -i(install)   安装

    - -v(verbose)   显示详细信息

    - -h(hash)      显示进度

    - --nodeps      不检测依赖性

- rpm -Uvh  包全名

    - U 升级

- rpm -e 包名

    - -e 卸载

    - --nodeps 不检查依赖性

### rpm包查询

- rpm -q[包名]：查询是否安装

### rpm -qi[包名]：查询软件包详细信息

- -i：查询软件信息

- -p：查询未安装包信息

### rpm -ql[包名]：查询包的安装位置

- -l：列表

- -p：查询未安装包信息

### rpm -qf[系统文件名]：查询系统文件属于哪个RPM包

### rpm -qR [包名]

- -R：查询软件包的依赖性

- -p：查询未安装包信息  

### yum安装

- yum -y install [包名]

### yum升级

- yum -y update [包名]

### yum卸载

- yum -y remove [包名]

### yum软件组管理命令

- yum grouplist：列出所有可用的软件组列表

- yum groupinstall [软件组名]：安装指定软件组

- yum groupremove [软件组名]：卸载指定软件组

## 用户管理

### 用户配置文件

- 用户信息文件：/etc/passwd

- 影子文件：/etc/shadow

- 组信息文件：/etc/group

- 组密码文件：/etc/gshadow

### 用户管理命令

 - useradd [用户名]：用户添加

    - -u UID：手工指定用户的UID

    - -d 家目录：手工指定用户的家目录

    - -c 用户说明：手工指定用户的说明

    - -g 组名：手工指定用户的初始组

    - -G 组名：指定用户的附加组

    - -s shell：手工指定用户的登录shell。默认是/bin/bash

- passwd [选项] 用户名：密码修改命令

    - -S：查看用户密码的状态

    - -l：暂时锁定用户

    - -u：解锁用户

    - --stdin：可以通过管道符输出的数据作为用户的密码

- usermod：修改用户信息

- chage：修改用户密码状态

    - -l：列出用户的详细密码状态

    - -d 日期：修改密码最后一次更改日期（shadow第3字段）

    - -m 天数：两次密码修改间隔（4字段）

    - -M：密码有效期（5字段）

    - -W 天数：密码过期前警告天数（6字段）

    - -I 天数：密码过期后宽限天数（7字段）

    - -E 日期：账号失效时间（8字段）

- userdel -r 用户名：删除用户

    - -r：删除用户的同时删除用户家目录

- su：用户切换命令

### 用户组管理命令

- groupadd [选项] 组名：添加用户组

    - g GID：指定组ID

- groupmod [选项] 组名

    - -g GID：修改组ID

    - -n 新组名：修改组名

- groupdel 组名：删除用户组

- gpasswd 选项  组名：把用户添加入组或从组中删除

    - -a 用户名：把用户加入组

    - -d 用户名：把用户从组中删除

## 权限管理

### ACL权限

- 查看分区ACL权限是否开启

    - dumpe2fs -h /dev/sda3

    - -h：仅显示超级块中信息，而不显示磁盘块组的详细信息

- getfacl：文件名：查看ACL命令

- setfacl 选项 文件名 (setfacl -m u:xxx:rw [文件名])

    - -m：设定ACL权限

    - -x：删除指定的ACL权限

    - -b：删除所有的ACL权限

    - -d：设定默认ACL权限

    - -k：删除默认ACL权限

    - -R：递归设定ACL权限

- 设置最大有效权限mask：setfacl -m m:rw [文件名]

- 删除用户/用户组ACL权限：setfacl -x u:/g: [文件名]

    - setfacl -b 文件名：删除文件的所有的ACL权限


- 递归ACL权限：父目录设定ACL权限时，所有的子文件和子目录也会 拥有相同的ACL权限

    - setfacl -m u:用户名:权限 -R 目录名

- 默认ACL权限：setfacl -m d:u:用户名:权限 目录名

### 文件特殊权限

- SetUID

- SetGID

-Sticky BIT