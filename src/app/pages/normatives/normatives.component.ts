import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Normative, CreateNormativeDto, UpdateNormativeDto, NormativeType, NormativeHistory, CategoryMarkup } from '../../models/normative.model';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-normatives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './normatives.component.html',
  styleUrls: ['./normatives.component.scss']
})
export class NormativesComponent implements OnInit {
  normatives: Normative[] = [];
  categoryMarkups: CategoryMarkup[] = [];
  selectedNormative: Normative | null = null;
  selectedHistory: NormativeHistory[] = [];
  showCreateModal = false;
  showEditModal = false;
  showHistoryModal = false;
  
  newNormative: CreateNormativeDto = {
    name: '',
    type: NormativeType.OTHER,
    value: 0,
    unit: '%'
  };

  editNormative: UpdateNormativeDto = {};

  normativeTypes = Object.values(NormativeType);
  canEdit = false;

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.canEdit = this.auth.canAccessEconomistFeatures();
    this.loadNormatives();
    this.loadCategoryMarkups();
  }

  loadNormatives(): void {
    this.api.getNormatives().subscribe(data => {
      this.normatives = data;
    });
  }

  loadCategoryMarkups(): void {
    this.api.getCategoryMarkups().subscribe(data => {
      this.categoryMarkups = data;
    });
  }

  openCreateModal(): void {
    this.newNormative = {
      name: '',
      type: NormativeType.OTHER,
      value: 0,
      unit: '%'
    };
    this.showCreateModal = true;
  }

  createNormative(): void {
    this.api.createNormative(this.newNormative).subscribe(() => {
      this.loadNormatives();
      this.showCreateModal = false;
    });
  }

  openEditModal(normative: Normative): void {
    this.selectedNormative = normative;
    this.editNormative = {
      name: normative.name,
      value: normative.value,
      unit: normative.unit,
      description: normative.description
    };
    this.showEditModal = true;
  }

  updateNormative(): void {
    if (!this.selectedNormative) return;
    this.api.updateNormative(this.selectedNormative.id, this.editNormative).subscribe(() => {
      this.loadNormatives();
      this.showEditModal = false;
      this.selectedNormative = null;
    });
  }

  deleteNormative(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этот норматив?')) {
      this.api.deleteNormative(id).subscribe(() => {
        this.loadNormatives();
      });
    }
  }

  openHistoryModal(normative: Normative): void {
    this.selectedNormative = normative;
    this.api.getNormativeHistory(normative.id).subscribe(data => {
      this.selectedHistory = data;
      this.showHistoryModal = true;
    });
  }

  updateCategoryMarkup(id: number, markupPercent: number): void {
    this.api.updateCategoryMarkup(id, markupPercent).subscribe(() => {
      this.loadCategoryMarkups();
    });
  }

  getNormativeTypeLabel(type: NormativeType): string {
    const labels: Record<NormativeType, string> = {
      [NormativeType.TRANSPORT_COEFFICIENT]: 'Коэффициент транспортных расходов',
      [NormativeType.VAT_RATE]: 'Ставка НДС',
      [NormativeType.AVERAGE_SALARY]: 'Средняя месячная заработная плата',
      [NormativeType.DEPRECIATION]: 'Амортизация оборудования',
      [NormativeType.OTHER]: 'Другое'
    };
    return labels[type] || type;
  }
}



