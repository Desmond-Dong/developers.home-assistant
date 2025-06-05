---
title: 配置流
---

集成可以通过用户界面设置，添加对配置流的支持以创建配置条目。希望支持配置条目的集成需要定义一个配置流处理器。此处理器将管理从用户输入、发现或其他来源（如 Home Assistant OS）创建条目。

配置流处理器控制存储在配置条目中的数据。这意味着在 Home Assistant 启动时不需要验证配置是否正确。这还将防止破坏性更改，因为我们将能够在版本更改时将配置条目迁移到新格式。

在实例化处理器时，Home Assistant 会确保加载所有依赖项并安装集成的要求。

## 更新清单

您需要更新集成清单，以通知 Home Assistant 您的集成具有配置流。这是通过在清单中添加 `config_flow: true` 来完成的（[文档](creating_integration_manifest.md#config-flow)）。

## 定义您的配置流

配置条目使用 [数据流条目框架](data_entry_flow_index.md) 定义其配置流。配置流需要在您的集成文件夹中的 `config_flow.py` 文件中定义，扩展 `homeassistant.config_entries.ConfigFlow` 并在继承 `ConfigFlow` 时传递一个 `domain` 键。

```python
from homeassistant import config_entries
from .const import DOMAIN


class ExampleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """示例配置流。"""
    # 它创建的条目的模式版本
    # 如果版本更改，Home Assistant 将调用您的迁移方法
    VERSION = 1
    MINOR_VERSION = 1
```

一旦您更新了清单并创建了 `config_flow.py`，您将需要运行 `python3 -m script.hassfest` （仅需一次）以便 Home Assistant 激活您的集成的配置条目。

## 配置流标题

配置流的标题可以受到集成的影响，并按照以下优先顺序确定：

1. 如果在配置流中设置了非空字典 `title_placeholders`，将用于动态计算配置流的标题。重新身份验证和重新配置流自动将 `title_placeholders` 设置为 `{"name": config_entry_title}`。
   1. 如果集成提供了本地化的 `flow_title`，将使用该标题，并从 `title_placeholders` 中替换任何翻译占位符。
   2. 如果集成不提供 `flow_title` 但 `title_placeholders` 包含 `name`，则将使用 `name` 作为流的标题。
2. 如果存在，则将流标题设置为集成的本地化 `title`。
3. 如果存在，则将流标题设置为集成清单的 `name`。
4. 将流标题设置为集成的域。

请注意，该优先顺序意味着：
- 如果缺少或为空 `title_placeholders` 字典，则本地化的 `flow_title` 会被忽略，即使本地化的 `flow_title` 没有任何占位符
- 如果 `title_placeholders` 非空，但没有本地化的 `flow_title` 并且 `title_placeholders` 不包括 `name`，则它会被忽略。

## 定义步骤

您的配置流需要定义配置流的步骤。每个步骤由唯一的步骤名称（`step_id`）标识。步骤回调方法遵循模式 `async_step_<step_id>`。有关步骤的不同返回值，请参阅 [数据条目流](data_entry_flow_index.md)。以下是如何定义 `user` 步骤的示例：

```python
import voluptuous as vol

class ExampleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    async def async_step_user(self, info):
        if info is not None:
            pass  # TODO: 处理信息

        return self.async_show_form(
            step_id="user", data_schema=vol.Schema({vol.Required("password"): str})
        )
```

有几个步骤名称保留供系统使用：

| 步骤名称   | 描述                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bluetooth`        | 如果您的集成通过 Bluetooth 被发现，则调用该步骤，指定 [使用清单中的 `bluetooth`](creating_integration_manifest.md#bluetooth)。                      |
| `discovery` | _已弃用_ 如果您的集成被发现，而没有定义匹配步骤，则调用该步骤。                                                                                      |
| `dhcp`      | 如果您的集成通过 DHCP 被发现，则调用该步骤，指定 [使用清单中的 `dhcp`](creating_integration_manifest.md#dhcp)。                                     |
| `hassio`    | 如果您的集成通过 Supervisor 附加组件被发现，则调用该步骤。                                                                                               |
| `homekit`   | 如果您的集成通过 HomeKit 被发现，则调用该步骤，指定 [使用清单中的 `homekit`](creating_integration_manifest.md#homekit)。                               |
| `mqtt`      | 如果您的集成通过 MQTT 被发现，则调用该步骤，指定 [使用清单中的 `mqtt`](creating_integration_manifest.md#mqtt)。                                     |
| `ssdp`      | 如果您的集成通过 SSDP/uPnP 被发现，则调用该步骤，指定 [使用清单中的 `ssdp`](creating_integration_manifest.md#ssdp)。                                   |
| `usb`       | 如果您的集成通过 USB 被发现，则调用该步骤，指定 [使用清单中的 `usb`](creating_integration_manifest.md#usb)。                                          |
| `user`      | 当用户通过用户界面启动流，或在被发现且没有定义匹配和发现步骤时调用。                                                                                           |
| `reconfigure`      | 当用户通过用户界面启动重新配置现有配置条目的流时调用。                                                                                                   |
| `zeroconf`  | 如果您的集成通过 Zeroconf/mDNS 被发现，则调用该步骤，指定 [使用清单中的 `zeroconf`](creating_integration_manifest.md#zeroconf)。                  |
| `reauth`    | 如果您的集成表示它 [需要重新身份验证，例如，因为凭据已过期](#reauthentication)，则调用该步骤。                                                               |
| `import`    | 保留用于从 YAML 配置迁移到配置条目。                                                                                                                 |

## 唯一 ID

配置流可以附加唯一 ID，必须是字符串，以避免同一设备被设置两次。唯一 ID 不需要全局唯一，只需在集成域内唯一即可。

通过设置唯一 ID，用户将有选择忽略配置条目的发现。这样，他们就不会再为此感到困扰。
如果集成使用 Bluetooth、DHCP、HomeKit、Zeroconf/mDNS、USB 或 SSDP/uPnP 被发现，则需要提供唯一 ID。

如果没有唯一 ID，可以选择省略 `bluetooth`、`dhcp`、`zeroconf`、`hassio`、`homekit`、`ssdp`、`usb` 和 `discovery` 步骤，即使它们在集成清单中配置。在这种情况下，当项目被发现时，将调用 `user` 步骤。

另外，如果集成不能总是获得唯一 ID（例如，多个设备，一些有，一些没有），则提供了一个助手，仍然允许发现，只要尚未配置该集成的任何实例即可。

以下是如何处理可能无法始终获得唯一 ID 的发现的示例：

```python
if device_unique_id:
    await self.async_set_unique_id(device_unique_id)
else:
    await self._async_handle_discovery_without_unique_id()
```

### 在配置流中管理唯一 ID

当设置唯一 ID 时，如果该唯一 ID 中已经有另一个流正在进行，流将立即中止。如果已有该 ID 的配置条目，也可以快速中止。配置条目将获得创建它们的流的唯一 ID。

在配置流步骤内调用：

```python
# 将唯一 ID 分配给流并中止流
# 如果同一唯一 ID 的另一个流正在进行
await self.async_set_unique_id(device_unique_id)

# 如果存在相同唯一 ID 的配置条目，则中止流
self._abort_if_unique_id_configured()
```

如果配置流随即中止，界面上将显示 `strings.json` 中 `abort` 部分的 `already_configured` 键的文本资源，作为中止理由。

```json
{
  "config": {
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  }
}
```

### 唯一 ID 要求

唯一 ID 用于将配置条目与基础设备或 API 匹配。唯一 ID 必须稳定，不应由用户更改，并且必须是字符串。

当设备访问详细信息更改时，可以使用唯一 ID 更新配置条目数据。例如，对于通过本地网络通信的设备，如果由于新的 DHCP 分配而更改了 IP 地址，集成可以使用唯一 ID 更新主机，使用以下代码段：

```
    await self.async_set_unique_id(serial_number)
    self._abort_if_unique_id_configured(updates={CONF_HOST: host, CONF_PORT: port})
```

#### 唯一 ID 的示例可接受来源

- 设备的序列号
- MAC 地址：使用 `homeassistant.helpers.device_registry.format_mac` 格式化；仅从设备 API 或发现处理程序获取 MAC 地址。依赖于读取 ARP 缓存或本地网络访问的工具，例如 `getmac`，在所有支持的网络环境中无法正常工作，不可接受。
- 表示纬度和经度的字符串或其他唯一地理位置
- 物理打印在设备上的唯一标识符或烧录到 EEPROM 中的标识符

#### 本地设备唯一 ID 的有时可接受来源

- 主机名：如果主机名的子集包含一个可接受的来源，可以使用该部分

#### 云服务唯一 ID 的有时可接受来源

- 电子邮件地址：必须规范化为小写
- 用户名：如果用户名不区分大小写，必须规范化为小写。
- 账户 ID：不得有冲突

#### 唯一 ID 的不可接受来源

- IP 地址
- 设备名称
- 如果用户可以更改的主机名
- URL

## 发现步骤

当集成被发现时，将调用其各自的发现步骤（即 `async_step_dhcp` 或 `async_step_zeroconf`）并传递发现信息。该步骤必须检查以下内容：

- 确保没有其他这个配置流的实例正在设置发现的设备。这可能会发生，因为有多种方式发现设备在网络上。
  - 在大多数情况下，设置流上的唯一 ID 并检查是否已经有相同唯一 ID 的配置条目，如 [在配置流中管理唯一 ID](#managing-unique-ids-in-config-flows) 部分中所述。
  - 在某些情况下，无法确定唯一 ID，或者由于不同的发现源可能有不同的计算方式，唯一 ID 是模糊的。在这种情况下：
    1. 在流上实现方法 `def is_matching(self, other_flow: Self) -> bool`。
    2. 调用 `hass.config_entries.flow.async_has_matching_flow(self)`。
    3. 你的流的 `is_matching` 方法将在每个其他正在进行的流上被调用一次。
- 确保设备尚未设置。
- 调用发现步骤绝不会导致完成流和配置条目。始终与用户确认。

## 不需要身份验证的可发现集成

如果您的集成可以在不需要任何身份验证的情况下被发现，您将能够使用内置的可发现流。该流提供了以下功能：

- 在完成配置流之前检测设备/服务是否可以在网络上被发现。
- 支持所有基于清单的发现协议。
- 限制为仅 1 个配置条目。由配置条目发现所有可用设备。

要开始，请运行 `python3 -m script.scaffold config_flow_discovery` 并遵循说明。这将创建所有必要的模板以使用发现配置您的集成。

## 通过 OAuth2 配置

Home Assistant 内置支持使用 [OAuth2 授权框架](https://www.rfc-editor.org/rfc/rfc6749) 提供账户连接的集成。要利用这一点，您需要以允许 Home Assistant 负责刷新令牌的方式构建您的 Python API 库。请参阅我们的 [API 库指南](api_lib_index.md) 了解如何做到这一点。

内置的 OAuth2 支持与本地配置的客户端 ID / 密钥配合使用，使用 [应用凭据平台](/docs/core/platform/application_credentials) 和 Home Assistant 云账户连接服务。该服务允许用户使用集中管理的客户端 ID/密钥链接他们的账户。如果您希望您的集成成为该服务的一部分，请与我们联系 [partner@openhomefoundation.org](mailto:partner@openhomefoundation.org)。

要开始，请运行 `python3 -m script.scaffold config_flow_oauth2` 并遵循说明。这将创建所有必要的模板以使用 OAuth2 配置您的集成。

## 翻译

[配置流的翻译](/docs/internationalization/core#config--options--subentry-flows) 处理程序在集成翻译文件 `strings.json` 的 `config` 键下定义。Hue 集成的示例：

```json
{
  "title": "Philips Hue 桥接",
  "config": {
    "step": {
      "init": {
        "title": "选择 Hue 桥接",
        "data": {
          "host": "主机"
        }
      },
      "link": {
        "title": "链接集线器",
        "description": "按下桥接上的按钮以将 Philips Hue 注册到 Home Assistant。\n\n![桥接上按钮的位置](/static/images/config_philips_hue.jpg)"
      }
    },
    "error": {
      "register_failed": "注册失败，请重试",
      "linking": "发生未知链接错误。"
    },
    "abort": {
      "discover_timeout": "无法发现 Hue 桥接",
      "no_bridges": "未发现 Philips Hue 桥接",
      "all_configured": "所有 Philips Hue 桥接已配置完毕",
      "unknown": "发生未知错误",
      "cannot_connect": "无法连接到桥接",
      "already_configured": "桥接已配置"
    }
  }
}
```

当翻译合并到 Home Assistant 中时，它们将自动上传到 [Lokalise](https://lokalise.co/)，翻译团队将帮助将其翻译成其他语言。在本地开发时，您需要运行 `python3 -m script.translations develop` 以查看对 `strings.json` 所做的更改 [关于翻译 Home Assistant 的更多信息。](translations.md)

## 配置条目迁移

如上所述 - 每个配置条目都有一个分配给它的版本。这样可以在配置条目架构更改时将配置条目数据迁移到新格式。

迁移可以通过在集成的 `__init__.py` 文件中实现函数 `async_migrate_entry` 来处理。如果迁移成功，该函数应返回 `True`。

版本由主要版本和次要版本组成。如果次要版本不同但主要版本相同，集成设置将继续进行，即使集成没有实现 `async_migrate_entry`。这意味着次要版本增加是向后兼容的，而主要版本增加会导致如果用户在未从备份恢复配置的情况下降级 Home Assistant Core，则集成设置失败。

```python
# 示例迁移函数
async def async_migrate_entry(hass, config_entry: ConfigEntry):
    """迁移旧条目。"""
    _LOGGER.debug("正在从版本 %s.%s 迁移配置", config_entry.version, config_entry.minor_version)

    if config_entry.version > 1:
        # 这意味着用户已从未来版本降级
        return False

    if config_entry.version == 1:

        new_data = {**config_entry.data}
        if config_entry.minor_version < 2:
            # TODO: 根据版本 1.2 的更改修改配置条目数据
            pass
        if config_entry.minor_version < 3:
            # TODO: 根据版本 1.3 的更改修改配置条目数据
            pass

        hass.config_entries.async_update_entry(config_entry, data=new_data, minor_version=3, version=1)

    _LOGGER.debug("迁移到配置版本 %s.%s 成功", config_entry.version, config_entry.minor_version)

    return True
```

## 重新配置

配置条目可以通过添加 `reconfigure` 步骤来允许重新配置。这提供了一种集成允许用户更改配置条目数据的方式，而无需实现用于更改非可选设置数据的 `OptionsFlow`。

这并不是处理身份验证问题或重新配置此类问题的方式。为此，我们有 [`reauth`](#reauthentication) 步骤，该步骤应实现，以便自动启动，以防身份验证出现问题。

```python
import voluptuous as vol

class ExampleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """示例集成的配置流。"""

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None):
        if user_input is not None:
            # TODO: 处理用户输入
            self.async_set_unique_id(user_id)
            self._abort_if_unique_id_mismatch()
            return self.async_update_reload_and_abort(
                self._get_reconfigure_entry(),
                data_updates=data,
            )

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema({vol.Required("input_parameter"): str}),
        )
