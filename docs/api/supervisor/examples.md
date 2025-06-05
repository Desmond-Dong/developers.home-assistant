---
title: "示例"
---

有关如何与 supervisor API 接口的示例。

## 使用 cURL 获取网络信息

```bash
curl -sSL -H "Authorization: Bearer $SUPERVISOR_TOKEN" http://supervisor/network/info
```

**响应：**

```json
{
  "result": "ok",
  "data": {
    "interfaces": {
      "eth0": {
        "ip_address": "192.168.1.100/24",
        "gateway": "192.168.1.1",
        "id": "有线连接 1",
        "type": "802-3-以太网",
        "nameservers": ["192.168.1.1"],
        "method": "静态",
        "primary": true
      }
    }
  }
}
```

## Ping supervisor

```bash
curl -sSL http://supervisor/supervisor/ping
```

**响应：**

```json
{
  "result": "ok",
  "data": {}
}