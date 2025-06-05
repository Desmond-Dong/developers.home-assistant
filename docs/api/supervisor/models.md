---
title: "模型"
---

这些模型描述的是从监督 API 返回的对象。

## 添加组件

| key              | type           | description                                           |
| ---------------- | -------------- | ----------------------------------------------------- |
| name             | string         | 添加组件的名称                                        |
| slug             | string         | 添加组件的标识符                                      |
| advanced         | boolean        | 如果仅对高级用户可见，则为 `true`                     |
| description      | string         | 添加组件的描述                                        |
| repository       | string         | 添加组件来自的仓库                                    |
| version          | string or null | 添加组件的安装版本                                    |
| version_latest   | string         | 添加组件的最新发布版本                                |
| update_available | boolean        | 如果有可用更新，则为 `true`                           |
| installed        | string         | 如果已安装添加组件，则为 `true`                       |
| available        | boolean        | 如果无法安装添加组件，则为 `false`                    |
| icon             | bool           | 添加组件有图标文件                                    |
| logo             | bool           | 添加组件有logo文件                                    |
| state            | string         | 添加组件的状态（启动，停止）                          |
| system_managed   | bool           | 表示添加组件是否由 Home Assistant 管理                |

## 应用程序

| key          | type    | description                            |
| ------------ | ------- | -------------------------------------- |
| name         | string  | 应用程序名称                           |
| index        | int     | TODO: 这是什么？                       |
| stream_index | int     | TODO: 这是什么？                       |
| stream_type  | string  | 流的类型（输入，输出）                 |
| volume       | float   | 当前音量                               |
| mute         | boolean | 如果应用程序被静音，则为 `true`        |
| addon        | string  | 添加组件的标识符                      |

## 音频

