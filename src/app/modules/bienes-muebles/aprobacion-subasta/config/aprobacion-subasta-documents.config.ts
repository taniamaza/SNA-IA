import { ESTADO } from '../../../../core/models/documento.model';
import type { DocumentsRecordsColumn, DocumentsRecordsConfig, DocumentsRecordsFilterOption } from '../../../../shared/types/documents-records.types';
import { buildProcessBreadcrumbs } from '../../../../shared/utils/breadcrumbs.util';
import { PROCESS_ID, PROCESS_ROUTE } from './aprobacion-subasta.rutas';

/**
 * Configuración de «Documentos y registros» de Aprobación de subasta pública electrónica. Todavía sin backend simulado
 * (`modoConsulta: true`, sin botón «Crear documento»): las filas son de muestra, solo para ver la
 * pantalla armada según el diseño de Figma.
 */

const documentColumns: DocumentsRecordsColumn[] = [
  { key: 'document', label: 'Documento', visibility: 'visible', group: 'default', widthClass: 'w-[280px]', kind: 'document-link' },
  { key: 'number', label: 'Número', visibility: 'visible', group: 'default', widthClass: 'w-[140px]' },
  { key: 'actionType', label: 'Tipo de acción', visibility: 'visible', group: 'default', widthClass: 'w-[140px]' },
  { key: 'status', label: 'Estado', visibility: 'visible', group: 'default', widthClass: 'w-[120px]', kind: 'flow-status' },
  { key: 'system', label: 'Sistema', visibility: 'visible', group: 'default', widthClass: 'w-[150px]' },
  { key: 'date', label: 'Fecha de registro', visibility: 'visible', group: 'default', widthClass: 'w-[120px]' },
  { key: 'entity', label: 'Entidad', visibility: 'visible', group: 'default', widthClass: 'w-[280px]' },
];

const recordColumns: DocumentsRecordsColumn[] = [
  { key: 'status', label: 'Estado', visibility: 'visible', group: 'default', widthClass: 'w-[120px]', kind: 'record-status' },
  { key: 'number', label: 'Número', visibility: 'visible', group: 'default', widthClass: 'w-[140px]' },
  { key: 'entity', label: 'Entidad', visibility: 'visible', group: 'default', widthClass: 'min-w-[280px]' },
];

const filterCampoOptions: DocumentsRecordsFilterOption[] = [
  { label: 'Documento', value: 'document' },
  { label: 'Número', value: 'number' },
  { label: 'Tipo de acción', value: 'actionType' },
  { label: 'Estado', value: 'status' },
  { label: 'Entidad', value: 'entity' },
];

const filterValorOptions: DocumentsRecordsFilterOption[] = [
  { label: ESTADO.ELABORADO, value: ESTADO.ELABORADO },
  { label: ESTADO.VERIFICADO, value: ESTADO.VERIFICADO },
  { label: ESTADO.APROBADO, value: ESTADO.APROBADO },
  { label: 'Creación', value: 'Creación' },
];

export const APROBACION_SUBASTA_DOCUMENTS_CONFIG: DocumentsRecordsConfig = {
  modoConsulta: true,
  title: 'Aprobación de subasta pública electrónica',
  processId: PROCESS_ID,
  defaultRequestRoute: PROCESS_ROUTE,
  createDocumentOptions: [],
  breadcrumbs: buildProcessBreadcrumbs(PROCESS_ID, PROCESS_ROUTE),
  documentRows: [
    {
      document: 'Solicitud de aprobación de subasta',
      number: 'PSP-SAS-00001-2026-MEF-OGA',
      linkRoute: PROCESS_ROUTE,
      actionType: 'Creación',
      status: ESTADO.APROBADO,
      system: 'Sistema Integrado de Gestión Administrativa',
      date: '15/01/2026',
      entity: '0001 - Ministerio de Economía y Finanzas',
    },
    {
      document: 'Solicitud de aprobación de subasta',
      number: 'PSP-SAS-00002-2026-MEF-OGA',
      linkRoute: `${PROCESS_ROUTE}/solicitud/PSP-SAS-00002-2026-MEF-OGA`,
      actionType: 'Creación',
      status: ESTADO.VERIFICADO,
      system: 'Sistema Integrado de Gestión Administrativa',
      date: '18/01/2026',
      entity: '0001 - Ministerio de Economía y Finanzas',
    },
    {
      document: 'Solicitud de aprobación de subasta',
      number: 'PSP-SAS-00003-2026-MEF-OGA',
      linkRoute: PROCESS_ROUTE,
      actionType: 'Creación',
      status: ESTADO.ELABORADO,
      system: 'Sistema Integrado de Gestión Administrativa',
      date: '20/01/2026',
      entity: '0001 - Ministerio de Economía y Finanzas',
    },
  ],
  recordRows: [
    { recordId: 'subasta-00001', status: 'Activo', number: 'PSP-SAS-00001-2026-MEF-OGA', entity: '0001 - Ministerio de Economía y Finanzas' },
  ],
  documentColumns,
  recordColumns,
  documentTableMinWidthClass: 'min-w-[1200px]',
  recordTableMinWidthClass: 'min-w-[600px]',
  recordTrackKey: 'recordId',
  recordHistoryDocumentLabel: 'Solicitud de aprobación de subasta',
  statusFilterOptions: [ESTADO.ELABORADO, ESTADO.VERIFICADO, ESTADO.OBSERVADO, ESTADO.APROBADO, ESTADO.RECHAZADO],
  actionTypeFilterOptions: ['Creación'],
  filterCampoOptions,
  filterValorOptions,
  fieldsMenuOptions: [{ label: 'Documento' }, { label: 'Tipo de acción' }, { label: 'Estado' }, { label: 'Fecha de registro' }, { label: 'Entidad' }],
};
