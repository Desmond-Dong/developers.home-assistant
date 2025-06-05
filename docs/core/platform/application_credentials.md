---
title: "应用凭证"
---

集成可能支持[通过 OAuth2 配置](/docs/config_entries_config_flow_handler#configuration-via-oauth2)，允许用户链接他们的帐户。集成可以添加一个 `application_credentials.py` 文件并实现下面描述的函数。

OAuth2 需要在应用程序和提供商之间共享的凭证。在 Home Assistant 中，集成特定的 OAuth2 凭证通过一种或多种方式提供：

- *本地 OAuth 与应用凭证组件*: 用户与云服务提供商创建自己的凭证，通常作为应用开发者，并将凭证注册到 Home Assistant 和集成中。所有支持 OAuth2 的集成都*要求*此方法。
- *云帐户链接与云组件*: Nabu Casa 向云服务提供商注册凭证，提供无缝的用户体验。此方法提供无缝的用户体验并且是*推荐的*（[更多信息](/docs/config_entries_config_flow_handler#configuration-via-oauth2)）。

## 添加支持

集成通过在 `manifest.json` 中添加对 `application_credentials` 组件的依赖来支持应用凭证：
```json
{
  ...
  "dependencies": ["application_credentials"],
  ...
}
```

然后在集成文件夹中添加一个名为 `application_credentials.py` 的文件并实现以下内容：

```python
from homeassistant.core import HomeAssistant
from homeassistant.components.application_credentials import AuthorizationServer


async def async_get_authorization_server(hass: HomeAssistant) -> AuthorizationServer:
    """返回授权服务器。"""
    return AuthorizationServer(
        authorize_url="https://example.com/auth",
        token_url="https://example.com/oauth2/v4/token"
    )
```

### AuthorizationServer

`AuthorizationServer` 表示用于集成的[OAuth2 授权服务器](https://datatracker.ietf.org/doc/html/rfc6749)。

| 名称          | 类型 |                                                                                                    | 描述 |
| ------------- | ---- | -------------------------------------------------------------------------------------------------- | ----------- |
| authorize_url | str  | **必填** | 用户在配置流程中被重定向到的 OAuth 授权 URL。 |
| token_url     | str  | **必填** | 用于获取访问令牌的 URL。                                           |

### 自定义 OAuth2 实现

集成可以提供自定义的 `AbstractOAuth2Implementation` 在 `application_credentials.py` 中，如下所示：

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_entry_oauth2_flow
from homeassistant.components.application_credentials import AuthImplementation, AuthorizationServer, ClientCredential


class OAuth2Impl(AuthImplementation):
    """自定义 OAuth2 实现。"""
    # ... 重写 AbstractOAuth2Implementation 细节

async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> config_entry_oauth2_flow.AbstractOAuth2Implementation:
    """返回自定义 auth 实现的认证实现。"""
    return OAuth2Impl(
        hass,
        auth_domain,
        credential,
        AuthorizationServer(
            authorize_url="https://example.com/auth",
            token_url="https://example.com/oauth2/v4/token"
        )
    )
```

### 带 PKCE 支持的授权流程

如果您希望支持[PKCE](https://www.rfc-editor.org/rfc/rfc7636)，可以在 `application_credentials.py` 中返回 `LocalOAuth2ImplementationWithPkce`，如下所示：

```python
from homeassistant.core import HomeAssistant
from homeassistant.helpers.config_entry_oauth2_flow import AbstractOAuth2Implementation, LocalOAuth2ImplementationWithPkce
from homeassistant.components.application_credentials import AuthImplementation, ClientCredential


async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> AbstractOAuth2Implementation:
    """返回自定义 auth 实现的认证实现。"""
    return LocalOAuth2ImplementationWithPkce(
        hass,
        auth_domain,
        credential.client_id,
        authorize_url="https://example.com/auth",
        token_url="https://example.com/oauth2/v4/token",
        client_secret=credential.client_secret, # 可选，默认是 `""`
        code_verifier_length=128 # 可选
    )
```

## 导入 YAML 凭证

能够通过应用凭证集成使用 API `async_import_client_credential` 导入之前接受 YAML 凭证的集成。

以下是一个示例来自于一个之前接受 YAML 凭证的集成：

```python
from homeassistant.components.application_credentials import (
    ClientCredential,
    async_import_client_credential,
)

# 集成的配置.yaml 示例模式
CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(CONF_CLIENT_ID): cv.string,
                vol.Required(CONF_CLIENT_SECRET): cv.string,
            }
        )
    },
)

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """设置组件。"""
    if DOMAIN not in config:
        return True

    await async_import_client_credential(
        hass,
        DOMAIN,
        ClientCredential(
            config[DOMAIN][CONF_CLIENT_ID],
            config[DOMAIN][CONF_CLIENT_SECRET],
        ),
    )
```

新的集成不应在 configuration.yaml 中接受凭证，因为用户可以在应用凭证用户界面中输入凭证。

### ClientCredential

`ClientCredential` 表示由用户提供的客户凭证。

| 名称          | 类型 |                                                                           | 描述 |
| ------------- | ---- | ------------------------------------------------------------------------- | ----------- |
| client_id     | str  | **必填** | 用户提供的 OAuth 客户端 ID。     |
| client_secret | str  | **必填** | 用户提供的 OAuth 客户端密钥。 |

## 翻译

应用凭证的翻译在组件翻译文件 `strings.json` 中的 `application_credentials` 键下定义。例如：

```json
{
    "application_credentials": {
        "description": "导航到 [开发者控制台]({console_url}) 创建凭证，然后在下面输入。",
    }
}
```

您可以选择性地在 `application_credentials.py` 中添加描述占位符键，通过添加一个新的方法，例如：

```python
from homeassistant.core import HomeAssistant

async def async_get_description_placeholders(hass: HomeAssistant) -> dict[str, str]:
    """返回凭证对话框的描述占位符。"""
    return {
        "console_url": "https://example.com/developer/console",
    }
```

在本地开发时，您需要运行 `python3 -m script.translations develop` 以查看对 `strings.json` 的更改。[更多关于翻译 Home Assistant 的信息。](translations.md)