```

成功时，重新配置流预期更新当前条目并中止；它们不应创建新条目。
这通常使用 `return self.async_update_reload_and_abort` 帮助程序来完成。
自动化测试应验证重新配置流更新现有配置条目而不创建额外条目。

检查是否处于重新配置流中可以使用 `if self.source == SOURCE_RECONFIGURE`。
还可以通过 `self._get_reconfigure_entry()` 访问相应的配置条目。
确保 `unique_id` 没有发生变化应使用 `await self.async_set_unique_id` 然后是 `self._abort_if_unique_id_mismatch()`。

## 重新身份验证

优雅地处理诸如无效、过期或被撤销的令牌等身份验证错误是推动 [集成质量标准](core/integration-quality-scale) 的必要条件。以下示例展示了如何在 `script.scaffold` 创建的 OAuth 流中添加重新身份验证，遵循 [构建 Python 库](api_lib_auth.md#oauth2) 中的模式。
如果您在寻找如何触发重新身份验证流，请参见 [处理过期凭据](integration_setup_failures.md#handling-expired-credentials)。

该示例在 `__init__.py` 中捕获配置条目设置中的身份验证异常，并指示用户访问集成页面以重新配置集成。

为了允许用户更改不是可选的配置条目数据（`OptionsFlow`）并且与身份验证不直接相关，例如更改的主机名，集成应实现 [`reconfigure`](#reconfigure) 步骤。

```python
from homeassistant.config_entries import SOURCE_REAUTH, ConfigEntry
from homeassistant.core import HomeAssistant
from . import api

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """设置配置条目。"""

    # TODO: 替换为实际 API 设置和异常
    auth = api.AsyncConfigEntryAuth(...)
    try:
        await auth.refresh_tokens()
    except TokenExpiredError as err:
        raise ConfigEntryAuthFailed(err) from err

    # TODO: 继续进行集成设置
