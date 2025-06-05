---
title: "Python 库：认证"
sidebar_label: 认证
---

库的认证部分负责获取认证并进行经过认证的请求。它不应该了解请求中的内容。

认证有多种形式，但一般归结为每个请求都伴随着一个包含访问令牌的 `authorization` 头。访问令牌通常是一个随机数字/字母的字符串。

您的库应该能够获取认证令牌，如果必要的话进行更新，并使用这些认证进行请求。它不应该提供存储认证数据的功能。

由于认证将由开发者存储，重要的是将认证以可以 JSON 序列化的格式返回给开发者。建议使用包含原始类型（`str`、`float`、`int`）的 `dict`。

如果您的 API 可以从多个位置提供服务，则您的认证类应该允许开发者传入 API 的位置。

## 异步示例

Python 允许开发者编写同步或异步（通过 `asyncio`）的代码。Home Assistant 是使用异步编写的，但也能够与同步库一起工作。我们更倾向于使用异步库。

如果您正在编写异步库，我们建议使用 `aiohttp`。这是一个现代且成熟的 HTTP 库，易于使用。

```python
from aiohttp import ClientSession, ClientResponse


class Auth:
    """用于进行认证请求的类。"""

    def __init__(self, websession: ClientSession, host: str, access_token: str):
        """初始化认证。"""
        self.websession = websession
        self.host = host
        self.access_token = access_token

    async def request(self, method: str, path: str, **kwargs) -> ClientResponse:
        """进行请求。"""
        if headers := kwargs.pop("headers", {}):
            headers = dict(headers)
        headers["authorization"] = self.access_token

        return await self.websession.request(
            method, f"{self.host}/{path}", **kwargs, headers=headers,
        )
```

要使用这个类，您需要创建一个 aiohttp ClientSession，并将其与 API 信息一起传递给构造函数。

```python
import asyncio
import aiohttp

from my_package import Auth


async def main():
    async with aiohttp.ClientSession() as session:
        auth = Auth(session, "http://example.com/api", "secret_access_token")

        # 这将从 http://example.com/api/lights 获取数据
        resp = await auth.request("get", "lights")
        print("HTTP 响应状态码", resp.status)
        print("HTTP 响应 JSON 内容", await resp.json())


asyncio.run(main())
```

## 同步示例

```python
import requests


class Auth:
    """用于进行认证请求的类。"""

    def __init__(self, host: str, access_token: str):
        """初始化认证。"""
        self.host = host
        self.access_token = access_token

    def request(self, method: str, path: str, **kwargs) -> requests.Response:
        """进行请求。"""
        if headers := kwargs.pop("headers", {}):
            headers = dict(headers)
        headers["authorization"] = self.access_token

        return requests.request(
            method, f"{self.host}/{path}", **kwargs, headers=headers,
        )
```

要使用这个类，构造类与 API 信息。

```python
from my_package import Auth


auth = Auth("http://example.com/api", "secret_access_token")

# 这将从 http://example.com/api/lights 获取数据
resp = auth.request("get", "lights")
print("HTTP 响应状态码", resp.status_code)
print("HTTP 响应 JSON 内容", resp.json())
```

## OAuth2

OAuth2 是一种 [标准化的版本](https://tools.ietf.org/html/rfc6749) 的认证方案，利用刷新令牌和访问令牌。访问令牌在发行后会在短时间内过期。刷新令牌可用于获取新的访问令牌。

刷新访问令牌依赖于客户端 ID 和密钥，这可能由外部服务持有。我们需要构建认证类，以允许开发者实现自己的令牌刷新逻辑。

Home Assistant 提供了 Home Assistant Cloud 账户链接服务，这是一个免费的云服务，可以让用户快速使用 OAuth2 连接账户。Home Assistant 内置了易于使用的工具，允许用户配置基于 OAuth2 的集成。有关更多信息， [请参见这里](config_entries_config_flow_handler.md#configuration-via-oauth2)。如果您的库像下面的示例那样实现，这些内置工具将效果最佳。

### 异步示例

```python
from abc import ABC, abstractmethod


class AbstractAuth(ABC):
    """用于进行认证请求的抽象类。"""

    def __init__(self, websession: ClientSession, host: str):
        """初始化认证。"""
        self.websession = websession
        self.host = host

    @abstractmethod
    async def async_get_access_token(self) -> str:
        """返回有效的访问令牌。"""

    async def request(self, method, url, **kwargs) -> ClientResponse:
        """进行请求。"""
        if headers := kwargs.pop("headers", {}):
            headers = dict(headers)

        access_token = await self.async_get_access_token()
        headers["authorization"] = f"Bearer {access_token}"

        return await self.websession.request(
            method, f"{self.host}/{url}", **kwargs, headers=headers,
        )
```

现在使用您库的开发者将必须实现获取访问令牌的抽象方法。假设开发者有自己的令牌管理类。

```python
from my_package import AbstractAuth


class Auth(AbstractAuth):
    def __init__(self, websession: ClientSession, host: str, token_manager):
        """初始化认证。"""
        super().__init__(websession, host)
        self.token_manager = token_manager

    async def async_get_access_token(self) -> str:
        """返回有效的访问令牌。"""
        if self.token_manager.is_token_valid():
            return self.token_manager.access_token

        await self.token_manager.fetch_access_token()
        await self.token_manager.save_access_token()

        return self.token_manager.access_token
```

### 同步示例

如果您使用 `requests`，我们建议使用 `requests_oauthlib` 包。下面是一个示例，它与本地客户端 ID 和密钥一起工作，但也允许将令牌获取外包给 Home Assistant。

```python
from typing import Optional, Union, Callable, Dict

from requests import Response
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import TokenExpiredError


class Auth:
    def __init__(
        self,
        host: str,
        token: Optional[Dict[str, str]] = None,
        client_id: str = None,
        client_secret: str = None,
        token_updater: Optional[Callable[[str], None]] = None,
    ):
        self.host = host
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_updater = token_updater

        extra = {"client_id": self.client_id, "client_secret": self.client_secret}

        self._oauth = OAuth2Session(
            auto_refresh_kwargs=extra,
            client_id=client_id,
            token=token,
            token_updater=token_updater,
        )

    def refresh_tokens(self) -> Dict[str, Union[str, int]]:
        """刷新并返回新令牌。"""
        token = self._oauth.refresh_token(f"{self.host}/auth/token")

        if self.token_updater is not None:
            self.token_updater(token)

        return token

    def request(self, method: str, path: str, **kwargs) -> Response:
        """进行请求。

        我们不使用 OAuth2 会话的内置令牌刷新机制，因为
        我们希望允许覆盖令牌刷新逻辑。
        """
        url = f"{self.host}/{path}"
        try:
            return getattr(self._oauth, method)(url, **kwargs)
        except TokenExpiredError:
            self._oauth.token = self.refresh_tokens()

            return getattr(self._oauth, method)(url, **kwargs)
```

开发者现在将能够覆盖刷新令牌函数以通过自己的外部服务进行路由。

```python
from my_package import AbstractAuth


class Auth(AbstractAuth):
    def refresh_tokens(self) -> Dict[str, Union[str, int]]:
        """刷新并返回新令牌。"""
        self.token_manager.fetch_access_token()
        self.token_manager.save_access_token()

        return self.token_manager.access_token