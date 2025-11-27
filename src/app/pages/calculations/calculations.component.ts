import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Calculation, CreateCalculationDto } from '../../models/calculation.model';
import { Product } from '../../models/product.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calculations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  calculations: Calculation[] = [];
  selectedProductId: number = 0;
  customMarkup: number = 0;
  userId: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).id;
    }

    this.api.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.products = data);
    this.api.getCalculations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.calculations = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitCalculation() {
    if (this.selectedProductId && this.customMarkup) {
      const dto: CreateCalculationDto = {
        productId: this.selectedProductId,
        userId: this.userId,
        customMarkup: this.customMarkup
      };

      this.api.createCalculation(dto)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.api.getCalculations()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => this.calculations = data);
          this.selectedProductId = 0;
          this.customMarkup = 0;
        });
    }
  }
  calculateFinalPrice(calc: any): number {
    if (!calc) return 0;
    return calc.p || 0; // Используем рассчитанную цену P
  }
}
