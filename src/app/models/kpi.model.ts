// KPI показатели
export interface KPI {
  // Уровень наценки
  un: number; // Ун (%) = ((P - Cs) / Cs) * 100%
  
  // Коэффициент доступности питания
  kdp: number; // Кд.п. (%) = (Средняя цена комплексного обеда / Средняя месячная заработная плата) * 100%
  
  // Валовая маржа
  grossMargin: number; // GrossMargin (%) = ((Revenue - COGS) / Revenue) * 100%
  
  // Рентабельность
  profitability: number; // Рентабельность = (P - Cs) / P × 100
  
  // Дополнительные показатели
  averageCost: number; // Средняя себестоимость блюд
  averagePrice: number; // Средняя цена блюд
  averageMarkup: number; // Средний уровень наценки
  averageComplexLunchPrice: number; // Средняя цена комплексного обеда
  
  // Период
  periodStart: string;
  periodEnd: string;
  calculatedAt: string;
}

export interface KPITrend {
  date: string;
  un: number;
  grossMargin: number;
  profitability: number;
  averagePrice: number;
  averageCost: number;
}

// Сценарий "что-если"
export interface WhatIfScenario {
  id?: number;
  name: string;
  description?: string;
  categoryId?: number; // Если null - применяется ко всем категориям
  categoryName?: string;
  deltaMarkup: number; // Изменение наценки в процентах (Δ)
  currentMarkup: number; // Текущая наценка
  newMarkup: number; // Новая наценка
  currentPrice: number; // Текущая цена
  newPrice: number; // Новая цена (P_new = Cs * (1 + (Un + Δ)/100))
  currentProfit: number; // Текущая прибыль
  newProfit: number; // Новая прибыль
  profitChange: number; // Изменение прибыли
  profitChangePercent: number; // Изменение прибыли в процентах
  createdAt: string;
}

export interface CreateWhatIfScenarioDto {
  name: string;
  description?: string;
  categoryId?: number;
  deltaMarkup: number; // Изменение наценки в процентах
}



