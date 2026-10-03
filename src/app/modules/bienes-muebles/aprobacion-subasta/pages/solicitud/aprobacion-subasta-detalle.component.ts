import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CurrentUserService } from '../../../../../core/auth/current-user.service';

import { ESTADO } from '../../../../../core/models/documento.model';
import type { BreadcrumbItem } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { FormTableSearchComponent } from '../../../../../shared/components/form-table-search/form-table-search.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { RequestApprovalModalsComponent } from '../../../../../shared/components/request-approval-modals/request-approval-modals.component';
import { SolicitudeFormCardComponent } from '../../../../../shared/components/solicitude-form-card/solicitude-form-card.component';
import { SolicitudeInfoCardComponent, SolicitudeInfoField } from '../../../../../shared/components/solicitude-info-card/solicitude-info-card.component';
import { SolicitudePageLayoutComponent } from '../../../../../shared/components/solicitude-page-layout/solicitude-page-layout.component';
import { TableControlsComponent } from '../../../../../shared/components/table-controls/table-controls.component';
import { buildProcessBreadcrumbs } from '../../../../../shared/utils/breadcrumbs.util';
import { ActionTrackerComponent, ActionTrackerSummary } from '../../../../../shared/ui/action-tracker/action-tracker.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CollapsibleCardComponent, CollapsibleCardField } from '../../../../../shared/ui/collapsible-card/collapsible-card.component';
import type { FlowStatus } from '../../../../../shared/ui/flow-status-tag/flow-status-tag.component';
import { DocumentSummaryCardComponent } from '../../../../../shared/ui/document-summary-card/document-summary-card.component';
import { IconComponent } from '../../../../../shared/ui/icon/icon.component';
import { SummaryCardComponent, SummaryCardField } from '../../../../../shared/ui/summary-card/summary-card.component';
import { PROCESS_ID, PROCESS_ROUTE } from '../../config/aprobacion-subasta.rutas';

interface Constancia {
  numeroItem: string;
  tipoDocumento: string;
  nombreArchivo: string;
  fechaRegistro: string;
}

/**
 * Detalle de un registro de pago de garantía verificado (Aprobación de subasta pública electrónica). Todavía sin
 * backend simulado: los datos son de muestra fijos, solo para ver la pantalla armada según el prototipo de Figma.
 * El rol y estado del encabezado (aprobador + verificado) habilitan Observar y Aprobar. Aprobar abre el modal de
 * confirmación y, al aceptar, el documento pasa a «Aprobado» (etiqueta de estado, botonera del encabezado y «Aprobado
 * por» de la trazabilidad) y avisa con el snackbar; el cambio vive solo en la pantalla. Observar todavía no hace nada.
 * Rechazar no existe en este proceso (`allowReject` en false).
 */
