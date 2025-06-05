---
title: 锁实体
sidebar_label: 锁
---

锁实体能够被锁定和解锁。锁定和解锁可以选择性地通过用户代码来保护。一些锁还允许打开闩锁，这也可以通过用户代码来保护。从 [`homeassistant.components.lock.LockEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/lock/__init__.py) 派生一个平台实体。

## 属性

:::tip
属性始终只应从内存中返回信息，而不是进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 以获取数据。
:::

| 名称       | 类型    | 默认   | 描述
|------------|---------|--------|---------
| changed_by | string  | None   | 描述最后一次更改是由什么触发的。
| code_format| string  | None   | 代码格式的正则表达式，如果不需要代码，则为 None。
| is_locked  | bool    | None   | 指示锁当前是否被锁定。用于确定 `state`。
| is_locking | bool    | None   | 指示锁当前是否正在锁定。用于确定 `state`。
| is_unlocking| bool   | None   | 指示锁当前是否正在解锁。用于确定 `state`。
| is_jammed  | bool    | None   | 指示锁当前是否被卡住。用于确定 `state`。
| is_opening | bool    | None   | 指示锁当前是否正在开启。用于确定 `state`。
| is_open    | bool    | None   | 指示锁当前是否打开。用于确定 `state`。

### 状态

状态是通过设置上述属性来定义的。得到的状态使用 `LockState` 枚举，返回以下成员之一。

| 值         | 描述                                                            |
|------------|-----------------------------------------------------------------|
| `LOCKED`   | 锁定是锁定状态。                                               |
| `LOCKING`  | 锁正在锁定。                                                  |
| `UNLOCKING`| 锁正在解锁。                                                  |
| `UNLOCKED` | 锁是解锁状态。                                                |
| `JAMMED`   | 锁当前被卡住。                                                |
| `OPENING`  | 锁正在开启。                                                  |
| `OPEN`     | 锁是打开状态。                                                |

## 支持的功能

支持的功能通过使用 `LockEntityFeature` 枚举中的值定义，并使用按位或 (`|`) 操作符组合。

| 值        | 描述                                     |
|-----------|------------------------------------------|
| `OPEN`    | 此锁支持打开门闩。                      |

## 方法

### 锁定

```python
class MyLock(LockEntity):

    def lock(self, **kwargs):
        """锁定所有或指定的锁。可以选择性地指定锁定锁的代码。"""

    async def async_lock(self, **kwargs):
        """锁定所有或指定的锁。可以选择性地指定锁定锁的代码。"""
```

### 解锁

```python
class MyLock(LockEntity):

    def unlock(self, **kwargs):
        """解锁所有或指定的锁。可以选择性地指定解锁锁的代码。"""

    async def async_unlock(self, **kwargs):
        """解锁所有或指定的锁。可以选择性地指定解锁锁的代码。"""
```

### 打开

仅在设置 `SUPPORT_OPEN` 标志时实现此方法。

```python
class MyLock(LockEntity):

    def open(self, **kwargs):
        """打开（解闩）所有或指定的锁。可以选择性地指定打开锁的代码。"""

    async def async_open(self, **kwargs):
        """打开（解闩）所有或指定的锁。可以选择性地指定打开锁的代码。"""