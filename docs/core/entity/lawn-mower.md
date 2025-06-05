---
title: 拉园机实体
sidebar_label: 拉园机
---

从 [`homeassistant.components.lawn_mower.LawnMowerEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/lawn_mower/__init__.py) 派生实体平台

## 属性

:::tip
属性应始终只从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::


| 名称     | 类型                                        | 默认值 | 描述
| -------- | ------------------------------------------- | ------ | -----------------
| activity | <code>LawnMowerActivity &#124; None</code> | `None` | 当前活动。

## 活动

| 活动     | 描述
| -------- | -----------
| `MOWING` | 拉园机当前正在修剪。
| `DOCKED` | 拉园机已完成修剪并正在停靠。
| `PAUSED` | 拉园机处于暂停状态。
| `RETURNING` | 拉园机正在返回停靠位置。
| `ERROR`  | 拉园机在活动期间遇到错误，需要帮助。

## 支持的功能

支持的功能通过在 `LawnMowerEntityFeature` 枚举中使用值定义，并通过按位或（`|`）运算符组合。

| 值              | 描述                                          |
| --------------- | --------------------------------------------- |
| `START_MOWING` | 拉园机支持开始修剪命令。                      |
| `PAUSE`        | 拉园机支持暂停当前任务。                      |
| `DOCK`         | 拉园机支持返回停靠命令。                      |

## 方法

### `start_mowing` 或 `async_start_mowing`

开始或恢复修剪任务。

### `dock` 或 `async_dock`

停止拉园机，返回停靠位置。

### `pause` 或 `async_pause`

在当前操作期间暂停拉园机。