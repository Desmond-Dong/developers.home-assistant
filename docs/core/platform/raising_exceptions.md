---
title: "抛出异常"
---

## 在服务动作处理程序中抛出异常

像服务动作调用和实体方法（例如 *设置HVAC模式*）这样的操作应当正确地抛出异常。

当用户出现错误时，集成应该抛出 `ServiceValidationError`（而不是 `ValueError`）。在这种情况下，堆栈跟踪将仅在调试级别打印。

对于其他故障，例如与设备通信时出现的问题，应抛出 `HomeAssistantError`。请注意，在这种情况下，异常堆栈跟踪将被打印到日志中。

## 本地化异常

Home Assistant [支持本地化](/docs/internationalization/core/#exceptions) `HomeAssistantError` 及其子类如 `ServiceValidationError`。