import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CDNNode, CDNEdge, WorkflowConfig, WorkflowExecution } from '../types';

interface WorkflowState {
  currentWorkflow: WorkflowConfig | null;
  nodes: CDNNode[];
  edges: CDNEdge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  isRunning: boolean;
  execution: WorkflowExecution | null;
  savedWorkflows: WorkflowConfig[];
  showWorkflowManager: boolean;
}

type WorkflowAction =
  | { type: 'SET_WORKFLOW'; payload: WorkflowConfig }
  | { type: 'ADD_NODE'; payload: CDNNode }
  | { type: 'UPDATE_NODE'; payload: { id: string; updates: Partial<CDNNode> } }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'ADD_EDGE'; payload: CDNEdge }
  | { type: 'UPDATE_EDGE'; payload: { id: string; updates: Partial<CDNEdge> } }
  | { type: 'DELETE_EDGE'; payload: string }
  | { type: 'SELECT_NODE'; payload: string | null }
  | { type: 'SELECT_EDGE'; payload: string | null }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'SET_EXECUTION'; payload: WorkflowExecution | null }
  | { type: 'UPDATE_NODE_STATUS'; payload: { nodeId: string; status: string } }
  | { type: 'SET_EXECUTING_EDGE'; payload: { edgeId: string; isExecuting: boolean } }
  | { type: 'SET_NODES'; payload: CDNNode[] }
  | { type: 'SET_EDGES'; payload: CDNEdge[] }
  | { type: 'SAVE_WORKFLOW'; payload: WorkflowConfig }
  | { type: 'LOAD_WORKFLOWS'; payload: WorkflowConfig[] }
  | { type: 'CLEAR_WORKFLOW' }
  | { type: 'CREATE_WORKFLOW'; payload: { name: string; description?: string } }
  | { type: 'DELETE_WORKFLOW'; payload: string }
  | { type: 'DUPLICATE_WORKFLOW'; payload: string }
  | { type: 'TOGGLE_WORKFLOW_MANAGER' }
  | { type: 'SWITCH_WORKFLOW'; payload: string };

