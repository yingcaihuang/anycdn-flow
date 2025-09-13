import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Settings } from 'lucide-react';
import { CDNNodeType, ConfigField } from '../types';
import { NODE_TYPE_CONFIGS } from '../config/nodeTypes';
import { useWorkflowStore } from '../store/WorkflowStore';

interface NodeConfigModalProps {
  nodeId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: any) => void;
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  nodeId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { state } = useWorkflowStore();
  const node = state.nodes.find(n => n.id === nodeId);
  
  const [formData, setFormData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData(node.data.config || {});
      setHasChanges(false);
    }
  }, [node, isOpen]);

  if (!isOpen || !node) return null;

  const config = NODE_TYPE_CONFIGS[node.type as CDNNodeType];

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate({
      config: formData,
    });
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setFormData(config.defaultConfig);
    setHasChanges(true);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('您有未保存的更改，确定要关闭吗？')) {
        setFormData(node.data.config || {});
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const renderField = (field: ConfigField) => {
    const value = formData[field.key] ?? field.defaultValue;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={field.description}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            min={field.min}
            max={field.max}
            onChange={(e) => handleChange(field.key, parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleChange(field.key, e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">启用此选项</span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'range':
        return (
          <div className="space-y-3">
            <input
              type="range"
              min={field.min}
              max={field.max}
              value={value || field.defaultValue}
              onChange={(e) => handleChange(field.key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{field.min}</span>
              <span className="font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                {value}
              </span>
              <span>{field.max}</span>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={handleCancel}
      />
      
      {/* 模态框 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: config.color + '20',
                  border: `2px solid ${config.color}40`
                }}
              >
                <Settings className="w-5 h-5" style={{ color: config.color }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{config.label} - 配置</h2>
                <p className="text-sm text-gray-500">{config.description}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-6">
            {config.configSchema.length > 0 ? (
              <div className="space-y-6">
                {config.configSchema.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                    {field.description && (
                      <p className="text-xs text-gray-500">{field.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">无可配置参数</h3>
                <p>此节点暂无需要配置的参数</p>
              </div>
            )}

            {/* 输出端口信息 */}
            {config.outputs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">输出端口</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {config.outputs.map((output) => (
                    <div key={output.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full border-2"
                        style={{
                          backgroundColor: output.color,
                          borderColor: output.color,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{output.label}</div>
                        <div className="text-xs text-gray-500 truncate">{output.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  ⚠️ 有未保存的更改
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                title="重置为默认配置"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              
              <button
                onClick={handleSave}
                disabled={!hasChanges && config.configSchema.length > 0}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeConfigModal;
