import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-price-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './price-approval.component.html',
  styleUrls: ['./price-approval.component.scss']
})
export class PriceApprovalComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: number[] = [];
  canApprove = false;
  canRecalculate = false;

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.canApprove = this.auth.canApprovePrices();
    this.canRecalculate = this.auth.canAccessAccountantFeatures();
    this.loadProducts();
  }

  loadProducts(): void {
    this.api.getProducts().subscribe(data => {
      this.products = data.filter(p => !p.isApproved); // Только неутвержденные
    });
  }

  toggleProductSelection(productId: number): void {
    const index = this.selectedProducts.indexOf(productId);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(productId);
    }
  }

  selectAll(): void {
    this.selectedProducts = this.products.map(p => p.id);
  }

  deselectAll(): void {
    this.selectedProducts = [];
  }

  recalculateAll(): void {
    if (confirm('Пересчитать все цены? Это обновит цены для всех товаров.')) {
      this.api.recalculateAllPrices().subscribe({
        next: (result) => {
          alert(`Пересчитано товаров: ${result.recalculated}`);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Ошибка пересчета:', error);
          alert('Ошибка при пересчете цен');
        }
      });
    }
  }

  approveSelected(): void {
    if (this.selectedProducts.length === 0) {
      alert('Выберите товары для утверждения');
      return;
    }

    if (confirm(`Утвердить цены для ${this.selectedProducts.length} товаров?`)) {
      const user = this.auth.getUser();
      if (!user) {
        alert('Пользователь не авторизован');
        return;
      }

      this.api.approvePrices(this.selectedProducts).subscribe({
        next: () => {
          alert('Цены успешно утверждены');
          this.selectedProducts = [];
          this.loadProducts();
        },
        error: (error) => {
          console.error('Ошибка утверждения:', error);
          alert('Ошибка при утверждении цен');
        }
      });
    }
  }

  isSelected(productId: number): boolean {
    return this.selectedProducts.includes(productId);
  }
}

