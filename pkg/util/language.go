package util

import "os"

var translationMetadata = map[string]string{
	"Learn about problems in your systems moments after they occur": "在系统出现问题后立即了解问题",
	"Alerting":          "警报",
	"Explore":           "探索",
	"Explore your data": "探索你的数据",
	"Alert rules":       "警报规则",
	"Rules that determine whether an alert will fire": "确定警报是否会触发的规则",
	"Contact points": "联络点",
	"Decide how your contacts are notified when an alert fires": "决定当警报触发时如何通知联系人",
	"Notification policies":                             "通知策略",
	"Determine how alerts are routed to contact points": "确定警报如何路由到联络点",
	"Silences": "静默",
	"Stop notifications from one or more alerting rules": "停止来自一个或多个警报规则的通知",
	"Alert groups": "警报组",
	"See grouped alerts from an Alertmanager instance": "请参阅 Alertmanager 实例的分组警报",
	"Admin":                            "管理",
	"no admin configuration available": "没有可用的管理配置",
	"At least one Alertmanager must be provided or configured as a datasource that handles alerts to choose this option": "要选择此选项，必须至少提供或配置一个Alertmanager作为处理警报的数据源",
	"Sends HTTP POST request to DingDing": "向钉钉发送HTTP POST请求",
	"Message Type":                        "消息类型",
	"Link":                                "链接",
	"ActionCard":                          "ActionCard",
	"Title":                               "标题",
	"Templated title of the message":      "模板化的消息标题",
	"Custom DingDing message. You can use template variables": "自定义钉钉消息。您可以使用模板变量",
	"Sends notifications to Kafka Rest Proxy":                 "发送通知到Kafka Rest代理",
	"Message":          "消息",
	"Kafka REST Proxy": "Kafka Rest代理",
	"Topic":            "主题",
	"Description":      "描述",
	"Templated description of the Kafka message": "Kafka消息的模板化描述",
	"Details": "详情",
	"Custom details to include with the message. You can use template variables": "要包含在消息中的自定义详细信息。您可以使用模板变量",
	"Sends notifications using Grafana server configured SMTP settings":          "使用Grafana服务器配置的SMTP设置发送通知",
	"Single email":                          "单独邮件",
	"Send a single email to all recipients": "向所有收件人发送一封邮件",
	"Addresses":                             "地址",
	"You can enter multiple email addresses using a \";\" separator":             "您可以使用\";\"分隔符输入多个邮箱地址",
	"Optional message to include with the email. You can use template variables": "可选的邮件包含在电子邮件中。您可以使用模板变量",
	"Subject":                          "主题",
	"Templated subject of the email":   "电子邮件的模板主题",
	"Sends notifications to PagerDuty": "向PagerDuty发送通知",
	"Integration Key":                  "集成 key",
	"Pagerduty Integration Key":        "Pagerduty集成 key",
	"Severity":                         "严重程度",
	"Class":                            "类",
	"The class/type of the event, for example 'ping failure' or 'cpu load'": "事件的类/类型，例如'ping失败'或'cpu负载'",
	"Component": "组件",
	"Component of the source machine that is responsible for the event, for example mysql or eth0": "源计算机中负责事件的组件，例如mysql或eth0",
	"Group": "组",
	"Logical grouping of components of a service, for example 'app-stack'": "服务组件的逻辑分组，例如“应用程序堆栈”",
	"Summary":                                     "总结",
	"You can use templates for summary":           "您可以使用模板进行摘要",
	"Sends notifications to VictorOps":            "向VictorOps发送通知",
	"VictorOps url":                               "VictorOps url",
	"Templated description of the message":        "消息的模板化描述",
	"Sends HTTP POST request to the Pushover API": "发送HTTP POST请求到Pushover API",
	"Templated title to display":                  "要显示的模板标题",
	"API Token":                                   "API Token",
	"Application token":                           "应用程序 Token",
	"User key(s)":                                 "用户密钥",
	"comma-separated list":                        "以逗号分隔",
	"Device(s) (optional)":                        "设备（可选）",
	"comma-separated list; leave empty to send to all devices": "以逗号分隔;保留空白以发送到所有设备",
	"Alerting priority": "报警优先级",
	"OK priority":       "确定优先级",
	"How often (in seconds) the Pushover servers will send the same alerting or OK notification to the user": "Pushover服务器多长时间(以秒为单位)向用户发送相同的警报或OK通知",
	"Retry (Only used for Emergency Priority)":                                                               "重试(仅用于紧急优先级)",
	"minimum 30 seconds": "最少30秒",
	"How many seconds the alerting or OK notification will continue to be retried": "警报或OK通知将持续重试多少秒",
	"Expire (Only used for Emergency Priority)":                                    "过期(仅用于紧急优先级)",
	"maximum 86400 seconds":        "最长86400秒",
	"Alerting sound":               "报警声音",
	"OK sound":                     "确定声音",
	"Sends notifications to Slack": "向Slack发送通知",
	"Recipient":                    "收件人",
	"Specify channel, private group, or IM channel (can be an encoded ID or a name) - required unless you provide a webhook": "指定通道，私人组，或IM通道(可以是编码的ID或名称)-必须的，除非你提供webhook",
	"Token": "Token",
	"Provide a Slack API token (starts with \"xoxb\") - required unless you provide a webhook": "提供一个Slack API令牌(以\"xoxb\"开头)-除非你提供一个webhook",
	"Username":                               "用户名称",
	"Set the username for the bot's message": "为机器人的消息设置用户名",
	"Icon emoji":                             "图标表情符号",
	"Provide an emoji to use as the icon for the bot's message. Overrides the icon URL": "提供一个表情符号作为机器人信息的图标。覆盖图标URL",
	"Icon URL": "图标链接",
	"Provide a URL to an image to use as the icon for the bot's message": "提供一个图像的URL，用作机器人消息的图标",
	"Mention Users": "提及用户",
	"Mention one or more users (comma separated) when notifying in a channel, by ID (you can copy this from the user's Slack profile)": "在一个频道中通知一个或多个用户(以逗号分隔)，通过ID(你可以从用户的Slack配置文件中复制)",
	"Mention Groups": "提及组",
	"Mention one or more groups (comma separated) when notifying in a channel (you can copy this from the group's Slack profile URL)": "在一个频道中通知时提到一个或多个组(以逗号分隔)(你可以从组的Slack配置文件URL中复制这个)",
	"Mention Channel":             "提及通知",
	"Disabled":                    "禁用",
	"Every active channel member": "每个活跃的通道成员",
	"Every channel member":        "每个频道成员",
	"Mention whole channel or just active members when notifying":                                                  "通知时提及整个频道或仅仅是活跃成员",
	"Optionally provide a Slack incoming webhook URL for sending messages, in this case the token isn't necessary": "可选地提供一个Slack传入webhook URL用于发送消息，在这种情况下，令牌是不需要的",
	"Slack incoming webhook URL": "松弛传入的webhook URL",
	"Endpoint URL":               "端点URL",
	"Optionally provide a custom Slack message API endpoint for non-webhook requests, default is https://slack.com/api/chat.postMessage": "可选地为非webhook请求提供自定义Slack消息API端点，默认为https://slack.com/api/chat.postMessage",
	"Templated title of the slack message":      "松弛消息的模板标题",
	"Text Body":                                 "文本主体",
	"Body of the slack message":                 "松弛消息的正文",
	"Sends HTTP POST request to a Sensu Go API": "发送HTTP POST请求到Sensu Go API",
	"Backend URL":                               "后端URL",
	"API Key":                                   "API Key",
	"API key to auth to Sensu Go backend":       "API密钥认证到Sensu Go后端",
	"Proxy entity name":                         "代理实体名称",
	"Check name":                                "检查名称",
	"Handler":                                   "是",
	"Namespace":                                 "命名空间",
	"Sends notifications using Incoming Webhook connector to Microsoft Teams": "使用传入Webhook连接器向Microsoft Teams发送通知",
	"Teams incoming webhook url":                                "团队传入的webhook url",
	"Templated title of the Teams message":                      "团队消息的模板化标题",
	"Section Title":                                             "节标题",
	"Section title for the Teams message. Leave blank for none": "团队消息的部分标题。为none留出空白",
	"Sends notifications to Telegram":                           "向Telegram发送通知",
	"BOT API Token":                                             "BOT API令牌",
	"Telegram BOT API Token":                                    "Telegram BOT API令牌",
	"Chat ID":                                                   "聊天ID",
	"Integer Telegram Chat Identifier":                          "整型电报聊天标识符",
	"Sends HTTP POST request to a URL":                          "发送HTTP POST请求到一个URL",
	"HTTP Method":                                               "HTTP方法",
	"HTTP Basic Authentication - Username":                      "HTTP基本认证-用户名",
	"HTTP Basic Authentication - Password":                      "HTTP基本认证-密码",
	"Authorization Header - Scheme":                             "授权头部-方案",
	"Optionally provide a scheme for the Authorization Request Header. Default is Bearer":                                                "可选地为授权请求报头提供一个方案。违约是不记名者",
	"Authorization Header - Credentials":                                                                                                 "授权头部-凭据",
	"Credentials for the Authorization Request header. Only one of HTTP Basic Authentication or Authorization Request Header can be set": "授权请求标头的凭据。只能设置HTTP基本认证或授权请求标头中的一个",
	"Max Alerts": "Max 警告",
	"Max alerts to include in a notification. Remaining alerts in the same batch will be ignored above this number. 0 means no limit": "在通知中包含的最大警报。同一批中的其余警报超过这个数字将被忽略。0表示没有限制",
	"Custom message. You can use template variables": "自定义消息。您可以使用模板变量",
	"Send alerts generated by Grafana to WeCom":      "发送由Grafana生成的警报到WeCom",
	"Webhook URL":                  "Webhook URL",
	"Required if using GroupRobot": "如果使用GroupRobot必须",
	"Agent ID":                     "代理人 ID",
	"Required if using APIAPP, see https://work.weixin.qq.com/wework_admin/frame#apps create ApiApp": "如果使用APIAPP，请参见https://work.weixin.qq.com/wework_admin/frame#apps create APIAPP",
	"Corp ID": "公司 ID",
	"Required if using APIAPP, see https://work.weixin.qq.com/wework_admin/frame#profile": "如果使用APIAPP，请参见https://work.weixin.qq.com/wework_admin/frame#profile",
	"Secret":                   "选择",
	"Required if using APIAPP": "如果使用APIAPP必须",
	"Custom WeCom message. You can use template variables": "自定义WeCom消息。您可以使用模板变量",
	"To User":                             "用户",
	"touser":                              "用户",
	"Sends notifications to Alertmanager": "向Alertmanager发送通知",
	"Basic Auth User":                     "基本认证用户",
	"Basic Auth Password":                 "基本认证密码",
	"Sends notifications to Discord":      "向Discord发送通知",
	"Message Content":                     "消息内容",
	"Mention a group using @ or a user using <@ID> when notifying in a channel": "提到一个使用@的组或一个使用&lt;@ id &gt;在通道中通知时",
	"Discord webhook URL":            "禁用 webhook URL",
	"Avatar URL":                     "头像链接",
	"Use Discord's Webhook Username": "使用Discord的Webhook用户名",
	"Use the username configured in Discord's webhook settings. Otherwise, the username will be 'Grafana'": "使用在Discord的webhook设置中配置的用户名。否则，用户名将是'Grafana'",
	"Sends notifications to Google Hangouts Chat via webhooks based on the official JSON message format":   "发送通知谷歌Hangouts聊天通过webhooks基于官方JSON消息格式",
	"Google Hangouts Chat incoming webhook url":                                                            "谷歌环聊入webhook url",
	"Send notifications to LINE notify":                                                                    "向LINE notify发送通知",
	"LINE notify token key":                                                                                "LINE通知令牌键",
	"Sends notifications to Threema using Threema Gateway (Basic IDs)":                                     "使用Threema网关向Threema发送通知(基本id)",
	"Gateway ID": "网关 ID",
	"Your 8 character Threema Gateway Basic ID (starting with a *)": "您的8个字符Threema Gateway基本ID(以*开头)",
	"Recipient ID": "收件人 ID",
	"The 8 character Threema ID that should receive the alerts": "应该接收警报的8个字符Threema ID",
	"API Secret":                           "接口密钥",
	"Your Threema Gateway API secret":      "你的Threema网关API秘密",
	"Sends notifications to OpsGenie":      "向OpsGenie发送通知",
	"OpsGenie API Key":                     "OpsGenie API Key",
	"Alert API URL":                        "警报 API UR",
	"Alert text limited to 130 characters": "警告文本限制在130个字符",
	"A description of the incident":        "事件的描述",
	"Auto close incidents":                 "自动关闭事件",
	"Automatically close alerts in OpsGenie once the alert goes back to ok": "一旦警报恢复正常，OpsGenie会自动关闭警报",
	"Override priority": "覆盖优先",
	"Allow the alert priority to be set using the og_priority annotation": "允许使用og_priority注释设置警报优先级",
	"Send notification tags as": "发送通知标签",
	"Tags":                      "标签",
	"Extra Properties":          "额外属性",
	"Tags & Extra Properties":   "标签和额外属性",
	"Send the common annotations to Opsgenie as either Extra Properties, Tags or both": "将常见注释作为额外属性、标签或两者都发送给Opsgenie",
	"Configuration":    "配置",
	"Organization: ":   "组织: ",
	"Service accounts": "劳务项目",
	"Use service accounts to run automated workloads in Grafana":                  "使用服务帐户在Grafana中运行自动化的工作负载",
	"Manage and create API keys that are used to interact with Grafana HTTP APIs": "管理和创建用于与Grafana HTTP API交互的API密钥",
	"API keys": "API 密钥",
	"Manage preferences across an organization": "管理整个组织的首选项",
	"Preferences": "首选项",
	"Extend the Grafana experience with plugins": "使用插件扩展Grafana体验",
	"Plugins": "插件",
	"Teams":   "团队",
	"Groups of users that have common dashboard and permission needs": "具有公共仪表板和权限需求的用户组",
	"Users":                            "用户",
	"Invite and assign roles to users": "为用户邀请和分配角色",
	"Correlations":                     "相关性",
	"Add and configure correlations":   "添加和配置相关性",
	"Data sources":                     "数据源",
	"Add and configure data sources":   "添加和配置数据源",
}

// Translation -
func Translation(english string) string {
	if chinese, ok := translationMetadata[english]; ok {
		if os.Getenv("LANGUAGE") == "en" {
			return english
		}
		return chinese
	}
	return english
}
