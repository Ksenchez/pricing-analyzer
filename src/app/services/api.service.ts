import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreateProductDto, Product, UpdateProductDto, ImportProductDto } from '../models/product.model';
import { PricingPolicy } from '../models/pricing-policy.model';
import { Calculation, CreateCalculationDto } from '../models/calculation.model';
import { Normative, CreateNormativeDto, UpdateNormativeDto, NormativeHistory, CategoryMarkup } from '../models/normative.model';
import { ProductCategory, CreateProductCategoryDto } from '../models/product-category.model';
import { KPI, KPITrend, WhatIfScenario, CreateWhatIfScenarioDto } from '../models/kpi.model';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = 'http://localhost:5001/api/'; // меняй порт под себя

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api + 'products/getall')
  }
  getByIdProduct(id: number): Observable<Product> {
    return this.http.get<Product>(this.api + `products/${id}`)
  }

  addProduct(data: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.api + 'products', data);
  }
  
  updateProduct(data: UpdateProductDto, id: number): Observable<Product> {
    return this.http.put<Product>(this.api + `products/${id}`, data);
  }

  deleteProduct(id: number) {
   return this.http.delete(this.api + `products/${id}`)
  }

  // Импорт товаров из Excel
  importProducts(file: File): Observable<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imported: number; errors: any[] }>(this.api + 'products/import', formData);
  }

  // Скачать шаблон для импорта
  downloadImportTemplate(): Observable<Blob> {
    return this.http.get(this.api + 'products/template', { responseType: 'blob' });
  }

  // Пересчет всех цен
  recalculateAllPrices(): Observable<{ recalculated: number }> {
    return this.http.post<{ recalculated: number }>(this.api + 'products/recalculate', {});
  }

  // Утверждение цен
  approvePrices(productIds: number[]): Observable<void> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.post<void>(this.api + 'products/approve', { 
      productIds,
      approvedBy: user.id || 1
    });
  }

   getPricingPolicies(): Observable<PricingPolicy[]> {
    return this.http.get<PricingPolicy[]>(this.api + 'pricingpolicies');
  }

   getPricingPolicyById(id: number): Observable<PricingPolicy> {
    return this.http.get<PricingPolicy>(this.api + `pricingpolicies/${id}`);
  }

  addPricingPolicy(data: PricingPolicy): Observable<PricingPolicy> {
    return this.http.post<PricingPolicy>(this.api + 'pricingpolicies', data);
  }

  updatePricingPolicy(data: PricingPolicy): Observable<PricingPolicy> {
    return this.http.put<PricingPolicy>(this.api + `pricingpolicies/${data.id}`, data);
  }

  deletePricingPolicy(id: number): Observable<void> {
    return this.http.delete<void>(this.api + `pricingpolicies/${id}`);
  }

  getCalculations(): Observable<Calculation[]> {
    return this.http.get<Calculation[]>(this.api + 'productcalculations');
  }

  createCalculation(data: CreateCalculationDto): Observable<Calculation> {
    return this.http.post<Calculation>(this.api + 'productcalculations', data);
  }
  getChartData(): Observable<{ date: string; totalFinalPrice: number }[]> {
    return this.http.get<{ date: string; totalFinalPrice: number }[]>(this.api + 'productcalculations/chart-data');
  }
  

  getProductPriceHistory(productId: number): Observable<{ date: string, price: number, customMarkup: number }[]> {
    return this.http.get<{ date: string, price: number, customMarkup: number }[]>(this.api + `productcalculations/price-history/${productId}`);
  }
  
  getProfitabilityReport(): Observable<any[]> {
    return this.http.get<any[]>(this.api + `productcalculations/profitability-report`);
  }

  // ========== НОРМАТИВЫ ==========
  getNormatives(): Observable<Normative[]> {
    return this.http.get<Normative[]>(this.api + 'normatives');
  }

  getNormativeById(id: number): Observable<Normative> {
    return this.http.get<Normative>(this.api + `normatives/${id}`);
  }

  createNormative(data: CreateNormativeDto): Observable<Normative> {
    return this.http.post<Normative>(this.api + 'normatives', data);
  }

  updateNormative(id: number, data: UpdateNormativeDto): Observable<Normative> {
    return this.http.put<Normative>(this.api + `normatives/${id}`, data);
  }

  deleteNormative(id: number): Observable<void> {
    return this.http.delete<void>(this.api + `normatives/${id}`);
  }

  getNormativeHistory(normativeId: number): Observable<NormativeHistory[]> {
    return this.http.get<NormativeHistory[]>(this.api + `normatives/${normativeId}/history`);
  }

  // Наценки по категориям
  getCategoryMarkups(): Observable<CategoryMarkup[]> {
    return this.http.get<CategoryMarkup[]>(this.api + 'normatives/category-markups');
  }

  updateCategoryMarkup(id: number, markupPercent: number): Observable<CategoryMarkup> {
    return this.http.put<CategoryMarkup>(this.api + `normatives/category-markups/${id}`, { markupPercent });
  }

  // ========== КАТЕГОРИИ ПРОДУКТОВ ==========
  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.api + 'categories');
  }

  getCategoryById(id: number): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(this.api + `categories/${id}`);
  }

  createCategory(data: CreateProductCategoryDto): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(this.api + 'categories', data);
  }

  updateCategory(id: number, data: CreateProductCategoryDto): Observable<ProductCategory> {
    return this.http.put<ProductCategory>(this.api + `categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(this.api + `categories/${id}`);
  }

  // ========== KPI ==========
  getKPI(periodStart?: string, periodEnd?: string): Observable<KPI> {
    let params = new HttpParams();
    if (periodStart) params = params.set('periodStart', periodStart);
    if (periodEnd) params = params.set('periodEnd', periodEnd);
    return this.http.get<KPI>(this.api + 'kpi', { params });
  }

  getKPITrends(periodStart?: string, periodEnd?: string): Observable<KPITrend[]> {
    let params = new HttpParams();
    if (periodStart) params = params.set('periodStart', periodStart);
    if (periodEnd) params = params.set('periodEnd', periodEnd);
    return this.http.get<KPITrend[]>(this.api + 'kpi/trends', { params });
  }

  // ========== СЦЕНАРИИ "ЧТО-ЕСЛИ" ==========
  getWhatIfScenarios(): Observable<WhatIfScenario[]> {
    return this.http.get<WhatIfScenario[]>(this.api + 'what-if');
  }

  createWhatIfScenario(data: CreateWhatIfScenarioDto): Observable<WhatIfScenario> {
    return this.http.post<WhatIfScenario>(this.api + 'what-if', data);
  }

  deleteWhatIfScenario(id: number): Observable<void> {
    return this.http.delete<void>(this.api + `what-if/${id}`);
  }

  // ========== ПОЛЬЗОВАТЕЛИ ==========
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api + 'users');
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.api + `users/${id}`);
  }

  createUser(data: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.api + 'users', data);
  }

  updateUser(id: number, data: UpdateUserDto): Observable<User> {
    return this.http.put<User>(this.api + `users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this.api + `users/${id}`);
  }

  resetUserPassword(id: number, newPassword: string): Observable<void> {
    return this.http.post<void>(this.api + `users/${id}/reset-password`, { newPassword });
  }

  // ========== ОТЧЕТЫ ==========
  exportReportToExcel(reportType: string, periodStart?: string, periodEnd?: string): Observable<Blob> {
    let params = new HttpParams().set('type', reportType);
    if (periodStart) params = params.set('periodStart', periodStart);
    if (periodEnd) params = params.set('periodEnd', periodEnd);
    return this.http.get(this.api + 'reports/excel', { params, responseType: 'blob' });
  }

  exportReportToPDF(reportType: string, periodStart?: string, periodEnd?: string): Observable<Blob> {
    let params = new HttpParams().set('type', reportType);
    if (periodStart) params = params.set('periodStart', periodStart);
    if (periodEnd) params = params.set('periodEnd', periodEnd);
    return this.http.get(this.api + 'reports/pdf', { params, responseType: 'blob' });
  }
  
}
