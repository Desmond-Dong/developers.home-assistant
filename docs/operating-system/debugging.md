---
title: "调试 Home Assistant 操作系统"
sidebar_label: 调试
---

:::info
本节不适合最终用户。最终用户应使用 [SSH 插件] 通过 SSH 访问 Home Assistant。这是为 **Home Assistant 的开发者** 准备的。如果你使用这些选项，请不要寻求支持。
:::

[SSH 插件]: https://github.com/home-assistant/addons/tree/master/ssh

## 启用对主机的 SSH 访问

:::info
通过 [SSH 插件]（默认使用 22 端口）进行的 SSH 访问仅授予有限的权限，当输入 'login' 命令时会要求提供用户名和密码。请按照以下步骤启用独立于插件的 22222 端口的单独 SSH 访问，允许您以完全权限访问 Home Assistant OS（“主机”）。
:::

1. 使用一个名为 `CONFIG`（区分大小写）的分区格式化为 FAT、ext4 或 NTFS 的 USB 驱动器。创建一个没有文件扩展名的 `authorized_keys` 文本文件，包含你的公钥，每行一个，并将其放置在 USB 驱动器 `CONFIG` 分区的根目录中。该文件必须使用 POSIX 标准换行控制字符（LF），而不是 Windows 的（CR LF），并且需要以 ASCII 字符编码（即不能在注释中包含任何特殊字符）。

   如果需要帮助生成密钥，请参见下面的 [生成 SSH 密钥](#generating-ssh-keys) 部分。

1. 将 USB 驱动器连接到你的 Home Assistant OS 设备，并显式使用 `ha os import` 命令导入驱动器内容（例如，通过 SSH 访问 [SSH 插件] 在 22 端口），或者在设备重新启动时保持驱动器连接，这会自动触发导入。

:::tip
确保在将公钥复制到 USB 驱动器根目录时，正确命名文件为 `authorized_keys`，而不带 `.pub` 文件扩展名。
:::

现在你应该能够通过 SSH 在 22222 端口以 root 身份连接到你的设备。在 Mac/Linux 上，请使用：

```shell
ssh root@homeassistant.local -p 22222
```

如果你有较旧的安装或更改了主机名，可能需要相应地调整上面的命令。你也可以改用设备的 IP 地址，而不是主机名。

你将以 root 身份登录，工作目录设置为 `/root` 文件夹。[Home Assistant OS] 是 Docker 的一个虚拟机监控程序。有关 Supervisor 的信息，请参见 [Supervisor 架构] 文档。Supervisor 提供了一个 API 用于管理主机和运行的 Docker 容器。Home Assistant 及所有已安装的插件都在单独的 Docker 容器中运行。

[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor 架构]: /architecture_index.md

## 禁用对主机的 SSH 访问

1. 使用一个名为 `CONFIG`（区分大小写）的分区格式化为 FAT、ext4 或 NTFS 的 USB 驱动器。删除该分区根目录中任何现有的 `authorized_keys` 文件。

1. 当将该驱动器插入并重新启动 Home Assistant OS 设备时，任何现有的 SSH 公钥将被移除，22222 端口上的 SSH 访问将被禁用。

## 检查日志

```shell
# 来自主机操作系统上 supervisor 服务的日志
journalctl -f -u hassos-supervisor.service

# Supervisor 日志
docker logs hassio_supervisor

# Home Assistant 日志
docker logs homeassistant
```

## 访问容器 bash

```shell
docker exec -it homeassistant /bin/bash
```

[windows-keys]: https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/create-with-putty/

### 生成 SSH 密钥

有关如何使用 Putty 生成和使用私钥/公钥的 Windows 指令，请参阅 [这里][windows-keys]。根据上述指示，添加公钥，而不是按滴水指示操作。

Mac、Windows 和 Linux 的替代说明可在 [这里](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) 找到。按照 *生成新的 SSH 密钥* 下的步骤操作（其他部分与 Home Assistant 无关，可以忽略）。

确保复制刚创建的 SSH 密钥对的 ***公钥***。默认情况下，公钥文件命名为 `id_ed25519.pub`（在 Ed25519 椭圆曲线算法的情况下）或 `id_rsa.pub`（在较旧的 RSA 算法的情况下），即它应该具有 `.pub` 文件名后缀。它保存到与私钥相同的文件夹中（私钥默认命名为 `id_ed25519` 或 `id_rsa`）。