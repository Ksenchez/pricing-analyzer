import { Component, OnInit } from '@angular/core';
import { PricingPolicy } from '../../models/pricing-policy.model';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing-policies',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pricing-policies.component.html',
  styleUrl: './pricing-policies.component.scss'
})

export class PricingPoliciesComponent implements OnInit {
  pricingPolicies: PricingPolicy[] = [];
  newPolicy: PricingPolicy = {
    id: 0,
    policyName: '',
    description: '',
    defaultMarkupPercent: 0,
    isActive: true
  };

  selectedPolicy: PricingPolicy = {
    id: -1,
    policyName: '',
    description: '',
    defaultMarkupPercent: 0,
    isActive: true
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getPricingPolicies();
  }

  // Получение всех ценовых политик
  getPricingPolicies() {
    this.apiService.getPricingPolicies().subscribe((data: PricingPolicy[]) => {
      this.pricingPolicies = data;
    });
  }

  // Добавление новой ценовой политики
  addPricingPolicy() {
    this.apiService.addPricingPolicy(this.newPolicy).subscribe(() => {
      this.getPricingPolicies();
      this.newPolicy = { id: 0, policyName: '', description: '', defaultMarkupPercent: 0, isActive: true }; // очищаем форму
    });
  }

  // Выбор ценовой политики для редактирования
  editPricingPolicy(id: number) {
    this.apiService.getPricingPolicyById(id).subscribe((data: PricingPolicy) => {
      this.selectedPolicy = { ...data };
    });
  }

  // Обновление ценовой политики
  updatePricingPolicy() {
    if (this.selectedPolicy) {
      this.apiService.updatePricingPolicy(this.selectedPolicy).subscribe(() => {
        this.getPricingPolicies(); // Обновляем список после обновления
        this.selectedPolicy.id = -1; // Закрываем модальное окно
      });
    }
  }

  // Удаление ценовой политики
  deletePricingPolicy(id: number) {
    this.apiService.deletePricingPolicy(id).subscribe(() => {
      this.getPricingPolicies(); // Обновляем список после удаления
    });
  }

  // Отмена редактирования
  cancelEdit() {
    this.selectedPolicy.id = -1;
  }
}