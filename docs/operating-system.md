---
title: Home Assistant 操作系统
sidebar_label: 介绍
---

Home Assistant 操作系统是一个专门为单板计算机和 x86-64 系统设计的操作系统，旨在运行 Home Assistant。它的目标是提供一个稳健且免维护的操作系统来运行 Home Assistant。

Home Assistant 操作系统 (HAOS) 使用 [Buildroot](https://buildroot.org/) 构建系统。Buildroot 在经典意义上并不是一个 Linux 发行版。它提供了构建 Linux 发行版所需的基础设施和构建系统。Buildroot 允许我们为不同的架构进行交叉编译，这在编译资源较少的架构（如基于 Arm 的系统）时尤其有用。HAOS 由一个比较常规的 Linux 和 GNU 软件栈组成，使用 Linux、GNU C 库、systemd 初始化守护进程和 Home Assistant 监管所需的 Docker 容器引擎。

### 组件

- **引导加载程序：**
  - 支持 UEFI 的设备使用 [GRUB](https://www.gnu.org/software/grub/)
  - 不支持 EFI 的设备使用 [U-Boot](https://www.denx.de/wiki/U-Boot)
- **操作系统：**
  - 使用 [Buildroot](https://buildroot.org/) 构建系统生成 Linux 发行版
- **文件系统：**
  - [SquashFS](https://www.kernel.org/doc/Documentation/filesystems/squashfs.txt) 用于只读文件系统（使用 LZ4 压缩）
  - [ZRAM](https://www.kernel.org/doc/Documentation/blockdev/zram.txt) 用于 `/tmp`、`/var` 和交换空间（使用 LZ4 压缩）
- **容器平台：**
  - [Docker 引擎](https://docs.docker.com/engine/) 用于在容器中运行 Home Assistant 组件
- **更新：**
  - [RAUC](https://rauc.io/) 用于无线（OTA）和 USB 更新
- **安全性：**
  - [AppArmor](https://apparmor.net/) Linux 内核安全模块