// Категории блюд
export interface ProductCategory {
  id: number;
  name: string; // "Первые блюда", "Вторые блюда", и т.д.
  code?: string; // Код категории
  description?: string;
  markupPercent: number; // Наценка для этой категории
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductCategoryDto {
  name: string;
  code?: string;
  description?: string;
  markupPercent: number;
}



