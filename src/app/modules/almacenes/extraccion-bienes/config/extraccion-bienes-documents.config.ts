import { ESTADO } from '../../../../core/models/documento.model';
import type { DocumentsRecordsColumn, DocumentsRecordsConfig, DocumentsRecordsFilterOption, DocumentsRecordsRowAction } from '../../../../shared/types/documents-records.types';
import { buildProcessBreadcrumbs } from '../../../../shared/utils/breadcrumbs.util';
import { CREATE_DOCUMENT_OPTIONS, PROCESS_ID, PROCESS_ROUTE, REQUEST_ROUTE } from './extraccion-bienes.rutas';

/**
 * Configuración de «Documentos y registros» de Extracción de bienes. La pantalla completa la pinta
 * `siaf-documents-records-page`: aquí solo se dice qué columnas, filtros y opciones tiene.
 */

const documentColumns: DocumentsRecordsColumn[] = [
  { key: 'document', label: 'Documento', visibility: 'visible', group: 'default', widthClass: 'w-[320px]', kind: 'document-link' },
  { key: 'number', label: 'Número', visibility: 'visible', group: 'default', widthClass: 'w-[220px]' },
  { key: 'actionType', label: 'Tipo de acción', visibility: 'visible', group: 'default', widthClass: 'w-[140px]' },
  { key: 'status', label: 'Estado', visibility: 'visible', group: 'default', widthClass: 'w-[120px]', kind: 'flow-status' },
  { key: 'system', label: 'Sistema', visibility: 'visible', group: 'default', widthClass: 'w-[150px]' },
  { key: 'date', label: 'Fecha de registro', visibility: 'visible', group: 'default', widthClass: 'w-[140px]' },
  { key: 'entity', label: 'Entidad', visibility: 'visible', group: 'default', widthClass: 'w-[280px]' },
];

const recordColumns: DocumentsRecordsColumn[] = [
  { key: 'number', label: 'N° extracción', visibility: 'visible', group: 'default', widthClass: 'w-[160px]' },
  { key: 'tipo', label: 'Tipo', visibility: 'visible', group: 'default', widthClass: 'w-[120px]' },
  { key: 'cartonizacion', label: 'Cartonización', visibility: 'visible', group: 'default', widthClass: 'w-[130px]', align: 'center', kind: 'boolean-icon' },
  { key: 'pedidos', label: 'Pedidos', visibility: 'visible', group: 'default', widthClass: 'w-[90px]' },
  { key: 'bienes', label: 'Bienes', visibility: 'visible', group: 'default', widthClass: 'w-[90px]' },
  { key: 'operarios', label: 'Operarios', visibility: 'visible', group: 'default', widthClass: 'w-[100px]' },
  { key: 'avance', label: 'Avance', visibility: 'visible', group: 'default', widthClass: 'w-[90px]' },
  { key: 'fecha', label: 'Fecha', visibility: 'visible', group: 'default', widthClass: 'w-[110px]' },
  { key: 'status', label: 'Estado', visibility: 'visible', group: 'default', widthClass: 'w-[130px]', kind: 'flow-status' },
];

/** Acciones de cada registro: ver el detalle (ícono) y, en el menú ⋮, reasignar y anular. */
export const ACCIONES_REGISTRO: DocumentsRecordsRowAction[] = [
  { value: 'detalle', label: 'Ver detalle', icon: 'visibility', primary: true },
  { value: 'reasignar', label: 'Reasignar', icon: 'swap_horiz' },
  { value: 'anular', label: 'Anular', icon: 'block' },
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
  { label: 'Creación', value: 'Creación' },
];

export const EXTRACCION_BIENES_DOCUMENTS_CONFIG: DocumentsRecordsConfig = {
  title: 'Extracción de bienes',
  processId: PROCESS_ID,
  defaultRequestRoute: REQUEST_ROUTE,
  createDocumentOptions: CREATE_DOCUMENT_OPTIONS,
  breadcrumbs: buildProcessBreadcrumbs(PROCESS_ID, PROCESS_ROUTE),
  // Las filas salen del almacén de solicitudes (`ExtraccionStore`), no de esta configuración.
  documentRows: [],
  recordRows: [],
  documentColumns,
  recordColumns,
  documentTableMinWidthClass: 'min-w-[1300px]',
  recordTableMinWidthClass: 'min-w-[1100px]',
  recordRowActions: ACCIONES_REGISTRO,
  recordTrackKey: 'recordId',
  recordHistoryDocumentLabel: 'Solicitud de Extracción de bienes',
  statusFilterOptions: [ESTADO.ELABORADO, ESTADO.VERIFICADO],
  actionTypeFilterOptions: ['Creación'],
  filterCampoOptions,
  filterValorOptions,
  fieldsMenuOptions: [{ label: 'Documento' }, { label: 'Tipo de acción' }, { label: 'Estado' }, { label: 'Fecha de registro' }, { label: 'Entidad' }],
};
