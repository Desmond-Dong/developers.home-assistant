---
title: "通过YAML进行集成配置"
---

`configuration.yaml` 是由用户定义的配置文件。它在Home Assistant首次启动时自动创建。它定义了要加载的组件。

:::info 关于设备和/或服务的YAML说明

与设备和/或服务通信的集成通过配置流程进行配置。在极少数情况下，我们可以例外。已存在的集成如果不应有YAML配置，允许并鼓励实施配置流程并移除YAML支持。对这些已有集成的现有YAML配置的更改将不再被接受。

更多详细信息请参阅 [ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md#decision)
:::

## 预处理

Home Assistant将根据指定加载的组件对配置进行一些预处理。

### CONFIG_SCHEMA

如果一个组件定义了变量 `CONFIG_SCHEMA`，则传入的配置对象将是通过 `CONFIG_SCHEMA` 运行配置的结果。 `CONFIG_SCHEMA` 应该是一个强壮的模式（voluptuous schema）。

### PLATFORM_SCHEMA

如果一个组件定义了变量 `PLATFORM_SCHEMA`，则该组件将被视为实体组件。实体组件的配置是平台配置的列表。

Home Assistant将收集此组件的所有平台配置。它将通过查找组件域（如 `light`）下的配置条目，同时还会查找域+附加文本的任何条目来实现。

在收集平台配置时，Home Assistant会对其进行验证。它会检查平台是否存在，并且如果平台定义了 `PLATFORM_SCHEMA`，则会根据该模式进行验证。如果未定义，则会根据组件中定义的 `PLATFORM_SCHEMA` 来验证配置。任何引用不存在的平台或包含无效配置的配置将被删除。

以下的 `configuration.yaml`：

```yaml
unrelated_component:
  some_key: some_value

switch:
  platform: example1

switch living room:
  - platform: example2
    some_config: true
  - platform: invalid_platform
```

将被传递给组件为

```python
{
    "unrelated_component": {
        "some_key": "some_value"
    },
    "switch": [
        {
            "platform": "example1"
        },
        {
            "platform": "example2",
            "some_config": True
        }
    ],
}