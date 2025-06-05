---
title: "集成清单"
sidebar_label: "清单"
---

每个集成都有一个清单文件来指定其基本信息。该文件存储为 `manifest.json` 在您的集成目录中。添加此类文件是必需的。

```json
{
  "domain": "hue",
  "name": "飞利浦Hue",
  "after_dependencies": ["http"],
  "codeowners": ["@balloob"],
  "dependencies": ["mqtt"],
  "documentation": "https://www.home-assistant.io/components/hue",
  "integration_type": "hub",
  "iot_class": "local_polling",
  "issue_tracker": "https://github.com/balloob/hue/issues",
  "loggers": ["aiohue"],
  "requirements": ["aiohue==1.9.1"],
  "quality_scale": "platinum"
}
```

或者一个您可以复制到项目中的最小示例：

```json
{
  "domain": "your_domain_name",
  "name": "Your Integration",
  "codeowners": [],
  "dependencies": [],
  "documentation": "https://www.example.com",
  "integration_type": "hub",
  "iot_class": "cloud_polling",
  "requirements": []
}
```

## 域

域是由字符和下划线组成的短名称。此域必须是唯一的，并且不能更改。移动应用集成的域示例：`mobile_app`。域密钥必须与该文件所在目录匹配。

## 名称

集成的名称。

## 版本

对于核心集成，这应被省略。

