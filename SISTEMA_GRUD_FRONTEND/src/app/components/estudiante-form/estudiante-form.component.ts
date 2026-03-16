import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Estudiante } from '../../models/estudiante.model';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estudiante-form.component.html',
  styleUrl: './estudiante-form.component.css'
})
export class EstudianteFormComponent implements OnInit {
  @Input() estudiante: Estudiante | null = null;
  @Output() onSubmit = new EventEmitter<Estudiante>();
  @Output() onCancel = new EventEmitter<void>();

  formulario!: FormGroup;
  isEditMode: boolean = false;

  carreras: string[] = [
    'Ing. en Sistemas',
    'Ing. Industrial',
    'Lic. en Informática',
    'Ing. Civil',
    'Lic. en Administración',
    'Ing. Mecánica',
    'Lic. en Derecho',
    'Ing. Electrónica'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.estudiante;
    this.formulario = this.fb.group({
      nombre: [
        this.estudiante?.nombre || '',
        [Validators.required, Validators.minLength(3)]
      ],
      carnet: [
        this.estudiante?.carnet || '',
        [Validators.required]
      ],
      email: [
        this.estudiante?.email || '',
        [Validators.required, Validators.email]
      ],
      carrera: [
        this.estudiante?.carrera || '',
        [Validators.required]
      ],
      semestre: [
        this.estudiante?.semestre || 1,
        [Validators.required, Validators.min(1), Validators.max(12)]
      ],
      estado: [
        this.estudiante?.estado || 'Activo',
        [Validators.required]
      ]
    });
  }

  get f() {
    return this.formulario.controls;
  }

  submitForm(): void {
    if (this.formulario.valid) {
      this.onSubmit.emit(this.formulario.value);
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.onCancel.emit();
  }
}