| key         | type | description                                     |
| ----------- | ---- | ----------------------------------------------- |
| card        | list | 一组 [卡片模型](#card)                          |
| input       | list | 一组 [音频设备模型](#audio-device)              |
| output      | list | 一组 [输出设备模型](#audio-device)              |
| application | list | 一组 [应用程序模型](#application)               |

## 音频设备

| key          | type        | description                                  |
| ------------ | ----------- | -------------------------------------------- |
| name         | string      | 设备的名称                                  |
| index        | int         | TODO: 这是什么？                             |
| description  | string      | 设备的描述                                  |
| volume       | float       | 当前音量                                    |
| mute         | string      | 如果设备被静音，则为 `true`                 |
| default      | string      | 如果设备是默认设备，则为 `true`             |
| card         | int or null | TODO: 这是什么？                             |
| applications | string      | 一组 [应用程序模型](#application)             |

## 音频配置文件

| key         | type    | description                     |
| ----------- | ------- | ------------------------------- |
| name        | string  | 配置文件名称                   |
| description | string  | 配置文件的描述                 |
| active      | boolean | 如果配置文件处于活动状态，则为 `true` |

## 卡片

| key      | type   | description                                      |
| -------- | ------ | ------------------------------------------------ |
| name     | string | 卡片的名称                                     |
| index    | int    | TODO: 这是什么？                                 |
| driver   | string | 卡片驱动程序的名称                             |
| profiles | list   | 一组 [音频配置文件模型](#audio-profile)          |

## 发现

| key     | type   | description               |
| ------- | ------ | ------------------------- |
| addon   | string | 添加组件的标识符         |
| service | string | 服务名称                  |
| uuid    | string | 发现的 UUID               |
| config  | dict   | 配置                      |

## 主机服务

| key         | type   | description             |
| ----------- | ------ | ----------------------- |
| name        | string | 服务名称                |
| description | string | 服务描述                |
| state       | string | 服务状态                |

## 网络接口

| key         | type    | description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| interface   | string  | 接口名称，例如 eth0。                                                        |
| type        | string  | 接口类型：`ethernet`、`wireless` 或 `vlan`。                                  |
| enabled     | boolean | 如果接口已启用，则返回 True。                                               |
| connected   | boolean | 如果接口已连接到网络，则返回 True。                                          |
| primary     | boolean | 如果是主要网络接口，则为 `true`。                                          |
| ipv4        | struct or null  | 带有 IPv4 连接详细信息的 IP 配置结构。                                     |
| ipv6        | struct or null  | 带有 IPv6 连接详细信息的 IP 配置结构。                                     |
| wifi        | struct or null  | 带有无线连接详细信息的 Wifi 配置结构。                                    |
| vlan        | struct or null  | 带有 vlan 详细信息的 Vlan 配置结构。                                      |

### IP 配置

| key         | type    | description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| method      | string  | 设置 IP 时使用的方法，可以是 `static`、`auto` 或 `disabled`。                |
| address     | list    | 一个包含 IP 地址和子网掩码的列表，格式为 X.X.X.X/XX。                      |
| gateway     | string  | 网关的 IP 地址。                                                            |
| nameservers | list    | 包含配置的 DNS 服务器 IP 地址的字符串列表。                                |

### Wifi 配置

| key         | type    | description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| mode        | string  | 设置模式 `infrastructure`、`mesh`、`adhoc` 或 `ap`。                       |
| auth        | string  | 设置验证模式：`open`、`web` 或 `wpa-psk`。                                  |
| ssid        | string  | 设置无线的 SSID。                                                           |
| signal      | integer | 信号强度的百分比。                                                         |

### VLAN 配置

| key     | type    | description                                                                  |
| ------- | ------- | ---------------------------------------------------------------------------- |
| id      | integer | VLAN ID。                                                                    |
| parent  | string  | 附加到的父接口。                                                          |

## 接入点

| key        | type    | description                                                                  |
| ---------- | ------- | ---------------------------------------------------------------------------- |
| mode       | string  | 之一：`infrastructure`、`mesh` 或 `adhoc`。                                 |
| ssid       | string  | 无线网络 ID。                                                              |
| frequency  | integer | 此接入点的工作频率。                                                      |
| signal     | integer | 信号强度的百分比。                                                         |
| mac        | string  | 接入点的 MAC 地址。                                                        |

## 面板

| key    | type    | description                            |
| ------ | ------- | -------------------------------------- |
| enable | boolean | 如果启用，则为 `true`                  |
| icon   | string  | 侧边栏图标                            |
| title  | string  | 侧边栏标题                            |
| admin  | boolean | 如果仅限管理员帐户，则为 `true`       |

## 仓库

| key        | type           | description                           |
| ---------- | -------------- | ------------------------------------- |
| slug       | string         | 仓库的标识符                         |
| name       | string         | 仓库名称                             |
| source     | string         | 指向仓库的 URL                       |
| url        | string or null | 仓库网站的 URL                       |
| maintainer | string         | 仓库维护者的名称                     |

## 服务

| key       | type    | description                         |
| --------- | ------- | ----------------------------------- |
| slug      | string  | 服务的标识符                       |
| available | boolean | 如果服务可用，则为 `true`           |
| providers | list    | 服务的提供商列表                   |

## 备份

| key       | type    | description                                                           |
| --------- | ------- | --------------------------------------------------------------------- |
| slug      | string  | 备份的生成标识符                                                     |
| date      | string  | 备份创建日期的 ISO 日期字符串表示                                  |
| name      | string  | 备份的名称                                                          |
| type      | string  | 备份的类型（完整、部分）                                            |
| protected | boolean | 如果备份是密码保护，则为 `true`                                     |
| content   | dictionary | 描述备份内容的字典                                               |
| compressed | boolean | 如果备份以压缩档案保存，则为 `true`                                 |

### 备份 -> 内容

备份对象的 `content` 键包含以下键：

| key       | type    | description                                                           |
| --------- | ------- | --------------------------------------------------------------------- |
| homeassistant      | boolean  | 如果备份包含 Home Assistant，则为 `true`                          |
| addons      | list  | 一组包含在备份中的添加组件标识符                                   |
| folders     | list  | 一组包含在备份中的文件夹名称                                       |

## 备份详细信息

| key                            | type           | description                                                                                                               |
| ------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| slug                           | string         | 备份的生成标识符                                                                                                       |
| type                           | string         | 备份的类型（完整、部分）                                                                                                |
| name                           | string         | 备份的名称                                                                                                             |
| date                           | string         | 备份创建日期的 ISO 日期字符串表示                                                                                        |
| size                           | string         | 备份的大小（以 MB 为单位）                                                                                              |
| protected                      | boolean        | 如果备份是密码保护，则为 `true`                                                                                          |
| location                       | string or null | 备份存储的挂载名称。 如果本地存储，则为 `null`。                                                                      |
| homeassistant                  | string         | 使用的 Home Assistant 版本                                                                                               |
| addons                         | list           | 备份中包含的添加组件列表。 添加组件表示为具有这些键的字典 [`slug`,`name`,`version`,`size`]                            |
| repositories                   | list           | 一组添加组件仓库 URL 的字符串                                                                                            |
| folders                        | list           | 一组表示目录的字符串                                                                                                    |
| homeassistant_exclude_database | boolean        | 如果 Home Assistant 数据库文件从此备份中排除，则为 `true`                                                             |

## 统计信息

| key            | type  | description                               |
| -------------- | ----- | ----------------------------------------- |
| cpu_percent    | float | 使用的 CPU 百分比                       |
| memory_usage   | int   | 当前内存使用量（以字节为单位）         |
| memory_limit   | int   | 最大允许内存使用量（以字节为单位）      |
| memory_percent | float | 使用的内存百分比                       |
| network_tx     | int   | 网络发送使用量                          |
| network_rx     | int   | 网络接收使用量                          |
| blk_read       | int   | 文件系统读取使用量                      |
| blk_write      | int   | 文件系统写入使用量                      |

## 问题

| key       | type        | description                                         |
| ----------| ----------- | --------------------------------------------------- |
| uuid      | str         | 生成的 uuid 作为问题 ID                             |
| type      | str         | 问题的类型                                         |
| context   | str         | 问题发生的上下文                                   |
| reference | str or null | 根据上下文，指向另一个模型的引用                     |

## 建议

| key       | type        | description                                         |
| ----------| ----------- | --------------------------------------------------- |
| uuid      | str         | 生成的 uuid 作为建议 ID                             |
| type      | str         | 建议的类型                                         |
| context   | str         | 建议发生的上下文                                   |
| reference | str or null | 根据上下文，指向另一个模型的引用                     |
| auto      | bool        | 如果建议的修复将自动应用，则为 True                  |

## 检查

| key       | type        | description                                         |
| ----------| ----------- | --------------------------------------------------- |
| slug      | str         | 检查的生成标识符                                   |
| enable    | bool        | 检查的启用状态                                     |

## 设备

| key        | type           | description                                                           |
| ---------- | -------------- | --------------------------------------------------------------------- |
| name       | string         | 设备对象的名称                                                     |
| sysfs      | string         | sysfs 设备对象的路径                                               |
| dev_path   | string         | devfs 的路径                                                        |
| subsystem  | string or null | 设备的子系统类型（tty、input、sound、block、misc）                  |
| parent     | string or null | 父 sysfs 设备对象的路径                                           |
| by_id      | string or null | Udev by ID 链接                                                   |
| attributes | dict           | 纯 udev 设备属性的字典，用于调试和理解                             |
| children   | list           | 一组指向子 sysfs 设备的路径                                       |

## 磁盘

| key        | type           | description                                                            |
| ---------- | -------------- | ---------------------------------------------------------------------- |
| name       | string         | 磁盘设备的名称                                                      |
| vendor     | string         | 磁盘设备的供应商                                                    |
| model      | string         | 磁盘设备的型号                                                      |
| serial     | string         | 磁盘设备的序列号                                                  |
| size       | int            | 磁盘的大小（以字节为单位）                                          |
| id         | string         | 磁盘设备的唯一 ID（可以是 UDisks2 驱动 ID 或设备路径）              |
| dev_path   | string         | 磁盘设备的设备路径                                                  |

## 挂载

| key        | type           | description                                                            | request/response |
| ---------- | -------------- | ---------------------------------------------------------------------- | ---------------- |
| name       | string         | 挂载的名称                                                          | 两者             |
| type       | string         | 挂载的类型（cifs 或 nfs）                                            | 两者             |
| usage      | string         | 挂载的用途（备份、媒体或共享）                                      | 两者             |
| server     | string         | 网络共享服务器的 IP 地址或主机名                                      | 两者             |
| port       | int            | 端口（如果未使用标准的挂载类型，则使用此端口）                        | 两者             |
| read_only  | bool           | 挂载为只读（备份挂载不可用）                                        | 两者             |
| path       | string         | （仅限 nfs 挂载）从网络共享的挂载路径                                | 两者             |
| share      | string         | （仅限 cifs 挂载）从网络共享的挂载共享                                | 两者             |
| username   | string         | （仅限 cifs 挂载）用于身份验证的用户名                              | 仅请求          |
| password   | string         | （仅限 cifs 挂载）用于身份验证的密码                                | 仅请求          |
| state      | string         | 挂载的当前状态（活动、失败等）                                       | 仅响应          |

仅请求字段可能包含在请求中，但永远不会出现在响应中。
仅响应字段将在响应中出现，但不能包含在请求中。

## 作业

| key        | type    | description                                                   |
| ---------- | ------- | ------------------------------------------------------------- |
| name       | string  | 作业的名称                                                   |
| reference  | string  | 作业正在处理的实例的唯一 ID（如适用）                       |
| uuid       | string  | 作业的唯一 ID                                                |
| progress   | int     | 作业的进展（如果可以获取准确的进展）                       |
| stage      | string  | 作业所处阶段的名称（如适用）                               |
| done       | boolean | 作业是否完成                                                |
| created    | string  | 作业创建日期和时间的 ISO 格式                               |
| child_jobs | list    | 由此作业启动的子 [作业](#job) 的列表                        |
| errors     | list    | 执行过程中发生的 [错误](#job-error) 列表                   |

## 作业错误

| key        | type    | description                                    |
| ---------- | ------- | ---------------------------------------------- |
| type       | string  | 发生的错误类型                                |
| message    | string  | 人类可读的出错描述                            |

## 启动槽

| key        | type    | description                                     |
| ---------- | ------- | ----------------------------------------------- |
| state      | string  | 活动或不活动（活动的槽正在使用中）            |
| status     | string  | 从插槽启动的上次启动状态（良好或不良）       |
| version    | string  | 安装的操作系统版本                            |

## 用户

| key        | type    | description                                                   |
| ---------- | ------- | ------------------------------------------------------------- |
| username   | string  | 用于登录的用户名                                            |
| name       | string  | 用户的名称                                                  |
| is_owner   | boolean | 用户是否为所有者                                            |
| is_active  | boolean | 用户是否活跃                                                |
| local_only | boolean | 用户是否可以从网络（例如通过 http）登录                   |
| group_ids  | list    | 用户拥有的角色（管理员等）                                 |

## 驱动器

| key            | type     | description                                                 |
| -------------- | -------- | ----------------------------------------------------------- |
| vendor         | string   | 驱动器供应商                                              |
| model          | string   | 驱动器型号                                               |
| serial         | string   | 驱动器序列号                                             |
| id             | string   | 驱动器的唯一和持久 ID                                   |
| size           | int      | 驱动器的大小（以字节为单位）                            |
| time_detected  | datetime | 系统检测到驱动器的时间                                  |
| connection_bus | string   | 驱动器的物理连接总线（USB 等）                          |
| seat           | string   | 驱动器插入的座位标识符                                   |
| removable      | boolean  | 驱动器是否可由用户拆卸                                   |
| ejectable      | boolean  | 驱动器是否可由系统弹出                                   |
| filesystems    | list     | 驱动器上 [文件系统分区](#filesystem) 的列表               |

## 文件系统

| key          | type    | description                                               |
| ------------ | ------- | --------------------------------------------------------- |
| device       | string  | 文件系统的特殊设备文件（例如 `/dev/sda1`）                |
| id           | string  | 文件系统的唯一和持久 ID                                   |
| size         | int     | 文件系统的大小（以字节为单位）                           |
| name         | string  | 文件系统名称（如果已知）                                 |
| system       | boolean | 如果文件系统被视为系统/内部设备，则为 `true`             |
| mount_points | list    | 文件系统挂载的路径列表                                   |