// Нормативы
export enum NormativeType {
  TRANSPORT_COEFFICIENT = 'TRANSPORT_COEFFICIENT',
  VAT_RATE = 'VAT_RATE',
  AVERAGE_SALARY = 'AVERAGE_SALARY',
  DEPRECIATION = 'DEPRECIATION',
  OTHER = 'OTHER'
}

export interface Normative {
  id: number;
  name: string;
  type: NormativeType;
  value: number;
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy?: number;
}

export interface CreateNormativeDto {
  name: string;
  type: NormativeType;
  value: number;
  unit: string;
  description?: string;
  isActive?: boolean;
  updatedBy?: number;
}

export interface UpdateNormativeDto {
  name?: string;
  value?: number;
  unit?: string;
  description?: string;
  isActive?: boolean;
  updatedBy?: number;
  reason?: string;
}

// История изменений нормативов
export interface NormativeHistory {
  id: number;
  normativeId: number;
  oldValue: number;
  newValue: number;
  changedAt: string;
  changedBy: number;
  changedByUsername?: string;
  reason?: string;
}

// Наценки по категориям
export interface CategoryMarkup {
  id: number;
  categoryName: string;
  markupPercent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

