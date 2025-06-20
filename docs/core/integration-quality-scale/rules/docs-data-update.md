---
title: "文档描述了数据是如何更新的"
---

## 推理

为了让用户了解集成的工作原理，我们应该描述集成的数据是如何更新的。
因为这将帮助用户对集成在其用例中的效果产生期望。
每5分钟只能轮询一次的运动传感器比主动推送更新的运动传感器可用性差。

由于用户可以为轮询集成定义自己的轮询间隔，我们应该添加当前的轮询速率并描述任何限制。
例如，如果我们连接的设备已知存在处理过多请求的问题，我们应该在文档中描述这一点。

## 示例实现

```markdown showLineNumbers
## 数据更新

我的集成默认每5分钟从设备获取一次数据。
较新的设备（运行MyOS的设备）可以{% term push %}数据。
在集成开始时，我们尝试启用该功能，如果失败则退回到{% term polling %}。
```

## 例外情况

对此规则没有例外。