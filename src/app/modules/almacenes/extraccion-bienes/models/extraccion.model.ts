/**
 * Proceso «Extracción de bienes» (Gestión de Almacenes), con datos de muestra: el responsable de logística arma una
 * solicitud con los pedidos a extraer, el método de extracción y los operarios que atenderán las listas.
 */

export type MetodoExtraccion = 'pedido' | 'agrupada';
export type EstadoSolicitudExtraccion = 'Elaborado' | 'Verificado';

export const CODIGO_DOCUMENTO = 'SEB';
export const NOMBRE_DOCUMENTO = 'Solicitud de Extracción de bienes';

export interface PedidoExtraccion {
  codigo: string;
  tipo: string;
  prioridad: string;
  destinos: number;
  bienes: number;
  /** Volumen en m³. */
  volumen: number;
  /** Peso en kg. */
  peso: number;
  fecha: string;
}

export interface OperarioExtraccion {
  codigo: string;
  nombre: string;
}

export interface SolicitudExtraccion {
  id: string;
  numero: string;
  estado: EstadoSolicitudExtraccion;
  fecha: string;
  entidad: string;
  pedidos: string[];
  metodo: MetodoExtraccion;
  politica: string;
  cartonizacion: 'si' | 'no';
  operarios: string[];
}

const TIPOS_PEDIDO = [
  { tipo: 'Regular', sigla: 'R', origen: 'PAA' },
  { tipo: 'Devolución', sigla: 'D', origen: 'PAA' },
  { tipo: 'Rechazo', sigla: 'R', origen: 'OS' },
  { tipo: 'Regular', sigla: 'R', origen: 'OC' },
];
const PRIORIDADES_PEDIDO = ['Urgente', 'Alta', 'Media', 'Baja'];

/** Pedidos de muestra determinísticos, para probar la búsqueda y la paginación del panel «Seleccionar pedidos». */
function generarPedidosMuestra(cantidad: number): PedidoExtraccion[] {
  return Array.from({ length: cantidad }, (_, i) => {
    const n = i + 4;
    const t = TIPOS_PEDIDO[i % TIPOS_PEDIDO.length];
    return {
      codigo: `2026-${t.origen}-${t.sigla}-${String(n).padStart(3, '0')}`,
      tipo: t.tipo,
      prioridad: PRIORIDADES_PEDIDO[(i * 3) % PRIORIDADES_PEDIDO.length],
      destinos: (i % 3) + 1,
      bienes: (i % 7) + 1,
      volumen: Math.round((0.1 + ((i * 37) % 90) / 100) * 100) / 100,
      peso: 5 + ((i * 11) % 60),
      fecha: `${String(1 + (i % 28)).padStart(2, '0')}/05/2026`,
    };
  });
}

export const PEDIDOS_MUESTRA: PedidoExtraccion[] = [
  { codigo: '2026-PAA-R-003', tipo: 'Regular', prioridad: 'Urgente', destinos: 2, bienes: 3, volumen: 0.68, peso: 30, fecha: '13/05/2026' },
  { codigo: '2026-PAA-R-002', tipo: 'Regular', prioridad: 'Alta', destinos: 1, bienes: 2, volumen: 0.42, peso: 18, fecha: '13/05/2026' },
  { codigo: '2026-PAA-D-002', tipo: 'Devolución', prioridad: 'Media', destinos: 1, bienes: 2, volumen: 0.3, peso: 12, fecha: '13/05/2026' },
  { codigo: '2026-OS-R-002', tipo: 'Rechazo', prioridad: 'Baja', destinos: 1, bienes: 1, volumen: 0.1, peso: 5, fecha: '13/05/2026' },
  ...generarPedidosMuestra(96),
];

export const OPERARIOS_MUESTRA: OperarioExtraccion[] = [
  { codigo: 'OP-001', nombre: 'Argandoña Vásquez, Gianmarco' },
  { codigo: 'OP-002', nombre: 'Pérez Saravia, José Alberto' },
  { codigo: 'OP-003', nombre: 'Martínez Quispe, Carlos Martín' },
  { codigo: 'OP-004', nombre: 'Fernández Solís, Carlos Felipe' },
  { codigo: 'OP-005', nombre: 'Quispe Mamani, Rosa Elena' },
  { codigo: 'OP-006', nombre: 'Huamán Torres, Luis Alberto' },
];

