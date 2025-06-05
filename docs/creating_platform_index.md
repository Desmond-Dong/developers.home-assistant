---
title: "集成平台"
sidebar_label: "平台"
---

Home Assistant 有各种内置集成，可以抽象出设备类型。包括 [灯光](core/entity/light.md)、[开关](core/entity/switch.md)、[遮挡物](core/entity/cover.md)、[气候设备](core/entity/climate.md) 等 [更多](core/entity.md) 类型。您的集成可以通过创建平台来与这些集成连接。每个与您集成的集成都需要一个平台。

要创建一个平台，您需要创建一个以您所构建的集成的域名命名的文件。因此，如果您正在构建一个灯光，您需要在集成文件夹中添加一个新的文件 `light.py`。

我们创建了两个示例集成，以便您了解这是如何工作的：

- [示例传感器平台](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/example_sensor/): 平台的 hello world。
- [示例灯光平台](https://github.com/home-assistant/example-custom-config/tree/master/custom_components/example_light/): 展示最佳实践。

### 与设备接口

Home Assistant 的一条规则是，集成不应直接与设备接口。相反，它应与第三方 Python 3 库进行交互。这样，Home Assistant 可以与 Python 社区共享代码，从而保持项目的可维护性。

一旦您有了 [准备好并发布到 PyPI 的 Python 库](api_lib_index.md)，请将其添加到 [清单](creating_integration_manifest.md) 中。现在是实现您所创建平台的集成所提供的实体基类的时候了。

在 [实体索引](core/entity.md) 中找到您的集成，以查看可实现的方法和属性。