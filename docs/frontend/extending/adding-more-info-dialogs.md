---
title: "添加更多信息对话框"
---

每当用户点击或点击其中一个卡片时，将会显示更多信息对话框。此对话框的标题将是状态卡，后面是该实体过去24小时的历史记录。在此下方，将为该实体呈现更多信息组件。更多信息组件可以显示更多信息或提供更多控制方式。

<img
  src='/img/en/frontend/frontend-more-info-light.png'
  alt='该灯的更多信息对话框允许用户控制颜色和亮度.'
/>

添加更多信息对话框的说明与添加新卡片类型非常相似。此示例将在领域 `camera` 上添加一个新的更多信息组件：

 1. 在文件 [/common/const.ts](https://github.com/home-assistant/frontend/blob/dev/src/common/const.ts) 中将 `'camera'` 添加到数组 `DOMAINS_WITH_MORE_INFO`。
 2. 在文件夹 [/dialogs/more-info/controls](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/controls) 中创建文件 `more-info-camera.js`。
 3. 在 [/dialogs/more-info/more-info-content.ts](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/more-info-content.ts) 中添加 `import './more-info-camera.js';`。