```

`config_flow.py` 中的流处理程序还需要一些额外步骤来支持重新身份验证，包括显示确认、启动重新身份验证流、更新现有配置条目以及重新加载以再次调用设置。

```python
class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """处理 OAuth2 身份验证的配置流。"""

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """在 API 身份验证错误时执行重新身份验证。"""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """对话框通知用户需要重新身份验证。"""
        if user_input is None:
            return self.async_show_form(
                step_id="reauth_confirm",
                data_schema=vol.Schema({}),
            )
        return await self.async_step_user()

    async def async_oauth_create_entry(self, data: dict) -> dict:
        """创建 oauth 配置条目或更新现有条目以进行重新身份验证。"""
        self.async_set_unique_id(user_id)
        if self.source == SOURCE_REAUTH:
            self._abort_if_unique_id_mismatch()
            return self.async_update_reload_and_abort(
                self._get_reauth_entry(),
                data_updates=data,
            )
        self._abort_if_unique_id_configured()
        return await super().async_oauth_create_entry(data)
```

默认情况下，`async_update_reload_and_abort` 帮助程序方法在更新和重新加载后中止流，并显示 `reauth_successful`。默认情况下，条目将始终被重新加载。如果配置条目仅应在条目更新的情况下重新加载，请指定 `reload_even_if_entry_is_unchanged=False`。

根据集成的具体细节，可能还有其他考虑因素，例如确保在重新身份验证之间使用相同的账户，或处理多个配置条目。

重新身份验证确认对话框需要在 `strings.json` 中的重新身份验证确认和成功对话框中额外的定义：

```json
{
  "config": {
    "step": {
      "reauth_confirm": {
        "title": "[%key:common::config_flow::title::reauth%]",
        # TODO: 替换为集成的名称
        "description": "示例集成需要重新验证您的账户"
      }
    },
    "abort": {
      "reauth_successful": "[%key:common::config_flow::abort::reauth_successful%]"
    }
  }
}
```

参见 [翻译](#translations) 本地开发说明。

身份验证失败（如被撤销的 oauth 令牌）手动测试可能会有点棘手。一种建议是复制 `config/.storage/core.config_entries` 并根据要测试的场景手动更改 `access_token`、`refresh_token` 和 `expires_at` 的值。然后，您可以走进重新身份验证流并确认这些值被新有效的令牌替代。

成功时，重新身份验证流预期更新当前条目并中止；它们不应创建新条目。
这通常使用 `return self.async_update_reload_and_abort` 帮助程序来完成。
自动化测试应验证重新身份验证流更新现有配置条目而不创建额外条目。

检查是否处于重新身份验证流中可以使用 `if self.source == SOURCE_REAUTH`。
还可以通过 `self._get_reauth_entry()` 访问相应的配置条目。
确保 `unique_id` 没有发生变化应使用 `await self.async_set_unique_id` 后跟 `self._abort_if_unique_id_mismatch()`。

## 子条目流

集成可以实现子条目流，以允许用户添加并可选择重新配置子条目。一个示例是提供天气预报的集成，其中配置条目存储身份验证详细信息，而每个天气预报应提供的位置存储为子条目。

子条目流与配置流类似，只是子条目流不支持重新身份验证或发现；子条目流只能通过 `user` 或 `reconfigure` 步骤启动。

```python
class ExampleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """示例集成的配置流。"""

    ...

    @classmethod
    @callback
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        """返回此集成支持的子条目。"""
        return {"location": LocationSubentryFlowHandler}

