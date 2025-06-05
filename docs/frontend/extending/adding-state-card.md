---
title: "添加状态卡"
---

Home Assistant 的主要界面是当前实体及其状态的列表。系统中的每个实体都会渲染一个状态卡。状态卡将显示一个图标、实体的名称、状态最后一次改变的时间以及当前状态或与之交互的控件。

![前端中的卡片](/img/en/frontend/frontend-cards1.png)

不同的卡片类型可以在 [这里](https://github.com/home-assistant/frontend/tree/dev/src/state-summary) 找到。

传感器在未分组时，将作为所谓的徽章显示在状态卡的顶部。

![前端中的徽章](/img/en/frontend/frontend-badges.png)

不同的徽章位于文件 [`/src/components/entity/ha-state-label-badge.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/entity/ha-state-label-badge.ts)。

添加自定义卡片类型可以通过几个简单的步骤完成。对于本示例，我们将为 `camera` 域添加一个新的状态卡：

 1. 在文件 [/common/const.ts](https://github.com/home-assistant/frontend/blob/dev/src/common/const.ts) 中将 `'camera'` 添加到数组 `DOMAINS_WITH_CARD`。
 2. 在文件夹 [/state-summary/](https://github.com/home-assistant/frontend/tree/dev/src/state-summary) 中创建文件 `state-card-camera.ts`。
 3. 在 [state-card-content.ts](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-content.ts) 中添加 `import './state-card-camera.ts';`。