import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { GlobalSettings, PortPosition, LabelPosition } from '../types';
import { useSettings } from '../store/SettingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useSettings();
  const [formData, setFormData] = useState<GlobalSettings>(state.settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(state.settings);
      setHasChanges(false);
    }
  }, [isOpen, state.settings]);

  if (!isOpen) return null;

  const handleChange = (key: keyof GlobalSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有设置为默认值吗？')) {
      dispatch({ type: 'RESET_SETTINGS' });
      setHasChanges(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('您有未保存的更改，确定要关闭吗？')) {
        setFormData(state.settings);
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const positionOptions = [
    { value: PortPosition.TOP, label: '上方', icon: '↑' },
    { value: PortPosition.RIGHT, label: '右侧', icon: '→' },
    { value: PortPosition.BOTTOM, label: '下方', icon: '↓' },
    { value: PortPosition.LEFT, label: '左侧', icon: '←' },
  ];

  const portSizeOptions = [
    { value: 'small', label: '小', size: '4px' },
    { value: 'medium', label: '中', size: '5px' },
    { value: 'large', label: '大', size: '7px' },
  ];

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
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">全局设置</h2>
                <p className="text-sm text-gray-500">自定义工作流编辑器的外观和行为</p>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 端口设置 */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                端口设置
              </h3>
              
              {/* 输出端口位置 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  输出端口位置
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {positionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('outputPortPosition', option.value)}
                      className={`
                        p-3 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md
                        ${formData.outputPortPosition === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 输入端口位置 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  输入端口位置
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {positionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('inputPortPosition', option.value)}
                      className={`
                        p-3 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md
                        ${formData.inputPortPosition === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 端口大小 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  端口大小
                </label>
                <div className="flex gap-3">
                  {portSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('portSize', option.value)}
                      className={`
                        flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md
                        ${formData.portSize === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      <div 
                        className="rounded-full bg-current"
                        style={{ width: option.size, height: option.size }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 显示端口标签 */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">显示端口标签</label>
                  <p className="text-xs text-gray-500">悬停时显示端口名称</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showPortLabels}
                    onChange={(e) => handleChange('showPortLabels', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>

            {/* 标签设置 */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                标签设置
              </h3>
              
              {/* 标签位置 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  标签位置
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleChange('labelPosition', LabelPosition.TOP)}
                    className={`
                      p-3 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md
                      ${formData.labelPosition === LabelPosition.TOP
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">↑</div>
                    <div className="text-sm font-medium">上方</div>
                  </button>
                  <button
                    onClick={() => handleChange('labelPosition', LabelPosition.BOTTOM)}
                    className={`
                      p-3 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md
                      ${formData.labelPosition === LabelPosition.BOTTOM
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">↓</div>
                    <div className="text-sm font-medium">下方</div>
                  </button>
                </div>
              </div>

              {/* 字体大小 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  字体大小
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'xxxxxs', label: '极微', sample: 'Aa' },
                    { value: 'xxxxs', label: '超微', sample: 'Aa' },
                    { value: 'xxxs', label: '微小', sample: 'Aa' },
                    { value: 'xxs', label: '超小', sample: 'Aa' },
                    { value: 'xs', label: '极小', sample: 'Aa' },
                    { value: 'sm', label: '小', sample: 'Aa' },
                    { value: 'base', label: '中', sample: 'Aa' },
                    { value: 'lg', label: '大', sample: 'Aa' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('labelFontSize', option.value)}
                      className={`
                        p-3 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md
                        ${formData.labelFontSize === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`mb-1 font-medium ${
                        option.value === 'xxxxxs' ? 'text-xxxxxs' :
                        option.value === 'xxxxs' ? 'text-xxxxs' :
                        option.value === 'xxxs' ? 'text-xxxs' :
                        option.value === 'xxs' ? 'text-xxs' :
                        option.value === 'xs' ? 'text-xs' :
                        option.value === 'sm' ? 'text-sm' :
                        option.value === 'base' ? 'text-base' :
                        option.value === 'lg' ? 'text-lg' : 'text-xxxxxs'
                      }`}>
                        {option.sample}
                      </div>
                      <div className="text-xs">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 外观设置 */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                外观设置
              </h3>
              
              {/* 主题 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  主题
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleChange('theme', 'light')}
                    className={`
                      flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md
                      ${formData.theme === 'light'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
                    <span className="text-sm font-medium">浅色</span>
                  </button>
                  <button
                    onClick={() => handleChange('theme', 'dark')}
                    className={`
                      flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md
                      ${formData.theme === 'dark'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600" />
                    <span className="text-sm font-medium">深色</span>
                  </button>
                </div>
              </div>

              {/* 网格显示 */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">显示网格</label>
                  <p className="text-xs text-gray-500">在画布背景显示网格点</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gridVisible}
                    onChange={(e) => handleChange('gridVisible', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>

              {/* 网格对齐 */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">网格对齐</label>
                  <p className="text-xs text-gray-500">移动节点时自动对齐到网格</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.snapToGrid}
                    onChange={(e) => handleChange('snapToGrid', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
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
                className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重置所有
              </button>
              
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
