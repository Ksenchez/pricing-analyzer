import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { WhatIfScenario, CreateWhatIfScenarioDto } from '../../models/kpi.model';
import { ProductCategory } from '../../models/product-category.model';

@Component({
  selector: 'app-what-if',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './what-if.component.html',
  styleUrls: ['./what-if.component.scss']
})
export class WhatIfComponent implements OnInit {
  scenarios: WhatIfScenario[] = [];
  categories: ProductCategory[] = [];
  showCreateModal = false;
  canCreate = false;

  newScenario: CreateWhatIfScenarioDto = {
    name: '',
    description: '',
    categoryId: undefined,
    deltaMarkup: 0
  };

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.canCreate = this.auth.canAccessEconomistFeatures();
    this.loadScenarios();
    this.loadCategories();
  }

  loadScenarios(): void {
    this.api.getWhatIfScenarios().subscribe(data => {
      this.scenarios = data;
    });
  }

  loadCategories(): void {
    this.api.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  openCreateModal(): void {
    this.newScenario = {
      name: '',
      description: '',
      categoryId: undefined,
      deltaMarkup: 0
    };
    this.showCreateModal = true;
  }

  createScenario(): void {
    this.api.createWhatIfScenario(this.newScenario).subscribe(() => {
      this.loadScenarios();
      this.showCreateModal = false;
    });
  }

  deleteScenario(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этот сценарий?')) {
      this.api.deleteWhatIfScenario(id).subscribe(() => {
        this.loadScenarios();
      });
    }
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'Все категории';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Неизвестно';
  }
}

