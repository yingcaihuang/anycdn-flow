import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GlobalSettings, PortPosition, LabelPosition } from '../types';

interface SettingsState {
  settings: GlobalSettings;
}

type SettingsAction =
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GlobalSettings> }
  | { type: 'RESET_SETTINGS' }
  | { type: 'LOAD_SETTINGS'; payload: GlobalSettings };

const defaultSettings: GlobalSettings = {
  outputPortPosition: PortPosition.RIGHT,
  inputPortPosition: PortPosition.LEFT,
  showPortLabels: true,
  portSize: 'small',
  labelPosition: LabelPosition.BOTTOM,
  labelFontSize: 'xxxxxs',
  theme: 'light',
  gridVisible: true,
  snapToGrid: false,
};

const initialState: SettingsState = {
  settings: defaultSettings,
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      // 保存到 localStorage
      localStorage.setItem('anycdn-flow-settings', JSON.stringify(newSettings));
      return {
        ...state,
        settings: newSettings,
      };

    case 'RESET_SETTINGS':
      localStorage.removeItem('anycdn-flow-settings');
      return {
        ...state,
        settings: defaultSettings,
      };

    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };

    default:
      return state;
  }
}

const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
} | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // 从 localStorage 加载设置
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('anycdn-flow-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: { ...defaultSettings, ...settings } });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// 便捷的 hooks
export function useGlobalSettings() {
  const { state } = useSettings();
  return state.settings;
}

export function useUpdateSettings() {
  const { dispatch } = useSettings();
  return (settings: Partial<GlobalSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };
}
