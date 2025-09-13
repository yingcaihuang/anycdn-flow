import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
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
  Settings,
  Play,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { CDNNodeType, PortPosition, LabelPosition } from '../../types';
import { NODE_TYPE_CONFIGS } from '../../config/nodeTypes';
import { useGlobalSettings } from '../../store/SettingsStore';

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
};

interface CDNNodeData {
  label: string;
  nodeType: CDNNodeType;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'error';
  metrics?: {
    requestCount: number;
    hitRate: number;
    bandwidth: number;
    latency: number;
    errorRate: number;
  };
}

const CDNNodeComponent: React.FC<NodeProps<CDNNodeData>> = ({ data, selected }) => {
  const config = NODE_TYPE_CONFIGS[data.nodeType];
  const settings = useGlobalSettings();
  const IconComponent = iconMap[config.icon as keyof typeof iconMap] || Server;

  const getStatusIcon = () => {
    switch (data.status) {
      case 'waiting':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse-fast" />;
      case 'running':
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-subtle" />;
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'completed':
        return <div className="w-2 h-2 bg-green-600 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-fast" />;
      case 'warning':
        return <div className="w-2 h-2 bg-orange-500 rounded-full" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'waiting':
        return 'border-yellow-400 bg-yellow-50 shadow-yellow-200 animate-pulse-fast';
      case 'running':
        return 'border-blue-400 bg-blue-50 shadow-blue-200 animate-bounce-subtle';
      case 'success':
        return 'border-green-400 bg-green-50 shadow-green-200';
      case 'completed':
        return 'border-green-600 bg-green-100 shadow-green-300';
      case 'error':
        return 'border-red-400 bg-red-50 shadow-red-200 animate-pulse-fast';
      case 'warning':
        return 'border-orange-400 bg-orange-50 shadow-orange-200';
      default:
        return 'border-gray-300 bg-white shadow-gray-200';
    }
  };

  // 输入端口：除了源节点（如源站服务器）外，其他节点都应该有输入端口
  const showInputHandle = config.category !== 'source';
  // 输出端口：除了目标节点（如用户）外，其他节点都应该有输出端口
  const showOutputHandle = config.category !== 'destination';

  // 获取端口位置信息
  const getPortPosition = (portType: 'input' | 'output') => {
    const position = portType === 'input' ? settings.inputPortPosition : settings.outputPortPosition;
    switch (position) {
      case PortPosition.TOP:
        return Position.Top;
      case PortPosition.RIGHT:
        return Position.Right;
      case PortPosition.BOTTOM:
        return Position.Bottom;
      case PortPosition.LEFT:
        return Position.Left;
      default:
        return portType === 'input' ? Position.Left : Position.Right;
    }
  };

  // 获取端口样式 - 确保相对于节点中心居中
  const getPortStyle = (portType: 'input' | 'output', index: number = 0) => {
    const position = portType === 'input' ? settings.inputPortPosition : settings.outputPortPosition;
    const portSize = settings.portSize === 'small' ? 4 : settings.portSize === 'large' ? 7 : 5;
    const offset = portSize / 2 + 1; // 端口中心到节点边缘的距离
    const nodeSize = 36; // 节点大小（从48缩小到36）
    const nodeCenter = nodeSize / 2; // 节点中心点 (18px)
    
    const baseStyle = {
      width: `${portSize}px`,
      height: `${portSize}px`,
    };

    if (portType === 'input') {
      // 输入端口始终居中
      switch (position) {
        case PortPosition.TOP:
          return {
            ...baseStyle,
            top: -offset,
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case PortPosition.RIGHT:
          return {
            ...baseStyle,
            right: -offset,
            top: '50%',
            transform: 'translateY(-50%)',
          };
        case PortPosition.BOTTOM:
          return {
            ...baseStyle,
            bottom: -offset,
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case PortPosition.LEFT:
          return {
            ...baseStyle,
            left: -offset,
            top: '50%',
            transform: 'translateY(-50%)',
          };
        default:
          return baseStyle;
      }
    } else {
      // 输出端口根据数量和位置居中分布
      const outputCount = config.outputs.length;
      
      switch (position) {
        case PortPosition.TOP:
        case PortPosition.BOTTOM: {
          // 水平分布，相对于节点中心居中
          const totalWidth = Math.max(outputCount * 8, 18); // 最小18px宽度
          const startX = nodeCenter - totalWidth / 2;
          const spacing = outputCount > 1 ? totalWidth / (outputCount - 1) : 0;
          const x = outputCount === 1 ? nodeCenter : startX + index * spacing;
          
          return {
            ...baseStyle,
            [position === PortPosition.TOP ? 'top' : 'bottom']: -offset,
            left: `${x}px`,
            transform: 'translateX(-50%)',
          };
        }
        case PortPosition.LEFT:
        case PortPosition.RIGHT: {
          // 垂直分布，相对于节点中心居中
          const totalHeight = Math.max(outputCount * 7, 15); // 最小15px高度
          const startY = nodeCenter - totalHeight / 2;
          const spacing = outputCount > 1 ? totalHeight / (outputCount - 1) : 0;
          const y = outputCount === 1 ? nodeCenter : startY + index * spacing;
          
          return {
            ...baseStyle,
            [position === PortPosition.LEFT ? 'left' : 'right']: -offset,
            top: `${y}px`,
            transform: 'translateY(-50%)',
          };
        }
        default:
          return baseStyle;
      }
    }
  };

  // 动态计算节点容器尺寸（考虑端口位置和大小）
  const portSize = settings.portSize === 'small' ? 4 : settings.portSize === 'large' ? 7 : 5;
  const portOffset = portSize / 2 + 1;
  
  const hasTopPorts = settings.outputPortPosition === PortPosition.TOP || 
                      settings.inputPortPosition === PortPosition.TOP;
  const hasBottomPorts = settings.outputPortPosition === PortPosition.BOTTOM || 
                         settings.inputPortPosition === PortPosition.BOTTOM;
  const hasLeftPorts = settings.outputPortPosition === PortPosition.LEFT || 
                       settings.inputPortPosition === PortPosition.LEFT;
  const hasRightPorts = settings.outputPortPosition === PortPosition.RIGHT || 
                        settings.inputPortPosition === PortPosition.RIGHT;
  
  // 计算容器尺寸，确保端口不会被裁剪
  const containerWidth = 36 + (hasLeftPorts ? portOffset : 0) + (hasRightPorts ? portOffset : 0);
  const containerHeight = 36 + (hasTopPorts ? portOffset : 0) + (hasBottomPorts ? portOffset : 0);
  
  // 计算节点在容器中的位置偏移
  const nodeOffsetX = hasLeftPorts ? portOffset : 0;
  const nodeOffsetY = hasTopPorts ? portOffset : 0;

  return (
    <div 
      className="relative group" 
      style={{ 
        width: `${containerWidth}px`, 
        height: `${containerHeight}px`,
        minWidth: `${containerWidth}px`,
        minHeight: `${containerHeight}px`
      }}
    >
      {/* 输入连接点 - 蓝色标记 */}
      {showInputHandle && (
        <Handle
          type="target"
          position={getPortPosition('input')}
          className="!border-2 !border-blue-500 !bg-blue-100 hover:!border-blue-600 hover:!bg-blue-200 !rounded-full transition-colors"
          style={getPortStyle('input')}
        />
      )}

      {/* 主节点 - 更小的 n8n 风格圆形 */}
      <div 
        className={`
          absolute w-9 h-9 rounded-full border-2 shadow-sm
          ${selected ? 'ring-2 ring-primary-400 ring-offset-1' : ''} 
          ${getStatusColor()}
          hover:shadow-md hover:scale-110 transition-all duration-200 cursor-pointer
          flex items-center justify-center
        `}
        style={{
          left: `${nodeOffsetX}px`,
          top: `${nodeOffsetY}px`,
        }}
      >
        {/* 主图标 */}
        <IconComponent 
          className="w-4 h-4" 
          style={{ color: config.color }}
        />

        {/* 状态指示器 */}
        {data.status && data.status !== 'idle' && (
          <div className="absolute -top-0.5 -right-0.5">
            {getStatusIcon()}
          </div>
        )}

        {/* 配置指示器 */}
        {Object.keys(data.config).length > 0 && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        )}

        {/* 性能指标指示器 */}
        {data.metrics && (
          <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-cyan-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        )}
      </div>

      {/* 节点标签 - 根据设置显示在上方或下方，相对于节点中心居中 */}
      <div 
        className={`absolute font-medium text-gray-700 text-center whitespace-nowrap ${
          settings.labelFontSize === 'xxxxxs' ? 'text-xxxxxs' :
          settings.labelFontSize === 'xxxxs' ? 'text-xxxxs' :
          settings.labelFontSize === 'xxxs' ? 'text-xxxs' :
          settings.labelFontSize === 'xxs' ? 'text-xxs' :
          settings.labelFontSize === 'xs' ? 'text-xs' :
          settings.labelFontSize === 'sm' ? 'text-sm' :
          settings.labelFontSize === 'base' ? 'text-base' :
          settings.labelFontSize === 'lg' ? 'text-lg' : 'text-xxxxxs'
        }`}
        style={
          settings.labelPosition === LabelPosition.TOP
            ? { 
                bottom: `${containerHeight - nodeOffsetY + 2}px`,
                left: `${nodeOffsetX + 18}px`, // 节点中心 (36/2 = 18)
                transform: 'translateX(-50%)'
              }
            : { 
                top: `${containerHeight - nodeOffsetY + 2}px`,
                left: `${nodeOffsetX + 18}px`, // 节点中心 (36/2 = 18)
                transform: 'translateX(-50%)'
              }
        }
      >
        {data.label.length > 10 ? data.label.substring(0, 8) + '..' : data.label}
      </div>

      {/* 悬停工具提示 */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg"
        style={{ top: `-${50 + (hasTopPorts ? portOffset : 0)}px` }}
      >
        <div className="font-medium">{config.label}</div>
        <div className="text-gray-300 text-xs mt-1">{config.description}</div>
        {data.metrics && (
          <div className="text-gray-300 text-xs mt-1 space-y-0.5">
            <div>请求: {data.metrics.requestCount.toLocaleString()}</div>
            <div>命中率: {(data.metrics.hitRate * 100).toFixed(1)}%</div>
            <div>延迟: {data.metrics.latency}ms</div>
          </div>
        )}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* 多个输出连接点 */}
      {showOutputHandle && config.outputs.length > 0 && (
        <>
          {config.outputs.map((output, index) => {
            const portStyle = getPortStyle('output', index);
            const showLabel = settings.showPortLabels;
            
            return (
              <div key={output.id} className="absolute group/output" style={portStyle}>
                <Handle
                  id={output.id}
                  type="source"
                  position={getPortPosition('output')}
                  className="!border-2 !rounded-full transition-all duration-200 hover:!scale-125 !w-full !h-full"
                  style={{
                    backgroundColor: output.color,
                    borderColor: output.color,
                    width: '100%',
                    height: '100%',
                  }}
                  title={`${output.label}: ${output.description}`}
                />
                {/* 输出端口标签 */}
                {showLabel && (
                  <div 
                    className={`
                      absolute text-xs font-medium whitespace-nowrap opacity-0 
                      group-hover/output:opacity-100 transition-opacity pointer-events-none
                      ${settings.outputPortPosition === PortPosition.TOP ? 'top-full left-1/2 transform -translate-x-1/2 mt-1' : ''}
                      ${settings.outputPortPosition === PortPosition.RIGHT ? 'left-full top-1/2 transform -translate-y-1/2 ml-1' : ''}
                      ${settings.outputPortPosition === PortPosition.BOTTOM ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-1' : ''}
                      ${settings.outputPortPosition === PortPosition.LEFT ? 'right-full top-1/2 transform -translate-y-1/2 mr-1' : ''}
                    `}
                    style={{ color: output.color }}
                  >
                    {output.label}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CDNNodeComponent;
