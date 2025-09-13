// CDN 工作流相关类型定义

export interface CDNNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
    status?: 'idle' | 'waiting' | 'running' | 'success' | 'error' | 'warning' | 'completed';
    metrics?: NodeMetrics;
  };
}

export interface CDNEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  className?: string;
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
  data?: {
    bandwidth?: number;
    latency?: number;
    outputType?: OutputType;
  };
}

export enum OutputType {
  SUCCESS = 'success',
  WARNING = 'warning', 
  ERROR = 'error',
  DATA = 'data',
  CACHE_HIT = 'cache_hit',
  CACHE_MISS = 'cache_miss',
  BLOCKED = 'blocked',
  PASSED = 'passed'
}

export interface NodeOutput {
  id: string;
  label: string;
  type: OutputType;
  color: string;
  description: string;
}

export interface NodeMetrics {
  requestCount: number;
  hitRate: number;
  bandwidth: number;
  latency: number;
  errorRate: number;
}

export interface WorkflowConfig {
  id: string;
  nodes: CDNNode[];
  edges: CDNEdge[];
  name: string;
  description?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

// CDN 供应商枚举
export enum CDNProvider {
  ALIBABA = 'alibaba',
  AWS = 'aws',
  CLOUDFLARE = 'cloudflare',
  GENERIC = 'generic', // 通用组件
}

// CDN 相关的节点类型
export enum CDNNodeType {
  // 阿里云 CDN 组件
  ALIBABA_CDN = 'alibaba-cdn',
  ALIBABA_OSS = 'alibaba-oss',
  ALIBABA_WAF = 'alibaba-waf',
  ALIBABA_DCDN = 'alibaba-dcdn',
  ALIBABA_IMAGE_OPTIMIZATION = 'alibaba-image-optimization',
  
  // AWS CloudFront 组件
  AWS_CLOUDFRONT = 'aws-cloudfront',
  AWS_S3 = 'aws-s3',
  AWS_WAF = 'aws-waf',
  AWS_SHIELD = 'aws-shield',
  AWS_LAMBDA_EDGE = 'aws-lambda-edge',
  
  // Cloudflare 组件
  CLOUDFLARE_CDN = 'cloudflare-cdn',
  CLOUDFLARE_WORKERS = 'cloudflare-workers',
  CLOUDFLARE_WAF = 'cloudflare-waf',
  CLOUDFLARE_IMAGES = 'cloudflare-images',
  CLOUDFLARE_ANALYTICS = 'cloudflare-analytics',
  
  // 通用组件
  ORIGIN_SERVER = 'origin-server',
  LOAD_BALANCER = 'load-balancer',
  EDGE_CACHE = 'edge-cache',
  REGIONAL_CACHE = 'regional-cache',
  BROWSER_CACHE = 'browser-cache',
  IMAGE_OPTIMIZER = 'image-optimizer',
  MINIFIER = 'minifier',
  GZIP_COMPRESSOR = 'gzip-compressor',
  BROTLI_COMPRESSOR = 'brotli-compressor',
  WAF = 'waf',
  DDOS_PROTECTION = 'ddos-protection',
  SSL_TERMINATION = 'ssl-termination',
  ANALYTICS = 'analytics',
  MONITORING = 'monitoring',
  ALERTING = 'alerting',
  GEO_ROUTING = 'geo-routing',
  SMART_ROUTING = 'smart-routing',
  FAILOVER = 'failover',
  END_USER = 'end-user'
}

export interface NodeTypeConfig {
  type: CDNNodeType;
  label: string;
  description: string;
  provider: CDNProvider;
  category: 'source' | 'cache' | 'optimization' | 'security' | 'monitoring' | 'routing' | 'destination';
  icon: string;
  color: string;
  defaultConfig: Record<string, any>;
  configSchema: ConfigField[];
  outputs: NodeOutput[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'range';
  required?: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  description?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  logs: ExecutionLog[];
  metrics: WorkflowMetrics;
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  nodeId?: string;
}

export interface WorkflowMetrics {
  totalRequests: number;
  avgLatency: number;
  hitRate: number;
  bandwidth: number;
  errorRate: number;
  uptime: number;
}

export enum PortPosition {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left'
}

export enum LabelPosition {
  TOP = 'top',
  BOTTOM = 'bottom'
}

export interface GlobalSettings {
  outputPortPosition: PortPosition;
  inputPortPosition: PortPosition;
  showPortLabels: boolean;
  portSize: 'small' | 'medium' | 'large';
  labelPosition: LabelPosition;
  labelFontSize: 'xxxxxs' | 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 'sm' | 'base' | 'lg';
  theme: 'light' | 'dark';
  gridVisible: boolean;
  snapToGrid: boolean;
}