const initialState: WorkflowState = {
  currentWorkflow: null,
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  isRunning: false,
  execution: null,
  savedWorkflows: [],
  showWorkflowManager: false,
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_WORKFLOW':
      return {
        ...state,
        currentWorkflow: action.payload,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
      };

    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };

    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.id
            ? { ...node, ...action.payload.updates }
            : node
        ),
      };

    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
        edges: state.edges.filter(
          edge => edge.source !== action.payload && edge.target !== action.payload
        ),
        selectedNode: state.selectedNode === action.payload ? null : state.selectedNode,
      };

    case 'ADD_EDGE':
      return {
        ...state,
        edges: [...state.edges, action.payload],
      };

    case 'UPDATE_EDGE':
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.payload.id
            ? { ...edge, ...action.payload.updates }
            : edge
        ),
      };

    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload),
        selectedEdge: state.selectedEdge === action.payload ? null : state.selectedEdge,
      };

    case 'SELECT_NODE':
      return {
        ...state,
        selectedNode: action.payload,
        selectedEdge: null,
      };

    case 'SELECT_EDGE':
      return {
        ...state,
        selectedEdge: action.payload,
        selectedNode: null,
      };

    case 'SET_RUNNING':
      return {
        ...state,
        isRunning: action.payload,
      };

    case 'SET_EXECUTION':
      return {
        ...state,
        execution: action.payload,
      };

    case 'UPDATE_NODE_STATUS':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? { ...node, data: { ...node.data, status: action.payload.status as any } }
            : node
        ),
      };

    case 'SET_EXECUTING_EDGE':
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.payload.edgeId
            ? { ...edge, className: action.payload.isExecuting ? 'executing' : '' }
            : edge
        ),
      };

    case 'SET_NODES':
      return {
        ...state,
        nodes: action.payload,
      };

    case 'SET_EDGES':
      return {
        ...state,
        edges: action.payload,
      };

    case 'SAVE_WORKFLOW':
      const existingIndex = state.savedWorkflows.findIndex(w => w.id === action.payload.id);
      let updatedWorkflows;
      
      if (existingIndex >= 0) {
        // 更新现有工作流
        updatedWorkflows = [...state.savedWorkflows];
        updatedWorkflows[existingIndex] = action.payload;
        console.log('Updating existing workflow:', action.payload);
      } else {
        // 添加新工作流
        updatedWorkflows = [...state.savedWorkflows, action.payload];
        console.log('Adding new workflow:', action.payload);
      }
      
      console.log('Updated workflows after save:', updatedWorkflows);
      return {
        ...state,
        savedWorkflows: updatedWorkflows,
        currentWorkflow: action.payload,
      };

    case 'LOAD_WORKFLOWS':
      console.log('Loading workflows into state:', action.payload);
      return {
        ...state,
        savedWorkflows: action.payload,
      };

    case 'CLEAR_WORKFLOW':
      return {
        ...state,
        currentWorkflow: null,
        nodes: [],
        edges: [],
        selectedNode: null,
        selectedEdge: null,
        isRunning: false,
        execution: null,
      };

    case 'CREATE_WORKFLOW':
      const newWorkflow: WorkflowConfig = {
        id: `workflow_${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description || '',
        version: '1.0.0',
        nodes: [],
        edges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('Creating new workflow:', newWorkflow);
      console.log('Current savedWorkflows before adding:', state.savedWorkflows);
      const updatedState = {
        ...state,
        currentWorkflow: newWorkflow,
        nodes: [],
        edges: [],
        savedWorkflows: [...state.savedWorkflows, newWorkflow],
        showWorkflowManager: false,
      };
      console.log('Updated state after creating workflow:', updatedState);
      return updatedState;

    case 'DELETE_WORKFLOW':
      const filteredWorkflows = state.savedWorkflows.filter(w => w.id !== action.payload);
      const isCurrentWorkflow = state.currentWorkflow?.id === action.payload;
      return {
        ...state,
        savedWorkflows: filteredWorkflows,
        currentWorkflow: isCurrentWorkflow ? null : state.currentWorkflow,
        nodes: isCurrentWorkflow ? [] : state.nodes,
        edges: isCurrentWorkflow ? [] : state.edges,
      };

    case 'DUPLICATE_WORKFLOW':
      const workflowToDuplicate = state.savedWorkflows.find(w => w.id === action.payload);
      if (workflowToDuplicate) {
        const duplicatedWorkflow: WorkflowConfig = {
          ...workflowToDuplicate,
          id: `workflow_${Date.now()}`,
          name: `${workflowToDuplicate.name} (副本)`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return {
          ...state,
          savedWorkflows: [...state.savedWorkflows, duplicatedWorkflow],
        };
      }
      return state;

    case 'TOGGLE_WORKFLOW_MANAGER':
      return {
        ...state,
        showWorkflowManager: !state.showWorkflowManager,
      };

    case 'SWITCH_WORKFLOW':
      const targetWorkflow = state.savedWorkflows.find(w => w.id === action.payload);
      if (targetWorkflow) {
        return {
          ...state,
          currentWorkflow: targetWorkflow,
          nodes: targetWorkflow.nodes,
          edges: targetWorkflow.edges,
          selectedNode: null,
          selectedEdge: null,
          isRunning: false,
          execution: null,
          showWorkflowManager: false,
        };
      }
      return state;

    default:
      return state;
  }
}

const WorkflowContext = createContext<{
  state: WorkflowState;
  dispatch: React.Dispatch<WorkflowAction>;
} | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // 从本地存储加载工作流
  React.useEffect(() => {
    const savedWorkflows = localStorage.getItem('anycdn-workflows');
    console.log('Loading workflows from localStorage:', savedWorkflows);
    console.log('All localStorage keys:', Object.keys(localStorage));
    if (savedWorkflows) {
      try {
        const workflows = JSON.parse(savedWorkflows);
        console.log('Parsed workflows:', workflows);
        // 将字符串日期转换回 Date 对象
        const workflowsWithDates = workflows.map((workflow: any) => ({
          ...workflow,
          createdAt: new Date(workflow.createdAt),
          updatedAt: new Date(workflow.updatedAt),
        }));
        console.log('Parsed workflows with dates:', workflowsWithDates);
        dispatch({ type: 'LOAD_WORKFLOWS', payload: workflowsWithDates });
      } catch (error) {
        console.error('Failed to load workflows from localStorage:', error);
      }
    } else {
      console.log('No workflows found in localStorage');
    }
  }, [dispatch]);

  // 保存工作流到本地存储
  React.useEffect(() => {
    console.log('Saving workflows to localStorage:', state.savedWorkflows);
    console.log('Current state.savedWorkflows length:', state.savedWorkflows.length);
    if (state.savedWorkflows.length > 0) {
      localStorage.setItem('anycdn-workflows', JSON.stringify(state.savedWorkflows));
      console.log('Successfully saved to localStorage');
    } else {
      console.log('No workflows to save, clearing localStorage');
      localStorage.removeItem('anycdn-workflows');
    }
  }, [state.savedWorkflows]);

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowStore() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowStore must be used within a WorkflowProvider');
  }
  return context;
}
