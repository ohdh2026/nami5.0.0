
export type Status = 'OK' | 'ISSUE' | 'NOT_CHECKED';

export interface ChecklistItem {
  id: string;
  name: string;
  label: string;
  status: Status;
  actionTaken: string;
}

export interface InspectionLog {
  id: string;
  date: string;
  operator: string;
  vehicleId: string;
  items: ChecklistItem[];
  overallNotes: string;
  isCompleted: boolean;
}

export const DEFAULT_EQUIPMENT = [
  { id: 'A', name: '장비 A', label: '엔진 및 동력 장치' },
  { id: 'B', name: '장비 B', label: '항법 및 GPS 시스템' },
  { id: 'C', name: '장비 C', label: '통신 장비 (VHF/UHF)' },
  { id: 'D', name: '장비 D', label: '연료 및 배터리 상태' },
  { id: 'E', name: '장비 E', label: '안전 장구 및 소방 시설' },
  { id: 'F', name: '장비 F', label: '기체/선체 외관 상태' },
  { id: 'G', name: '장비 G', label: '야간 운항 등화 장치' },
  { id: 'H', name: '장비 H', label: '조종 제어 계통' },
];
