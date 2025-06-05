---
title: 远程实体
sidebar_label: 远程
---

远程实体可以表示两种不同类型的设备：

1. 一个发送指令的物理设备。
2. 一个在 Home Assistant 中的虚拟设备，它向另一个物理设备发送指令，例如电视。

从 [`homeassistant.components.remote.RemoteEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/remote/__init__.py) 派生实体平台

## 属性

:::tip
属性应该始终只从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| current_activity | str | None | 返回当前活动 |
| activity_list | list | None | 返回可用活动的列表 |

### 活动

活动是一个预定义的活动或宏，它将远程控制器置于特定状态。例如，一个“观看电视”活动可能会开启多个设备并将频道更改为特定频道。

## 支持的特性

支持的特性通过使用 `RemoteEntityFeature` 枚举中的值定义，并使用按位或 (`|`) 运算符组合。

| 值                | 描述                                      |
| ----------------- | ------------------------------------------ |
| `LEARN_COMMAND`   | 实体允许从设备学习指令。                    |
| `DELETE_COMMAND`  | 实体允许从设备删除指令。                    |
| `ACTIVITY`        | 实体支持活动。                             |

## 方法

### 开启指令

```python
class MyRemote(RemoteEntity):

    def turn_on(self, activity: str = None, **kwargs):
         """发送开启指令。"""

    async def async_turn_on(self, activity: str = None, **kwargs):
         """发送开启指令。"""
```

### 关闭指令

```python
class MyRemote(RemoteEntity):

    def turn_off(self, activity: str = None, **kwargs):
         """发送关闭指令。"""

    async def async_turn_off(self, activity: str = None, **kwargs):
         """发送关闭指令。"""
```

### 切换指令

```python
class MyRemote(RemoteEntity):

    def toggle(self, activity: str = None, **kwargs):
         """切换设备。"""

    async def async_toggle(self, activity: str = None, **kwargs):
         """切换设备。"""
```

### 发送指令

```python
class MyRemote(RemoteEntity):

    def send_command(self, command: Iterable[str], **kwargs):
        """向设备发送指令。"""

    async def async_send_command(self, command: Iterable[str], **kwargs):
        """向设备发送指令。"""
```

### 学习指令

仅在标志 `SUPPORT_LEARN_COMMAND` 被设置时实现此方法。

```python
class MyRemote(RemoteEntity):

    def learn_command(self, **kwargs):
        """从设备学习指令。"""

    async def async_learn_command(self, **kwargs):
        """从设备学习指令。"""
```

### 删除指令

仅在标志 `SUPPORT_DELETE_COMMAND` 被设置时实现此方法。

```python
class MyRemote(RemoteEntity):

    def delete_command(self, **kwargs):
        """从设备删除指令。"""

    async def async_delete_command(self, **kwargs):
        """从设备删除指令。"""