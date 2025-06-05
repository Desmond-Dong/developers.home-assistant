---
title: 文本实体
sidebar_label: 文本
---

文本实体是允许用户向集成输入文本值的实体。从 [`homeassistant.components.text.TextEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/text/__init__.py) 派生实体平台。

## 属性

:::tip
属性应该始终仅从内存中返回信息，而不能执行 I/O（例如网络请求）。实现 `update()` 或 `async_update()` 以获取数据，或构建机制推送状态更新到实体类实例。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| mode | string | `text` | 定义文本在 UI 中的显示方式。可以是 `text` 或 `password`。
| native_max | int | 100 | 文本值中的最大字符数（包括）。
| native_min | int | 0 | 文本值中的最小字符数（包括）。
| pattern | str | `None` | 文本值必须匹配的正则表达式模式，以便有效。
| native_value | str | **必填** | 文本的值。

其他适用于所有实体的属性，如 `icon`、`name` 等也适用。


## 方法

### 设置值

```python
class MyTextEntity(TextEntity):
    # 实现其中一个方法。

    def set_value(self, value: str) -> None:
        """设置文本值。"""

    async def async_set_value(self, value: str) -> None:
        """设置文本值。"""