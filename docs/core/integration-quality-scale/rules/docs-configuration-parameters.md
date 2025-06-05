---
title: "文档描述了所有集成配置选项"
---

## 理由

集成可以提供选项流程，以允许用户更改集成配置。
此规则确保所有配置选项都有文档记录，以便用户可以理解每个选项的功能及其使用方法。

## 示例实现

以下示例适用于具有多个配置选项的集成，使用 `configuration_basic` 标签。

```markdown showLineNumbers
{% include integrations/option_flow.md %}

{% configuration_basic %}
国家代码：
  description: 您可以指定要在摄像头上显示的国家的国家代码（NL或BE）。
时间范围：
  description: 预测传感器前瞻降水的分钟数（最小5，最大120）。
{% endconfiguration_basic %}

```

## 例外情况

此规则没有例外情况。