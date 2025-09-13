import { NodeTypeConfig, CDNNodeType, OutputType, CDNProvider } from '../types';

export const NODE_TYPE_CONFIGS: Record<CDNNodeType, NodeTypeConfig> = {
  // 阿里云 CDN 组件
  [CDNNodeType.ALIBABA_CDN]: {
    type: CDNNodeType.ALIBABA_CDN,
    label: '阿里云 CDN',
    description: '阿里云内容分发网络，提供全球加速服务',
    provider: CDNProvider.ALIBABA,
    category: 'cache',
    icon: 'zap',
    color: '#ff6900',
    defaultConfig: {
      domain: '',
      region: 'global',
      httpsEnabled: true,
      cacheRules: [],
    },
    configSchema: [
      { key: 'domain', label: '加速域名', type: 'text', required: true },
      { key: 'region', label: '加速区域', type: 'select', options: [
        { label: '全球', value: 'global' },
        { label: '中国大陆', value: 'china' },
        { label: '海外', value: 'overseas' }
      ], defaultValue: 'global' },
      { key: 'httpsEnabled', label: '启用 HTTPS', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: 'CDN 加速成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'CDN 服务错误' }
    ],
  },

  [CDNNodeType.ALIBABA_OSS]: {
    type: CDNNodeType.ALIBABA_OSS,
    label: '阿里云 OSS',
    description: '阿里云对象存储服务，提供海量数据存储',
    provider: CDNProvider.ALIBABA,
    category: 'source',
    icon: 'server',
    color: '#ff6900',
    defaultConfig: {
      bucket: '',
      region: 'oss-cn-hangzhou',
      accessKey: '',
      secretKey: '',
    },
    configSchema: [
      { key: 'bucket', label: '存储桶名称', type: 'text', required: true },
      { key: 'region', label: '区域', type: 'select', options: [
        { label: '华东1(杭州)', value: 'oss-cn-hangzhou' },
        { label: '华东2(上海)', value: 'oss-cn-shanghai' },
        { label: '华北1(青岛)', value: 'oss-cn-qingdao' },
        { label: '华北2(北京)', value: 'oss-cn-beijing' }
      ], defaultValue: 'oss-cn-hangzhou' },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: 'OSS 访问成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'OSS 访问失败' }
    ],
  },

  // AWS CloudFront 组件
  [CDNNodeType.AWS_CLOUDFRONT]: {
    type: CDNNodeType.AWS_CLOUDFRONT,
    label: 'AWS CloudFront',
    description: 'Amazon CloudFront 全球内容分发网络',
    provider: CDNProvider.AWS,
    category: 'cache',
    icon: 'zap',
    color: '#ff9900',
    defaultConfig: {
      distributionId: '',
      region: 'us-east-1',
      httpsEnabled: true,
      priceClass: 'PriceClass_100',
    },
    configSchema: [
      { key: 'distributionId', label: '分发ID', type: 'text', required: true },
      { key: 'region', label: '区域', type: 'select', options: [
        { label: '美国东部', value: 'us-east-1' },
        { label: '美国西部', value: 'us-west-2' },
        { label: '欧洲', value: 'eu-west-1' },
        { label: '亚太', value: 'ap-southeast-1' }
      ], defaultValue: 'us-east-1' },
      { key: 'httpsEnabled', label: '启用 HTTPS', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: 'CloudFront 加速成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'CloudFront 服务错误' }
    ],
  },

  [CDNNodeType.AWS_S3]: {
    type: CDNNodeType.AWS_S3,
    label: 'AWS S3',
    description: 'Amazon Simple Storage Service 对象存储',
    provider: CDNProvider.AWS,
    category: 'source',
    icon: 'server',
    color: '#ff9900',
    defaultConfig: {
      bucket: '',
      region: 'us-east-1',
      accessKey: '',
      secretKey: '',
    },
    configSchema: [
      { key: 'bucket', label: '存储桶名称', type: 'text', required: true },
      { key: 'region', label: '区域', type: 'select', options: [
        { label: '美国东部', value: 'us-east-1' },
        { label: '美国西部', value: 'us-west-2' },
        { label: '欧洲', value: 'eu-west-1' },
        { label: '亚太', value: 'ap-southeast-1' }
      ], defaultValue: 'us-east-1' },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: 'S3 访问成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'S3 访问失败' }
    ],
  },

  // Cloudflare 组件
  [CDNNodeType.CLOUDFLARE_CDN]: {
    type: CDNNodeType.CLOUDFLARE_CDN,
    label: 'Cloudflare CDN',
    description: 'Cloudflare 全球内容分发网络',
    provider: CDNProvider.CLOUDFLARE,
    category: 'cache',
    icon: 'zap',
    color: '#f38020',
    defaultConfig: {
      zoneId: '',
      domain: '',
      sslMode: 'full',
      cacheLevel: 'aggressive',
    },
    configSchema: [
      { key: 'zoneId', label: '区域ID', type: 'text', required: true },
      { key: 'domain', label: '域名', type: 'text', required: true },
      { key: 'sslMode', label: 'SSL模式', type: 'select', options: [
        { label: '完全', value: 'full' },
        { label: '灵活', value: 'flexible' },
        { label: '严格', value: 'strict' }
      ], defaultValue: 'full' },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: 'Cloudflare 加速成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'Cloudflare 服务错误' }
    ],
  },

  [CDNNodeType.CLOUDFLARE_WORKERS]: {
    type: CDNNodeType.CLOUDFLARE_WORKERS,
    label: 'Cloudflare Workers',
    description: 'Cloudflare 边缘计算服务',
    provider: CDNProvider.CLOUDFLARE,
    category: 'optimization',
    icon: 'cpu',
    color: '#f38020',
    defaultConfig: {
      script: '',
      route: '',
      environment: 'production',
    },
    configSchema: [
      { key: 'script', label: '脚本代码', type: 'text', required: true },
      { key: 'route', label: '路由规则', type: 'text', required: true },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: 'Workers 执行成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'Workers 执行失败' }
    ],
  },

  [CDNNodeType.ORIGIN_SERVER]: {
    type: CDNNodeType.ORIGIN_SERVER,
    label: '源站服务器',
    description: '原始内容服务器，提供网站的原始文件和数据',
    provider: CDNProvider.GENERIC,
    category: 'source',
    icon: 'server',
    color: '#10b981',
    defaultConfig: {
      url: '',
      protocol: 'https',
      port: 443,
      healthCheck: true,
      timeout: 30000,
    },
    configSchema: [
      { key: 'url', label: '服务器地址', type: 'text', required: true },
      { key: 'protocol', label: '协议', type: 'select', options: [
        { label: 'HTTPS', value: 'https' },
        { label: 'HTTP', value: 'http' }
      ], defaultValue: 'https' },
      { key: 'port', label: '端口', type: 'number', min: 1, max: 65535, defaultValue: 443 },
      { key: 'healthCheck', label: '健康检查', type: 'boolean', defaultValue: true },
      { key: 'timeout', label: '超时时间(ms)', type: 'number', min: 1000, max: 60000, defaultValue: 30000 },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: '成功获取内容' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: '服务器错误或超时' }
    ],
  },

  [CDNNodeType.LOAD_BALANCER]: {
    type: CDNNodeType.LOAD_BALANCER,
    label: '负载均衡器',
    description: '分发请求到多个服务器，提高可用性和性能',
    provider: CDNProvider.GENERIC,
    category: 'routing',
    icon: 'shuffle',
    color: '#3b82f6',
    defaultConfig: {
      algorithm: 'round-robin',
      healthCheck: true,
      failoverEnabled: true,
      stickySession: false,
    },
    configSchema: [
      { key: 'algorithm', label: '负载均衡算法', type: 'select', options: [
        { label: '轮询', value: 'round-robin' },
        { label: '最少连接', value: 'least-connections' },
        { label: 'IP 哈希', value: 'ip-hash' },
        { label: '权重轮询', value: 'weighted-round-robin' }
      ], defaultValue: 'round-robin' },
      { key: 'healthCheck', label: '健康检查', type: 'boolean', defaultValue: true },
      { key: 'failoverEnabled', label: '启用故障转移', type: 'boolean', defaultValue: true },
      { key: 'stickySession', label: '会话保持', type: 'boolean', defaultValue: false },
    ],
    outputs: [
      { id: 'success', label: '成功', type: OutputType.SUCCESS, color: '#10b981', description: '请求成功分发' },
      { id: 'overload', label: '过载', type: OutputType.WARNING, color: '#f59e0b', description: '负载过高警告' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: '所有服务器不可用' }
    ],
  },

  [CDNNodeType.EDGE_CACHE]: {
    type: CDNNodeType.EDGE_CACHE,
    label: '边缘缓存',
    description: '部署在用户附近的缓存服务器，提供最快的内容访问',
    provider: CDNProvider.GENERIC,
    category: 'cache',
    icon: 'zap',
    color: '#f59e0b',
    defaultConfig: {
      ttl: 3600,
      maxSize: '10GB',
      cacheRules: [],
      purgeEnabled: true,
    },
    configSchema: [
      { key: 'ttl', label: '缓存时间(秒)', type: 'number', min: 60, max: 86400, defaultValue: 3600 },
      { key: 'maxSize', label: '最大缓存大小', type: 'text', defaultValue: '10GB' },
      { key: 'purgeEnabled', label: '启用缓存清除', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'hit', label: '命中', type: OutputType.CACHE_HIT, color: '#10b981', description: '缓存命中' },
      { id: 'miss', label: '未命中', type: OutputType.CACHE_MISS, color: '#f59e0b', description: '缓存未命中' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: '缓存服务错误' }
    ],
  },

  [CDNNodeType.REGIONAL_CACHE]: {
    type: CDNNodeType.REGIONAL_CACHE,
    label: '区域缓存',
    description: '区域级缓存服务器，为多个边缘节点提供内容',
    category: 'cache',
    icon: 'globe',
    color: '#f59e0b',
    defaultConfig: {
      ttl: 7200,
      maxSize: '100GB',
      regions: [],
    },
    configSchema: [
      { key: 'ttl', label: '缓存时间(秒)', type: 'number', min: 300, max: 604800, defaultValue: 7200 },
      { key: 'maxSize', label: '最大缓存大小', type: 'text', defaultValue: '100GB' },
    ],
    outputs: [
      { id: 'hit', label: '命中', type: OutputType.CACHE_HIT, color: '#10b981', description: '区域缓存命中' },
      { id: 'miss', label: '未命中', type: OutputType.CACHE_MISS, color: '#f59e0b', description: '区域缓存未命中' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: '区域缓存错误' }
    ],
  },

  [CDNNodeType.BROWSER_CACHE]: {
    type: CDNNodeType.BROWSER_CACHE,
    label: '浏览器缓存',
    description: '设置浏览器缓存策略，减少重复请求',
    category: 'cache',
    icon: 'monitor',
    color: '#f59e0b',
    defaultConfig: {
      maxAge: 86400,
      noCache: false,
      mustRevalidate: false,
    },
    configSchema: [
      { key: 'maxAge', label: '最大缓存时间(秒)', type: 'number', min: 0, max: 31536000, defaultValue: 86400 },
      { key: 'noCache', label: '禁用缓存', type: 'boolean', defaultValue: false },
      { key: 'mustRevalidate', label: '强制重新验证', type: 'boolean', defaultValue: false },
    ],
    outputs: [
      { id: 'cached', label: '已缓存', type: OutputType.SUCCESS, color: '#10b981', description: '浏览器缓存生效' },
      { id: 'refresh', label: '刷新', type: OutputType.DATA, color: '#3b82f6', description: '需要刷新内容' }
    ],
  },

  [CDNNodeType.IMAGE_OPTIMIZER]: {
    type: CDNNodeType.IMAGE_OPTIMIZER,
    label: '图片优化器',
    description: '自动优化图片格式、大小和质量',
    provider: CDNProvider.GENERIC,
    category: 'optimization',
    icon: 'image',
    color: '#8b5cf6',
    defaultConfig: {
      quality: 80,
      format: 'auto',
      webpEnabled: true,
      avifEnabled: false,
      progressive: true,
    },
    configSchema: [
      { key: 'quality', label: '图片质量', type: 'range', min: 10, max: 100, defaultValue: 80 },
      { key: 'format', label: '输出格式', type: 'select', options: [
        { label: '自动', value: 'auto' },
        { label: 'WebP', value: 'webp' },
        { label: 'AVIF', value: 'avif' },
        { label: 'JPEG', value: 'jpeg' },
        { label: 'PNG', value: 'png' }
      ], defaultValue: 'auto' },
      { key: 'webpEnabled', label: '启用 WebP', type: 'boolean', defaultValue: true },
      { key: 'avifEnabled', label: '启用 AVIF', type: 'boolean', defaultValue: false },
      { key: 'progressive', label: '渐进式加载', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'optimized', label: '已优化', type: OutputType.SUCCESS, color: '#10b981', description: '图片优化成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: '图片处理失败' }
    ],
  },

  [CDNNodeType.MINIFIER]: {
    type: CDNNodeType.MINIFIER,
    label: '代码压缩器',
    description: '压缩 HTML、CSS、JavaScript 文件大小',
    category: 'optimization',
    icon: 'minimize-2',
    color: '#8b5cf6',
    defaultConfig: {
      html: true,
      css: true,
      javascript: true,
      removeComments: true,
      removeWhitespace: true,
    },
    configSchema: [
      { key: 'html', label: '压缩 HTML', type: 'boolean', defaultValue: true },
      { key: 'css', label: '压缩 CSS', type: 'boolean', defaultValue: true },
      { key: 'javascript', label: '压缩 JavaScript', type: 'boolean', defaultValue: true },
      { key: 'removeComments', label: '移除注释', type: 'boolean', defaultValue: true },
      { key: 'removeWhitespace', label: '移除空白字符', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'minified', label: '已压缩', type: OutputType.SUCCESS, color: '#10b981', description: '代码压缩成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: '压缩处理失败' }
    ],
  },

  [CDNNodeType.GZIP_COMPRESSOR]: {
    type: CDNNodeType.GZIP_COMPRESSOR,
    label: 'Gzip 压缩器',
    description: '使用 Gzip 算法压缩内容，减少传输大小',
    category: 'optimization',
    icon: 'archive',
    color: '#8b5cf6',
    defaultConfig: {
      level: 6,
      minSize: 1024,
      types: ['text/html', 'text/css', 'application/javascript', 'application/json'],
    },
    configSchema: [
      { key: 'level', label: '压缩级别', type: 'range', min: 1, max: 9, defaultValue: 6 },
      { key: 'minSize', label: '最小压缩大小(字节)', type: 'number', min: 0, defaultValue: 1024 },
    ],
    outputs: [
      { id: 'compressed', label: '已压缩', type: OutputType.SUCCESS, color: '#10b981', description: 'Gzip压缩成功' },
      { id: 'skipped', label: '跳过', type: OutputType.DATA, color: '#6b7280', description: '文件过小跳过压缩' }
    ],
  },

  [CDNNodeType.BROTLI_COMPRESSOR]: {
    type: CDNNodeType.BROTLI_COMPRESSOR,
    label: 'Brotli 压缩器',
    description: '使用 Brotli 算法压缩内容，比 Gzip 更高效',
    category: 'optimization',
    icon: 'package',
    color: '#8b5cf6',
    defaultConfig: {
      quality: 6,
      minSize: 1024,
      types: ['text/html', 'text/css', 'application/javascript', 'application/json'],
    },
    configSchema: [
      { key: 'quality', label: '压缩质量', type: 'range', min: 0, max: 11, defaultValue: 6 },
      { key: 'minSize', label: '最小压缩大小(字节)', type: 'number', min: 0, defaultValue: 1024 },
    ],
    outputs: [
      { id: 'compressed', label: '已压缩', type: OutputType.SUCCESS, color: '#10b981', description: 'Brotli压缩成功' },
      { id: 'skipped', label: '跳过', type: OutputType.DATA, color: '#6b7280', description: '文件过小跳过压缩' }
    ],
  },

  [CDNNodeType.WAF]: {
    type: CDNNodeType.WAF,
    label: 'Web 应用防火墙',
    description: '保护网站免受恶意攻击和威胁',
    provider: CDNProvider.GENERIC,
    category: 'security',
    icon: 'shield',
    color: '#ef4444',
    defaultConfig: {
      sqlInjection: true,
      xss: true,
      rateLimiting: true,
      geoBlocking: false,
      customRules: [],
    },
    configSchema: [
      { key: 'sqlInjection', label: 'SQL 注入防护', type: 'boolean', defaultValue: true },
      { key: 'xss', label: 'XSS 攻击防护', type: 'boolean', defaultValue: true },
      { key: 'rateLimiting', label: '速率限制', type: 'boolean', defaultValue: true },
      { key: 'geoBlocking', label: '地理位置阻断', type: 'boolean', defaultValue: false },
    ],
    outputs: [
      { id: 'passed', label: '通过', type: OutputType.PASSED, color: '#10b981', description: '安全检查通过' },
      { id: 'blocked', label: '阻断', type: OutputType.BLOCKED, color: '#ef4444', description: '检测到威胁并阻断' },
      { id: 'warning', label: '警告', type: OutputType.WARNING, color: '#f59e0b', description: '可疑请求警告' }
    ],
  },

  [CDNNodeType.DDOS_PROTECTION]: {
    type: CDNNodeType.DDOS_PROTECTION,
    label: 'DDoS 防护',
    description: '防御分布式拒绝服务攻击',
    category: 'security',
    icon: 'shield-check',
    color: '#ef4444',
    defaultConfig: {
      threshold: 1000,
      challengeEnabled: true,
      autoBlocking: true,
    },
    configSchema: [
      { key: 'threshold', label: '触发阈值(请求/秒)', type: 'number', min: 100, defaultValue: 1000 },
      { key: 'challengeEnabled', label: '启用质询', type: 'boolean', defaultValue: true },
      { key: 'autoBlocking', label: '自动阻断', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'passed', label: '通过', type: OutputType.PASSED, color: '#10b981', description: '正常流量' },
      { id: 'blocked', label: '阻断', type: OutputType.BLOCKED, color: '#ef4444', description: 'DDoS攻击阻断' },
      { id: 'challenge', label: '质询', type: OutputType.WARNING, color: '#f59e0b', description: '需要人机验证' }
    ],
  },

  [CDNNodeType.SSL_TERMINATION]: {
    type: CDNNodeType.SSL_TERMINATION,
    label: 'SSL 终止',
    description: '处理 SSL/TLS 加密和解密',
    category: 'security',
    icon: 'lock',
    color: '#ef4444',
    defaultConfig: {
      tlsVersion: 'TLS 1.3',
      hsts: true,
      ocspStapling: true,
    },
    configSchema: [
      { key: 'tlsVersion', label: 'TLS 版本', type: 'select', options: [
        { label: 'TLS 1.3', value: 'TLS 1.3' },
        { label: 'TLS 1.2', value: 'TLS 1.2' },
        { label: 'TLS 1.1', value: 'TLS 1.1' }
      ], defaultValue: 'TLS 1.3' },
      { key: 'hsts', label: '启用 HSTS', type: 'boolean', defaultValue: true },
      { key: 'ocspStapling', label: 'OCSP 装订', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'secured', label: '已加密', type: OutputType.SUCCESS, color: '#10b981', description: 'SSL加密成功' },
      { id: 'error', label: '错误', type: OutputType.ERROR, color: '#ef4444', description: 'SSL证书错误' }
    ],
  },

  [CDNNodeType.ANALYTICS]: {
    type: CDNNodeType.ANALYTICS,
    label: '数据分析',
    description: '收集和分析网站访问数据',
    provider: CDNProvider.GENERIC,
    category: 'monitoring',
    icon: 'bar-chart',
    color: '#06b6d4',
    defaultConfig: {
      realTime: true,
      sampling: 100,
      retention: 90,
    },
    configSchema: [
      { key: 'realTime', label: '实时分析', type: 'boolean', defaultValue: true },
      { key: 'sampling', label: '采样率(%)', type: 'range', min: 1, max: 100, defaultValue: 100 },
      { key: 'retention', label: '数据保留天数', type: 'number', min: 1, max: 365, defaultValue: 90 },
    ],
    outputs: [
      { id: 'data', label: '数据', type: OutputType.DATA, color: '#3b82f6', description: '分析数据输出' }
    ],
  },

  [CDNNodeType.MONITORING]: {
    type: CDNNodeType.MONITORING,
    label: '性能监控',
    description: '监控系统性能和可用性',
    category: 'monitoring',
    icon: 'activity',
    color: '#06b6d4',
    defaultConfig: {
      interval: 60,
      uptime: true,
      performance: true,
      alerts: true,
    },
    configSchema: [
      { key: 'interval', label: '监控间隔(秒)', type: 'number', min: 10, max: 3600, defaultValue: 60 },
      { key: 'uptime', label: '可用性监控', type: 'boolean', defaultValue: true },
      { key: 'performance', label: '性能监控', type: 'boolean', defaultValue: true },
      { key: 'alerts', label: '启用告警', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'metrics', label: '指标', type: OutputType.DATA, color: '#3b82f6', description: '性能指标数据' },
      { id: 'alert', label: '告警', type: OutputType.WARNING, color: '#f59e0b', description: '性能异常告警' }
    ],
  },

  [CDNNodeType.ALERTING]: {
    type: CDNNodeType.ALERTING,
    label: '告警系统',
    description: '当系统出现问题时发送告警通知',
    category: 'monitoring',
    icon: 'bell',
    color: '#06b6d4',
    defaultConfig: {
      email: true,
      slack: false,
      webhook: false,
      threshold: 95,
    },
    configSchema: [
      { key: 'email', label: '邮件通知', type: 'boolean', defaultValue: true },
      { key: 'slack', label: 'Slack 通知', type: 'boolean', defaultValue: false },
      { key: 'webhook', label: 'Webhook 通知', type: 'boolean', defaultValue: false },
      { key: 'threshold', label: '告警阈值(%)', type: 'range', min: 50, max: 100, defaultValue: 95 },
    ],
    outputs: [
      { id: 'sent', label: '已发送', type: OutputType.SUCCESS, color: '#10b981', description: '告警通知已发送' },
      { id: 'failed', label: '失败', type: OutputType.ERROR, color: '#ef4444', description: '通知发送失败' }
    ],
  },

  [CDNNodeType.GEO_ROUTING]: {
    type: CDNNodeType.GEO_ROUTING,
    label: '地理路由',
    description: '根据用户地理位置路由到最近的服务器',
    provider: CDNProvider.GENERIC,
    category: 'routing',
    icon: 'map-pin',
    color: '#3b82f6',
    defaultConfig: {
      regions: ['us-east', 'us-west', 'eu-west', 'ap-southeast'],
      fallback: 'us-east',
      latencyBased: true,
    },
    configSchema: [
      { key: 'fallback', label: '默认区域', type: 'select', options: [
        { label: '美国东部', value: 'us-east' },
        { label: '美国西部', value: 'us-west' },
        { label: '欧洲西部', value: 'eu-west' },
        { label: '亚太东南', value: 'ap-southeast' }
      ], defaultValue: 'us-east' },
      { key: 'latencyBased', label: '基于延迟路由', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'routed', label: '已路由', type: OutputType.SUCCESS, color: '#10b981', description: '成功路由到目标区域' },
      { id: 'fallback', label: '备用', type: OutputType.WARNING, color: '#f59e0b', description: '使用备用路由' }
    ],
  },

  [CDNNodeType.SMART_ROUTING]: {
    type: CDNNodeType.SMART_ROUTING,
    label: '智能路由',
    description: '基于实时网络状况的智能路由选择',
    category: 'routing',
    icon: 'route',
    color: '#3b82f6',
    defaultConfig: {
      algorithm: 'latency',
      healthCheck: true,
      adaptiveRouting: true,
    },
    configSchema: [
      { key: 'algorithm', label: '路由算法', type: 'select', options: [
        { label: '延迟优先', value: 'latency' },
        { label: '带宽优先', value: 'bandwidth' },
        { label: '综合评分', value: 'combined' }
      ], defaultValue: 'latency' },
      { key: 'healthCheck', label: '健康检查', type: 'boolean', defaultValue: true },
      { key: 'adaptiveRouting', label: '自适应路由', type: 'boolean', defaultValue: true },
    ],
    outputs: [
      { id: 'optimized', label: '已优化', type: OutputType.SUCCESS, color: '#10b981', description: '智能路由优化' },
      { id: 'degraded', label: '降级', type: OutputType.WARNING, color: '#f59e0b', description: '性能降级模式' }
    ],
  },

  [CDNNodeType.FAILOVER]: {
    type: CDNNodeType.FAILOVER,
    label: '故障转移',
    description: '当主服务器故障时自动切换到备用服务器',
    category: 'routing',
    icon: 'repeat',
    color: '#3b82f6',
    defaultConfig: {
      timeout: 5000,
      retries: 3,
      backupServers: [],
    },
    configSchema: [
      { key: 'timeout', label: '超时时间(ms)', type: 'number', min: 1000, max: 30000, defaultValue: 5000 },
      { key: 'retries', label: '重试次数', type: 'number', min: 1, max: 10, defaultValue: 3 },
    ],
    outputs: [
      { id: 'primary', label: '主路由', type: OutputType.SUCCESS, color: '#10b981', description: '主服务器正常' },
      { id: 'failover', label: '故障转移', type: OutputType.WARNING, color: '#f59e0b', description: '切换到备用服务器' }
    ],
  },

  [CDNNodeType.END_USER]: {
    type: CDNNodeType.END_USER,
    label: '终端用户',
    description: '最终接收内容的用户',
    provider: CDNProvider.GENERIC,
    category: 'destination',
    icon: 'user',
    color: '#64748b',
    defaultConfig: {},
    configSchema: [],
    outputs: [],
  },
};
