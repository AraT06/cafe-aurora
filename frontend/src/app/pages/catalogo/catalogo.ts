import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CatalogoService } from '../../core/services/catalogo.service';
import { Especialidad, GaleriaItem, Servicio } from '../../core/models/catalogo.model';

type Pestana = 'servicios' | 'especialidades' | 'galeria';

@Component({
  selector: 'app-catalogo',
  imports: [],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class Catalogo implements OnInit {
  private readonly catalogoService = inject(CatalogoService);

  readonly pestanaActiva = signal<Pestana>('especialidades');
  readonly cargando = signal(true);
  readonly error = signal(false);

  readonly servicios = signal<Servicio[]>([]);
  readonly especialidades = signal<Especialidad[]>([]);
  readonly galeria = signal<GaleriaItem[]>([]);

  ngOnInit(): void {
    forkJoin({
      servicios: this.catalogoService.obtenerServicios(),
      especialidades: this.catalogoService.obtenerEspecialidades(),
      galeria: this.catalogoService.obtenerGaleria()
    }).subscribe({
      next: ({ servicios, especialidades, galeria }) => {
        this.servicios.set(servicios);
        this.especialidades.set(especialidades);
        this.galeria.set(galeria);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  seleccionarPestana(pestana: Pestana): void {
    this.pestanaActiva.set(pestana);
  }
}