export const POLITICAS_INVENTARIO = [
  { value: 'PEPS', label: 'PEPS (Primero en entrar, primero en salir)' },
  { value: 'FEFO', label: 'FEFO (primero en vencer, primero en salir)' },
  { value: 'OTRA', label: '[Otra política por definir]' },
];

/** LPN según la cartonización: sin cartonización son «LPN ciegos»; con cartonización, «LPN generados». */
export const etiquetaLpn = (cartonizacion: string): string =>
  cartonizacion === 'no' ? 'LPN ciegos' : cartonizacion === 'si' ? 'LPN generados' : '';

export const OPCIONES_METODO = [
  { label: 'Extracción por pedido', value: 'pedido' },
  { label: 'Extracción agrupada por bienes', value: 'agrupada' },
];

export const OPCIONES_CARTONIZACION = [
  { label: 'Con cartonización', value: 'si' },
  { label: 'Sin cartonización', value: 'no' },
];

export const ETIQUETA_METODO: Record<MetodoExtraccion, string> = {
  pedido: 'Extracción por pedido',
  agrupada: 'Extracción agrupada por bienes',
};

/** Volumen o peso con dos decimales y coma de millares, como en el diseño (`1.10 m³`). */
export const formatoNumero = (valor: number): string => valor.toFixed(2);

const SEMILLA_ENTIDAD = 'Dirección General de Abastecimiento';
export const ENTE_RECTOR = SEMILLA_ENTIDAD;

/** Solicitudes de ejemplo que se ven al entrar la primera vez. */
export const SOLICITUDES_MUESTRA: SolicitudExtraccion[] = [
  {
    id: 'seb-0001',
    numero: 'SEB-00001-2026-MEF-DGA',
    estado: 'Verificado',
    fecha: '12/05/2026',
    entidad: '0001 - Ministerio de Economía y Finanzas',
    pedidos: ['2026-PAA-D-002', '2026-OS-R-002'],
    metodo: 'agrupada',
    politica: 'PEPS',
    cartonizacion: 'no',
    operarios: ['OP-002'],
  },
  {
    id: 'seb-0002',
    numero: 'SEB-00002-2026-MEF-DGA',
    estado: 'Elaborado',
    fecha: '13/05/2026',
    entidad: '0001 - Ministerio de Economía y Finanzas',
    pedidos: ['2026-PAA-R-002'],
    metodo: 'pedido',
    politica: 'FEFO',
    cartonizacion: 'si',
    operarios: ['OP-001'],
  },
];

export type EstadoRegistroExtraccion = 'Registrado' | 'En proceso' | 'Finalizado';

/** Registro de una extracción ya generada: lo que lista la pestaña «Registros». */
export interface RegistroExtraccion {
  numero: string;
  tipo: 'Regular' | 'Devolución';
  cartonizacion: 'Sí' | 'No';
  pedidos: number;
  bienes: number;
  operarios: number;
  avance: number;
  fecha: string;
  estado: EstadoRegistroExtraccion;
}

export const REGISTROS_MUESTRA: RegistroExtraccion[] = [
  { numero: '2026-EXTR-A-001', tipo: 'Regular', cartonizacion: 'No', pedidos: 2, bienes: 3, operarios: 2, avance: 100, fecha: '15/05/2026', estado: 'Finalizado' },
  { numero: '2026-EXTR-A-002', tipo: 'Regular', cartonizacion: 'Sí', pedidos: 1, bienes: 2, operarios: 1, avance: 0, fecha: '16/05/2026', estado: 'En proceso' },
  { numero: '2026-EXTR-A-003', tipo: 'Regular', cartonizacion: 'Sí', pedidos: 2, bienes: 3, operarios: 2, avance: 0, fecha: '16/05/2026', estado: 'En proceso' },
  { numero: '2026-EXTR-A-004', tipo: 'Devolución', cartonizacion: 'No', pedidos: 2, bienes: 3, operarios: 2, avance: 50, fecha: '17/05/2026', estado: 'En proceso' },
  { numero: '2026-EXTR-A-005', tipo: 'Regular', cartonizacion: 'Sí', pedidos: 2, bienes: 3, operarios: 2, avance: 0, fecha: '18/05/2026', estado: 'En proceso' },
  { numero: '2026-EXTR-A-006', tipo: 'Regular', cartonizacion: 'Sí', pedidos: 2, bienes: 4, operarios: 2, avance: 0, fecha: '18/05/2026', estado: 'Registrado' },
];
