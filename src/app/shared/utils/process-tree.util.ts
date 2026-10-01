/**
 * Árbol maestro de procesos + utilidad de búsqueda de ruta.
 * Vive en shared/utils/ (no en layout/) porque lo consumen tanto piezas
 * del shell (layout/process-menu-tree, layout/create-document) como
 * utilidades transversales de shared (breadcrumbs.util) — shared no debe
 * depender de layout, así que la fuente de verdad va acá.
 */
export interface ProcessMenuNode {
  id: string;
  label: string;
  selected?: boolean;
  // Solo debe marcarse en nodos raiz: la vista inicial muestra hasta el segundo nivel.
  expanded?: boolean;
  // Ruta de la página principal del módulo (documentos y registros)
  moduleRoute?: string;
  // Si un nodo tiene estas propiedades, Crear documento puede completar documento/tipo y navegar.
  createRoute?: string;
  documentOptions?: string[];
  documentCreateOptions?: Array<{
    label: string;
    route?: string;
    actionTypes?: string[];
  }>;
  actionTypeOptions?: string[];
  /**
   * Marca un nodo como módulo planificado pero aún no implementado.
   * El menú lo renderiza con texto atenuado y badge "Próximamente",
   * y el click no navega (solo expande si tiene hijos).
   */
  comingSoon?: boolean;
  children?: ProcessMenuNode[];
}

/**
 * Árbol de procesos del taller. Solo «Registro de cuentas bancarias» está implementado (con datos simulados); el resto
 * son ejemplos de cómo se ve un proceso planificado («Próximamente»). Para sumar un proceso: una hoja con
 * `moduleRoute` (Documentos y registros) y otra para sus consultas, y sus rutas en `app.routes.ts`.
 *
 * IDs consumidos por componentes externos (migas de pan con `findProcessPathById`):
 *   - registro-cuentas-bancarias-documentos
 *   - registro-cuentas-bancarias-consultas
 */
