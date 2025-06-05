---
title: "板子元数据"
sidebar_label: 元数据
---

每个支持的板子都有特定于 Home Assistant 操作系统（HAOS）的元数据文件，名为 `meta`。该文件记录了变量和可用的选项。

## 板子特定变量

`BOARD_ID`:

板子识别符。通常是小写字母。用于生成文件名，并在 os-release 文件中用作 `VARIANT_ID`。

`BOARD_NAME`:

用户友好的板子名称。在 os-release 文件中的 `VERSION` 和 `VARIANT` 变量中使用。

## 启动相关变量

`BOOT_ENV_SIZE`:

启动加载器环境的最大大小（以十六进制表示）。对于 rauc 是必需的。

`BOOT_SYS`:

- efi
- hybrid
- mbr

HAOS 尽可能使用 GPT。如果要使用 GPT，第二个逻辑块（LBA）需要是可用的。在某些板子上，该块由启动固件保留/要求。如果是这种情况，则需要使用 MBR 类的方法。

Hybrid 使用两种分区表，以防可以使用 GPT，但较低级别的固件仍然要求 MBR。

`BOOT_SPL`:

- true
- false

启用 SPL（次要程序加载器）处理。一些 U-Boot 目标生成一个小的加载器（SPL），除此之外还有主 U-Boot 二进制文件。

`BOOTLOADER`:

- grub
- uboot

HAOS 主要使用 [U-Boot](https://www.denx.de/wiki/U-Boot)。对于 UEFI 系统，使用 [GRUB](https://www.gnu.org/software/grub/)。

`DISK_SIZE`:

默认值 2。最终（未压缩）映像的大小，单位为 GB。

`KERNEL_FILE`:

内核二进制文件的文件名。通常 `Image` 用于 aarch64，`zImage` 用于 `armv7`，`bzImage` 用于 `amd64`。

## 管理程序相关变量

`SUPERVISOR_MACHINE`:

- generic-x86-64
- khadas-vim3
- odroid-c2
- odroid-c4
- odroid-n2
- odroid-xu
- qemuarm
- qemuarm-64
- qemux86
- qemux86-64
- raspberrypi
- raspberrypi2
- raspberrypi3
- raspberrypi4
- raspberrypi3-64
- raspberrypi4-64
- tinker

`SUPERVISOR_ARCH`:

- amd64
- i386
- armhf
- armv7
- aarch64