import React, { useState } from 'react';
import { useWorkflowStore } from '../store/WorkflowStore';
import { Plus, FolderOpen, Copy, Trash2, Play, Settings, X } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkflowManager: React.FC = () => {
  const { state, dispatch } = useWorkflowStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) {
      toast.error('请输入工作流名称');
      return;
    }

    dispatch({
      type: 'CREATE_WORKFLOW',
      payload: {
        name: newWorkflowName.trim(),
        description: newWorkflowDescription.trim(),
      },
    });

    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setShowCreateModal(false);
    toast.success('工作流创建成功');
  };

  const handleDeleteWorkflow = (workflowId: string, workflowName: string) => {
    if (window.confirm(`确定要删除工作流 "${workflowName}" 吗？`)) {
      dispatch({ type: 'DELETE_WORKFLOW', payload: workflowId });
      toast.success('工作流已删除');
    }
  };

  const handleDuplicateWorkflow = (workflowId: string) => {
    dispatch({ type: 'DUPLICATE_WORKFLOW', payload: workflowId });
    toast.success('工作流已复制');
  };

  const handleSwitchWorkflow = (workflowId: string) => {
    dispatch({ type: 'SWITCH_WORKFLOW', payload: workflowId });
    toast.success('已切换到新工作流');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (!state.showWorkflowManager) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FolderOpen key="folder-icon" className="w-6 h-6 text-blue-600" />
            <h2 key="title" className="text-xl font-semibold text-gray-900">工作流管理</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              key="new-workflow-button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus key="plus-icon" className="w-4 h-4" />
              <span key="new-text">新建工作流</span>
            </button>
            <button
              key="close-button"
              onClick={() => dispatch({ type: 'TOGGLE_WORKFLOW_MANAGER' })}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
          {state.savedWorkflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FolderOpen className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">还没有工作流</h3>
              <p className="text-sm mb-6">创建您的第一个 CDN 加速工作流</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus key="plus-icon-2" className="w-5 h-5" />
                <span key="create-text">创建第一个工作流</span>
              </button>
            </div>
          ) : (
            <div className="p-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.savedWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`relative bg-white border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
                      state.currentWorkflow?.id === workflow.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSwitchWorkflow(workflow.id)}
                  >
                    {/* 当前工作流标识 */}
                    {state.currentWorkflow?.id === workflow.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    )}

                    {/* 工作流信息 */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {workflow.name}
                      </h3>
                      {workflow.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {workflow.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div key="node-count">节点数: {workflow.nodes.length}</div>
                        <div key="edge-count">连接数: {workflow.edges.length}</div>
                        <div key="created-at">创建时间: {formatDate(workflow.createdAt)}</div>
                        <div key="updated-at">更新时间: {formatDate(workflow.updatedAt)}</div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          key="open-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchWorkflow(workflow.id);
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Play key="play-icon" className="w-3 h-3" />
                          <span key="open-text">打开</span>
                        </button>
                        <button
                          key="duplicate-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateWorkflow(workflow.id);
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Copy key="copy-icon" className="w-3 h-3" />
                          <span key="copy-text">复制</span>
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkflow(workflow.id, workflow.name);
                        }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 创建新工作流模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">创建新工作流</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工作流名称 *
                </label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="输入工作流名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述 (可选)
                </label>
                <textarea
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  placeholder="输入工作流描述"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                key="cancel-button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                key="create-button"
                onClick={handleCreateWorkflow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager;
