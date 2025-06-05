---
title: "自定义视图布局"
---

默认情况下，Home Assistant 将尝试以砖石布局（如 Pinterest）显示卡片。自定义视图布局允许开发人员覆盖此设置并定义布局机制（如网格）。

## API

您可以将自定义视图定义为 [自定义元素](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements)。由您决定如何在元素内部呈现 DOM。您可以使用 Lit Element、Preact 或任何其他流行框架（除了 React – [有关 React 的更多信息](https://custom-elements-everywhere.com/#react)）。

自定义视图接收以下内容：

```ts
interface LovelaceViewElement {
  hass?: HomeAssistant;
  lovelace?: Lovelace;
  index?: number;
  cards?: Array<LovelaceCard | HuiErrorCard>;
  badges?: LovelaceBadge[];
  setConfig(config: LovelaceViewConfig): void;
}
```

卡片和徽章将由核心代码创建和维护，并提供给自定义视图。自定义视图旨在加载卡片和徽章，并以自定义布局显示它们。

## 示例

（注意：此示例没有所有属性，但展示了示例所需的必要内容）

```js
import { LitElement, html } from "https://unpkg.com/@polymer/lit-element@^0.6.1/lit-element.js?module";

class MyNewView extends LitElement {
  setConfig(_config) {}

  static get properties() {
    return {
      cards: {type: Array, attribute: false}
    };
  }

  render() {
    if(!this.cards) {
      return html``;
    }
    return html`${this.cards.map((card) => html`<div>${card}</div>`)}`;
  }
}
```

您可以像定义自定义卡片一样在自定义元素注册表中定义此元素：

```js
customElements.define("my-new-view", MyNewView);
```

自定义视图可以通过在视图定义中添加以下内容来使用：

```yaml
- title: 主页视图
  type: custom:my-new-view
  badges: [...]
  cards: [...]
```

默认的砖石视图是一个布局元素的示例。（[来源](https://github.com/home-assistant/frontend/blob/master/src/panels/lovelace/views/hui-masonry-view.ts)）。

## 存储自定义数据

如果您的视图需要在卡片级别持久化数据，可以使用卡片配置中的 `view_layout` 来存储信息。例如：键、X 和 Y 坐标、宽度和高度等。当您需要存储某个卡片在视图中的位置或维度时，这会很有用。

```yaml
- type: weather-card
  view_layout:
    key: 1234
    width: 54px
  entity: weather.my_weather
```

## 编辑、删除或添加卡片

要调用核心前端对话框以编辑、删除或添加卡片，您只需调用以下三个事件：

```
事件: "ll-delete-card"
详细信息: { path: [number] | [number, number] }

事件: "ll-edit-card"
详细信息: { path: [number] | [number, number] }

事件: "ll-create-card"
详细信息: none
```

要调用事件，您可以使用：

```js
// 删除当前视图中的第4个卡片
this.dispatchEvent(new CustomEvent("ll-edit-card", { detail: { path: [3] } })) // this 指的是卡片元素