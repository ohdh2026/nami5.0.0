
import React from 'react';
import { InspectionLog } from '../types.ts';

interface HistoryListProps {
  logs: InspectionLog[];
  onEdit: (log: InspectionLog) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ logs, onEdit, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-folder-open text-slate-400 text-3xl"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800">기록된 점검 일지가 없습니다</h3>
        <p className="text-slate-500 mt-1">상단 '새 점검 작성' 버튼을 눌러 첫 일지를 작성해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">최근 점검 이력</h2>
        <span className="text-sm text-slate-500">총 {logs.length}건</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {logs.map((log) => {
          const issueCount = log.items.filter(i => i.status === 'ISSUE').length;
          
          return (
            <div 
              key={log.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow group animate-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    issueCount > 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <i className={`fas ${issueCount > 0 ? 'fa-triangle-exclamation' : 'fa-check-circle'} text-xl`}></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-800">{log.vehicleId}</h3>
                      <span className="text-xs text-slate-400">|</span>
                      <span className="text-sm text-slate-600 font-medium">{log.operator}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center">
                      <i className="far fa-calendar-alt mr-1.5"></i>{log.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right mr-4 hidden md:block">
                    <div className={`text-xs font-bold uppercase ${issueCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {issueCount > 0 ? `${issueCount}건의 결함` : '점검 통과'}
                    </div>
                    <div className="text-[10px] text-slate-400">장비 A~H 점검 완료</div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(log)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="상세 보기 / 수정"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(log.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="기록 삭제"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="인쇄"
                    >
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </div>
              </div>

              {issueCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-2">이상 장비 내역:</div>
                  <div className="flex flex-wrap gap-2">
                    {log.items.filter(i => i.status === 'ISSUE').map(i => (
                      <span key={i.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                        {i.name} ({i.id})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryList;
