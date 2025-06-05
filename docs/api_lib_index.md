---
title: "为API构建Python库"
sidebar_label: "介绍"
---

Home Assistant的基本规则之一是我们不包含任何特定于协议的代码。相反，这些代码应放在一个独立的Python库中并发布到PyPI。本文将描述如何开始这一过程！

## 基本库要求

- 库必须有源代码分发包，不能依赖于仅有二进制分发包的包。
- 对于与外部设备或服务通信的外部Python库，必须启用问题追踪器。
- 如果该库主要用作Home Assistant，并且您是集成的代码所有者，建议使用一个带有指向[Home Assistant核心问题](https://github.com/home-assistant/core/issues)链接的问题模板选择器。例如：[zwave-js-server-python - 新问题](https://github.com/home-assistant-libs/zwave-js-server-python/issues/new/choose)
- 该库及可能的子依赖库必须使用[OSI批准的许可证](https://opensource.org/license)进行许可。这应该反映在库的元数据中。

在本指南中，我们假设我们正在为可以通过HTTP访问并返回结构化为JSON对象的数据的Rest API构建一个库。这是我们看到的最常见类型的API。这些API可以在设备本身上访问，或者在云中访问。

本指南并非对每个API都完全适用。您可能需要调整示例。

:::info
如果您是制造商正在为您的产品设计新的API，[请在这里阅读添加到产品的最佳API类型](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/#local-device-pushing-new-state)。
:::

HTTP API请求由四个不同的部分组成：

- URL。这是我们获取数据的路径。在Rest API中，URL将唯一标识资源。URL的示例有`http://example.com/api/lights`和`http://example.com/api/light/1234`。
- HTTP方法。这定义了我们想从API获取的内容。最常见的有：
  - `GET`用于当我们想获取信息时，例如灯的状态
  - `POST`用于当我们希望执行某件事情（例如打开灯）
- 请求体。这是我们发送到服务器的数据，以确定需要执行的操作。这是我们在`POST`请求的情况下发送命令的方式。
- 头部。这包含描述请求的元数据。这将用于向请求附加授权。

## 结构化库

我们的库将由两个不同的部分组成：

- **身份验证：** 负责向API端点发出经过身份验证的HTTP请求并返回结果。这是唯一一个实际与API交互的代码部分。
- **数据模型：** 表示数据并提供与数据交互的命令。

## 在Home Assistant中尝试您的库

如果您希望在将库发布到PyPI之前在Home Assistant中尝试您的库，您需要运行可编辑版本的库。

请前往您的Home Assistant开发环境，激活虚拟环境并输入：

```shell
pip3 install -e ../my_lib_folder
```

现在运行Home Assistant而不从PyPI安装依赖项，以避免覆盖您的包。

```shell
hass --skip-pip-packages my_lib_module_name