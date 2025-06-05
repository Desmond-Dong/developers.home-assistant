---
title: "文档提供了移除说明"
---

## 理由

从 Home Assistant 中移除设备或服务并不总是简单明了的。  
文档应该提供清晰的说明，告诉用户如何移除设备或服务。

## 示例实现

```markdown showLineNumbers
## 移除集成

该集成遵循标准的集成移除流程。无需额外的步骤。

{% include integrations/remove_device_service.md %}

在删除集成后，请进入制造商的应用程序，并在那里也移除 Home Assistant 集成。
```

## 例外情况

此规则没有例外情况。