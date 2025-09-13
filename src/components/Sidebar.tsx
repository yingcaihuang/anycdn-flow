import React, { useState } from 'react';
import { 
  Server, 
  Shuffle, 
  Zap, 
  Globe, 
  Monitor, 
  Image, 
  Minimize2, 
  Archive, 
  Package, 
  Shield, 
  ShieldCheck, 
  Lock, 
  BarChart, 
  Activity, 
  Bell, 
  MapPin, 
  Navigation, 
  Repeat, 
  User,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { NODE_TYPE_CONFIGS } from '../config/nodeTypes';
import { CDNNodeType, CDNProvider } from '../types';

const iconMap = {
  server: Server,
  shuffle: Shuffle,
  zap: Zap,
  globe: Globe,
  monitor: Monitor,
  image: Image,
  'minimize-2': Minimize2,
  archive: Archive,
  package: Package,
  shield: Shield,
  'shield-check': ShieldCheck,
  lock: Lock,
  'bar-chart': BarChart,
  activity: Activity,
  bell: Bell,
  'map-pin': MapPin,
  route: Navigation,
  repeat: Repeat,
  user: User,
  cpu: Activity, // 使用 Activity 图标代替 cpu
};

const categoryLabels = {
  source: '数据源',
  cache: '缓存层',
  optimization: '优化处理',
  security: '安全防护',
  monitoring: '监控分析',
  routing: '路由调度',
  destination: '目标用户',
};

const categoryColors = {
  source: 'bg-green-50 border-green-200',
  cache: 'bg-yellow-50 border-yellow-200',
  optimization: 'bg-purple-50 border-purple-200',
  security: 'bg-red-50 border-red-200',
  monitoring: 'bg-cyan-50 border-cyan-200',
  routing: 'bg-blue-50 border-blue-200',
  destination: 'bg-gray-50 border-gray-200',
};

const providerLabels = {
  [CDNProvider.ALIBABA]: '阿里云',
  [CDNProvider.AWS]: 'AWS',
  [CDNProvider.CLOUDFLARE]: 'Cloudflare',
  [CDNProvider.GENERIC]: '通用组件',
};

const providerColors = {
  [CDNProvider.ALIBABA]: 'bg-orange-50 border-orange-200',
  [CDNProvider.AWS]: 'bg-yellow-50 border-yellow-200',
  [CDNProvider.CLOUDFLARE]: 'bg-orange-50 border-orange-200',
  [CDNProvider.GENERIC]: 'bg-gray-50 border-gray-200',
};

const Sidebar: React.FC = () => {
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set([CDNProvider.ALIBABA, CDNProvider.AWS, CDNProvider.CLOUDFLARE])
  );

  const toggleProvider = (provider: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(provider)) {
      newExpanded.delete(provider);
    } else {
      newExpanded.add(provider);
    }
    setExpandedProviders(newExpanded);
  };

  const handleDragStart = (event: React.DragEvent, nodeType: CDNNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // 按供应商分组节点类型
  const nodesByProvider = Object.values(NODE_TYPE_CONFIGS).reduce((acc, config) => {
    if (!acc[config.provider]) {
      acc[config.provider] = [];
    }
    acc[config.provider].push(config);
    return acc;
  }, {} as Record<CDNProvider, typeof NODE_TYPE_CONFIGS[CDNNodeType][]>);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">组件面板</h2>
        <p className="text-sm text-gray-500 mt-1">拖拽组件到画布中构建工作流</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(nodesByProvider).map(([provider, nodes]) => (
          <div key={provider} className="space-y-2">
            <button
              onClick={() => toggleProvider(provider)}
              className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-md"
            >
              <span className="font-medium text-gray-900">
                {providerLabels[provider as CDNProvider]}
              </span>
              {expandedProviders.has(provider) ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedProviders.has(provider) && (
              <div className="space-y-2 pl-2">
                {nodes.map((config) => {
                  const IconComponent = iconMap[config.icon as keyof typeof iconMap] || Server;
                  
                  return (
                    <div
                      key={config.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, config.type)}
                      className={`
                        p-1.5 border border-dashed rounded-lg cursor-move transition-all duration-200
                        hover:shadow-sm hover:scale-105 active:scale-95
                        ${providerColors[config.provider]}
                      `}
                      title={config.description}
                    >
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border"
                          style={{ 
                            backgroundColor: config.color + '20',
                            borderColor: config.color + '40'
                          }}
                        >
                          <IconComponent 
                            className="w-2.5 h-2.5" 
                            style={{ color: config.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-xs leading-tight">
                            {config.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>🏢 按供应商分组组件</div>
          <div>💡 拖拽组件到画布中</div>
          <div>🔗 连接组件构建工作流</div>
          <div>👆 单击选中，双击配置</div>
          <div>🎯 多融合CDN架构</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
