import { Routes } from '@angular/router';

/** Gestión de Bienes Muebles: por ahora solo Aprobación de subasta pública electrónica, con datos de muestra. */
export const BIENES_MUEBLES_ROUTES: Routes = [
  {
    path: 'procesos/aprobacion-subasta',
    loadComponent: () =>
      import('./aprobacion-subasta/pages/documents/aprobacion-subasta-documents.component').then(
        (m) => m.AprobacionSubastaDocumentsComponent,
      ),
  },
  {
    path: 'procesos/aprobacion-subasta/solicitud/:id',
    loadComponent: () =>
      import('./aprobacion-subasta/pages/solicitud/aprobacion-subasta-detalle.component').then(
        (m) => m.AprobacionSubastaDetalleComponent,
      ),
  },
];
