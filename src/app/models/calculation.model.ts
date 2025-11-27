import { Product } from './product.model';

export interface Calculation {
  id: number;
  productId: number;
  userId: number;
  calculatedAt: string;
  
  // Сохранение всех значений расчета для истории
  cs: number; // Стоимость сырьевого набора
  h: number; // Наценка
  tr: number; // Транспорт
  a: number; // Амортизация
  sp: number; // Себестоимость
  vat: number; // НДС
  p: number; // Цена
  un: number; // Уровень наценки
  
  product?: Product;
  user?: {
    id: number;
    username: string;
  };
}

export interface CreateCalculationDto {
  productId: number;
  userId: number;
  customMarkup: number; // Для обратной совместимости, но на бэкенде не используется
}