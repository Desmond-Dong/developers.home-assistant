---
title: 二进制传感器实体
sidebar_label: 二进制传感器
---

二进制传感器是只能有两种状态的传感器。从 [`homeassistant.components.binary_sensor.BinarySensorEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/binary_sensor/__init__.py) 派生实体平台。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 以获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| is_on| <code>bool &#124; None</code> | `None` | **必填**。如果二进制传感器当前是开启还是关闭。
| device_class | <code>BinarySensorDeviceClass &#124; None</code> | `None` | 二进制传感器的类型。

### 可用设备类别

| 常量 | 描述
| ----- | -----------
| `BinarySensorDeviceClass.BATTERY` | 开启表示低电量，关闭表示正常。
| `BinarySensorDeviceClass.BATTERY_CHARGING` | 开启表示正在充电，关闭表示未充电。
| `BinarySensorDeviceClass.CO` | 开启表示检测到一氧化碳，关闭表示没有一氧化碳（正常）。
| `BinarySensorDeviceClass.COLD` | 开启表示寒冷，关闭表示正常。
| `BinarySensorDeviceClass.CONNECTIVITY` | 开启表示已连接，关闭表示未连接。
| `BinarySensorDeviceClass.DOOR` | 开启表示打开，关闭表示关闭。
| `BinarySensorDeviceClass.GARAGE_DOOR` | 开启表示打开，关闭表示关闭。
| `BinarySensorDeviceClass.GAS` | 开启表示检测到气体，关闭表示没有气体（正常）。
| `BinarySensorDeviceClass.HEAT` | 开启表示热，关闭表示正常。
| `BinarySensorDeviceClass.LIGHT` | 开启表示检测到光，关闭表示没有光。
| `BinarySensorDeviceClass.LOCK` | 开启表示打开（解锁），关闭表示关闭（锁定）。
| `BinarySensorDeviceClass.MOISTURE` | 开启表示潮湿，关闭表示干燥。
| `BinarySensorDeviceClass.MOTION` | 开启表示检测到运动，关闭表示没有运动（正常）。
| `BinarySensorDeviceClass.MOVING` | 开启表示正在移动，关闭表示不移动（停止）。
| `BinarySensorDeviceClass.OCCUPANCY` | 开启表示占用，关闭表示未占用（正常）。
| `BinarySensorDeviceClass.OPENING` | 开启表示打开，关闭表示关闭。
| `BinarySensorDeviceClass.PLUG` | 开启表示已插入，关闭表示已拔出。
| `BinarySensorDeviceClass.POWER` | 开启表示检测到电源，关闭表示没有电源。
| `BinarySensorDeviceClass.PRESENCE` | 开启表示在家，关闭表示不在。
| `BinarySensorDeviceClass.PROBLEM` | 开启表示检测到问题，关闭表示没有问题（正常）。
| `BinarySensorDeviceClass.RUNNING` | 开启表示正在运行，关闭表示未运行。
| `BinarySensorDeviceClass.SAFETY` | 开启表示不安全，关闭表示安全。
| `BinarySensorDeviceClass.SMOKE` | 开启表示检测到烟雾，关闭表示没有烟雾（正常）。
| `BinarySensorDeviceClass.SOUND` | 开启表示检测到声音，关闭表示没有声音（正常）。
| `BinarySensorDeviceClass.TAMPER` | 开启表示检测到篡改，关闭表示没有篡改（正常）
| `BinarySensorDeviceClass.UPDATE` | 开启表示有可用更新，关闭表示是最新的。应避免使用此设备类别，请考虑使用 [`update`](/docs/core/entity/update) 实体。
| `BinarySensorDeviceClass.VIBRATION` | 开启表示检测到震动，关闭表示没有震动。
| `BinarySensorDeviceClass.WINDOW` | 开启表示打开，关闭表示关闭。