
import React from 'react';

interface HeaderProps {
  activeTab: 'NEW' | 'HISTORY';
  setActiveTab: (tab: 'NEW' | 'HISTORY') => void;
  onNewClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onNewClick }) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg no-print">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fas fa-clipboard-check text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Smart Ops</h1>
            <p className="text-xs text-slate-400">운항 전 장비 점검 시스템</p>
          </div>
        </div>
        
        <nav className="flex space-x-1 bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('NEW')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'NEW' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-plus-circle mr-2"></i>새 점검 작성
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'HISTORY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-history mr-2"></i>점검 이력
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
