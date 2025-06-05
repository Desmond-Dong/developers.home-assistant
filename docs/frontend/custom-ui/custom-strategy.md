---
title: "自定义策略"
---

_在 Home Assistant 2021.5 中引入。_

策略是生成仪表板配置的 JavaScript 函数。当用户尚未创建仪表板配置时，会显示一个自动生成的仪表板。该配置是使用内置策略生成的。

开发人员可以创建自己的策略来生成仪表板。策略可以使用所有 Home Assistant 的数据和用户的仪表板配置来创建新内容。

策略可以应用于整个配置或特定视图。

策略在 JavaScript 文件中定义为自定义元素，并通过 [仪表板资源](./registering-resources.md) 包含。Home Assistant 将调用类中的静态函数，而不是将其渲染为自定义元素。

## 仪表板策略

仪表板策略负责生成完整的仪表板配置。这可以是从头开始，或基于传入的现有仪表板配置。

两个参数传递给策略：

| 键 | 描述
| -- | --
| `config` | 仪表板策略配置。
| `hass` | Home Assistant 对象。

```ts
class StrategyDemo {
  static async generate(config, hass) {
    return {
      title: "生成的仪表板",
      views: [
        {
          "cards": [
            {
              "type": "markdown",
              "content": `生成于 ${(new Date).toLocaleString()}`
            }
          ]
        }
      ]
    };
  }
}

customElements.define("ll-strategy-my-demo", StrategyDemo);
```

使用以下仪表板配置来使用该策略：

```yaml
strategy:
  type: custom:my-demo
```

## 视图策略

视图策略负责生成特定仪表板视图的配置。当用户打开特定视图时，调用策略。

两个参数传递给策略：

| 键 | 描述
| -- | --
| `config` | 视图策略配置。
| `hass` | Home Assistant 对象。

```ts
class StrategyDemo {
  static async generate(config, hass) {
    return {
      "cards": [
        {
          "type": "markdown",
          "content": `生成于 ${(new Date).toLocaleString()}`
        }
      ]
    };
  }
}

customElements.define("ll-strategy-my-demo", StrategyDemo);
```

使用以下仪表板配置来使用该策略：

```yaml
views:
- strategy:
    type: custom:my-demo
```

## 完整示例

建议仪表板策略将尽可能多的工作留给视图策略。这样仪表板将尽快显示给用户。这可以通过让仪表板生成依赖于其自身策略的视图配置来完成。

以下示例将为每个区域创建一个视图，每个视图在网格中显示该区域的所有实体。

```ts
class StrategyDashboardDemo {
  static async generate(config, hass) {
    // 查询我们需要的所有数据。通过将其存储在策略选项中，我们将使其对视图可用。
    const [areas, devices, entities] = await Promise.all([
      hass.callWS({ type: "config/area_registry/list" }),
      hass.callWS({ type: "config/device_registry/list" }),
      hass.callWS({ type: "config/entity_registry/list" }),
    ]);

    // 每个视图都是基于策略，因此我们延迟渲染，直到打开它
    return {
      views: areas.map((area) => ({
        strategy: {
          type: "custom:my-demo",
          area, 
          devices, 
          entities,
        },
        title: area.name,
        path: area.area_id,
      })),
    };
  }
}

class StrategyViewDemo {
  static async generate(config, hass) {
    const { area, devices, entities } = config;

    const areaDevices = new Set();

    // 查找与该区域链接的所有设备
    for (const device of devices) {
      if (device.area_id === area.area_id) {
        areaDevices.add(device.id);
      }
    }

    const cards = [];

    // 查找所有直接链接到该区域的实体
    // 或链接到与该区域链接的设备的实体。
    for (const entity of entities) {
      if (
        entity.area_id
          ? entity.area_id === area.area_id
          : areaDevices.has(entity.device_id)
      ) {
        cards.push({
          type: "button",
          entity: entity.entity_id,
        });
      }
    }

    return {
      cards: [
        {
          type: "grid",
          cards,
        },
      ],
    };
  }
}

customElements.define("ll-strategy-dashboard-my-demo", StrategyDashboardDemo);
customElements.define("ll-strategy-view-my-demo", StrategyViewDemo);
```

使用以下仪表板配置来使用该策略：

```yaml
strategy:
  type: custom:my-demo