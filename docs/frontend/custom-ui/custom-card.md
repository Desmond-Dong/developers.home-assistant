---
title: "自定义卡片"
---

[仪表板](https://www.home-assistant.io/dashboards/) 是我们为 Home Assistant 定义用户界面的方法。我们提供了许多内置卡片，但你不仅限于我们决定在 Home Assistant 中包含的那些。你可以构建并使用你自己的卡片！

## 定义你的卡片

这是一个基本示例，展示了可能的功能。

在你的 Home Assistant 配置目录中创建一个新文件，路径为 `<config>/www/content-card-example.js`，并放入以下内容：

```js
class ContentCardExample extends HTMLElement {
  // 每当状态发生变化时，都会设置一个新的 `hass` 对象。使用这个来
  // 更新你的内容。
  set hass(hass) {
    // 如果内容还不存在则初始化内容。
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="示例卡片">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "不可用";

    this.content.innerHTML = `
      ${entityId} 的状态是 ${stateStr}!
      <br><br>
      <img src="http://via.placeholder.com/350x150">
    `;
  }

  // 用户提供的配置。如果抛出异常，Home Assistant
  // 将会渲染一个错误卡片。
  setConfig(config) {
    if (!config.entity) {
      throw new Error("你需要定义一个实体");
    }
    this.config = config;
  }

  // 卡片的高度。Home Assistant 使用这个来自动
  // 在砖石视图中分配所有卡片到可用列中。
  getCardSize() {
    return 3;
  }

  // 在节视图中卡片在网格中的大小规则
  getGridOptions() {
    return {
      rows: 3,
      columns: 6,
      min_rows: 3,
      max_rows: 3,
    };
  }
}

customElements.define("content-card-example", ContentCardExample);
```

## 引用你的新卡片

在我们的示例卡片中，我们定义了一个带有标签 `content-card-example` 的卡片（见最后一行），所以我们的卡片类型将是 `custom:content-card-example`。而且因为你在 `<config>/www` 目录中创建了这个文件，它将可以通过 URL `/local/` 在你的浏览器中访问（如果你最近添加了 www 文件夹，你需要重启 Home Assistant 以使文件被识别）。

在你的仪表板配置中添加一个资源，URL 为 `/local/content-card-example.js`，类型为 `module`（[资源文档](/docs/frontend/custom-ui/registering-resources)）。

然后你可以在你的仪表板配置中使用你的卡片：

```yaml
# 示例仪表板配置
views:
  - name: 示例
    cards:
      - type: "custom:content-card-example"
        entity: input_boolean.switch_tv
```

## API

自定义卡片被定义为一个 [自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)。由你决定如何在元素中渲染你的 DOM。你可以使用 Polymer、Angular、Preact 或任何其他流行框架（除了 React——[有关 React 的更多信息](https://custom-elements-everywhere.com/#react)）。

### 配置

当配置发生变化时，Home Assistant 将调用 `setConfig(config)`（很少）。如果抛出异常表示配置无效，Home Assistant 将渲染一个错误卡片通知用户。

当 Home Assistant 的状态发生变化时，Home Assistant 将设置 [the `hass` 属性](/docs/frontend/data/)（频繁）。每当状态发生变化时，组件将必须更新自己以表示最新状态。

### 在砖石视图中的大小

你的卡片可以定义一个 `getCardSize` 方法，返回卡片的大小，作为数字或会解析为数字的 Promise。高为 1 相当于 50 像素。这将帮助 Home Assistant 在 [砖石视图](https://www.home-assistant.io/dashboards/masonry/) 中均匀分配卡片。如果没有定义该方法，则假定卡片大小为 `1`。

由于某些元素可以懒加载，如果你想获取另一个元素的卡片大小，应首先检查其是否已定义。

```js
return customElements
  .whenDefined(element.localName)
  .then(() => element.getCardSize());
```

### 在节视图中的大小

你可以定义一个 `getGridOptions` 方法，返回网格中卡片占用的最小、最大和默认的单元格数量（如果你的卡片用于 [节视图](https://www.home-assistant.io/dashboards/sections/)）。每个节被分为 12 列。
如果你不定义此方法，则卡片将占用 12 列，并将忽略网格的行。

网格的一个单元格按照以下维度定义：

- 宽度：节宽度除以 12（大约 `30px`）
- 高度：`56px`
- 单元格之间的间隙：`8px`

不同的网格选项是：

- `rows`: 卡片占用的默认行数。如果你希望卡片忽略网格的行，请不要定义此值（默认未定义）。
- `min_rows`: 卡片占用的最小行数（默认 `1`）。
- `max_rows`: 卡片占用的最大行数（默认未定义）。
- `columns`: 卡片占用的默认列数。将其设置为 `full` 以强制使你的卡片占据全宽（默认 `12`）。
- `min_columns`: 卡片占用的最小列数（默认 `1`）。
- `max_columns`: 卡片占用的最大列数（默认未定义）。

对于列数，强烈建议将默认值设置为 3 的倍数（`3`、`6`、`9` 或 `12`），这样你的卡片在仪表板上看起来会更美观。

实现示例：

```js
public getGridOptions() {
  return {
    rows: 2,
    columns: 6,
    min_rows: 2,
  };
}
```

在这个示例中，卡片默认将占据 6 x 2 个单元格。卡片的高度不能小于 2 行。根据单元格的尺寸，卡片将具有 `120px` 的高度（`2` * `56px` + `8px`）。

## 高级示例

仪表板中加载的资源作为 JS 模块导入。以下是一个使用 JS 模块的自定义卡片示例，它实现了所有的花哨功能。

![wired 卡片的截图](/img/en/frontend/dashboard-custom-card-screenshot.png)

在你的 Home Assistant 配置目录中创建一个新文件，路径为 `<config>/www/wired-cards.js`，并放入以下内容：

```js
import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");

class WiredToggleCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    return html`
      <wired-card elevation="2">
        ${this.config.entities.map((ent) => {
          const stateObj = this.hass.states[ent];
          return stateObj
            ? html`
                <div class="state">
                  ${stateObj.attributes.friendly_name}
                  <wired-toggle
                    .checked="${stateObj.state === "on"}"
                    @change="${(ev) => this._toggle(stateObj)}"
                  ></wired-toggle>
                </div>
              `
            : html` <div class="not-found">实体 ${ent} 未找到。</div> `;
        })}
      </wired-card>
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("你需要定义实体");
    }
    this.config = config;
  }

  // 卡片的高度。Home Assistant 使用这个来自动
  // 在所有可用列上分配卡片。
  getCardSize() {
    return this.config.entities.length + 1;
  }

  _toggle(state) {
    this.hass.callService("homeassistant", "toggle", {
      entity_id: state.entity_id,
    });
  }

  static get styles() {
    return css`
      :host {
        font-family: "Gloria Hallelujah", cursive;
      }
      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
      }
      .state {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        align-items: center;
      }
      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }
      wired-toggle {
        margin-left: 8px;
      }
    `;
  }
}
customElements.define("wired-toggle-card", WiredToggleCard);
```

在你的仪表板配置中添加一个资源，URL 为 `/local/wired-cards.js`，类型为 `module`。

对于你的配置：

```yaml
# 示例仪表板配置
views:
  - name: 示例
    cards:
      - type: "custom:wired-toggle-card"
        entities:
          - input_boolean.switch_ac_kitchen
          - input_boolean.switch_ac_livingroom
          - input_boolean.switch_tv
```

## 图形卡片配置

你的卡片可以定义一个 `getConfigElement` 方法，返回一个自定义元素以编辑用户配置。Home Assistant 将在仪表板的卡片编辑器中显示此元素。

你的卡片还可以定义一个 `getStubConfig` 方法，返回用于卡片类型选择器的默认卡片配置（不带 `type:` 参数）的 json 形式。

Home Assistant 在设置时将调用配置元素的 `setConfig` 方法。
Home Assistant 会在状态变化时更新配置元素的 `hass` 属性，以及包含有关仪表板配置的信息的 `lovelace` 元素。

对配置的更改通过分发带有新配置的 `config-changed` 事件进行反馈。

要让你的卡片显示在仪表板的卡片选择器对话框中，向数组 `window.customCards` 添加一个描述它的对象。对象的必需属性为 `type` 和 `name`（请见下面的示例）。

```js
class ContentCardExample extends HTMLElement {
  static getConfigElement() {
    return document.createElement("content-card-editor");
  }

  static getStubConfig() {
    return { entity: "sun.sun" }
  }

  ...
}

customElements.define('content-card-example', ContentCardExample);
```

```js
class ContentCardEditor extends LitElement {
  setConfig(config) {
    this._config = config;
  }

  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }
}

customElements.define("content-card-editor", ContentCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "content-card-example",
  name: "内容卡片",
  preview: false, // 可选 - 默认值为 false
  description: "由我制作的自定义卡片！", // 可选
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // 在前端卡片编辑器中添加帮助链接
});