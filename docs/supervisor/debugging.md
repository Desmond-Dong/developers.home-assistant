---
title: "调试 Home Assistant Supervisor"
sidebar_label: 调试
---

以下调试技巧和窍门适用于正在运行 Home Assistant 镜像并在基础镜像上工作的开发人员。如果您使用通用的 Linux 安装脚本，您应该能够根据您的主机访问主机和日志。

## 调试 Supervisor

在您能够使用 Python 调试器之前，您需要在 Supervisor 中启用调试选项：

```shell
ha su options --debug=true
ha su reload
```

如果您在远程主机上运行 Supervisor，您将无法直接访问 Supervisor 容器。“远程 ptvsd 调试器”插件（可从[开发附加组件库](https://github.com/home-assistant/addons-development)获取）会在您的主机 IP 地址上暴露调试端口，从而允许远程调试 Supervisor。

以下是一个示例 Visual Studio Code 配置，用于将 Python 调试器附加到 Home Assistant Supervisor。这个配置作为 Run > Start Debugging 或按 F5 的默认设置。您需要将“IP”更改为与 Docker 环境中的 Supervisor IP 匹配（在 Supervisor 容器内使用 `ip addr`）或如果您远程调试则使用主机 IP。

`.vscode/launch.json`
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Supervisor 远程调试",
            "type": "python",
            "request": "attach",
            "port": 33333,
            "host": "IP",
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "/usr/src/hassio"
                }
            ]
        }
    ]
}