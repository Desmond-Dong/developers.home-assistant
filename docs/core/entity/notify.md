---
title: 通知实体
sidebar_label: 通知
---

通知实体是一个能够向设备或服务发送消息的实体，但从 Home Assistant 的角度来看，它保持无状态。

通知实体派生自 [`homeassistant.components.notify.NotifyEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/notify/__init__.py)，
可以用于发送通知消息，例如（但不限于）：

- 短信
- 电子邮件
- 直接消息或聊天
- 在设备的 LCD 显示屏上显示的屏幕消息

## 状态

通知实体的状态是一个时间戳，表示最后发送的消息的日期和时间。
与 `text` 实体不同，`notify` 实体没有可以设置的状态。

如果您想表示某种可以改变的文本值（因此具有实际状态），您应该使用 `text` 实体。

## 属性

由于此集成是无状态的，因此它没有为自身提供任何特定的属性。
所有实体共有的其他属性，如 `icon` 和 `name` 等仍然适用。

## 方法

### 发送消息

发送消息方法用于向设备或服务发送消息。

```python
class MyNotifier(NotifyEntity):
    # 实现以下方法之一。

    def send_message(self, message: str, title: str | None = None) -> None:
        """发送消息。"""

    async def async_send_message(self, message: str, title: str | None = None) -> None:
        """发送消息。"""