export const DEFAULT_PROCESS_TREE: ProcessMenuNode[] = [
  {
    id: 'gestion-tesoreria',
    label: 'Gestión de tesorería',
    expanded: true,
    selected: true,
    children: [
      {
        id: 'registro-cuentas-bancarias',
        label: 'Registro de cuentas bancarias',
        children: [
          {
            id: 'registro-cuentas-bancarias-documentos',
            label: 'Documentos y registros de cuentas bancarias',
            moduleRoute: '/procesos/registro-cuentas-bancarias',
            createRoute: '/procesos/registro-cuentas-bancarias/solicitud',
            documentOptions: ['Solicitud de Registro de Cuenta Bancaria'],
            documentCreateOptions: [
              {
                label: 'Solicitud de Registro de Cuenta Bancaria',
                route: '/procesos/registro-cuentas-bancarias/solicitud',
                actionTypes: ['Creación'],
              },
            ],
            actionTypeOptions: ['Creación'],
          },
          {
            id: 'registro-cuentas-bancarias-consultas',
            label: 'Consultas y reportes de cuentas bancarias',
            moduleRoute: '/procesos/registro-cuentas-bancarias/consultas',
          },
        ],
      },
      {
        id: 'programacion-pagos',
        label: 'Programación de pagos',
        comingSoon: true,
        children: [
          { id: 'programacion-pagos-documentos', label: 'Documentos y registros de programación de pagos', comingSoon: true },
          { id: 'programacion-pagos-consultas', label: 'Consultas y reportes de programación de pagos', comingSoon: true },
        ],
      },
    ],
  },
  {
    id: 'gestion-almacen',
    label: 'Gestión de almacén',
    expanded: true,
    comingSoon: true,
    children: [
      {
        id: 'logistica-entrada',
        label: 'Logistica de entrada',
        comingSoon: true,
        children: [
          { id: 'gestion-citas', label: 'Gestión de citas', comingSoon: true },
          { id: 'recepcion-verificacion', label: 'Recepción y verificación', comingSoon: true },
          { id: 'control-calidad', label: 'Control de Calidad', comingSoon: true },
        ],
      },
      {
        id: 'logistica-interna',
        label: 'logistica interna',
        comingSoon: true,
        children: [
          { id: 'internamiento', label: 'Internamiento', comingSoon: true },
          { id: 'reabasto', label: 'Reabasto', comingSoon: true },
          { id: 'inventario-masivo', label: 'Inventario Masivo', comingSoon: true },
          { id: 'inventario-ciclico', label: 'Inventario Ciclico', comingSoon: true },
        ],
      },
      {
        id: 'logistica-salida',
        label: 'logistica SALIDA',
        comingSoon: true,
        children: [
          { id: 'liberacion-pedido', label: 'Liberación de Pedido', comingSoon: true },
          { id: 'extraccion-bienes', label: 'Extracción de bienes', comingSoon: true },
          { id: 'acondicionamiento-bienes', label: 'Acondicionamiento de bienes', comingSoon: true },
          { id: 'despacho-bienes', label: 'Despacho de bienes', comingSoon: true },
          { id: 'rechazo-bienes', label: 'Rechazo de bienes', comingSoon: true },
          { id: 'devolucion-bienes', label: 'Devolución de bienes', comingSoon: true },
        ],
      },
      { id: 'almacen-clasificadores-catalogos', label: 'Clasificadores y catálogos', comingSoon: true },
      { id: 'almacen-consultas-reportes', label: 'Consultas y reportes', comingSoon: true },
    ],
  },
  { id: 'gestion-bienes-muebles', label: 'Gestión de Bienes Muebles', comingSoon: true },
  {
    id: 'gestion-actos-disposicion-final',
    label: 'Gestión de actos de DISPOSICIÓN FINAL',
    expanded: true,
    comingSoon: true,
    children: [
      { id: 'gestion-donacion-raee', label: 'Gestión de Donación RAEE', comingSoon: true },
      {
        id: 'gestion-subasta-publica',
        label: 'Gestión de Subasta Pública',
        expanded: true,
        comingSoon: true,
        children: [
          { id: 'aprobacion-subasta', label: 'Aprobación de subasta pública electrónica', moduleRoute: '/procesos/aprobacion-subasta' },
          { id: 'convocatoria-habilitacion-postores', label: 'Convocatoria y habilitación de postores', comingSoon: true },
          { id: 'adjudicacion-spe', label: 'Adjudicación de la SPE', comingSoon: true },
          { id: 'operaciones-entrega-informe-spe', label: 'Operaciones de Entrega e Informe Final de SPE', comingSoon: true },
        ],
      },
      { id: 'gestion-otros-actos', label: 'Gestión de Otros actos', comingSoon: true },
    ],
  },
  { id: 'gestion-supervision', label: 'Gestión de supervisión', comingSoon: true },
];

export function findProcessPathById(id: string, nodes: readonly ProcessMenuNode[] = DEFAULT_PROCESS_TREE): ProcessMenuNode[] {
  for (const node of nodes) {
    if (node.id === id) {
      return [node];
    }

    const childPath = findProcessPathById(id, node.children || []);

    if (childPath.length > 0) {
      return [node, ...childPath];
    }
  }

  return [];
}

/**
 * Árbol del menú "Ajustes" (módulo de administración). Lo pinta el mismo `siaf-process-menu-tree`
 * que el menú de procesos, con otros textos. En el taller no hay módulo de administración: las hojas
 * van como «Próximamente» y no navegan.
 */
export const ADMIN_MENU_TREE: ProcessMenuNode[] = [
  {
    id: 'administracion',
    label: 'Administración',
    expanded: true,
    children: [
      {
        id: 'usuarios-accesos',
        label: 'Usuarios y accesos',
        expanded: true,
        children: [
          { id: 'gestion-usuarios', label: 'Gestión de usuarios', comingSoon: true },
          { id: 'perfiles-funcionales', label: 'Perfiles funcionales', comingSoon: true },
        ],
      },
      {
        id: 'organizacion',
        label: 'Organización',
        children: [
          { id: 'entidades', label: 'Entidades', comingSoon: true },
          { id: 'unidades', label: 'Unidades orgánicas', comingSoon: true },
        ],
      },
    ],
  },
];
