import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Save, 
  FolderOpen, 
  Settings, 
  Download,
  Upload,
  RefreshCw,
  Zap,
  Plus
} from 'lucide-react';
import { useWorkflowStore } from '../store/WorkflowStore';
import { WorkflowConfig } from '../types';
import { NODE_TYPE_CONFIGS } from '../config/nodeTypes';
import SettingsModal from './SettingsModal';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { state, dispatch } = useWorkflowStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [workflowName, setWorkflowName] = useState('');

  const handleRunWorkflow = async () => {
    if (state.nodes.length === 0) {
      toast.error('请先添加一些节点到工作流中');
      return;
    }
    
    dispatch({ type: 'SET_RUNNING', payload: true });
    toast.success('工作流开始执行');
    
    // 重置所有节点状态
    state.nodes.forEach(node => {
      dispatch({ type: 'UPDATE_NODE_STATUS', payload: { nodeId: node.id, status: 'idle' } });
    });
    
    // 模拟工作流执行动画
    const executeNodeSequence = async (nodeIndex: number = 0) => {
      if (nodeIndex >= state.nodes.length) return;
      
      const node = state.nodes[nodeIndex];
      
      // 等待状态
      dispatch({ type: 'UPDATE_NODE_STATUS', payload: { nodeId: node.id, status: 'waiting' } });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 运行状态
      dispatch({ type: 'UPDATE_NODE_STATUS', payload: { nodeId: node.id, status: 'running' } });
      
      // 激活相关的边
      const connectedEdges = state.edges.filter(edge => edge.source === node.id);
      connectedEdges.forEach(edge => {
        dispatch({ type: 'SET_EXECUTING_EDGE', payload: { edgeId: edge.id, isExecuting: true } });
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 完成状态
      dispatch({ type: 'UPDATE_NODE_STATUS', payload: { nodeId: node.id, status: 'success' } });
      
      // 停止边动画
      connectedEdges.forEach(edge => {
        dispatch({ type: 'SET_EXECUTING_EDGE', payload: { edgeId: edge.id, isExecuting: false } });
      });
      
      // 执行下一个节点
      await executeNodeSequence(nodeIndex + 1);
    };
    
    await executeNodeSequence();
    
    // 执行完成
    setTimeout(() => {
      dispatch({ type: 'SET_RUNNING', payload: false });
      toast.success('工作流执行完成');
    }, 500);
  };

  const handleStopWorkflow = () => {
    dispatch({ type: 'SET_RUNNING', payload: false });
    
    // 重置所有节点状态
    state.nodes.forEach(node => {
      dispatch({ type: 'UPDATE_NODE_STATUS', payload: { nodeId: node.id, status: 'idle' } });
    });
    
    // 重置所有边状态
    state.edges.forEach(edge => {
      dispatch({ type: 'SET_EXECUTING_EDGE', payload: { edgeId: edge.id, isExecuting: false } });
    });
    
    toast.success('工作流已停止');
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) {
      toast.error('请输入工作流名称');
      return;
    }

    const workflow: WorkflowConfig = {
      id: `workflow_${Date.now()}`,
      name: workflowName,
      description: `CDN 加速工作流 - ${workflowName}`,
      version: '1.0.0',
      nodes: state.nodes,
      edges: state.edges,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'SAVE_WORKFLOW', payload: workflow });
    toast.success(`工作流 "${workflowName}" 已保存`);
    setShowSaveDialog(false);
    setWorkflowName('');
  };

  const handleSaveCurrentWorkflow = () => {
    if (!state.currentWorkflow) {
      // 如果没有当前工作流，弹出对话框让用户输入名字
      setShowSaveDialog(true);
      return;
    }

    // 如果有当前工作流，直接更新它
    const updatedWorkflow: WorkflowConfig = {
      ...state.currentWorkflow,
      nodes: state.nodes,
      edges: state.edges,
      updatedAt: new Date(),
    };

    dispatch({ type: 'SAVE_WORKFLOW', payload: updatedWorkflow });
    toast.success(`工作流 "${state.currentWorkflow.name}" 已保存`);
  };

  const handleExportWorkflow = () => {
    if (state.nodes.length === 0) {
      toast.error('没有可导出的工作流');
      return;
    }

    const workflow = {
      name: state.currentWorkflow?.name || '未命名工作流',
      nodes: state.nodes,
      edges: state.edges,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('工作流已导出');
  };

  const handleImportWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        dispatch({ type: 'SET_WORKFLOW', payload: workflow });
        toast.success(`工作流 "${workflow.name}" 已导入`);
      } catch (error) {
        toast.error('导入失败：文件格式错误');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">AnyCDN Flow</h1>
          </div>
          {state.currentWorkflow ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">当前工作流:</span>
              <span className="text-sm font-medium text-gray-900">{state.currentWorkflow.name}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">可视化 CDN 加速工作流构建器</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* 运行控制 */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            {state.isRunning ? (
              <button
                onClick={handleStopWorkflow}
                className="toolbar-button bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <Square className="w-4 h-4" />
                停止
              </button>
            ) : (
              <button
                onClick={handleRunWorkflow}
                className="toolbar-button bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                disabled={state.nodes.length === 0}
              >
                <Play className="w-4 h-4" />
                运行
              </button>
            )}
            
            {state.isRunning && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                执行中...
              </div>
            )}
          </div>

          {/* 文件操作 */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <button
              onClick={handleSaveCurrentWorkflow}
              className="toolbar-button"
              disabled={state.nodes.length === 0}
            >
              <Save className="w-4 h-4" />
              保存
            </button>

            <label className="toolbar-button cursor-pointer">
              <Upload className="w-4 h-4" />
              导入
              <input
                type="file"
                accept=".json"
                onChange={handleImportWorkflow}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExportWorkflow}
              className="toolbar-button"
              disabled={state.nodes.length === 0}
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>

          {/* 其他操作 */}
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_WORKFLOW_MANAGER' })}
            className="toolbar-button"
          >
            <FolderOpen className="w-4 h-4" />
            工作流
          </button>

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="toolbar-button"
          >
            <Settings className="w-4 h-4" />
            设置
          </button>
        </div>
      </div>

      {/* 保存对话框 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">保存工作流</h3>
            <input
              type="text"
              placeholder="请输入工作流名称"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setWorkflowName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleSaveWorkflow}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                disabled={!workflowName.trim()}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 设置模态框 */}
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </header>
  );
};

export default Header;