@Component({
  selector: 'siaf-aprobacion-subasta-detalle',
  standalone: true,
  imports: [
    SolicitudePageLayoutComponent,
    SolicitudeInfoCardComponent,
    SolicitudeFormCardComponent,
    DocumentSummaryCardComponent,
    CollapsibleCardComponent,
    SummaryCardComponent,
    FormTableSearchComponent,
    TableControlsComponent,
    PaginationComponent,
    RequestApprovalModalsComponent,
    ButtonComponent,
    IconComponent,
    ActionTrackerComponent,
  ],
  template: `
    <siaf-solicitude-page-layout
      [breadcrumbs]="breadcrumbs"
      role="approver"
      [state]="estadoEncabezado()"
      [heading]="heading"
      secondaryText="Creación"
      [showReturn]="true"
      [allowReject]="false"
      (approved)="abrirAprobar()"
    >
      <section class="grid gap-siaf-md lg:grid-cols-[1fr_360px]">
        <siaf-solicitude-info-card [fields]="camposEntidad" />
        <siaf-document-summary-card [documentNumber]="numeroDocumento" [status]="estado()" />
      </section>

      <siaf-solicitude-form-card title="Datos del proceso de subasta">
        <siaf-collapsible-card [fields]="datosProceso" [closable]="false">
          <div class="flex flex-col gap-siaf-lg px-siaf-lg py-siaf-md">
            @for (lote of lotes; track lote.numero) {
              <div class="flex min-h-12 items-center gap-siaf-xs rounded-siaf-sm border border-[var(--sys-color-divider-strong)] bg-surface px-siaf-md py-siaf-xxs">
                <siaf-icon class="shrink-0 text-[var(--sys-color-text-neutral-medium)]" name="expand_more" [size]="24" />
                <p class="m-0 text-sm font-medium text-[var(--sys-color-text-neutral-medium)]">
                  LOTE N°{{ lote.numero }}
                  <span class="text-[var(--sys-color-text-neutral-low)]">({{ lote.bienes }} bienes muebles)</span>
                </p>
              </div>
            }
          </div>
        </siaf-collapsible-card>
      </siaf-solicitude-form-card>

      <siaf-solicitude-form-card title="Datos de la orden de pago">
        <siaf-summary-card [fields]="ordenPago" [bordered]="true" [showIndicator]="true" [showClose]="false" />
      </siaf-solicitude-form-card>

      <siaf-solicitude-form-card title="Detalle del registro">
        <div class="flex flex-col gap-siaf-lg">
          <div class="grid gap-siaf-md sm:grid-cols-2 xl:grid-cols-4">
            @for (dato of resumenRegistro; track dato.label) {
              <div
                class="flex flex-col gap-siaf-xxs rounded-siaf-md border border-[var(--sys-color-divider-strong)] px-siaf-md py-siaf-sm"
                [class]="dato.destacado ? 'bg-[var(--color-palette-green1-50)]' : 'bg-[var(--sys-color-bg-surfaces-surface-lowest)]'"
              >
                <span class="min-h-4 text-[11px] font-medium uppercase tracking-[0.66px] text-[var(--sys-color-text-neutral-low)]">{{ dato.label }}</span>
                <span class="text-sm font-bold tracking-[-0.02px] text-[var(--sys-color-text-neutral-medium)]">{{ dato.value }}</span>
              </div>
            }
          </div>

          <div class="flex flex-col gap-siaf-md">
            <h3 class="m-0 text-sm font-bold uppercase text-text">Constancia(s) de operación bancaria</h3>

            <siaf-form-table-search placeholder="Buscar" [value]="busqueda()" (valueChange)="busqueda.set($event)" />

            <siaf-table-controls
              [showSelection]="false"
              [page]="1"
              [pageSize]="filasPorPagina()"
              [totalItems]="constanciasVisibles().length"
              [totalPages]="1"
            />

            <div class="siaf-table-shell">
              <table class="siaf-table">
                <thead>
                  <tr class="siaf-table-head-row">
                    <th class="siaf-table-th">N° ítem</th>
                    <th class="siaf-table-th">Tipo de documento</th>
                    <th class="siaf-table-th">Nombre del archivo</th>
                    <th class="siaf-table-th">Fecha de registro</th>
                    <th class="siaf-table-th"><span class="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (fila of constanciasVisibles(); track fila.numeroItem) {
                    <tr class="siaf-table-row">
                      <td class="siaf-table-td">{{ fila.numeroItem }}</td>
                      <td class="siaf-table-td">{{ fila.tipoDocumento }}</td>
                      <td class="siaf-table-td">{{ fila.nombreArchivo }}</td>
                      <td class="siaf-table-td">{{ fila.fechaRegistro }}</td>
                      <td class="siaf-table-td">
                        <div class="flex items-center justify-end gap-siaf-xs">
                          <siaf-button variant="text" size="sm" icon="file_download" [iconOnly]="true" [ariaLabel]="'Descargar ' + fila.nombreArchivo" />
                          <siaf-button variant="text" size="sm" icon="preview" [iconOnly]="true" [ariaLabel]="'Ver ' + fila.nombreArchivo" />
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td class="siaf-table-td text-center text-[var(--sys-color-text-neutral-low)]" colspan="5">Sin constancias que coincidan con la búsqueda.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <siaf-pagination
              navigation="Activate"
              position="Bottom"
              [rowPage]="true"
              [page]="1"
              [pageSize]="filasPorPagina()"
              [totalItems]="constanciasVisibles().length"
              [totalPages]="1"
              [rowsPerPage]="filasPorPagina()"
              (rowsPerPageChange)="filasPorPagina.set($event)"
            />
          </div>
        </div>
      </siaf-solicitude-form-card>

      <siaf-action-tracker [showSummaryCards]="true" [showTabs]="false" [summaryItems]="trazabilidad()" />
    </siaf-solicitude-page-layout>

    <siaf-request-approval-modals
      [approveOpen]="modalAprobar()"
      [reason]="comentario()"
      [snackbarOpen]="avisoAbierto()"
      snackbarVariant="creation-approved"
      requestType="creación"
      [requestNumber]="numeroDocumento"
      (approveConfirmed)="onConfirmarAprobar()"
      (approvalClosed)="modalAprobar.set(false)"
      (reasonChange)="comentario.set($event)"
      (snackbarClosed)="avisoAbierto.set(false)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AprobacionSubastaDetalleComponent {
  readonly heading = 'Registro de pago de garantía';
  readonly numeroDocumento = '001-2026';
  readonly estado = signal<FlowStatus>(ESTADO.VERIFICADO);
  readonly estadoEncabezado = computed(() => (this.estado() === ESTADO.APROBADO ? 'approved' : 'verified'));
  private readonly usuario = inject(CurrentUserService);
  private readonly aprobacion = signal<{ usuario: string; fecha: string } | null>(null);
  readonly breadcrumbs: BreadcrumbItem[] = buildProcessBreadcrumbs(PROCESS_ID, PROCESS_ROUTE, this.heading);

  readonly camposEntidad: SolicitudeInfoField[] = [
    { label: 'Fecha', value: '13/01/2026 07:40:15' },
    { label: 'Ente rector', value: 'MEF - DIRECCIÓN GENERAL DE ABASTECIMIENTO' },
    { label: 'Entidad', value: 'MINISTERIO DE TRANSPORTE Y COMUNICACIONES' },
  ];

  readonly datosProceso: CollapsibleCardField[] = [
    { label: 'Código del proceso', value: 'SPE-001-2026-MTC' },
    { label: 'Etapa', value: 'CONVOCATORIA Y HABILITACIÓN DE POSTORES' },
    { label: 'Lotes en los cuales postula', value: 2, icon: 'info', iconLabel: 'Detalle de los lotes' },
  ];

  readonly lotes = [
    { numero: '001', bienes: 10 },
    { numero: '002', bienes: 10 },
  ];

  readonly ordenPago: SummaryCardField[] = [
    { label: 'Nro', value: 'PAY-05-2025' },
    { label: 'Estado', value: 'Pendiente', tag: { label: 'Pendiente', icon: 'pending' } },
    { label: 'Cuenta de ingreso', value: '34534-213213213', icon: 'info', iconLabel: 'Información de la cuenta de ingreso' },
  ];

  readonly resumenRegistro = [
    { label: 'Cantidad de bienes muebles', value: '20', destacado: false },
    { label: 'Precio base total (S/)', value: 'S/ 11 000.00', destacado: false },
    { label: 'Garantía requerida (S/)', value: 'S/ 11 000.00', destacado: false },
    { label: 'Monto registrado', value: 'S/ 11 000.00', destacado: true },
  ];

  private readonly constancias: Constancia[] = [
    { numeroItem: '01', tipoDocumento: 'PDF', nombreArchivo: 'PAY-001-2026', fechaRegistro: '05/01/2025' },
  ];

  readonly busqueda = signal('');
  readonly filasPorPagina = signal(10);
  readonly constanciasVisibles = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) return this.constancias;
    return this.constancias.filter((c) => Object.values(c).some((valor) => valor.toLowerCase().includes(texto)));
  });

  readonly modalAprobar = signal(false);
  readonly avisoAbierto = signal(false);
  readonly comentario = signal('');

  abrirAprobar(): void {
    this.comentario.set('');
    this.modalAprobar.set(true);
  }

  /** Sin backend simulado: el cambio a «Aprobado» vive solo en esta pantalla y se pierde al recargar. */
  onConfirmarAprobar(): void {
    this.modalAprobar.set(false);
    this.estado.set(ESTADO.APROBADO);
    this.aprobacion.set({ usuario: this.usuario.name.toUpperCase(), fecha: this.ahora() });
    this.avisoAbierto.set(true);
  }

  readonly trazabilidad = computed((): ActionTrackerSummary[] => [
    { label: 'Elaborado por', actionBy: 'RICARDO JOHN DOE BUSTAMANTE', date: '19/08/2026 08:00:59' },
    { label: 'Verificado por', actionBy: 'RICARDO JOHN DOE BUSTAMANTE', date: '19/08/2025 08:00:59' },
    { label: 'Aprobado por', actionBy: this.aprobacion()?.usuario ?? '', date: this.aprobacion()?.fecha ?? '' },
  ]);

  private ahora(): string {
    return new Date()
      .toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      .replace(', ', ' ');
  }
}
