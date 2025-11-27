import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Normative, NormativeType } from '../models/normative.model';
import { ProductCategory } from '../models/product-category.model';

/**
 * Сервис для расчета себестоимости и цен по формулам
 */
@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  
  /**
   * Расчет суммы наценки
   * Н = (Ун * Сс) / 100
   */
  calculateMarkup(cs: number, un: number): number {
    return (un * cs) / 100;
  }

  /**
   * Расчет транспортных расходов
   * Тр = Сс * Ктр
   */
  calculateTransport(cs: number, transportCoefficient: number): number {
    return cs * (transportCoefficient / 100);
  }

  /**
   * Расчет амортизации на порцию
   * А = Σ Амортизационных отчислений / Количество порций
   */
  calculateDepreciation(totalDepreciation: number, portionCount: number): number {
    if (portionCount <= 0) return 0;
    return totalDepreciation / portionCount;
  }

  /**
   * Расчет НДС (20% если транспортировка за пределы предприятия)
   */
  calculateVAT(sp: number, isTransportedOutside: boolean, vatRate: number = 20): number {
    if (!isTransportedOutside) return 0;
    return sp * (vatRate / 100);
  }

  /**
   * Расчет полной себестоимости порции
   * СП = СС + Н + Тр + А
   */
  calculateFullCost(
    cs: number, // Стоимость сырьевого набора
    un: number, // Уровень наценки
    transportCoefficient: number, // Коэффициент транспортных расходов
    totalDepreciation: number, // Общая амортизация
    portionCount: number = 1 // Количество порций
  ): {
    cs: number;
    h: number; // Наценка
    tr: number; // Транспорт
    a: number; // Амортизация
    sp: number; // Полная себестоимость
  } {
    const h = this.calculateMarkup(cs, un);
    const tr = this.calculateTransport(cs, transportCoefficient);
    const a = this.calculateDepreciation(totalDepreciation, portionCount);
    const sp = cs + h + tr + a;

    return { cs, h, tr, a, sp };
  }

  /**
   * Расчет конечной отпускной цены за порцию
   * P = SP + (SP * Un/100) + НДС
   * Или: P = SP * (1 + Un/100) + НДС
   */
  calculateFinalPrice(
    sp: number, // Полная себестоимость
    un: number, // Уровень наценки
    isTransportedOutside: boolean, // Транспортировка за пределы предприятия
    vatRate: number = 20 // Ставка НДС
  ): {
    sp: number;
    markupAmount: number; // Сумма наценки на SP
    vat: number;
    p: number; // Конечная цена
  } {
    const markupAmount = sp * (un / 100);
    const vat = this.calculateVAT(sp + markupAmount, isTransportedOutside, vatRate);
    const p = sp + markupAmount + vat;

    return { sp, markupAmount, vat, p };
  }

  /**
   * Полный расчет цены продукта
   */
  calculateProductPrice(
    product: Partial<Product>,
    category: ProductCategory,
    transportCoefficient: number,
    totalDepreciation: number,
    vatRate: number = 20
  ): Product {
    const cs = product.cs || 0;
    const un = category.markupPercent;
    const portionCount = product.portionCount || 1;
    const isTransportedOutside = product.isTransportedOutside || false;

    // Расчет себестоимости
    const costCalc = this.calculateFullCost(cs, un, transportCoefficient, totalDepreciation, portionCount);

    // Расчет цены
    const priceCalc = this.calculateFinalPrice(costCalc.sp, un, isTransportedOutside, vatRate);

    return {
      ...product as Product,
      cs,
      h: costCalc.h,
      tr: costCalc.tr,
      a: costCalc.a,
      sp: costCalc.sp,
      vat: priceCalc.vat,
      p: priceCalc.p,
      un,
      portionCount,
      isTransportedOutside
    } as Product;
  }

  /**
   * Расчет уровня наценки
   * Ун (%) = ((P - Cs) / Cs) * 100%
   */
  calculateMarkupLevel(p: number, cs: number): number {
    if (cs === 0) return 0;
    return ((p - cs) / cs) * 100;
  }

  /**
   * Расчет рентабельности
   * Рентабельность = (P - Cs) / P × 100
   */
  calculateProfitability(p: number, cs: number): number {
    if (p === 0) return 0;
    return ((p - cs) / p) * 100;
  }

  /**
   * Расчет валовой маржи
   * GrossMargin (%) = ((Revenue - COGS) / Revenue) * 100%
   */
  calculateGrossMargin(revenue: number, cogs: number): number {
    if (revenue === 0) return 0;
    return ((revenue - cogs) / revenue) * 100;
  }

  /**
   * Расчет прогноза изменения прибыли при изменении наценки
   * P_new = Cs * (1 + (Un + Δ)/100)
   */
  calculateWhatIfPrice(cs: number, currentUn: number, deltaUn: number): number {
    const newUn = currentUn + deltaUn;
    return cs * (1 + newUn / 100);
  }
}



