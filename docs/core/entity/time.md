---
title: 时间实体
sidebar_label: 时间
---

`time` 是一个实体，允许用户向集成输入时间。从 [`homeassistant.components.time.TimeEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/time/__init__.py) 派生实体平台。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 以获取数据。
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| native_value | time | **必填** | 时间的值。

其他所有实体共有的属性，如 `icon`、`name` 等，也适用。

## 方法

### 设置值

当用户或自动化想要更新值时调用。

```python
class MyTime(TimeEntity):
    # 实现其中一个方法。

    def set_value(self, value: time) -> None:
        """更新当前值。"""

    async def async_set_value(self, value: time) -> None:
        """更新当前值。"""