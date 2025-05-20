// types/o-spreadsheet.d.ts

declare module '@odoo/o-spreadsheet' {
  import { Model } from '@odoo/o-spreadsheet/model';
  import { CorePlugin } from '@odoo/o-spreadsheet/core_plugins/core_plugin';
  
  export { Model, CorePlugin };
  export function mount(model: Model, container: HTMLElement): () => void;
}