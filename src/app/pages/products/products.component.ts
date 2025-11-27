import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateProductDto, Product } from '../../models/product.model';
import { ProductCategory } from '../../models/product-category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: ProductCategory[] = [];

  newProduct: CreateProductDto = {
    name: '',
    description: '',
    categoryId: 0,
    cs: 0,
    portionCount: 1,
    isTransportedOutside: false
  };

  editProductDto: CreateProductDto = {
    name: '',
    description: '',
    categoryId: 0,
    cs: 0,
    portionCount: 1,
    isTransportedOutside: false
  };

  selectedProduct: Product | null = null;
  showCreateModal = false;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  getCategories() {
    this.apiService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  openCreateModal() {
    this.newProduct = {
      name: '',
      description: '',
      categoryId: 0,
      cs: 0,
      portionCount: 1,
      isTransportedOutside: false
    };
    this.showCreateModal = true;
  }

  addProduct() {
    this.apiService.addProduct(this.newProduct).subscribe(() => {
      this.getProducts();
      this.showCreateModal = false;
      this.newProduct = {
        name: '',
        description: '',
        categoryId: 0,
        cs: 0,
        portionCount: 1,
        isTransportedOutside: false
      };
    });
  }
  
  updateProduct() {
    if (!this.selectedProduct) return;
    const id = this.selectedProduct.id;
    this.apiService.updateProduct(this.editProductDto, id).subscribe(() => {
      this.getProducts();
      this.selectedProduct = null;
    });
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe(() => {
      this.getProducts();
    });
  }

  editProduct(id: number) {
    this.apiService.getByIdProduct(id).subscribe((data: Product) => {
      this.selectedProduct = data;
      this.editProductDto = {
        name: data.name,
        description: data.description || '',
        categoryId: data.categoryId,
        cs: data.cs,
        portionCount: data.portionCount,
        isTransportedOutside: data.isTransportedOutside
      };
    });
  }

  cancelEdit() {
    this.selectedProduct = null;
  }
}
