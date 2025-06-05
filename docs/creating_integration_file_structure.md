---
title: "集成文件结构"
sidebar_label: "文件结构"
---

每个集成都存储在一个以集成域命名的目录中。该域是由字符和下划线组成的简短名称。这个域必须是唯一的，不能被更改。移动应用集成的域示例：`mobile_app`。因此，所有与此集成相关的文件都位于文件夹 `mobile_app/` 中。

该文件夹的最低内容如下所示：

- `manifest.json`: 清单文件描述了集成及其依赖项。[更多信息](creating_integration_manifest.md)
- `__init__.py`: 组件文件。如果集成仅提供一个平台，您可以将此文件限制为介绍集成的文档字符串 `"""The Mobile App integration."""`。

## 集成设备 - `light.py`, `switch.py` 等

如果您的集成将要集成一个或多个设备，您需要通过创建与实体集成交互的平台来实现。例如，如果您想在 Home Assistant 中表示一个灯设备，您将创建 `light.py`，该文件将包含灯集成的灯平台。

- 关于[可用实体集成](core/entity.md)的更多信息。
- 关于[创建平台](creating_platform_index.md)的更多信息。

## 集成服务操作 - `services.yaml`

如果您的集成将注册服务操作，它将需要提供可用操作的描述。描述存储在 `services.yaml` 中。[关于 `services.yaml` 的更多信息。](dev_101_services.md)

## 数据更新协调器 - `coordinator.py`

您的集成有多种方式接收数据，包括推送或轮询。通常，集成将通过对所有实体进行单次协调的轮询来获取数据，这需要使用 `DataUpdateCoordinator`。如果您想使用它，并选择创建它的子类，建议在 `coordinator.py` 中定义协调器类。[关于 `DataUpdateCoordinator` 的更多信息](integration_fetching_data.md#coordinated-single-api-poll-for-data-for-all-entities)。

## Home Assistant 查找集成的位置

当 Home Assistant 在配置文件中看到引用的域（即 `mobile_app:`）或如果它是另一个集成的依赖项时，它会查找集成。Home Assistant 将查看以下位置：

- `<config directory>/custom_components/<domain>`
- `homeassistant/components/<domain>`（内置集成）

您可以通过在 `<config directory>/custom_components` 文件夹中拥有一个相同域的集成来覆盖内置集成。[在您覆盖核心集成时 `manifest.json` 文件需要一个版本标签](creating_integration_manifest/#version)。被覆盖的核心集成可以通过在概述的集成框右上角的特定图标来识别 [![打开您的 Home Assistant 实例并显示您的集成。](https://my.home-assistant.io/badges/integrations.svg)](https://my.home-assistant.io/redirect/integrations/)
请注意，不推荐覆盖内置集成，因为您将不再获得更新。建议选择一个独特的名称。
