---
title: "推送通知"
---

`mobile_app` 集成内置了一个通知平台，允许以通用的方式向您的用户发送推送通知，而无需安装外部自定义组件。推送通知可以通过 WebSocket 连接或通过云服务发送。

## 启用 WebSocket 推送通知

您的应用可以通过 WebSocket API 连接到 Home Assistant 以订阅推送通知。要启用此功能，您的应用需要订阅云推送通知或在注册时将 `push_websocket_channel: true` 添加到 `app_data` 对象中。

要创建一个 WebSocket 通道，请创建一个推送通知订阅：

```json
{
  "id": 2,
  "type": "mobile_app/push_notification_channel",
  "webhook_id": "abcdefghkj",
  "support_confirm": true // 可选
}
```

所有推送通知将作为事件通过 WebSocket 连接发送：

```json
{
  "id": 2,
  "type": "event",
  "event": {
    "message": "Hello world",
    "hass_confirm_id": "12345" // 如果 confirm = true
  },
}
```

如果启用了确认，您必须发送 WebSocket 命令进行确认：

```json
{
  "id": 3,
  "type": "mobile_app/push_notification_confirm",
  "webhook_id": "abcdefghkj",
  "confirm_id": "12345"
}
```

如果一个注册支持云推送通知并连接以接收本地推送通知，通知将优先在本地发送，如果应用未确认通知，则回退到云。

## 启用云推送通知

要启用应用的通知平台，您必须在初始注册期间或更新现有注册时，在 `app_data` 对象中设置两个键。

| 键 | 类型 | 描述 |
| --- | ---- | ----------- |
| `push_token` | 字符串 | 用户设备唯一的推送通知令牌。例如，这可以是 APNS 令牌或 FCM 实例 ID/令牌。 |
| `push_url` | 字符串 | 您的服务器上将推送通知进行 HTTP POST 的 URL。 |

您应该建议用户在设置这些键之后重启 Home Assistant，以便他们可以看到通知目标。它的格式将为 `notify.mobile_app_<saved_device_name>`。

### 部署服务器组件

通知平台不关心如何通知您的用户。它仅将通知转发到您的外部服务器，您应实际处理请求。这种方法让您可以全面控制自己的推送通知基础设施。

请参阅本文件的下一部分，了解使用 Firebase 云功能和 Firebase 云消息传递的推送通知转发器的示例服务器实现。

您的服务器应该接受如下的 HTTP POST 负载：

```json
{
  "message": "Hello World",
  "title": "通过 mobile_app.notify 发送的测试消息",
  "push_token": "my-secure-token",
  "registration_info": {
    "app_id": "io.home-assistant.iOS",
    "app_version": "1.0.0",
    "os_version": "12.2",
    "webhook_id": "registration 中的 webhook_id"
  },
  "data": {
    "key": "value"
  }
}
```

:::info
`webhook_id` 仅在核心版本 2021.11 或更高版本中包含。
:::

假设通知已成功排队待送达，它应该响应 201 状态码。

### 错误

如果发生错误，您应返回导致问题的描述以及非 201 或 429 的状态码。错误响应必须是一个 JSON 对象，并可以包含以下键之一：

| 键 | 类型 | 描述 |
| --- | ---- | ----------- |
| `errorMessage` | 字符串 | 如果提供，将附加到预设错误消息中。例如，如果 `errorMessage` 为 "无法与 Apple 通信"，则将在日志中输出为 "内部服务器错误，请稍后再试: 无法与 Apple 通信"。 |
| `message` | 字符串 | 如果提供，将直接以警告日志级别输出到日志中。 |

无论您使用何种键，您都应尽可能详细地描述问题，并且如果可能，提供用户修复的建议。

### 速率限制

通知平台还支持向用户暴露速率限制。Home Assistant 建议您实现保守的速率限制，以保持低成本，并且用户不会因收到过多通知而过载。
作为参考，Home Assistant Companion 每 24 小时最多可发送 150 条通知。所有用户的速率限制在 UTC 零点重置。您当然可以自由使用任何配置来进行自己的速率限制。

如果您选择实现速率限制，您成功的服务器响应应如下所示：

```json
{
  "rateLimits": {
    "successful": 1,
    "errors": 5,
    "maximum": 150,
    "resetsAt": "2019-04-08T00:00:00.000Z"
  }
}
```

