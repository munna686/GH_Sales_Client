// Common Angular imports
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { SplitterModule } from 'primeng/splitter';
import { CardModule } from 'primeng/card';
import { TreeTableModule } from 'primeng/treetable';
import { BadgeModule } from 'primeng/badge';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { FieldsetModule } from 'primeng/fieldset';

// Array of all common modules for easy importing in standalone components
export const COMMON_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  // PrimeNG Table
  TableModule,
  TagModule,
  BadgeModule,
  // PrimeNG Form Controls
  IconFieldModule,
  CheckboxModule,
  InputIconModule,
  MultiSelectModule,
  SelectModule,
  ButtonModule,
  InputTextModule,
  TextareaModule,
  InputNumberModule,
  ToggleSwitchModule,
  FloatLabelModule,
  SelectButtonModule,
  DatePickerModule,
  // PrimeNG Dialogs & Overlays
  DialogModule,
  ConfirmDialogModule,
  ToastModule,
  TooltipModule,
  // PrimeNG Layout
  ToolbarModule,
  DividerModule,
  CardModule,
  AccordionModule,
  SplitterModule,
  TabsModule,
  TreeTableModule,
  MenuModule,
  ButtonGroupModule,
  // PrimeNG Effects
  RippleModule,
  // File Upload
  FileUploadModule,
  // Avatar
  AvatarModule,
  // Fieldset
  FieldsetModule
] as const;
