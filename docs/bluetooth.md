---
title: "蓝牙"
sidebar_label: "构建蓝牙集成"
---

### 集成作者的最佳实践

- 需要使用蓝牙适配器的集成应在其 [`manifest.json`](creating_integration_manifest.md) 的 [`dependencies`](creating_integration_manifest.md#dependencies) 中添加 `bluetooth_adapters`。此 [`manifest.json`](creating_integration_manifest.md) 条目确保所有受支持的远程适配器在集成尝试使用它们之前已连接。

- 调用 `bluetooth.async_get_scanner` API 获取 `BleakScanner` 实例并将其传递给你的库。返回的扫描器避免了运行多个扫描器的开销，这非常重要。此外，如果用户更改蓝牙适配器设置，封装的扫描器将继续正常工作。

- 避免在连接之间重复使用 `BleakClient`，因为这会使连接变得不可靠。

- 使用至少十（10）秒的连接超时，因为 `BlueZ` 必须在第一次连接到新设备或更新设备时解析服务。在连接时，临时连接错误很常见，并且连接并不总是在第一次尝试时成功。`bleak-retry-connector` PyPI 包可以消除快速且可靠地与设备建立连接时的猜测。

### 可连接和不可连接的蓝牙控制器

Home Assistant 支持远程蓝牙控制器。一些控制器仅支持监听广告数据，而不支持连接到设备。由于许多设备只需要接收广告，我们有可连接设备和不可连接设备的概念。假设设备不需要主动连接，那么 `connectable` 参数应设置为 `False`，以选择接收来自不支持发起连接的控制器的数据。当 `connectable` 设置为 `False` 时，将提供来自可连接和不可连接控制器的数据。

`connectable` 的默认值为 `True`。如果集成有一些需要连接的设备和一些不需要连接的设备，`manifest.json` 应该为设备适当地设置该标志。如果无法构建匹配器来区分相似的设备，请检查配置流发现中的 `connectable` 属性 `BluetoothServiceInfoBleak`，并拒绝需要发起连接的设备的流。