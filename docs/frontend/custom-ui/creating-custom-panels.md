---
title: "创建自定义面板"
---

面板是显示Home Assistant信息的页面，并允许控制它。面板从侧边栏链接并全屏渲染。它们通过JavaScript实时访问Home Assistant对象。该应用程序中的面板示例包括仪表板、地图、日志簿和历史记录。

除了组件注册面板，用户还可以使用`panel_custom`组件注册面板。这允许用户快速构建自己用于Home Assistant的自定义界面。

## 介绍

面板被定义为自定义元素。您可以使用任何框架，只要将其封装为自定义元素即可。要快速开始创建面板，请创建一个名为`<config>/www/example-panel.js`的新文件，内容如下

```js
import "https://unpkg.com/wired-card@2.1.0/lib/wired-card.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class ExamplePanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
    };
  }

  render() {
    return html`
      <wired-card elevation="2">
        <p>共有 ${Object.keys(this.hass.states).length} 个实体。</p>
        <p>该屏幕是${this.narrow ? "" : "不"}狭窄的。</p>
        配置的面板配置
        <pre>${JSON.stringify(this.panel.config, undefined, 2)}</pre>
        当前路由
        <pre>${JSON.stringify(this.route, undefined, 2)}</pre>
      </wired-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        background-color: #fafafa;
        padding: 16px;
        display: block;
      }
      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }
    `;
  }
}
customElements.define("example-panel", ExamplePanel);
```

然后添加到您的`configuration.yaml`中：

```yaml
panel_custom:
  - name: example-panel
    # url_path需要对每个panel_custom配置唯一
    url_path: redirect-server-controls
    sidebar_title: 示例面板
    sidebar_icon: mdi:server
    module_url: /local/example-panel.js
    config:
      # 您想要提供给面板的数据
      hello: world
```

## API参考

Home Assistant前端将通过设置您的自定义元素的属性向您的面板传递信息。设置以下属性：

| 属性      | 类型      | 描述
| --------- | --------- | -----------
| hass      | 对象      | Home Assistant的当前状态
| narrow    | 布尔值    | 面板是否应该以狭窄模式渲染
| panel     | 对象      | 面板信息。配置可作为`panel.config`获得。

## JavaScript版本

Home Assistant用户界面目前以现代JavaScript和旧版JavaScript（ES5）的形式提供给浏览器。旧版具有更广泛的浏览器支持，但这带来了尺寸和性能的损失。

如果您确实需要以ES5支持运行，则必须在定义元素之前加载ES5自定义元素适配器：

```javascript
window.loadES5Adapter().then(function() {
  customElements.define('my-panel', MyCustomPanel)
});