---
title: 设备跟踪器实体
sidebar_label: 设备跟踪器
---

设备跟踪器是一个只读实体，提供存在信息。设备跟踪器实体有两种类型，ScannerEntity和TrackerEntity。

## ScannerEntity

ScannerEntity报告本地网络上设备的连接状态。如果设备已连接，ScannerEntity的状态将为`home`，如果设备未连接，状态将为`not_home`。

从 [`homeassistant.components.device_tracker.config_entry.ScannerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py) 派生一个平台实体。

### 属性

:::tip
属性应始终仅从内存中返回信息，而不执行I/O（如网络请求）。实现`update()`或`async_update()`来获取数据。
:::

| 名称           | 类型                          | 默认值            | 描述                                 |
| -------------- | ----------------------------- | ----------------- | ------------------------------------ |
| battery_level  | <code>int &#124; None</code>  | `None`            | 设备的电池电量。                      |
| hostname       | <code>str &#124; None</code>  | `None`            | 设备的主机名。                        |
| ip_address     | <code>str &#124; None</code>  | `None`            | 设备的IP地址。                        |
| is_connected   | `bool`                        | **必需**          | 设备的连接状态。                      |
| mac_address    | <code>str &#124; None</code>  | `None`            | 设备的MAC地址。                       |
| source_type    | `SourceType`                  | `SourceType.ROUTER` | 设备的源类型。                       |

### DHCP 发现

如果设备跟踪器的`source_type`为`router`并且`ip_address`、`mac_address`和`hostname`属性已设置，数据将
加速`DHCP 发现`，因为系统将不必等待
DHCP发现数据包来查找现有设备。

## TrackerEntity

TrackerEntity跟踪设备的位置，并将其报告为位置名称、区域名称或`home`或`not_home`状态。TrackerEntity通常接收GPS坐标以确定其状态。要报告状态，`location_name`或`latitude`和`longitude`应该被设置。

从 [`homeassistant.components.device_tracker.config_entry.TrackerEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/device_tracker/config_entry.py) 派生一个平台实体。

### 属性

:::tip
属性应始终仅从内存中返回信息，而不执行I/O（如网络请求）。实现`update()`或`async_update()`来获取数据。
:::

| 名称               | 类型                          | 默认值          | 描述                                   |
| ------------------ | ----------------------------- | --------------- | -------------------------------------- |
| battery_level      | <code>int &#124; None</code>   | `None`          | 设备的电池电量。                        |
| latitude           | <code>float &#124; None</code> | `None`          | 设备的纬度坐标。                        |
| location_accuracy  | `float`                       | `0`             | 设备的位置信息准确度（米）。               |
| location_name      | <code>str &#124; None</code>   | `None`          | 设备的位置名称。                        |
| longitude          | <code>float &#124; None</code> | `None`          | 设备的经度坐标。                        |
| source_type        | SourceType                    | `SourceType.GPS` | 设备的源类型。                          |