| 键 | 类型 | 描述 |
| --- | ---- | ----------- |
| `successful` | 整数 | 在速率限制期间用户成功发送的推送通知数量。 |
| `errors` | 整数 | 在速率限制期间用户发送的失败推送通知数量。 |
| `maximum` | 整数 | 用户在速率限制期间可以发送的最大推送通知数量。 |
| `resetsAt` | ISO8601 时间戳 | 用户速率限制期间到期的时间戳。必须提供 UTC 时区。 |

速率限制将在每次成功发送通知后以警告日志级别输出到日志中。Home Assistant 还会输出直到速率限制周期重置的确切剩余时间。

一旦用户在速率限制期间达到发送的最大通知数量，您应开始响应 429 状态码，直到速率限制周期到期。响应对象可以可选地包含一个键 `message`，该键将输出到 Home Assistant 日志，而不是标准错误消息。

通知平台本身并未实现任何形式的速率限制保护。用户可以继续向您发送通知，因此您应该尽早在逻辑中以 429 状态码拒绝它们。

### 示例服务器实现

以下代码是一个 Firebase 云函数，它将通知转发至 Firebase 云消息服务。要部署此功能，您应该创建一个名为 `rateLimits` 的新 Firestore 数据库。然后，您可以部署以下代码。
另外，请确保您已为 APNS 和 FCM 正确配置了项目的身份验证密钥。

```javascript
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.firestore();

const MAX_NOTIFICATIONS_PER_DAY = 150;

exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
  console.log('收到负载', req.body);
  var today = getToday();
  var token = req.body.push_token;
  var ref = db.collection('rateLimits').doc(today).collection('tokens').doc(token);

  var payload = {
    notification: {
      body: req.body.message,
    },
    token: token,
  };

  if(req.body.title) {
    payload.notification.title = req.body.title;
  }

  if(req.body.data) {
    if(req.body.data.android) {
      payload.android = req.body.data.android;
    }
    if(req.body.data.apns) {
      payload.apns = req.body.data.apns;
    }
    if(req.body.data.data) {
      payload.data = req.body.data.data;
    }
    if(req.body.data.webpush) {
      payload.webpush = req.body.data.webpush;
    }
  }

  console.log('通知负载', JSON.stringify(payload));

  var docExists = false;
  var docData = {
    deliveredCount: 0,
    errorCount: 0,
    totalCount: 0,
  };

  try {
    let currentDoc = await ref.get();
    docExists = currentDoc.exists;
    if(currentDoc.exists) {
      docData = currentDoc.data();
    }
  } catch(err) {
    console.error('获取文档时出错!', err);
    return handleError(res, 'getDoc', err);
  }

  if(docData.deliveredCount > MAX_NOTIFICATIONS_PER_DAY) {
    return res.status(429).send({
      errorType: 'RateLimited',
      message: '给定目标已达到每天允许的最大通知数量。请稍后再试。',
      target: token,
      rateLimits: getRateLimitsObject(docData),
    });
  }

  docData.totalCount = docData.totalCount + 1;

  var messageId;
  try {
    messageId = await admin.messaging().send(payload);
    docData.deliveredCount = docData.deliveredCount + 1;
  } catch(err) {
    docData.errorCount = docData.errorCount + 1;
    await setRateLimitDoc(ref, docExists, docData, res);
    return handleError(res, 'sendNotification', err);
  }

  console.log('成功发送消息:', messageId);

  await setRateLimitDoc(ref, docExists, docData, res);

  return res.status(201).send({
    messageId: messageId,
    sentPayload: payload,
    target: token,
    rateLimits: getRateLimitsObject(docData),
  });

});

async function setRateLimitDoc(ref, docExists, docData, res) {
  try {
    if(docExists) {
      console.log('更新现有文档!');
      await ref.update(docData);
    } else {
      console.log('创建新文档!');
      await ref.set(docData);
    }
  } catch(err) {
    if(docExists) {
      console.error('更新文档时出错!', err);
    } else {
      console.error('创建文档时出错!', err);
    }
    return handleError(res, 'setDocument', err);
  }
  return true;
}

function handleError(res, step, incomingError) {
  if (!incomingError) return null;
  console.error('在', step, '期间发生内部错误', incomingError);
  return res.status(500).send({
    errorType: 'InternalError',
    errorStep: step,
    message: incomingError.message,
  });
}

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  return yyyy + mm + dd;
}

function getRateLimitsObject(doc) {
  var d = new Date();
  return {
    successful: (doc.deliveredCount || 0),
    errors: (doc.errorCount || 0),
    total: (doc.totalCount || 0),
    maximum: MAX_NOTIFICATIONS_PER_DAY,
    remaining: (MAX_NOTIFICATIONS_PER_DAY - doc.deliveredCount),
    resetsAt: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1)
  };
}