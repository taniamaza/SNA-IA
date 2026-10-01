import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocumentsRecordsPageComponent } from '../../../../../shared/components/documents-records-page/documents-records-page.component';
import { APROBACION_SUBASTA_DOCUMENTS_CONFIG } from '../../config/aprobacion-subasta-documents.config';

/**
 * «Documentos y registros» de Aprobación de subasta pública electrónica. Todavía sin backend simulado: la pantalla
 * la arma `siaf-documents-records-page` con filas de muestra fijas (`modoConsulta: true`).
 */
@Component({
  selector: 'siaf-aprobacion-subasta-documents',
  standalone: true,
  imports: [DocumentsRecordsPageComponent],
  template: `<siaf-documents-records-page [config]="pageConfig" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AprobacionSubastaDocumentsComponent {
  readonly pageConfig = APROBACION_SUBASTA_DOCUMENTS_CONFIG;
}