集成的版本是自定义集成所必需的。版本需要是一个有效版本，被 [AwesomeVersion](https://github.com/ludeeus/awesomeversion) 认可，如 [CalVer](https://calver.org/) 或 [SemVer](https://semver.org/)。

## 集成类型

集成分为多种集成类型。每个集成都必须在其清单中提供一个 `integration_type`，描述其主要焦点。

:::warning
如果未设置，我们当前默认为 `hub`。此默认设置在过渡期间是暂时的，每个集成都应设置 `integration_type`，因此将来将变为强制要求。
:::

| 类型 | 描述
| ---- | -----------
| `device` | 提供单个设备，例如 ESPHome。 |
| `entity` | 提供基本实体平台，如传感器或灯。这通常不应使用。 |
| `hardware` | 提供硬件集成，如 Raspberry Pi 或 Hardkernel。这通常不应使用。 |
| `helper` | 提供实体以帮助用户进行自动化，如输入布尔值、导数或组。 |
| `hub` | 提供集线器集成，支持多个设备或服务，如飞利浦Hue。 |
| `service` | 提供单个服务，如 DuckDNS 或 AdGuard。 |
| `system` | 提供系统集成并保留，通常不应使用。 |
| `virtual` | 本身不是集成。相反，它指向另一个集成或物联网标准。请参阅 [虚拟集成](#虚拟集成) 部分。 |

:::info
`hub` 与 `service` 或 `device` 之间的区别由集成的性质定义。`hub` 提供对多个其他设备或服务的网关。`service` 和 `device` 是每个配置条目提供单个设备或服务的集成。
:::

## 文档

包含有关如何使用您的集成的文档的网站。如果该集成是提交给 Home Assistant 的，它应为 `https://www.home-assistant.io/integrations/<domain>`

## 问题跟踪

集成的问题跟踪，用户在遇到问题时报告。如果该集成是提交给 Home Assistant 的，则应省略。对于内置集成，Home Assistant 将自动生成正确的链接。

## 依赖项

依赖项是您希望 Home Assistant 在加载该集成之前成功设置的其他 Home Assistant 集成。将集成添加到依赖项将确保依赖集成在设置之前加载，但不能保证所有依赖配置条目都已设置。如果您希望提供来自其他集成的功能，例如 Webhook 或 MQTT 连接，则添加依赖项可能是必要的。如果依赖项是可选但不是关键的，添加 [后依赖项](#after-dependencies) 可能是更好的选择。有关处理 MQTT 的更多详细信息，请参阅 [MQTT 部分](#mqtt)。

内置集成仅应在 `dependencies` 中指定其他内置集成。自定义集成可以在 `dependencies` 中同时指定内置和自定义集成。

## 后依赖项

此选项用于指定可能被集成使用但不是必需的依赖项。当存在 `after_dependencies` 时，集成的设置将等待在 `after_dependencies` 中列出的集成（这些集成可通过 YAML 或配置条目进行配置）先进行设置。它还将确保 `after_dependencies` 的要求已安装，以便安全导入集成中的方法，无论 `after_dependencies` 中列出的集成是否已配置。例如，如果 `camera` 集成在某些配置中可能使用 `stream` 集成，将 `stream` 添加到 `camera` 清单的 `after_dependencies` 中将确保在配置时首先加载 `stream`，并且该 `stream` 的任何依赖项都已安装并可以被 `camera` 导入。如果 `stream` 未配置，`camera` 仍会加载。

内置集成仅应在 `after_dependencies` 中指定其他内置集成。自定义集成可以在 `after_dependencies` 中同时指定内置和自定义集成。

## 代码所有者

负责此集成的 GitHub 用户名或团队名称。您应该至少在这里添加您的 GitHub 用户名，以及任何帮助您编写包含代码的人。

## 配置流

如果您的集成具有创建配置条目的配置流，请指定 `config_flow` 键。指定后，必须在您的集成中存在 `config_flow.py` 文件。

```json
{
  "config_flow": true
}
```

### 仅单个配置条目

如果您的集成仅支持一个配置条目，请指定 `single_config_entry` 键。指定后，它将不允许用户为此集成添加超过一个的配置条目。

```json
{
  "single_config_entry": true
}
```

## 要求

要求是您通常使用 `pip` 为您的组件安装的 Python 库或模块。Home Assistant 将尝试将要求安装到 Home Assistant [配置目录](https://www.home-assistant.io/docs/configuration/) 的 `deps` 子目录中，如果您未使用 `venv`，或者在像 `path/to/venv/lib/python3.6/site-packages` 的位置运行虚拟环境。这将确保所有要求在启动时可用。如果步骤失败，例如缺少模块编译的包或其他安装错误，该组件将无法加载。

要求是一个字符串数组。每个条目都是一个与 `pip` 兼容的字符串。例如，媒体播放器 Cast 平台依赖于 Python 包 PyChromecast v3.2.0： `["pychromecast==3.2.0"]`。

### 在开发和测试期间的自定义要求

在组件开发期间，测试不同版本的要求可能是有用的。这可以通过两个步骤完成，使用 `pychromecast` 作为示例：

```shell
pip install pychromecast==3.2.0 --target ~/.homeassistant/deps
hass --skip-pip-packages pychromecast
```

这将使用指定的版本，并防止 Home Assistant 尝试使用 `requirements` 中指定的内容覆盖它。要防止任何未指定依赖项的包被自动覆盖，您可以通过全局 `--skip-pip` 标志启动 Home Assistant。

如果您需要对要求进行更改以支持您的组件，也可以使用 `pip install -e` 安装要求的开发版本：

```shell
git clone https://github.com/balloob/pychromecast.git
pip install -e ./pychromecast
hass --skip-pip-packages pychromecast
```

还可以使用公共 Git 仓库来安装要求。这样做可能很有用，例如，在其发布到 PyPI 之前测试对要求依赖的更改。语法：

```json
{
  "requirements": ["<library>@git+https://github.com/<user>/<project>.git@<git ref>"]
}
```
`<git ref>` 可以是任何 git 引用：分支、标签、提交哈希等。有关 Git 支持的 [PIP 文档](https://pip.pypa.io/en/stable/topics/vcs-support/#git)。

以下示例将直接从 GitHub 安装 `pycoolmaster` 库的 `except_connect` 分支：

```json
{
  "requirements": ["pycoolmaster@git+https://github.com/issacg/pycoolmaster.git@except_connect"]
}
```

### 自定义集成要求

自定义集成应仅包括核心 [requirements.txt](https://github.com/home-assistant/core/blob/dev/requirements.txt) 不需要的要求。

## 日志记录器

`loggers` 字段是集成的要求用于其 [getLogger](https://docs.python.org/3/library/logging.html?highlight=logging#logging.getLogger) 调用的名称列表。

## 蓝牙

如果您的集成支持通过蓝牙进行发现，您可以在清单中添加匹配器。如果用户加载了 `bluetooth` 集成，它将在发现时加载您集成的配置流的 `bluetooth` 步骤。我们支持通过匹配 `connectable`、`local_name`、`service_uuid`、`service_data_uuid`、`manufacturer_id` 和 `manufacturer_data_start` 来监听蓝牙发现。`manufacturer_data_start` 字段期望是一个字节列表，编码为 0-255 的整数值。清单值是匹配器字典的列表。如果在蓝牙数据中找到任何指定匹配器的所有项，则发现您的集成。由您的配置流去过滤重复项。

`local_name` 的匹配不能包含前面三个 (3) 字符中的任何模式。

如果设备仅需要广告数据，则将 `connectable` 设置为 `false` 将选择接收来自没有连接支持的蓝牙控制器的发现。

以下示例将匹配 Nespresso Prodigio 机器：

```json
{
  "bluetooth": [
    {
      "local_name": "Prodigio_*"
    }
  ]
}
```

以下示例将匹配用于 SwitchBot 机器人和窗帘设备的 128 位 uuid 的服务数据：

```json
{
  "bluetooth": [
    {
      "service_uuid": "cba20d00-224d-11e6-9fb8-0002a5d5c51b"
    }
  ]
}
```

如果您想要匹配具有 16 位 uuid 的服务数据，则首先需要将其转换为 128 位 uuid，通过将 `00000000-0000-1000-8000-00805f9b34fb` 中的第三个和第四个字节替换为 16 位 uuid。例如，对于 Switchbot 传感器设备，16 位 uuid 为 `0xfd3d`，对应的 128 位 uuid 为 `0000fd3d-0000-1000-8000-00805f9b34fb`。以下示例因此将匹配用于 SwitchBot 传感器设备的 16 位 uuid 的服务数据：

```json
{
  "bluetooth": [
    {
      "service_data_uuid": "0000fd3d-0000-1000-8000-00805f9b34fb"
    }
  ]
}
```

以下示例将匹配 HomeKit 设备：

```json
{
  "bluetooth": [
    {
      "manufacturer_id": 76,
      "manufacturer_data_start": [6]
    }
  ]
}
```

## Zeroconf

如果您的集成支持通过 [Zeroconf](https://en.wikipedia.org/wiki/Zero-configuration_networking) 进行发现，您可以在清单中添加该类型。如果用户加载了 `zeroconf` 集成，它将在发现时加载您集成的配置流的 `zeroconf` 步骤。

Zeroconf 是一个列表，因此您可以指定多个类型进行匹配。

```json
{
  "zeroconf": ["_googlecast._tcp.local."]
}
```

某些 zeroconf 类型非常通用（例如，`_printer._tcp.local.`、`_axis-video._tcp.local.` 或 `_http._tcp.local.`)。在这种情况下，您应该包含名称（`name`）或属性（`properties`）过滤器：

```json
{
  "zeroconf": [
    {"type":"_axis-video._tcp.local.","properties":{"macaddress":"00408c*"}},
    {"type":"_axis-video._tcp.local.","name":"example*"},
    {"type":"_airplay._tcp.local.","properties":{"am":"audioaccessory*"}},
   ]
}
```

请注意，`properties` 过滤器中的所有值必须为小写，并且可以包含 fnmatch 类型的通配符。

## SSDP

如果您的集成支持通过 [SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol) 进行发现，您可以在清单中添加该类型。如果用户加载了 `ssdp` 集成，它将在发现时加载您集成的配置流的 `ssdp` 步骤。我们支持通过 SSDP ST、USN、EXT 和 Server 头（以小写形式显示的头名称）发现 SSDP，以及数据在 [UPnP 设备描述](https://openconnectivity.org/developer/specifications/upnp-resources/upnp/basic-device-v1-0/) 中。清单值是匹配器字典的列表，如果在 SSDP/UPnP 数据中找到任何指定匹配器的所有项，则发现您的集成。由您的配置流去过滤重复项。

以下示例有一个匹配器，由三个项组成，所有项必须匹配，该配置才能进行发现。

```json
{
  "ssdp": [
    {
      "st": "roku:ecp",
      "manufacturer": "Roku",
      "deviceType": "urn:roku-com:device:player:1-0"
    }
  ]
}
```

## HomeKit

如果您的集成支持通过 HomeKit 进行发现，您可以在清单中添加受支持的型号名称。如果用户加载了 `zeroconf` 集成，它将在发现时加载您集成的配置流的 `homekit` 步骤。

HomeKit 发现的工作原理是测试发现的型号名称是否以清单.json 中指定的任何型号名称开头。

```json
{
  "homekit": {
    "models": [
      "LIFX"
    ]
  }
}
```

通过 HomeKit 进行的发现并不意味着您必须使用 HomeKit 协议与设备进行通信。您可以使用任何您认为合适的方式与设备进行通信。

当发现信息因清单中的此条目而路由到您的集成时，该发现信息不再被路由到侦听 HomeKit zeroconf 类型的集成。

## MQTT

如果您的集成支持通过 MQTT 进行发现，您可以添加用于发现的主题。如果用户加载了 `mqtt` 集成，它将在发现时加载您集成的配置流的 `mqtt` 步骤。

MQTT 发现的工作原理是订阅清单.json 中指定的 MQTT 主题。

```json
{
  "mqtt": [
    "tasmota/discovery/#"
  ]
}
```

如果您的集成需要 `mqtt`，请确保它已添加到 [dependencies](#dependencies)。

依赖于 MQTT 的集成应等待使用 `await mqtt.async_wait_for_mqtt_client(hass)` 等待 MQTT 客户端可用，然后才能订阅。`async_wait_for_mqtt_client` 方法将阻塞并返回 `True`，直到 MQTT 客户端可用。

## DHCP

如果您的集成支持通过 DHCP 进行发现，您可以在清单中添加该类型。如果用户加载了 `dhcp` 集成，它将在发现时加载您集成的配置流的 `dhcp` 步骤。我们通过 `hostname` 和 [OUI](https://en.wikipedia.org/wiki/Organizationally_unique_identifier) 被动地监听 DHCP 发现，或者在设置 `registered_devices` 为 `true` 时匹配设备注册表的 mac 地址。清单值是匹配器字典的列表，如果在 DHCP 数据中找到任何指定匹配器的所有项，则发现您的集成。使用 [Unix 文件名模式匹配](https://docs.python.org/3/library/fnmatch.html) 进行匹配。由您的配置流去过滤重复项。

如果一个集成想要接收发现流以在设备上线时更新其 IP 地址，但匹配的 `hostname` 或 `oui` 可能过于广泛，并且它在设备注册表中用 mac 地址注册，使用 `CONNECTION_NETWORK_MAC`，则应该添加 `registered_devices` 设置为 `true` 的 DHCP 条目。

如果集成支持 `zeroconf` 或 `ssdp`，则应优先于 `dhcp`，因为它通常提供更好的用户体验。

以下示例有两个匹配器，每个匹配器包含两个项。任何匹配器中的所有项都必须匹配该配置才能进行发现。

例如：

-  如果 `hostname` 为 `Rachio-XYZ` 且 `macaddress` 为 `00:9D:6B:55:12:AA`，则会发生发现（第一个匹配器）。
-  如果 `hostname` 为 `Dachio-XYZ` 或 `Pachio-XYZ`，且 `macaddress` 为 `00:9D:6B:55:12:AA`，则会发生发现（第三个匹配器）。
-  如果 `hostname` 为 `Rachio-XYZ` 且 `macaddress` 为 `00:00:00:55:12:AA`，则不会发生发现（无匹配的 MAC）。
-  如果 `hostname` 为 `NotRachio-XYZ` 且 `macaddress` 为 `00:9D:6B:55:12:AA`，则不会发生发现（无匹配的 hostname）。

```json
{
  "dhcp": [
    {
    "hostname": "rachio-*",
    "macaddress": "009D6B*"
    },
    {
    "hostname": "[dp]achio-*",
    "macaddress": "009D6B*"
    }
  ]
}
```

设置 `registered_devices` 为 `true` 的示例：

```json
{
  "dhcp": [
    {
    "hostname": "myintegration-*",
    },
    {
    "registered_devices": true,
    }
  ]
}
```

## USB

如果您的集成支持通过 USB 进行发现，您可以在清单中添加该类型。如果用户加载了 `usb` 集成，它将在发现时加载您集成的配置流的 `usb` 步骤。我们支持通过 VID（供应商 ID）、PID（设备 ID）、序列号、制造商和描述通过提取这些值从 USB 描述符进行发现。有关识别这些值的帮助，请参阅 [如何识别设备](https://wiki.debian.org/HowToIdentifyADevice/USB)。清单值是匹配器字典的列表，如果在 USB 数据中找到任何指定匹配器的所有项，则发现您的集成。由您的配置流去过滤重复项。

:::warning
某些 VID 和 PID 组合被许多无关设备使用。例如 VID `10C4` 和 PID `EA60` 匹配任何 Silicon Labs CP2102 USB-Serial 桥接芯片。当匹配这些类型的设备时，匹配 `description` 或其他标识符以避免意外发现是非常重要的。
:::

以下示例包含两个匹配器，每个匹配器由两个项组成。匹配发现需要在任何两个匹配器中的所有项都匹配。

例如：

-  如果 `vid` 为 `AAAA`，`pid` 为 `AAAA`，则会发生发现。
-  如果 `vid` 为 `AAAA`，`pid` 为 `FFFF`，则不会发生发现。
-  如果 `vid` 为 `CCCC`，`pid` 为 `AAAA`，则不会发生发现。
-  如果 `vid` 为 `1234`，`pid` 为 `ABCD`，`serial_number` 为 `12345678`，`manufacturer` 为 `Midway USB`，且 `description` 为 `版本 12 Zigbee Stick`，则会发生发现。

```json
{
  "usb": [
    {
    "vid": "AAAA",
    "pid": "AAAA"
    },
    {
    "vid": "BBBB",
    "pid": "BBBB"
    },
    {
    "vid": "1234",
    "pid": "ABCD",
    "serial_number": "1234*",
    "manufacturer": "*midway*",
    "description": "*zigbee*"
    },
  ]
}
```

## 集成质量评分

[集成质量评分](/docs/core/integration-quality-scale) 根据代码质量和用户体验对集成进行评分。质量评分的每个级别由一系列要求组成。如果集成满足所有要求，则认为已达到该级别。

新的集成需要至少满足青铜级，因此请务必查看 [集成质量评分](/docs/core/integration-quality-scale) 的要求列表。这有助于极大改善代码和用户体验。

```json
{
 "quality_scale": "silver"
}
```

## IoT 类

[IOT 类][iot_class] 描述集成如何与设备或服务连接。有关 IoT 类的更多信息，请阅读 [“分类物联网”][iot_class] 的博客。

清单中接受以下 IoT 类：

- `assumed_state`：我们无法获取设备的状态。我们能做的就是基于我们上一个命令来假定状态。
- `cloud_polling`：此设备的集成通过云实现，并需要主动的互联网连接。轮询状态意味着更新可能会稍后被注意到。
- `cloud_push`：此设备的集成通过云实现，并需要主动的互联网连接。一旦新状态可用，Home Assistant 会收到通知。
- `local_polling`：提供与设备的直接通信。轮询状态意味着更新可能会稍后被注意到。
- `local_push`：提供与设备的直接通信。一旦新状态可用，Home Assistant 会收到通知。
- `calculated`：集成不自行处理通信，但提供计算结果。

[iot_class]: https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/#classifiers

## 虚拟集成

某些产品由不以产品命名的集成支持。例如，Yale Home 锁通过 August 集成进行集成，而 IKEA SYMFONISK 产品线可以与 Sonos 集成一起使用。

还有一些情况下，产品线仅支持标准 IoT 标准，例如 Zigbee 或 Z-Wave。例如，U-tec ultraloq 通过 Z-Wave 工作，并没有专门的集成。

对于最终用户，找到如何将这些产品与 Home Assistant 集成的方法可能会令人困惑。为了帮助处理上述情况，Home Assistant 引入了“虚拟集成”。这些集成不是真正的集成，而是用于帮助用户找到适合其设备的集成。

虚拟集成是只具有单个清单文件的集成，而没有任何附加代码。虚拟集成有两种类型：一种是由其他集成支持的虚拟集成，另一种是使用现有的 IoT 标准的虚拟集成。

:::info
虚拟集成只能由 Home Assistant 核心提供，而不能由自定义集成提供。
:::

### 由…支持

“由…支持”虚拟集成是指指向另一个集成以提供其实现的集成。例如，Yale Home 锁通过 August （`august`）集成进行集成。

示例清单：

```json
{
  "domain": "yale_home",
  "name": "Yale Home",
  "integration_type": "virtual",
  "supported_by": "august"
}
```

`domain` 和 `name` 与任何其他集成相同，但 `integration_type` 被设置为 `virtual`。此虚拟集成的域的徽标必须添加到我们的 [品牌库](https://github.com/home-assistant/brands/)，因此在这种情况下，使用了 Yale Home 品牌。

`supported_by` 是提供该产品实现的集成的域。在上面的示例中，Yale Home 锁由 August 集成支持，并指向其域 `august`。

结果：

- Yale Home 在我们的用户文档网站上列在集成下，自动生成的存根页面将用户引导到要使用的集成。
- Yale Home 在 Home Assistant 中列出，当点击“添加集成”时。当被选择时，我们会向用户说明该产品是通过另一个集成进行集成的，然后用户继续进行小米米家配置流。

### IoT 标准

“IoT 标准”虚拟集成是使用现有 IoT 标准为设备提供连接性的集成。例如，U-tec ultraloq 通过 Z-Wave 工作，并没有专门的集成。

示例清单：

```json
{
  "domain": "ultraloq",
  "name": "ultraloq",
  "integration_type": "virtual",
  "iot_standards": ["zwave"],
}
```

`domain` 和 `name` 与任何其他集成相同，但 `integration_type` 被设置为 `virtual`。此虚拟集成的域的徽标应添加到我们的 [品牌库](https://github.com/home-assistant/brands/)。

`iot_standards` 是该产品用于连接的标准。在上面的示例中，U-tec ultraloq 产品使用 Z-Wave 与 Home Assistant 集成。

结果：

- U-tec ultraloq 在我们的用户文档网站上列在集成下，自动生成的存根页面将用户引导到要使用的集成。
- U-tec ultraloq 在 Home Assistant 中列出，当点击“添加集成”时。当被选择时，我们会指导用户添加此 Z-Wave 设备（如果尚未设置 Z-Wave，则引导进入 Z-Wave 的设置）。

:::info
品牌还 [支持设置 IoT 标准](/docs/creating_integration_brand/#iot-standards)。

在品牌级别设置 IoT 标准是优先选择的，仅在可能会给最终用户带来困惑的情况下使用虚拟集成。
:::