import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { KPITrend } from '../../models/kpi.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [FormsModule, CommonModule, NgChartsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  profitReport: any[] = [];
  showProfitReport = false;
  products: Product[] = [];
  selectedProductId = 0;
  selectedProduct: Product | null = null;
  kpiTrends: KPITrend[] = [];
  periodStart: string = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0];
  periodEnd: string = new Date().toISOString().split('T')[0];

  today = new Date();
  reportData: { date: string; customMarkup: number; finalPrice: number }[] = [];

  // График динамики наценки
  markupChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Наценка (%)',
      data: [],
      backgroundColor: '#8a2be2'
    }]
  };

  markupChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Динамика наценки по продукту' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // График трендов KPI
  trendsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Уровень наценки (%)',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4
      },
      {
        label: 'Валовая маржа (%)',
        data: [],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4
      },
      {
        label: 'Рентабельность (%)',
        data: [],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4
      }
    ]
  };

  trendsChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Динамика KPI показателей' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getProducts().subscribe(products => {
      this.products = products;
      if (products.length > 0) {
        this.selectedProductId = products[0].id;
        this.selectedProduct = products[0];
        this.loadMarkupChart();
      }
    });
    this.loadKPITrends();
    this.loadProfitReport();
  }

  loadMarkupChart() {
    this.selectedProduct = this.products.find(p => p.id === this.selectedProductId) || null;
    this.api.getProductPriceHistory(this.selectedProductId).subscribe(data => {
      this.markupChartData.labels = data.map(d => d.date);
      this.markupChartData.datasets[0].data = data.map(d => d.customMarkup);

      this.reportData = data.map(d => ({
        date: d.date,
        customMarkup: d.customMarkup,
        finalPrice: d.price
      }));

      setTimeout(() => this.chart?.update());
    });
  }

  loadKPITrends(): void {
    this.api.getKPITrends(this.periodStart, this.periodEnd).subscribe(data => {
      this.kpiTrends = data;
      this.trendsChartData.labels = data.map(t => t.date);
      this.trendsChartData.datasets[0].data = data.map(t => t.un);
      this.trendsChartData.datasets[1].data = data.map(t => t.grossMargin);
      this.trendsChartData.datasets[2].data = data.map(t => t.profitability);
      setTimeout(() => this.chart?.update());
    });
  }

  loadProfitReport() {
    this.api.getProfitabilityReport().subscribe(data => {
      this.profitReport = data;
      this.showProfitReport = true;
    });
  }

  onPeriodChange(): void {
    this.loadKPITrends();
  }

  exportToExcel(type: string): void {
    this.api.exportReportToExcel(type, this.periodStart, this.periodEnd).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте отчета');
      }
    });
  }

  exportToPDF(type: string): void {
    this.api.exportReportToPDF(type, this.periodStart, this.periodEnd).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте отчета');
      }
    });
  }

  printReport() {
    const printContents = document.getElementById('print-area')?.innerHTML;
    const originalContents = document.body.innerHTML;
  
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }

  // Прогнозирование (линейная регрессия)
  predictNextPeriod(): { un: number; grossMargin: number; profitability: number } {
    if (this.kpiTrends.length < 2) {
      return { un: 0, grossMargin: 0, profitability: 0 };
    }

    const n = this.kpiTrends.length;
    const lastUn = this.kpiTrends[n - 1].un;
    const prevUn = this.kpiTrends[n - 2].un;
    const predictedUn = lastUn + (lastUn - prevUn);

    const lastGrossMargin = this.kpiTrends[n - 1].grossMargin;
    const prevGrossMargin = this.kpiTrends[n - 2].grossMargin;
    const predictedGrossMargin = lastGrossMargin + (lastGrossMargin - prevGrossMargin);

    const lastProfitability = this.kpiTrends[n - 1].profitability;
    const prevProfitability = this.kpiTrends[n - 2].profitability;
    const predictedProfitability = lastProfitability + (lastProfitability - prevProfitability);

    return {
      un: Math.max(0, predictedUn),
      grossMargin: Math.max(0, predictedGrossMargin),
      profitability: Math.max(0, predictedProfitability)
    };
  }
}
