---
title: "更新系统"
sidebar_label: 更新系统
---

Home Assistant 操作系统使用 [RAUC](https://rauc.io/) 作为更新系统。RAUC 是一个基于镜像的更新系统，专为嵌入式系统设计。它支持多个启动槽，因此支持 A/B 风格的更新机制。该更新系统与流行的引导加载程序（如 U-Boot）集成，但也允许通过脚本与自定义引导流程集成。它使用 X.509 加密技术对更新包进行签名和验证。

## RAUC 和 Home Assistant OS

RAUC 可以从 Buildroot 直接获得。HAOS 构建系统创建更新包（`.raucb` 文件），这些包与用于初始安装的磁盘镜像文件一起上传。RAUC 更新包实际上包含内核和系统分区以及引导分区，对于某些板，还包含名为 `SPL` 的引导镜像。这些分区镜像用于生成磁盘镜像和更新包。所有板都使用从 `buildroot-external/ota/manifest.raucm.gtpl` 模板文件生成的类似 RAUC 清单。该清单定义了更新包的确切内容。

RAUC 在 [rauc.readthedocs.io](https://rauc.readthedocs.io/) 上有非常好的文档，本指南将主要关注 RAUC 的实际和 HAOS 特定方面。

## 使用更新包

RAUC 作为 HAOS 上的 systemd 系统服务运行。该系统服务公开了一个 D-Bus API。Supervisor 使用这个 D-Bus API 来启动更新。更新包本身由 Supervisor 下载并传递给 RAUC。从 RAUC 系统服务的角度来看，更新是一个简单的本地更新安装。

对于开发或测试，可以通过 shell 使用 `rauc install` 命令安装 RAUC 更新包。例如，手动更新特定板可以直接在 HAOS shell 中运行以下命令：

```sh
# cd /mnt/data/
# curl -L -O https://github.com/home-assistant/operating-system/releases/download/11.5.rc3/haos_rpi5-64-11.5.rc3.raucb
# rauc install haos_rpi5-64-11.5.rc3.raucb
# systemctl reboot
```

:::note
在使用 `tryboot` 机制的 Raspberry Pi 5 上，一定要使用 `systemctl reboot`，因为普通的 `reboot` 不会触发从其他槽引导。或者，需要显式地使用 `reboot '0 tryboot'`。
:::

重启后，系统应该运行新安装的 HAOS 版本。

## 启动槽

HAOS 有两个启动槽，分别命名为 A 和 B。新安装始终以一个已部署的启动槽开始（槽 A）。在更新时，另一个启动槽正在被写入，系统重启到另一个启动槽。因此，刚安装系统的第一次更新将安装到启动槽 B。Supervisor 使用 `ha os info` 显示启动槽，而在 OS shell 中可以使用 `rauc status` 命令查看两个启动槽的完整状态。

```sh
# rauc status
=== 系统信息 ===
兼容:  haos-rpi5-64
变种:     
从以下启动: kernel.0 (A)

=== 引导加载程序 ===
激活: kernel.0 (A)

=== 槽状态 ===
  [spl.0] (/dev/disk/by-partlabel/hassos-boot, raw, inactive)

  [boot.0] (/dev/disk/by-partlabel/hassos-boot, vfat, inactive)

x [kernel.0] (/dev/disk/by-partlabel/hassos-kernel0, raw, booted)
        启动名称: A
        启动状态: 良好
    [rootfs.0] (/dev/disk/by-partlabel/hassos-system0, raw, active)

o [kernel.1] (/dev/disk/by-partlabel/hassos-kernel1, raw, inactive)
        启动名称: B
        启动状态: 良好
    [rootfs.1] (/dev/disk/by-partlabel/hassos-system1, raw, inactive)
```

更新后，RAUC 指示引导加载程序引导到另一个槽（例如，通过写入 U-Boot 环境变量）。如果引导成功，该槽将标记为良好，系统将继续引导到此启动槽。通常，每个启动槽会尝试三次引导，才会恢复到另一个启动槽，但确切的逻辑取决于引导加载程序的集成。

可以使用 `ha os boot-slot` 命令更改启动槽。在使用 GRUB 引导加载程序的系统上，也可以使用引导菜单。在这种情况下，所选的启动槽将用于将来的引导，直到再次手动或通过操作系统更新更改。

## 安全性

HAOS RAUC 更新包是签名的。HAOS 有自己的公钥基础设施（PKI），拥有开发和发布 CA。目前，所有公共构建都是使用发布 CA 签名的。证书在 OS 的 `/etc/rauc/keyring.pem` 路径下预先安装。

在本地构建时，第一次使用构建目录时会生成自签名证书。该证书及其关联的私钥存储在构建目录的根目录下，分别为 `key.pem` 和 `cert.pem`（参见 `buildroot-external/scripts/rauc.sh`）。从那时起，每个构建都使用相同的自签名证书。这个自签名证书还会自动添加到 HAOS 镜像本身的密钥环中。这意味着从本地构建的 HAOS 安装可以处理来自同一构建目录的更新包。

### 更新到开发构建

将现有的官方安装更新到本地自签名构建会因签名验证错误而失败：

```sh
# rauc install haos_rpi5-64-11.6.dev0.raucb
安装中
  0% 安装中
  0% 确定槽状态
 20% 确定槽状态完成。
 20% 检查包
 20% 验证签名
 40% 验证签名失败。
 40% 检查包失败。
100% 安装失败。
最后错误: 签名验证失败: 验证错误:自签名证书
安装 `/mnt/data/haos_rpi5-64-11.6.dev0.raucb` 失败
```

然而，Home Assistant 操作系统不是一个封闭的平台。它使用默认的密钥环来验证传入的更新。通过对 OS shell 的 root 访问，添加另一个密钥环（可以是一个自签名证书）到密钥链相当简单，因此可以更新到自签名的操作系统构建：

```sh
# cp -r /etc/rauc/ /tmp/rauc
# cat /mnt/data/cert.pem >> /tmp/rauc/keyring.pem
# mount -o bind /tmp/rauc/ /etc/rauc/
# systemctl restart rauc
```

通过这些更改，可以安装本地构建。从本地构建的操作系统安装官方更新仍然是可能的，因为自签名证书被附加到密钥链。这意味着官方发布证书仍然被接受，即使对于本地构建。这允许从本地开发构建更新到官方发布。