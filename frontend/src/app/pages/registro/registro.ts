import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

const contrasenasCoinciden = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmar = control.get('confirmarPassword')?.value;
  return password && confirmar && password !== confirmar ? { noCoincide: true } : null;
};

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    },
    { validators: contrasenasCoinciden }
  );

  enviar(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const { nombre, correo, password } = this.formulario.getRawValue();

    this.authService.registrar({ nombre, correo, password }).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error) => {
        this.enviando.set(false);
        this.error.set(error.status === 409 ? 'Ya existe una cuenta con ese correo.' : 'No se pudo crear la cuenta. Intenta de nuevo.');
      }
    });
  }
}
