---
title: "文档描述了所有集成安装参数"
---

## 理由

在设置集成时，没有什么比不知道需要什么信息更令人沮丧的了。为了改善用户体验，文档应该描述在安装过程中所需的所有参数。这应该帮助用户在开始安装过程之前收集所有必要的信息。

## 示例实现

如果通过配置流程使用集成：

```markdown showLineNumbers
{% configuration_basic %}
Host:
    description: "您的桥接设备的IP地址。您可以在路由器中找到它，或在集成应用程序中的 **桥接设置** > **本地API** 下找到。"
Local access token:
    description: "您的桥接设备的本地访问令牌。您可以在集成应用程序中的 **桥接设置** > **本地API** 下找到。"
{% endconfiguration_basic %}
```

如果通过 `configuration.yaml` 中的 YAML 设置集成：

```markdown showLineNumbers
{% configuration %}
Host:
    description: "您的桥接设备的IP地址。您可以在路由器中找到它，或在集成应用程序中的 **桥接设置** -> **本地API** 下找到。"
    required: false
    type: string
Local access token:
    description: "您的桥接设备的本地访问令牌。您可以在集成应用程序中的 **桥接设置** -> **本地API** 下找到。"
    required: false
    type: string
{% endconfiguration %}
```

## 例外

此规则没有例外。