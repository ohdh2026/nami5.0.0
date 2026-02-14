
import React, { useState, useEffect, useCallback } from 'react';
import { InspectionLog, ChecklistItem, DEFAULT_EQUIPMENT, Status } from './types';
import ChecklistForm from './components/ChecklistForm';
import HistoryList from './components/HistoryList';
import Header from './components/Header';

const App: React.FC = () => {
  const [logs, setLogs] = useState<InspectionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY'>('NEW');
  const [currentLog, setCurrentLog] = useState<InspectionLog | null>(null);

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('op_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('op_logs', JSON.stringify(logs));
  }, [logs]);

  const createNewLog = useCallback(() => {
    const newItems: ChecklistItem[] = DEFAULT_EQUIPMENT.map(eq => ({
      id: eq.id,
      name: eq.name,
      label: eq.label,
      status: 'NOT_CHECKED',
      actionTaken: '',
    }));

    const newLog: InspectionLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      operator: '',
      vehicleId: '',
      items: newItems,
      overallNotes: '',
      isCompleted: false,
    };

    setCurrentLog(newLog);
    setActiveTab('NEW');
  }, []);

  const handleSaveLog = (log: InspectionLog) => {
    setLogs(prev => {
      const exists = prev.find(l => l.id === log.id);
      if (exists) {
        return prev.map(l => l.id === log.id ? log : l);
      }
      return [log, ...prev];
    });
    alert('점검 일지가 저장되었습니다.');
    setActiveTab('HISTORY');
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm('이 점검 기록을 삭제하시겠습니까?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleEditLog = (log: InspectionLog) => {
    setCurrentLog(log);
    setActiveTab('NEW');
  };

  // Initialize a new log if none is active and on the NEW tab
  useEffect(() => {
    if (!currentLog && activeTab === 'NEW') {
      createNewLog();
    }
  }, [currentLog, activeTab, createNewLog]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNewClick={createNewLog}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {activeTab === 'NEW' && currentLog ? (
          <ChecklistForm 
            log={currentLog} 
            onSave={handleSaveLog} 
            onCancel={() => setActiveTab('HISTORY')}
          />
        ) : (
          <HistoryList 
            logs={logs} 
            onEdit={handleEditLog} 
            onDelete={handleDeleteLog}
          />
        )}
      </main>

      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm no-print">
        &copy; 2024 Smart Ops Pre-flight System. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
