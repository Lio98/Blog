---
title: 'git命令'
date: 2022-01-25
categories:
- "Csharp"
tags:
- gitCommon
sidebar: true
permalink: '/Tools/gitCommon'
isFull: true
isShowComments: true
isShowIndex: false
---

## 常用命令

- 配置

    ```
    在当前目录新建Git代码库
    git init

    新建一个目录，并将其初始化为Git代码库
    git init [project-name]

    拉一个新项目代码
    git clone [url]

    显示当前Git配置
    git config --list

    修改git配置用户信息
    git config -g user.name "[name]"
    git config -g user.email "[email]"
    ```

- 文件，代码操作

    ```
    添加指定文件到暂存区
    git add [file1] [file2] ...

    添加目录到暂存区，递归
    git add [dir]

    添加当前所有更改到暂存区
    git add .

    提交暂存区的指定文件到仓库区
    git commit [file1] [file2] ... -m [message]

    提交暂存区继上次commit后的变化到仓库区
    git commit -a 

    提交时显示所有diff信息
    git commit -v

    使用一次新的commit替代上一次提交，如果代码没有任何变化，则用来改写上一次commit的提交信息
    git commit --amend [file1] [file2] ...

    查看历史提交记录
    git log

    ```
- 分支

    ```
    拉取指定分支
    git clone -b [branch-name] [url]

    列出本地分支
    git branch

    列出远程分支
    git branch -r

    列出本地和远程分支
    git branch -a

    新建分支
    git branch [branch-name]

    切换分支
    git checkout [branc-name]

    合并指定分支到当前分支
    git merge [branch-name]

    删除分支
    git branch -d [branch-name]

    删除远程分支
    git push origin --delete [branch-name]
    git branch -dr [remote/branch]

    新建分支并却换到该分支
    git branch -b [branch-name]

    ```
- 不常用命令

    ```
    关联远程仓库
    git remote add origin 

    删除已关联的远程仓库
    git remote rm origin 

    首次提交
    git push -u origin master

    强推，当本地仓库与远程仓库代码不同步时使用可同步本地仓库和远程仓库
    git push -f origin/[分支]

    远程仓库中的更新合并到本地仓库中，-rebase的作用是取消本地仓库中刚刚的commit，并把他们接到更新后的版本库之中。
    git pull --rebase origin master

    版本回退
    1. reset：同构reset的方式，把head指针指向之前的某次提交，reset之后，后面的版本就找不到了
    git reset --hard [版本号]

    2. revert：这种方式不会把版本往前回退，而是生成一个新的版本
    git revert -n [版本号]
    git commit -m [message]
    git push

    强制覆盖本地代码
    1. git fetch --all
    2. git reset --hard origin/master
    3. git pull

    撤销commit
    git reset --soft HEAD^

    修改目录权限引发全部文件出现更改，可用一下命令忽略文件权限的配置
    git config core.filemode false

    保存pull、push时的账号密码(输入一次密码后便会记住)
    git config --global credential.helper store
    这一步在~/.gitconfig文件尾部添加
    [credential]
        helper = store

    .gitignore文件失效，gitignore只能忽略那些原来没有被track的文件，，如果某些文件已经被纳入了版本管理中，则修改 .gitignore 是无效的。解决方法是先把本地缓存删除，然后再提交。
    git rm -r --cached
    git add .
    git commit -m [message]

    去除ssl校验
    git config --global http.sslVerify false
    ```