---
title: git 多平台ssh配置
date: 2023-04-07 13:19:04
tags: GIT
---
# git 多平台ssh配置
当需要在 Git 中使用多个 SSH Key 进行认证时，可以按照以下步骤进行配置：

## 1. 打开终端并进入 SSH 目录
```bash
cd ~/.ssh
```
## 2. 生成不同的 SSH Key
```
ssh-keygen -t rsa -C 'xxxxx@youremail.com' -f ~/.ssh/gitee_id_rsa
ssh-keygen -t rsa -C 'xxxxx@youremail.com' -f ~/.ssh/github_id_rsa
```
这里生成了两个不同的 SSH Key，分别用于访问不同的 Git 托管平台，例如 gitee.com 和 github.com。

## 2. 在 SSH 目录下创建 config 文件并写入以下内容
```
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/gitee_id_rsa
# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
```
这里创建了 config 文件并针对不同的主机地址分别设置了 Host、HostName、PreferredAuthentications 和 IdentityFile。

## 测试是否联通

```bash
ssh -T git@gitee.com
ssh -T git@github.com
```

以上步骤涵盖了创建多个 SSH Key、配置 config 文件和测试 SSH 连接的全部流程，可以轻松地完成 Git 多地址 SSH 配置。