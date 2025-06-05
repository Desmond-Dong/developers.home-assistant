---
title: "自定义徽章"
---

[徽章](https://www.home-assistant.io/dashboards/badges/)是位于视图顶部的小部件，位于所有卡片之上。我们提供了一个内置徽章，[实体徽章](https://next.home-assistant.io/dashboards/badges/#entity-badge)，但你并不局限于这个。你可以构建并使用你自己的徽章！

## 定义你的徽章

徽章的定义方式与定义[自定义卡片](/docs/frontend/custom-ui/custom-card)非常相似。

让我们创建一个基本的徽章，在屏幕顶部显示自定义文本。
在你的Home Assistant配置目录中创建一个新文件，命名为`<config>/www/text-badge.js`，并放入以下内容：

```js

class TextBadge extends HTMLElement {
  // 每当状态变化时，会设置一个新的`hass`对象。使用它来
  // 更新你的内容。
  set hass(hass) {
    this._hass = hass;
    this.updateContent();
  }

  // 用户提供的配置。如果没有定义实体，则抛出异常，Home Assistant
  // 将渲染一个错误徽章。
  setConfig(config) {
    if (!config.entity) {
      throw new Error("你需要定义一个实体");
    }
    this.config = config;
    this.updateContent();
  }

  updateContent() {
    if (!this.config || !this._hass) return;

    const entityId = this.config.entity;
    const state = this._hass.states[entityId];
    const stateStr = state ? state.state : "不可用";

    this.innerHTML = `<p>${stateStr}</p>`;
  }
}

customElements.define("text-badge", TextBadge);
```

## 引用你的新徽章

在我们的示例徽章中，我们定义了一个带有标签`text-badge`的徽章（见最后一行），所以我们的徽章类型将是`custom:text-badge`。因为你在`<config>/www`目录中创建了文件，所以它可以通过网址`/local/`在浏览器中访问（如果你最近添加了www文件夹，你需要重新启动Home Assistant以使文件被识别）。

在你的仪表板配置中添加一个资源，URL为`/local/text-badge.js`，类型为`module`（[资源文档](/docs/frontend/custom-ui/registering-resources)）。

然后你可以在你的仪表板配置中使用你的徽章：

```yaml
# 示例仪表板配置
views:
  - name: 示例
    badges:
      - type: "custom:text-badge"
        entity: light.bedside_lamp
```

## API

自定义徽章被定义为[自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)。由你决定如何在你的元素内部渲染DOM。你可以使用Polymer、Angular、Preact或任何流行的框架（除了React – [有关React的更多信息](https://custom-elements-everywhere.com/#react)）。

当配置更改时，Home Assistant将调用`setConfig(config)`（很少发生）。如果你因为配置无效而抛出异常，Home Assistant将渲染一个错误徽章以通知用户。

当Home Assistant状态发生变化时，将设置[`hass`属性](/docs/frontend/data/)（频繁）。每当状态变化时，组件必须更新自身以表示最新状态。

## 图形徽章配置

你的徽章可以定义一个`getConfigElement`方法，该方法返回一个自定义元素用于编辑用户配置。Home Assistant将在仪表板中的徽章编辑器中显示这个元素。

你的徽章还可以定义一个`getStubConfig`方法，该方法以json形式返回一个默认徽章配置（不含`type:`参数），用于仪表板的徽章类型选择器。

Home Assistant将在设置时调用配置元素的`setConfig`方法。
Home Assistant将在状态变化时更新配置元素的`hass`属性，以及包含仪表板配置信息的`lovelace`元素。

配置的更改通过调度`config-changed`事件传递给仪表板，事件的细节中包含新的配置。

要使你的徽章显示在仪表板的徽章选择对话框中，将描述它的对象添加到数组`window.customBadges`中。对象的必需属性是`type`和`name`（见下面示例）。

```js
import "./text-badge-editor.js";

class TextBadge extends HTMLElement {
  
  ...

  static getConfigElement() {
    return document.createElement("text-badge-editor");
  }

  static getStubConfig() {
    return { entity: "sun.sun" };
  }
}

customElements.define("text-badge", TextBadge);
```

```js
class TextBadgeEditor extends HTMLElement {
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

customElements.define("text-badge-editor", TextBadgeEditor);
window.customBadges = window.customBadges || [];
window.customBadges.push({
  type: "text-badge",
  name: "文本徽章",
  preview: false, // 可选 - 默认为false
  description: "我制作的自定义徽章！", // 可选
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-badge", // 在前端徽章编辑器中添加帮助链接
});