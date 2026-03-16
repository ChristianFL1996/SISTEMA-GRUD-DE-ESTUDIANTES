import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Estudiante } from '../../models/estudiante.model';
import { EstudianteService } from '../../services/estudiante.service';
import { EstudianteFormComponent } from '../estudiante-form/estudiante-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estudiante-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, EstudianteFormComponent],
  templateUrl: './estudiante-lista.component.html',
  styleUrl: './estudiante-lista.component.css'
})
export class EstudianteListaComponent implements OnInit, OnDestroy {
  estudiantes: Estudiante[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  limit: number = 5;
  totalRegistros: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  showForm: boolean = false;
  estudianteEditar: Estudiante | null = null;

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1;
      this.cargarEstudiantes();
    });

    this.cargarEstudiantes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.estudianteService.getEstudiantes(this.searchTerm, this.currentPage, this.limit)
      .subscribe({
        next: (response) => {
          this.estudiantes = response.data;
          this.totalRegistros = response.total;
          this.totalPages = Math.ceil(this.totalRegistros / this.limit);
          if (this.sortColumn) {
            this.sortData();
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar estudiantes:', err);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los estudiantes',
            confirmButtonColor: '#1a73e8'
          });
        }
      });
  }

  // ======== Sorting ========
  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  private sortData(): void {
    this.estudiantes.sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];

      let comparison = 0;
      if (typeof valA === 'string') {
        comparison = valA.localeCompare(valB, 'es');
      } else {
        comparison = valA - valB;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  // ======== Search & Pagination ========
  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onLimitChange(newLimit: number): void {
    this.limit = newLimit;
    this.currentPage = 1;
    this.cargarEstudiantes();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarEstudiantes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarEstudiantes();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.cargarEstudiantes();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ======== CRUD Operations ========
  abrirFormularioCrear(): void {
    this.estudianteEditar = null;
    this.showForm = true;
  }

  abrirFormularioEditar(estudiante: Estudiante): void {
    this.estudianteEditar = { ...estudiante };
    this.showForm = true;
  }

  cerrarFormulario(): void {
    this.showForm = false;
    this.estudianteEditar = null;
  }

  onFormSubmit(estudiante: Estudiante): void {
    if (this.estudianteEditar && this.estudianteEditar.id) {
      this.estudianteService.updateEstudiante(this.estudianteEditar.id, estudiante)
        .subscribe({
          next: () => {
            this.cerrarFormulario();
            this.cargarEstudiantes();
            Swal.fire({
              icon: 'success',
              title: '¡Actualizado!',
              text: 'El estudiante fue actualizado exitosamente',
              timer: 2500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el estudiante',
              confirmButtonColor: '#1a73e8'
            });
          }
        });
    } else {
      this.estudianteService.createEstudiante(estudiante)
        .subscribe({
          next: () => {
            this.cerrarFormulario();
            this.cargarEstudiantes();
            Swal.fire({
              icon: 'success',
              title: '¡Creado!',
              text: 'El estudiante fue registrado exitosamente',
              timer: 2500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el estudiante. Verifique que el carné no esté duplicado.',
              confirmButtonColor: '#1a73e8'
            });
          }
        });
    }
  }

  confirmarEliminar(estudiante: Estudiante): void {
    Swal.fire({
      title: '¿Eliminar estudiante?',
      html: `
        <p style="color:#64748b;margin-bottom:12px;">Esta acción no se puede deshacer.</p>
        <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">
          <strong>${estudiante.nombre}</strong>
          <span style="background:#e2e8f0;padding:2px 8px;border-radius:4px;margin-left:8px;font-size:0.85em;">${estudiante.carnet}</span>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: '🗑️ Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && estudiante.id) {
        this.estudianteService.deleteEstudiante(estudiante.id)
          .subscribe({
            next: () => {
              this.cargarEstudiantes();
              Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El estudiante fue eliminado del sistema',
                timer: 2500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
              });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el estudiante',
                confirmButtonColor: '#1a73e8'
              });
            }
          });
      }
    });
  }

  // ======== Helpers ========
  getEstadoClass(estado: string): string {
    return estado.toLowerCase() === 'activo' ? 'badge-activo' : 'badge-inactivo';
  }

  get startRecord(): number {
    return this.totalRegistros === 0 ? 0 : (this.currentPage - 1) * this.limit + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.limit, this.totalRegistros);
  }
}
