---
title: "与多个平台的集成"
sidebar_label: 多个平台
---

大多数集成由单个平台组成。在这种情况下，只需定义一个平台即可。然而，如果您要添加第二个平台，您将希望集中管理您的连接逻辑。这在组件内部完成（`__init__.py`）。

如果您的集成可以通过 `configuration.yaml` 进行配置，则会导致您的配置入口点发生变化，因为现在用户需要直接设置您的集成，您的集成负责设置平台。

## 当通过配置条目配置时加载平台

如果您的集成是通过配置条目设置的，您需要将配置条目转发到适当的集成，以设置您的平台。欲了解更多信息，请参见 [配置条目文档](config_entries_index.md#for-platforms)。

## 当通过 configuration.yaml 配置时加载平台

如果您的集成不使用配置条目，则必须使用我们的发现助手来设置其平台。请注意，此方法不支持卸载。

为此，您需要使用发现助手中的 `load_platform` 和 `async_load_platform` 方法。

- 另见 [实现该逻辑的完整示例](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/example_load_platform/)