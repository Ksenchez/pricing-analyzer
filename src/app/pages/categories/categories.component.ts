import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ProductCategory, CreateProductCategoryDto } from '../../models/product-category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: ProductCategory[] = [];
  showCreateModal = false;
  showEditModal = false;
  selectedCategory: ProductCategory | null = null;
  canEdit = false;

  newCategory: CreateProductCategoryDto = {
    name: '',
    code: '',
    description: '',
    markupPercent: 0
  };

  editCategory: CreateProductCategoryDto = {
    name: '',
    code: '',
    description: '',
    markupPercent: 0
  };

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.canEdit = this.auth.canAccessEconomistFeatures();
    this.loadCategories();
  }

  loadCategories(): void {
    this.api.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  openCreateModal(): void {
    this.newCategory = {
      name: '',
      code: '',
      description: '',
      markupPercent: 0
    };
    this.showCreateModal = true;
  }

  createCategory(): void {
    this.api.createCategory(this.newCategory).subscribe(() => {
      this.loadCategories();
      this.showCreateModal = false;
    });
  }

  openEditModal(category: ProductCategory): void {
    this.selectedCategory = category;
    this.editCategory = {
      name: category.name,
      code: category.code || '',
      description: category.description || '',
      markupPercent: category.markupPercent
    };
    this.showEditModal = true;
  }

  updateCategory(): void {
    if (!this.selectedCategory) return;
    this.api.updateCategory(this.selectedCategory.id, this.editCategory).subscribe(() => {
      this.loadCategories();
      this.showEditModal = false;
      this.selectedCategory = null;
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      this.api.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}

