import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../store/WorkflowStore';
import { CDNNode, CDNEdge, CDNNodeType } from '../types';
import { NODE_TYPE_CONFIGS } from '../config/nodeTypes';
import CDNNodeComponent from './nodes/CDNNodeComponent';
import NodeConfigModal from './NodeConfigModal';

// 注册自定义节点类型
const nodeTypes = {
  'cdn-node': CDNNodeComponent,
};

const WorkflowBuilder: React.FC = () => {
  const { state, dispatch } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // 将状态管理的节点和边转换为 ReactFlow 格式
  const [nodes, setNodes, onNodesChange] = useNodesState(
    state.nodes.map(node => ({
      ...node,
      type: 'cdn-node',
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    state.edges.map(edge => ({
      ...edge,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#9ca3af', strokeWidth: 2 },
    }))
  );

  // 同步全局状态到本地状态
  React.useEffect(() => {
    if (state.currentWorkflow) {
      const reactFlowNodes = state.nodes.map(node => ({
        ...node,
        type: 'cdn-node',
      }));
      setNodes(reactFlowNodes);
    }
  }, [state.currentWorkflow?.id, state.nodes, setNodes]);

  React.useEffect(() => {
    if (state.currentWorkflow) {
      const reactFlowEdges = state.edges.map(edge => ({
        ...edge,
        type: 'smoothstep',
        animated: false,
        className: edge.className || '',
        style: edge.style || { stroke: '#9ca3af', strokeWidth: 2 },
      }));
      setEdges(reactFlowEdges);
    }
  }, [state.currentWorkflow?.id, state.edges, setEdges]);

  // 同步本地状态到全局 store (防抖处理)
  React.useEffect(() => {
    if (!state.currentWorkflow) return;
    
    const timeoutId = setTimeout(() => {
      const cdnNodes: CDNNode[] = nodes.map(node => ({
        id: node.id,
        type: node.data.nodeType || CDNNodeType.ORIGIN_SERVER,
        position: node.position,
        data: node.data,
      }));

      const cdnEdges: CDNEdge[] = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        data: edge.data,
        className: edge.className,
        style: edge.style,
      }));
      
      // 只在有实际变化时更新
      const nodesChanged = JSON.stringify(cdnNodes) !== JSON.stringify(state.nodes);
      const edgesChanged = JSON.stringify(cdnEdges) !== JSON.stringify(state.edges);
      
      if (nodesChanged || edgesChanged) {
        dispatch({ type: 'SET_WORKFLOW', payload: {
          ...state.currentWorkflow,
          nodes: cdnNodes,
          edges: cdnEdges,
          updatedAt: new Date(),
        }});
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, state.currentWorkflow, state.nodes, state.edges, dispatch]);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      // 获取源节点的输出类型信息
      const sourceNode = nodes.find(n => n.id === connection.source);
      let outputType = null;
      let edgeColor = '#9ca3af';
      
      if (sourceNode && connection.sourceHandle) {
        const nodeType = sourceNode.data.nodeType;
        const config = NODE_TYPE_CONFIGS[nodeType];
        const output = config?.outputs.find(o => o.id === connection.sourceHandle);
        if (output) {
          outputType = output.type;
          edgeColor = output.color;
        }
      }

      const newEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: false,
        style: { stroke: edgeColor, strokeWidth: 2 },
        data: {
          outputType,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow') as CDNNodeType;

      if (!nodeType || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const config = NODE_TYPE_CONFIGS[nodeType];
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: 'cdn-node',
        position,
        data: {
          label: config.label,
          nodeType,
          config: { ...config.defaultConfig },
          status: 'idle' as const,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch({ type: 'SELECT_NODE', payload: node.id });
      // 单击只选中节点，不打开配置面板
    },
    [dispatch]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch({ type: 'SELECT_NODE', payload: node.id });
      setShowConfigModal(true);
    },
    [dispatch]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      dispatch({ type: 'SELECT_EDGE', payload: edge.id });
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch({ type: 'SELECT_NODE', payload: null });
    dispatch({ type: 'SELECT_EDGE', payload: null });
    setShowConfigModal(false);
  }, [dispatch]);

  // 如果没有当前工作流，显示空状态
  if (!state.currentWorkflow) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">欢迎使用 AnyCDN Flow</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            开始创建您的第一个 CDN 加速工作流，或者从现有工作流中选择一个开始编辑。
          </p>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_WORKFLOW_MANAGER' })}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            管理工作流
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="workflow-canvas"
          >
            <Controls 
              className="!bg-white !border-gray-200 !shadow-lg"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            <MiniMap 
              className="!bg-white !border-gray-200 !shadow-lg"
              nodeColor={(node) => {
                const nodeType = node.data.nodeType as CDNNodeType;
                return NODE_TYPE_CONFIGS[nodeType]?.color || '#64748b';
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1} 
              color="#e5e7eb"
            />
          </ReactFlow>
        </div>

        {/* 节点配置模态框 */}
        {state.selectedNode && (
          <NodeConfigModal 
            nodeId={state.selectedNode}
            isOpen={showConfigModal}
            onClose={() => {
              setShowConfigModal(false);
              dispatch({ type: 'SELECT_NODE', payload: null });
            }}
            onUpdate={(updates) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === state.selectedNode
                    ? { ...node, data: { ...node.data, ...updates } }
                    : node
                )
              );
            }}
          />
        )}

        {/* 空状态提示 */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                开始构建您的 CDN 工作流
              </h3>
              <div className="text-gray-500 space-y-1">
                <p>从左侧面板拖拽组件到这里开始构建</p>
                <p className="text-sm">💡 单击选中节点，双击打开配置面板</p>
              </div>
            </div>
          </div>
        )}

        {/* 运行状态指示器 */}
        {state.isRunning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-800 font-medium">工作流执行中...</span>
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default WorkflowBuilder;
