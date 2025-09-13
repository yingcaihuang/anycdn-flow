import React from 'react';
import { Toaster } from 'react-hot-toast';
import WorkflowBuilder from './components/WorkflowBuilder';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkflowManager from './components/WorkflowManager';
import { WorkflowProvider } from './store/WorkflowStore';
import { SettingsProvider } from './store/SettingsStore';

function App() {
  return (
    <SettingsProvider>
      <WorkflowProvider>
        <div className="h-screen flex flex-col bg-gray-100">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative">
              <WorkflowBuilder />
            </main>
          </div>
          <WorkflowManager />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </WorkflowProvider>
    </SettingsProvider>
  );
}

export default App;
