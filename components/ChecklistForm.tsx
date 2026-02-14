
import React, { useState } from 'react';
import { InspectionLog, Status, ChecklistItem } from '../types.ts';
import { getCorrectiveActionSuggestion } from '../services/geminiService.ts';

interface ChecklistFormProps {
  log: InspectionLog;
  onSave: (log: InspectionLog) => void;
  onCancel: () => void;
}

const ChecklistForm: React.FC<ChecklistFormProps> = ({ log, onSave, onCancel }) => {
  const [formData, setFormData] = useState<InspectionLog>(log);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const handleStatusChange = (itemId: string, status: Status) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    }));
  };

  const handleActionChange = (itemId: string, action: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, actionTaken: action } : item
      )
    }));
  };

  const suggestAction = async (item: ChecklistItem) => {
    const issueDescription = prompt(`${item.name} (${item.label})의 이상 내용을 간략히 입력하세요:`);
    if (!issueDescription) return;

    setLoadingAI(item.id);
    const suggestion = await getCorrectiveActionSuggestion(item.label, issueDescription);
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => 
        i.id === item.id ? { ...i, actionTaken: `발견사항: ${issueDescription} | 조치: ${suggestion}` } : i
      )
    }));
    setLoadingAI(null);
  };

  const isAllChecked = formData.items.every(item => item.status !== 'NOT_CHECKED');

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in fade-in duration-500">
      <div className="bg-slate-50 border-b border-slate-200 px-8 py-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <i className="fas fa-edit text-blue-600 mr-3"></i>
          {formData.isCompleted ? '점검 완료 일지' : '신규 운항 전 점검'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">점검 일자</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">점검자 성명</label>
            <input 
              type="text" 
              placeholder="성명을 입력하세요"
              value={formData.operator}
              onChange={(e) => setFormData({...formData, operator: e.target.value})}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">기체/선박 번호</label>
            <input 
              type="text" 
              placeholder="예: HL-1234 / NB-789"
              value={formData.vehicleId}
              onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-8 py-4 w-24">ID</th>
              <th className="px-4 py-4 w-48">점검 항목</th>
              <th className="px-4 py-4 w-64 text-center">상태</th>
              <th className="px-8 py-4">비고 (이상 시 조치사항)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {formData.items.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-6 align-top">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                    {item.id}
                  </span>
                </td>
                <td className="px-4 py-6 align-top">
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </td>
                <td className="px-4 py-6 align-top">
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => handleStatusChange(item.id, 'OK')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border-2 ${
                        item.status === 'OK' 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-500'
                      }`}
                    >
                      <i className="fas fa-check mr-1.5"></i>정상
                    </button>
                    <button 
                      onClick={() => handleStatusChange(item.id, 'ISSUE')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border-2 ${
                        item.status === 'ISSUE' 
                        ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500'
                      }`}
                    >
                      <i className="fas fa-exclamation-triangle mr-1.5"></i>이상
                    </button>
                  </div>
                </td>
                <td className="px-8 py-6 align-top">
                  <div className="relative">
                    <textarea 
                      placeholder={item.status === 'ISSUE' ? "이상 내용과 조치사항을 입력하세요..." : "특이사항 없음"}
                      value={item.actionTaken}
                      onChange={(e) => handleActionChange(item.id, e.target.value)}
                      rows={2}
                      className={`w-full text-sm bg-slate-50/50 border rounded-lg p-3 focus:outline-none transition-all ${
                        item.status === 'ISSUE' ? 'border-rose-200 focus:ring-1 focus:ring-rose-500' : 'border-transparent'
                      }`}
                    />
                    {item.status === 'ISSUE' && (
                      <button 
                        onClick={() => suggestAction(item)}
                        disabled={loadingAI === item.id}
                        className="absolute right-2 bottom-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
                        title="AI 조치 가이드 요청"
                      >
                        {loadingAI === item.id ? (
                          <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                          <i className="fas fa-magic"></i>
                        )}
                        <span>AI 가이드</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center text-sm">
          {!isAllChecked ? (
            <span className="text-amber-600 font-medium">
              <i className="fas fa-info-circle mr-2"></i>모든 항목을 점검해야 완료할 수 있습니다.
            </span>
          ) : (
            <span className="text-emerald-600 font-medium">
              <i className="fas fa-check-circle mr-2"></i>모든 항목 점검 완료
            </span>
          )}
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={onCancel}
            className="flex-1 md:flex-none px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-all"
          >
            취소
          </button>
          <button 
            onClick={() => onSave({...formData, isCompleted: true})}
            disabled={!isAllChecked || !formData.operator || !formData.vehicleId}
            className={`flex-1 md:flex-none px-10 py-3 rounded-xl font-bold shadow-lg transition-all ${
              isAllChecked && formData.operator && formData.vehicleId
              ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            점검 완료 및 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistForm;
