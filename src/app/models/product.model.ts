import { ProductCategory } from "./product-category.model";

// Товар/блюдо с полной структурой для расчета себестоимости
export interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number; // ID категории блюда
  category?: ProductCategory;
  
  // Себестоимость и расчеты
  cs: number; // Стоимость сырьевого набора на порцию (из 1С, без наценки)
  sp: number; // Полная себестоимость порции (SP = Cs + H + Tr + A)
  h: number; // Сумма наценки (H = (Ун * Сс) / 100)
  tr: number; // Транспортные расходы (Tr = Сс * Ктр)
  a: number; // Амортизация оборудования на порцию
  vat: number; // НДС (если транспортировка за пределы предприятия)
  
  // Цена
  p: number; // Конечная отпускная цена за порцию (P = SP + (SP * Un/100) + НДС)
  un: number; // Уровень наценки в процентах (из категории)
  
  // Дополнительные данные
  isTransportedOutside: boolean; // Транспортируется ли за пределы предприятия (для НДС)
  portionCount: number; // Количество порций из сырьевого набора
  quantity: number; // Количество порций в наличии/реализовано
  
  // Статус
  isApproved: boolean; // Утверждена ли цена начальником
  approvedAt?: string;
  approvedBy?: number;
  
  // Метаданные
  createdAt: string;
  updatedAt: string;
  importedFrom1C: boolean; // Импортирован из 1С
  importDate?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  categoryId: number;
  cs: number; // Стоимость сырьевого набора
  portionCount?: number; // Количество порций (по умолчанию 1)
  isTransportedOutside?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  categoryId?: number;
  cs?: number;
  isTransportedOutside?: boolean;
}

// Для импорта из Excel
export interface ImportProductDto {
  name: string;
  categoryName?: string; // Название категории для сопоставления
  cs: number; // Стоимость сырьевого набора
  portionCount?: number;
  isTransportedOutside?: boolean;
}
  