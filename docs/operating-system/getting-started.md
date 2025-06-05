---
title: "开始使用 Home Assistant 操作系统开发"
sidebar_label: 开始
---

## 准备开发环境

### 检出源代码

位于 [github.com/home-assistant/operating-system/](https://github.com/home-assistant/operating-system/) 的主仓库包含通过 [br2-external 机制](https://buildroot.org/downloads/manual/manual.html#outside-br-custom) 的 Buildroot 定制，以及助手脚本和 GitHub Action CI 脚本。主仓库使用 Git 子模块机制来指向 Buildroot 本身。虽然大多数定制可以通过 br2-机制进行，但也对 Buildroot 本身进行了某些修改。出于这个原因，我们还在 [github.com/home-assistant/buildroot/](https://github.com/home-assistant/buildroot/) 下维护了 Buildroot 的一个分支。目标是将针对上游 Buildroot 的补丁数量保持在最小。

确保你有可用的 `git`，并按如下方式克隆主 HAOS 仓库：

```shell
git clone https://github.com/home-assistant/operating-system/
cd operating-system/
git submodule update --init
```

当你更新本地 git 仓库时，确保也更新 `buildroot` 子模块。这确保你会获得匹配的 Buildroot，以防它也被更新。

```shell
git pull
git submodule update
```

要返回到干净状态，使用以下两个命令（这会删除所有本地修改！）

```shell
git reset --hard
git submodule update --init --force
```

### 安装先决条件

HAOS 使用构建容器来运行 Buildroot。安装 Docker 容器引擎，并确保你有一个可工作的 `docker` 命令，该命令允许运行特权容器。构建脚本旨在作为用户运行，但某些命令使用特权，因此也需要有效的 `sudo` 命令。

虽然 Buildroot 可以在大多数 Linux 发行版上本地运行，但强烈建议使用基于 Debian 的构建容器。这将提供一个稳定且已知的构建环境，其中所有依赖项都已预先安装。

:::info
构建容器需要以特权模式启动，因为在构建过程的某个时刻，将在 Docker 容器内部挂载一个新的循环设备支持的文件系统映像。因此，无根容器将无法构建 HAOS。
:::

## 使用构建容器构建映像

脚本 `scripts/enter.sh` 构建构建容器映像并使用该映像启动容器。传递给脚本的参数将在容器内执行。

HAOS 为每个支持的目标使用一个配置文件。要为特定目标（板）构建，必须将配置文件传递给 `make`。配置文件存储在 `buildroot-external/configs/` 中。请注意，后缀 `_defconfig` 将自动添加，并且*不允许*传递给 `make`。例如，要构建 Raspberry Pi 4 64 位配置 `buildroot-external/configs/rpi4_64_defconfig`，请使用以下命令：

```
$ sudo scripts/enter.sh make rpi4_64
正在将构建上下文发送到 Docker 守护进程  159.7kB
步骤 1/8 : FROM debian:bullseye
 ---> a178460bae57
[...]
成功构建 11d679ac51be
成功标记 hassos:local
[...]
/usr/bin/make -C /build/buildroot O=/build/output BR2_EXTERNAL=/build/buildroot-external "rpi4_64_defconfig"
[...]
```

这在容器内使用源代码库根目录中的 `Makefile` 调用了 make。这个 makefile 反过来又调用了 Buildroot 的 makefile。

根据你的机器速度，构建过程需要 0.5 到 1 小时。构建文件（目标文件、中间二进制文件等）存储在 `output/` 文件夹中（在 rel-6 和更早版本中曾位于 `buildroot/output/` 中）。最终镜像文件存储在 `release/` 目录中。

### 重建软件包

Buildroot 像常规发行版一样使用软件包。但 Buildroot 软件包并不是简单地下载预构建的软件包，而是下载源文件并直接编译二进制文件。Buildroot 会记住哪些软件包已经构建过。这使得第二次构建要快得多，因为只有最终镜像被重新生成。如果你想强制 Buildroot 重新构建特定软件包，只需从 `output/build/` 目录中删除它：

```shell
rm -rf output/build/linux-custom/
```

:::tip
你可以检查 `output/build/packages-file-list.txt` 以了解最终镜像中的哪个文件属于哪个软件包。这使得查找你想要更改的软件包更加容易。
:::

### 为多个目标构建

要在单个源目录中为多个目标构建，必须使用不同的输出目录。可以使用 `O=` 参数指定输出目录。建议的模式是使用与目标配置文件同名的输出目录：

```shell
sudo scripts/enter.sh make O=output_rpi4_64 rpi4_64
```

### 交互式使用构建容器

如果没有传递参数给 `scripts/enter.sh`，将会呈现一个 shell。

```bash
$ sudo scripts/enter.sh
正在将构建上下文发送到 Docker 守护进程  159.7kB
步骤 1/8 : FROM debian:bullseye
 ---> a178460bae57
[...]
builder@c6dfb4cd4036:/build$ 
```

从这个 shell，以上述方式启动的构建可以使用 `make O=output_rpi4_64 rpi4_64`。

这允许调用其他 Buildroot 目标，例如 [图形依赖关系](https://buildroot.org/downloads/manual/manual.html#_graphing_the_dependencies_between_packages)。要使用其他 Buildroot 目标，请确保切换到 `buildroot/` 目录并从那里执行命令。

```bash
builder@c6dfb4cd4036:/build$ cd buildroot/
builder@c6dfb4cd4036:/build$ make O=../output_rpi4_64 graph-depends
获取依赖树...
dot  -Tpdf \
        -o /build/output_rpi4/graphs/graph-depends.pdf \
        /build/output_rpi4/graphs/graph-depends.dot
builder@c6dfb4cd4036:/build$
```

## 使用 Qemu 测试映像

目标 OVA（开放虚拟设备）包含各种虚拟机的映像。其中一种映像格式是 QCOW2，这是 QEMU 的原生映像格式。它可以用于使用 QEMU 测试新的 HAOS 构建。

由于 HAOS 需要 UEFI 支持，这在处理“经典”（/遗留）MBR 基于映像时稍微复杂。在 *Debian* 主机上安装 [ovmf 软件包](https://packages.debian.org/stable/ovmf)，该软件包提供“用于 64 位 x86 虚拟机的 UEFI 固件”。该软件包将在 `/usr/share/OVMF/OVMF_CODE.fd` 安装一个 **TianoCore** 派生的 QEMU UEFI 映像，可以与 QEMU 一起使用以启动生成的 QCOW2 映像。

```bash
$ sudo scripts/enter.sh make O=output_ova ova
[...]
$ unxz release/haos_ova-7.0.dev20211003.qcow2.xz
$ qemu-system-x86_64 -enable-kvm -name haos -smp 2 -m 1G -drive file=release/haos_ova-7.0.dev20211003.qcow2,index=0,media=disk,if=virtio,format=qcow2 -drive file=/usr/share/ovmf/x64/OVMF_CODE.fd,if=pflash,format=raw,readonly=on
```

这将显示 QEMU 的 SDL 界面，并应该启动 Home Assistant 操作系统。一旦启动完成并显示 Home Assistant CLI 提示 `ha > `，你可以使用 `login` 访问根 shell。

## 创建拉取请求以供审核

一旦你对更改感到满意，请创建一个单独的 git 分支并提交它们。尽量描述*为什么*你认为该更改重要并应应用于 HAOS。例如，“更新内核” 从更改本身也很明显。维护者更感兴趣的是你认为内核应该更新的原因。*为什么* 的理由可以相当简单（更新内核以确保我们跟上最新更改），或者它可以有一些有趣的细节（更新内核，因为这个最新版本修复了 xy 板上的网卡）。

创建上游 [github.com/home-assistant/operating-system](https://github.com/home-assistant/operating-system) 仓库的一个分支（如果你还没有进行），并将你的分支推送到你分叉的 GitHub 仓库。然后打开一个新的拉取请求。所有更改应针对开发分支 `dev`。如果你希望你的更改在下一个稳定版本中添加，请添加 `rel-x` 标签，以便标记为回补。