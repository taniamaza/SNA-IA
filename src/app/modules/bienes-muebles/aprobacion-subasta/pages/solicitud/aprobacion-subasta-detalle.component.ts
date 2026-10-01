import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActionTrackerComponent, ActionTrackerSummary } from '../../../../../shared/ui/action-tracker/action-tracker.component';
import { ReadonlyFieldComponent } from '../../../../../shared/ui/readonly-field/readonly-field.component';
import { TableComponent } from '../../../../../shared/ui/table/table.component';
import type { BreadcrumbItem } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { SolicitudeFormCardComponent } from '../../../../../shared/components/solicitude-form-card/solicitude-form-card.component';
import { SolicitudeInfoCardComponent, SolicitudeInfoField } from '../../../../../shared/components/solicitude-info-card/solicitude-info-card.component';
import { SolicitudePageLayoutComponent } from '../../../../../shared/components/solicitude-page-layout/solicitude-page-layout.component';
import type { DataTableColumn, DataTableRow } from '../../../../../shared/components/data-table/data-table.component';
import { buildProcessBreadcrumbs } from '../../../../../shared/utils/breadcrumbs.util';
import { PROCESS_ID, PROCESS_ROUTE } from '../../config/aprobacion-subasta.rutas';

/**
 * Detalle de una solicitud verificada de Aprobación de subasta pública electrónica. Todavía sin backend simulado:
 * los datos son de muestra fijos (el proceso de documentos está en `modoConsulta`), solo para
 * ver la pantalla armada según el diseño de Figma. El rol/estado del encabezado (aprobador +
 * verificado) habilita los botones Aprobar/Observar/Rechazar, pero no ejecutan ninguna acción real.
 */
@Component({
  selector: 'siaf-aprobacion-subasta-detalle',
  standalone: true,
  imports: [
    SolicitudePageLayoutComponent,
    SolicitudeInfoCardComponent,
    SolicitudeFormCardComponent,
    ReadonlyFieldComponent,
    TableComponent,
    ActionTrackerComponent,
  ],
  template: `
    <siaf-solicitude-page-layout
      [breadcrumbs]="breadcrumbs"
      role="approver"
      state="verified"
      [heading]="heading"
      [secondaryText]="numeroDocumento"
      [showReturn]="true"
    >
      <siaf-solicitude-info-card [fields]="camposEntidad" />

      <siaf-solicitude-form-card title="Datos del proceso de subasta">
        <div class="grid gap-x-siaf-xl gap-y-siaf-md md:grid-cols-2 xl:grid-cols-3">
          <readonly-field caption="Código del proceso" value="SPE-001-2026-MTC" />
          <readonly-field caption="Etapa" value="Convocatoria y habilitación de postores" />
          <readonly-field caption="Lotes en los cuales postula" value="2" />
        </div>
      </siaf-solicitude-form-card>

      <siaf-solicitude-form-card title="Datos de pago">
        <div class="flex flex-col gap-siaf-md">
          <div class="grid gap-x-siaf-xl gap-y-siaf-md md:grid-cols-2 xl:grid-cols-3">
            <readonly-field caption="Datos de pago" value="PAY-05-2025" />
            <readonly-field caption="Etapa" value="Convocatoria y habilitación de postores" />
            <readonly-field caption="Cuenta recaudación" value="34534-213213213" />
          </div>

          <div class="grid gap-siaf-md md:grid-cols-2 xl:grid-cols-4">
            @for (dato of datosPago; track dato.label) {
              <readonly-field [caption]="dato.label" [value]="dato.value" />
            }
          </div>

          <div class="flex flex-col gap-siaf-xs">
            <h3 class="m-0 text-sm font-bold uppercase text-text">Comprobantes de pago</h3>
            <siaf-table [columns]="columnasComprobantes" [rows]="comprobantes" idKey="numeroItem" />
          </div>
        </div>
      </siaf-solicitude-form-card>

      <siaf-action-tracker [showSummaryCards]="true" [showTabs]="false" [summaryItems]="trazabilidad" />
    </siaf-solicitude-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AprobacionSubastaDetalleComponent {
  readonly heading = 'Solicitud de aprobación de subasta';
  readonly numeroDocumento = 'PSP-SAS-00002-2026-MEF-OGA';
  readonly breadcrumbs: BreadcrumbItem[] = buildProcessBreadcrumbs(PROCESS_ID, PROCESS_ROUTE, this.heading);

  readonly camposEntidad: SolicitudeInfoField[] = [
    { label: 'Fecha', value: '13/01/2026     07:40:15' },
    { label: 'Ente rector', value: 'MEF - Dirección General de Abastecimiento' },
    { label: 'Entidad', value: 'Ministerio de Transporte y Comunicaciones' },
  ];

  readonly datosPago: SolicitudeInfoField[] = [
    { label: 'Cantidad de bienes muebles', value: '20' },
    { label: 'Precio base total (S/)', value: 'S/ 11 000.00' },
    { label: 'Garantía requerida (S/)', value: 'S/ 11 000.00' },
    { label: 'Monto registrado', value: 'S/ 11 000.00' },
  ];

  readonly columnasComprobantes: DataTableColumn[] = [
    { key: 'numeroItem', label: 'N° ítem' },
    { key: 'tipoDocumento', label: 'Tipo de documento' },
    { key: 'nombreArchivo', label: 'Nombre del archivo' },
    { key: 'fechaRegistro', label: 'Fecha de registro' },
  ];

  readonly comprobantes: DataTableRow[] = [
    { numeroItem: '01', tipoDocumento: 'PDF', nombreArchivo: 'PAY-001-2026', fechaRegistro: '05/01/2025' },
  ];

  readonly trazabilidad: ActionTrackerSummary[] = [
    { label: 'Elaborado por', actionBy: 'Ana Torres Díaz', date: '13/01/2026 07:40' },
    { label: 'Verificado por', actionBy: 'Ana Torres Díaz', date: '13/01/2026 08:15' },
    { label: 'Aprobado por', actionBy: '', date: '' },
  ];
}
