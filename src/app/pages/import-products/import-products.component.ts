import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-import-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.scss']
})
export class ImportProductsComponent implements OnInit {
  selectedFile: File | null = null;
  isUploading = false;
  importResult: { imported: number; errors: any[] } | null = null;
  canImport = false;

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.canImport = this.auth.canAccessAccountantFeatures();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Выберите файл для загрузки');
      return;
    }

    this.isUploading = true;
    this.importResult = null;

    this.api.importProducts(this.selectedFile).subscribe({
      next: (result) => {
        this.importResult = result;
        this.isUploading = false;
        if (result.errors.length > 0) {
          console.error('Ошибки импорта:', result.errors);
        }
      },
      error: (error) => {
        console.error('Ошибка импорта:', error);
        this.isUploading = false;
        alert('Ошибка при импорте файла');
      }
    });
  }

  downloadTemplate(): void {
    // Скачиваем шаблон Excel с сервера
    this.api.downloadImportTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'template_import_products.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Ошибка при скачивании шаблона:', error);
        alert('Ошибка при скачивании шаблона');
      }
    });
  }
}