class LocationSubentryFlowHandler(ConfigSubentryFlow):
    """处理添加和修改位置的子条目流。"""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """用户流以添加新位置。"""
        ...
```

### 子条目唯一 ID

子条目可以设置唯一 ID。规则类似于 [配置条目的唯一 ID](#unique-ids)，只是子条目的唯一 ID 仅需要在配置条目内唯一。

### 子条目翻译

[子条目流的翻译](/docs/internationalization/core#config--options--subentry-flows) 处理程序在集成翻译文件 `strings.json` 的 `config_subentries` 键下定义，例如：

```json
{
  "config_subentries": {
    "location": {
      "title": "天气位置",
      "step": {
        "user": {
          "title": "添加位置",
          "description": "配置天气位置"
        },
        "reconfigure": {
          "title": "更新位置",
          "description": "..."
        }
      },
      "error": {
      },
      "abort": {
      }
    }
  }
}
```

### 子条目重新配置

子条目可以被重新配置，类似于 [配置条目的重新配置](#reconfigure)。要为子条目流添加重新配置的支持，请实现 `reconfigure` 步骤。

```python
class LocationSubentryFlowHandler(ConfigSubentryFlow):
    """处理添加和修改位置的子条目流。"""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """用户流以添加新位置。"""
        ...

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """用户流以修改现有位置。"""
        # 获取父配置条目供参考。
        config_entry = self._get_reconfigure_entry()
        # 获取要更新的特定子条目。
        config_subentry = self._get_reconfigure_subentry()
        ...
```

## 测试您的配置流

具有配置流的集成需要对 `config_flow.py` 中的所有代码进行完整的测试覆盖才能被接受到核心中。 [测试您的代码](development_testing.md#running-a-limited-test-suite) 包含有关如何生成覆盖率报告的更多细节。