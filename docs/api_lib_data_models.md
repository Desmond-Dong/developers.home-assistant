---
title: "Python库：建模数据"
sidebar_label: 建模数据
---

现在我们已经设置好认证，可以开始进行认证请求并获取数据了！

在建模数据时，重要的是我们要以API提供的相同结构来暴露数据。一些API设计可能没有太多意义或包含拼写错误。我们仍然需要在我们的对象中表示它们。这可以让使用您库的开发者方便地跟随API文档，了解它在您的库中是如何工作的。

API库应尽量做到简单。因此，表示数据结构为类是可以的，但不应将数据从一个值转换为另一个值。例如，您不应实现摄氏度和华氏度之间的转换。这涉及到结果的精度决策，因此应留给使用库的开发者。

在这个示例中，我们将建模一个名为ExampleHub的Rest API的异步库，该API有两个端点：

- get `/light/<id>`：查询单个灯的信息。

  ```json
  {
    "id": 1234,
    "name": "示例灯",
    "is_on": true
  }
  ```

- post `/light/<id>`：控制灯。示例JSON：`{ "is_on": false }`。响应灯的新状态。

- get `/lights`：返回所有灯的列表
  ```json
  [
    {
      "id": 1234,
      "name": "示例灯",
      "is_on": true
    },
    {
      "id": 5678,
      "name": "示例灯2",
      "is_on": false
    }
  ]
  ```

由于该API表示灯，所以我们首先要创建一个类来表示灯。

```python
from .auth import Auth


class Light:
    """表示ExampleHub API中的Light对象的类。"""

    def __init__(self, raw_data: dict, auth: Auth):
        """初始化灯对象。"""
        self.raw_data = raw_data
        self.auth = auth

    # 注意：每个属性名称映射返回数据中的名称

    @property
    def id(self) -> int:
        """返回灯的ID。"""
        return self.raw_data["id"]

    @property
    def name(self) -> str:
        """返回灯的名称。"""
        return self.raw_data["name"]

    @property
    def is_on(self) -> bool:
        """返回灯是否开启。"""
        return self.raw_data["is_on"]

    async def async_control(self, is_on: bool):
        """控制灯。"""
        resp = await self.auth.request(
            "post", f"light/{self.id}", json={"is_on": is_on}
        )
        resp.raise_for_status()
        self.raw_data = await resp.json()

    async def async_update(self):
        """更新灯的数据。"""
        resp = await self.auth.request("get", f"light/{self.id}")
        resp.raise_for_status()
        self.raw_data = await resp.json()
```

现在我们有了灯类，可以建模API的根，这提供了数据的入口点。

```python
from typing import List

from .auth import Auth
from .light import Light


class ExampleHubAPI:
    """与ExampleHub API通信的类。"""

    def __init__(self, auth: Auth):
        """初始化API并存储auth，以便我们可以进行请求。"""
        self.auth = auth

    async def async_get_lights(self) -> List[Light]:
        """返回灯的列表。"""
        resp = await self.auth.request("get", "lights")
        resp.raise_for_status()
        return [Light(light_data, self.auth) for light_data in await resp.json()]

    async def async_get_light(self, light_id) -> Light:
        """返回灯的信息。"""
        resp = await self.auth.request("get", f"light/{light_id}")
        resp.raise_for_status()
        return Light(await resp.json(), self.auth)
```

有了这两个文件，我们现在可以像这样控制我们的灯：

```python
import asyncio
import aiohttp

from my_package import Auth, ExampleHubAPI


async def main():
    async with aiohttp.ClientSession() as session:
        auth = Auth(session, "http://example.com/api", "secret_access_token")
        api = ExampleHubAPI(auth)

        lights = await api.async_get_lights()

        # 打印灯的状态
        for light in lights:
            print(f"灯 {light.name} 是 {'开启' if light.is_on else '关闭'}")

        # 控制一盏灯。
        light = lights[0]
        await light.async_control(not light.is_on)


asyncio.run(main())