---
title: "自定义卡片功能"
---

一些仪表板卡片支持 [功能](https://www.home-assistant.io/dashboards/features/)。这些小部件为卡片添加快速控制。我们提供了许多内置功能，但您并不仅限于我们决定在 Home Assistant 中包含的功能。您可以按照定义 [自定义卡片](/docs/frontend/custom-ui/custom-card) 的方式构建和使用您自己的功能。

## 定义您的卡片功能

下面是一个 [按钮实体](/docs/core/entity/button/) 的自定义卡片功能示例。

![自定义卡片功能示例的截图](/img/en/frontend/dashboard-custom-card-feature-screenshot.png)

```js
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const supportsButtonPressCardFeature = (stateObj) => {
  const domain = stateObj.entity_id.split(".")[0];
  return domain === "button";
};

class ButtonPressCardFeature extends LitElement {
  static get properties() {
    return {
      hass: undefined,
      config: undefined,
      stateObj: undefined,
    };
  }

  static getStubConfig() {
    return {
      type: "custom:button-press-card-feature",
      label: "按下",
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("无效的配置");
    }
    this.config = config;
  }

  _press(ev) {
    ev.stopPropagation();
    this.hass.callService("button", "press", {
      entity_id: this.stateObj.entity_id,
    });
  }

  render() {
    if (
      !this.config ||
      !this.hass ||
      !this.stateObj ||
      !supportsButtonPressCardFeature(this.stateObj)
    ) {
      return null;
    }

    return html`
      <button class="button" @click=${this._press}>
        ${this.config.label || "按下"}
      </button>
    `;
  }

  static get styles() {
    return css`
      .button {
        display: block;
        height: var(--feature-height, 42px);
        width: 100%;
        border-radius: var(--feature-border-radius, 12px);
        border: none;
        background-color: #eeeeee;
        cursor: pointer;
        transition: background-color 180ms ease-in-out;
      }
      .button:hover {
        background-color: #dddddd;
      }
      .button:focus {
        background-color: #cdcdcd;
      }
    `;
  }
}

customElements.define("button-press-card-feature", ButtonPressCardFeature);

window.customCardFeatures = window.customCardFeatures || [];
window.customCardFeatures.push({
  type: "button-press-card-feature",
  name: "按钮按下",
  supported: supportsButtonPressCardFeature, // 可选
  configurable: true, // 可选 - 默认为 false
});
```

如果您希望您的功能更好地与 Home Assistant 的默认设计集成，可以使用这些 CSS 变量：

- `--feature-height`: 建议的高度 (42px)。
- `--feature-border-radius`: 建议的边框半径 (12px)。设置按钮或滑块的边框半径可能会很有用。
- `--feature-button-spacing`: 建议的按钮间距 (12px)。如果您的功能中有多个按钮，这可能会很有用。

与自定义卡片的主要区别是图形配置选项。
要在卡片编辑器中显示它，您必须将描述它的对象添加到数组 `window.customCardFeatures` 中。

对象的必需属性是 `type` 和 `name`。建议使用一个函数来定义 `supported` 选项，以便编辑器只有在与卡片中选择的实体兼容时才建议该功能。如果您的实体有额外配置（例如上面示例中的 `label` 选项），请将 `configurable` 设置为 `true`。

此外，静态函数 `getConfigElement` 和 `getStubConfig` 的工作方式与普通自定义卡片相同。