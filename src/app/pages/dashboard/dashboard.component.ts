import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { KPI } from '../../models/kpi.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  kpi: KPI | null = null;
  periodStart: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
  periodEnd: string = new Date().toISOString().split('T')[0];
  isLoading = false;

  // График динамики себестоимости
  costChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Средняя себестоимость',
      data: [],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4
    }]
  };

  costChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Динамика себестоимости' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadKPI();
    this.loadChartData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadKPI(): void {
    if (!this.periodStart || !this.periodEnd) {
      return;
    }

    this.isLoading = true;
    this.kpi = null; // Очищаем старые данные
    
    this.api.getKPI(this.periodStart, this.periodEnd)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.kpi = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка загрузки KPI:', error);
          this.isLoading = false;
          this.kpi = null;
        }
      });
  }

  loadChartData(): void {
    // Загружаем данные за последние 6 месяцев для графика
    const chartPeriodStart = new Date();
    chartPeriodStart.setMonth(chartPeriodStart.getMonth() - 6);
    const chartPeriodEnd = new Date();

    this.api.getKPITrends(
      chartPeriodStart.toISOString().split('T')[0],
      chartPeriodEnd.toISOString().split('T')[0]
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trends) => {
          if (trends && trends.length > 0) {
            this.costChartData.labels = trends.map(t => {
              const date = new Date(t.date);
              return date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
            });
            this.costChartData.datasets[0].data = trends.map(t => t.averageCost);
            // Обновляем график
            this.costChartData = { ...this.costChartData };
          }
        },
        error: (error) => {
          console.error('Ошибка загрузки данных для графика:', error);
        }
      });
  }

  onPeriodChange(): void {
    // Загружаем KPI сразу, так как ngModelChange гарантирует обновление значения
    this.loadKPI();
  }
}
