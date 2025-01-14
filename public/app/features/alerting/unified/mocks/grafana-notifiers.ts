import { NotifierDTO } from 'app/types';

export const grafanaNotifiersMock: NotifierDTO[] = [
  {
    type: 'teams',
    name: 'Microsoft Teams',
    heading: 'Teams settings',
    description: '使用传入Webhook连接器向Microsoft Teams发送通知',
    info: '',
    options: [
      {
        element: 'input',
        inputType: 'text',
        label: 'URL',
        description: '',
        placeholder: '球队传入的webhook url',
        propertyName: 'url',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
    ],
  },
  {
    type: 'hipchat',
    name: 'HipChat',
    heading: 'HipChat settings',
    description: '向HipChat聊天室发送通知',
    info: '',
    options: [
      {
        element: 'input',
        inputType: 'text',
        label: 'Hip Chat Url',
        description: '',
        placeholder: 'HipChat URL (ex https://grafana.hipchat.com)',
        propertyName: 'url',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'API Key',
        description: '',
        placeholder: 'HipChat API Key',
        propertyName: 'apiKey',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Room ID',
        description: '',
        placeholder: '',
        propertyName: 'roomid',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
    ],
  },
  {
    type: 'webhook',
    name: 'webhook',
    heading: 'Webhook settings',
    description: '发送HTTP POST请求到一个URL',
    info: '',
    options: [
      {
        element: 'input',
        inputType: 'text',
        label: 'Url',
        description: '',
        placeholder: '',
        propertyName: 'url',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'select',
        inputType: '',
        label: 'Http方法',
        description: '',
        placeholder: '',
        propertyName: 'httpMethod',
        selectOptions: [
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
        ],
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Username',
        description: '',
        placeholder: '',
        propertyName: 'username',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'password',
        label: 'Password',
        description: '',
        placeholder: '',
        propertyName: 'password',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: true,
        dependsOn: '',
      },
    ],
  },
  {
    type: 'prometheus-alertmanager',
    name: 'Prometheus Alertmanager',
    heading: 'Alertmanager settings',
    description: '发送警报到 Prometheus 警报管理器',
    info: '',
    options: [
      {
        element: 'input',
        inputType: 'text',
        label: 'Url',
        description:
          '如Alertmanager文档所述，此处不指定负载均衡器。输入所有以逗号分隔的Alertmanager url。',
        placeholder: 'http://localhost:9093',
        propertyName: 'url',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Basic Auth User',
        description: '',
        placeholder: '',
        propertyName: 'basicAuthUser',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'password',
        label: 'Basic Auth Password',
        description: '',
        placeholder: '',
        propertyName: 'basicAuthPassword',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: true,
        dependsOn: '',
      },
    ],
  },
  {
    type: 'email',
    name: 'Email',
    heading: 'Email settings',
    description: '使用Grafana服务器配置的SMTP设置发送通知',
    info: '',
    options: [
      {
        element: 'checkbox',
        inputType: '',
        label: 'Single email',
        description: '向所有收件人发送一封邮件',
        placeholder: '',
        propertyName: 'singleEmail',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'textarea',
        inputType: '',
        label: '地址',
        description: '可以使用“;”分隔符输入多个邮箱地址',
        placeholder: '',
        propertyName: 'addresses',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
    ],
  },
  {
    type: 'slack',
    name: 'Slack',
    heading: 'Slack settings',
    description: '向Slack发送通知',
    info: '',
    options: [
      {
        element: 'input',
        inputType: 'text',
        label: 'Recipient',
        description:
          '指定频道或用户，使用#channel-name， @username(必须全小写，不能有空格)，或者用户/频道Slack ID -除非你提供webhook',
        placeholder: '',
        propertyName: 'recipient',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: false,
        dependsOn: 'secureSettings.url',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Token',
        description: '提供一个Slack API令牌(以“xoxb”开头)——除非你提供一个webhook，否则这是必需的',
        placeholder: '',
        propertyName: 'token',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: true,
        dependsOn: 'secureSettings.url',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Username',
        description: "为机器人的消息设置用户名",
        placeholder: '',
        propertyName: 'username',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Icon emoji',
        description: "提供一个表情符号作为机器人信息的图标。覆盖图标URL。",
        placeholder: '',
        propertyName: 'iconEmoji',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Icon URL',
        description: "提供一个图像的URL，用作机器人消息的图标",
        placeholder: '',
        propertyName: 'iconUrl',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: '提到的用户',
        description:
          "在一个频道中通知一个或多个用户(以逗号分隔)，通过ID(你可以从用户的Slack配置文件中复制)",
        placeholder: '',
        propertyName: 'mentionUsers',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Mention Groups',
        description:
          "在一个频道中通知时提到一个或多个组(以逗号分隔)(你可以从组的Slack配置文件URL中复制这个)",
        placeholder: '',
        propertyName: 'mentionGroups',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'select',
        inputType: '',
        label: 'Mention Channel',
        description: '通知时提及整个频道或仅仅是活跃成员',
        placeholder: '',
        propertyName: 'mentionChannel',
        selectOptions: [
          { value: '', label: '禁用' },
          { value: 'here', label: '每个活跃的通道成员' },
          { value: 'channel', label: '每个频道成员' },
        ],
        showWhen: { field: '', is: '' },
        required: false,
        validationRule: '',
        secure: false,
        dependsOn: '',
      },
      {
        element: 'input',
        inputType: 'text',
        label: 'Webhook URL',
        description:
          "可选地提供一个Slack传入webhook URL用于发送消息，在这种情况下，令牌是不需要的",
        placeholder: '松弛传入的webhook URL',
        propertyName: 'url',
        selectOptions: null,
        showWhen: { field: '', is: '' },
        required: true,
        validationRule: '',
        secure: true,
        dependsOn: 'token',
      },
    ],
  },
];
