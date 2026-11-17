import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContactosService } from '../../core/services/contactos.service';
import { CafeteriaService } from '../../core/services/cafeteria.service';
import { CafeteriaInfo } from '../../core/models/cafeteria-info.model';

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export class Contacto {
  private readonly fb = inject(FormBuilder);
  private readonly contactosService = inject(ContactosService);
  private readonly cafeteriaService = inject(CafeteriaService);

  readonly info = signal<CafeteriaInfo | null>(null);
  readonly enviando = signal(false);
  readonly enviado = signal(false);
  readonly errorEnvio = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    mensaje: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor() {
    this.cafeteriaService.obtenerInformacion().subscribe({
      next: (info) => this.info.set(info),
      error: () => this.info.set(null)
    });
  }

  enviar(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set(null);

    const { nombre, correo, telefono, mensaje } = this.formulario.getRawValue();

    this.contactosService.enviar({ nombre, correo, telefono: telefono || undefined, mensaje }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
        this.formulario.reset();
      },
      error: () => {
        this.enviando.set(false);
        this.errorEnvio.set('No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.');
      }
    });
  }
}
