import { Component, OnInit, computed, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { COMMON_IMPORTS } from '@/shared/common-imports';
import { StorageUtil } from '@/utility/StorageUtil';
import {
  SalesIndent,
  SalesIndentDetail,
  SalesIndentPreviewData,
  SalesIndentPreviewItem,
  SalesIndentPreviewSummary,
  SalesIndentService
} from '@/pages/service/sales-indent.service';
import { UserPrivilege, EMPTY_USER_PRIVILEGE } from '@/Model/user-privilege.model';
import { BaseIcon } from "primeng/icons/baseicon";
import { SalesOrderDetail, SalesOrderDetailResponse, SalesOrderService, SalesOrderToIndentDTO, VWProductDTO } from '@/pages/service/sales-order.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '@/utility/Common';

@Component({
  selector: 'app-sales-indent-component',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sales-indent-component.html',
  styleUrl: './sales-indent-component.scss',
  providers: [MessageService]
})
export class SalesIndentComponent implements OnInit {
  userPrivilege: UserPrivilege = EMPTY_USER_PRIVILEGE;

  indents = signal<SalesIndent[]>([]);
  loading = signal(false);

  products = signal<(VWProductDTO & { display: string })[]>([]);
  // Client-side search (simple contains filter)
  pendingSearchText = signal('');
  appliedSearchText = signal('');

  // Sales Orders (Create/Edit dialog)
  entryAccordionValue: '0' | '1' = '0';

  // Sales Orders accordion search
  salesOrderSearchText = signal('');
  ViewModes = { Draft: 'Draft', Workflow: 'Workflow' } as const;
  selectedViewMode: 'Draft' | 'Workflow' = 'Draft';

  totalRecords = 0;
  pageSize = 10;
  pageNumber = 1;
  userId = 0;
  currentUser: any = null;

  // Detail dialog
  detailDialogMaximized = false;
  displayDetailDialog = false;
  selectedIndent = signal<SalesIndent | null>(null);
  indentDetails = signal<SalesIndentDetail[]>([]);
  salesOrderToIndent = signal<SalesOrderToIndentDTO[] >([]);
  selectedDetailLoading = signal(false);

  // Selected Sales Order info (Create/Edit dialog)
  salesOrderMasterDetail = signal<SalesOrderDetailResponse['data'] | null>(null);
  salesOrderDetailLoading = signal(false);

  //Create or Edit Dialog
  displayEntryDialog = false;

  // Preview dialog (before save)
  displayPreviewDialog = false;
  previewLoading = signal(false);
  indentPreview = signal<{ summary: SalesIndentPreviewSummary; items: SalesIndentPreviewItem[]; freeItems: SalesIndentPreviewItem[] } | null>(null);

  // form
  indentForm!: FormGroup;

  filteredIndents = computed(() => {
    const rows = this.indents();
    const q = (this.appliedSearchText() || '').trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((x) => {
      const hay = `${x.indentRefNo} ${x.customerName} ${x.locationName} ${x.depotName} ${x.salesOfficer}`.toLowerCase();
      return hay.includes(q);
    });
  });

  filteredSalesOrdersToIndent = computed(() => {
    const rows = this.salesOrderToIndent();
    const q = (this.salesOrderSearchText() || '').trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((o) => {
      const hay = `${o.orderRefNo} ${o.customerName} ${o.locationName} ${o.salesOfficer} ${o.transMode}`.toLowerCase();
      return hay.includes(q);
    });
  });

  selectedSalesOrderMaster = computed(() => {
    const data = this.salesOrderMasterDetail();
    return (data?.Master ?? data?.master ?? null) as any;
  });

  selectedSalesOrderDetails = computed((): SalesOrderDetail[] => {
    const data = this.salesOrderMasterDetail();
    const details = data?.Details ?? data?.details ?? [];
    return Array.isArray(details) ? details : [];
  });

  nonFreeDetails = computed(() =>
    this.indentDetails().filter((x) => !x?.isFreeProduct)
  );

  freeDetails = computed(() =>
    this.indentDetails().filter((x) => !!x?.isFreeProduct)
  );

  detailTotalQuantity = computed(() =>
    this.nonFreeDetails().reduce((sum, item) => sum + (Number((item as any)?.orderQty) || 0), 0)
  );

  detailTotalAmount = computed(() =>
    this.nonFreeDetails().reduce((sum, item) => sum + (Number((item as any)?.netSalesAmt ?? (item as any)?.salesAmt) || 0), 0)
  );

  constructor(
    private salesIndentService: SalesIndentService,
    private salesOrderService: SalesOrderService,
    private messageService: MessageService,
    private fb : FormBuilder,
  ) {
    this.initializeUserData();
    this.initForm();
  }

  ngOnInit(): void {
    this.userPrivilege = this.readPrivilegeFromStorage();
    console.log('User Privilege:', this.userPrivilege);
    this.loadIndents();
    this.loadProducts();
  }

  public isAdminPrivilegeUser(): boolean {
    const user: any = this.currentUser ?? {};
    // Only treat as admin when the explicit "admin privilege type" flag is present.
    // Avoid using other similarly-named fields that may have different meanings.
    const flag = user.adminPriviegeType ?? user.adminPrivilegeType ?? 0;
    return Number(flag) === 1;
  }

  private normalizeArray<T>(res: any): T[] {
    const direct = res?.data;
    if (Array.isArray(direct)) return direct as T[];

    const nested = res?.data?.data;
    if (Array.isArray(nested)) return nested as T[];

    return [];
  }


  loadProducts(): void {
    this.salesOrderService.getProductsList().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          const mapped = this.normalizeArray<VWProductDTO>(res).map((p) => ({
            ...p,
            display: `${p.productCode} - ${p.productName}`
          }));
          this.products.set(mapped);
        } else {
          this.products.set([]);
        }
      },
      error: () => this.products.set([])
    });

  }

  

  private initForm(): void {
    this.indentForm = this.fb.group({
      indentId: [null],
      indentDate: [null, Validators.required],
      deliveryDate: [null],
      orderId: [null, Validators.required],
      remarks: [''],
      entryUsrId: [null],
      entryBy: [''],
      salesIndentDetails: this.fb.array([])
    });
  }
  get salesIndentDetails(): FormArray {
    return this.indentForm.get('salesIndentDetails') as FormArray;
  }

  createDetailRow(): FormGroup {
    return this.fb.group({
      indentItemId: [null],
      productId: [null, Validators.required],
      orderQty: [0],
      tradePrice: [0],
      indentQty: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // ✅ Helper to cast AbstractControl → FormGroup (avoids template type errors)
getDetailGroup(index: number): FormGroup {
    return this.salesIndentDetails.at(index) as FormGroup;
}

addDetailRow(): void {
    this.salesIndentDetails.push(this.createDetailRow());
}

removeDetailRow(index: number): void {
    this.salesIndentDetails.removeAt(index);
}

  addRow() {
    this.salesIndentDetails.push(this.createDetailRow());
  }

  removeRow(index: number) {
    this.salesIndentDetails.removeAt(index);
  }

  submit() {
    console.log(this.indentForm.value);
  }

  private readPrivilegeFromStorage(): UserPrivilege {
    const stored = StorageUtil.getItem<UserPrivilege | UserPrivilege[]>('privilege');
    if (Array.isArray(stored)) return stored[0] ?? EMPTY_USER_PRIVILEGE;
    return stored ?? EMPTY_USER_PRIVILEGE;
  }

  private initializeUserData(): void {
    const user: any = StorageUtil.getItem('user');
    if (!user) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No user session found. Please login first.'
      });
      this.userId = 0;
      return;
    }

    this.currentUser = user;
    this.userId = user.userId || user.id || user.employeeId || 0;
  }

  onSearchChange(value: string): void {
    this.pendingSearchText.set(value || '');
  }

  onEntryDialogShow(): void {
    this.entryAccordionValue = '0';
    this.salesOrderSearchText.set('');
    if (this.salesOrderToIndent().length === 0) {
      this.getSalesOrderToIndent();
    }
  }
  
  private getSalesOrderToIndent(): void {
    this.salesOrderService.getSalesOrderToIndent(this.userId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.salesOrderToIndent.set(response.data ?? []);
          console.log('salesOrderToIndent updated:', this.salesOrderToIndent());
        } else {
          this.salesOrderToIndent.set([]);
        }
      },
      error: () => {
        this.salesOrderToIndent.set([]);
      }
    });
  }

  onSalesOrderSearchChange(value: string): void {
    this.salesOrderSearchText.set(value || '');
  }

  selectSalesOrder(salesOrderId: number): void {
    const id = Number(salesOrderId || 0);
    if (!id) return;

    this.entryAccordionValue = '1';
    this.salesOrderDetailLoading.set(true);
    this.salesOrderService.getSalesOrderDetail(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.salesOrderMasterDetail.set(response.data ?? null);
          console.log('salesOrderMasterDetail updated:', this.salesOrderMasterDetail());
          //this.prepareEntryFromSelectedOrder();
          this.indentForm.patchValue({
            orderId: this.selectedSalesOrderMaster()?.orderId || null

          })
         /// clear old rows
          this.salesIndentDetails.clear();
          // add new rows
            response.data?.details?.forEach((item: any) => {
            const row = this.fb.group({
              indentItemId: [null],
              productId: [item.productId],
              orderQty: [item.orderQty],
              tradePrice: [item.tradePrice],
              indentQty: [item.orderQty || 0]
            });

            this.salesIndentDetails.push(row);

          });

        } else {
          this.salesOrderMasterDetail.set(null);
        }
        this.salesOrderDetailLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading sales order detail:', error);
        this.salesOrderMasterDetail.set(null);
        this.salesOrderDetailLoading.set(false);
      }
    });
  }

  // Entry dialog form state for new indent
  entryIndentForm = signal({ indentDate: '', deliveryDate: '', remarks: '' });
  entryIndentDetails = signal<SalesIndentDetail[]>([]);

  private prepareEntryFromSelectedOrder(): void {
    const master = this.selectedSalesOrderMaster();
    const details = this.selectedSalesOrderDetails() || [];
    // initialize form defaults
    this.entryIndentForm.set({ indentDate: new Date().toISOString().slice(0, 10), deliveryDate: '', remarks: '' });
    // map order details to indent detail skeleton
    const mapped = (details || []).map((d) => {
      const dd = d as any;
      return ({
        indentItemId: 0,
        productCode: dd.productCode || '',
        productId: dd.productId || 0,
        productName: dd.productName || '',
        packSize: dd.packSize,
        ivPrice: dd.ivPrice || 0,
        orderQty: Number(dd.orderQty || 0),
        stockQty: Number(dd.stockQty || 0),
        salesQty: Number(dd.salesQty || 0),
        bonusQty: Number(dd.bonusQty || 0),
        tradePrice: Number(dd.tradePrice || 0),
        netSalesQty: Number(dd.orderQty || 0),
        isFreeProduct: !!dd.isFreeProduct
      } as SalesIndentDetail);
    });

    this.entryIndentDetails.set(mapped);
  }

  addEntryDetailRow(): void {
    const list = [...this.entryIndentDetails()];
    list.push({
      indentItemId: 0,
      productCode: '',
      productId: 0,
      productName: 'New product',
      packSize: '',
      ivPrice: 0,
      orderQty: 0,
      stockQty: 0,
      salesQty: 0,
      bonusQty: 0,
      tradePrice: 0,
      netSalesQty: 0,
      isFreeProduct: false
    });
    this.entryIndentDetails.set(list);
  }

  removeEntryDetailRow(index: number): void {
    const list = [...this.entryIndentDetails()];
    if (index >= 0 && index < list.length) {
      list.splice(index, 1);
      this.entryIndentDetails.set(list);
    }
  }

  updateEntryDetailQty(index: number, value: number): void {
    const list = [...this.entryIndentDetails()];
    if (index >= 0 && index < list.length) {
      const item = { ...list[index] } as any;
      item.netSalesQty = Number(value || 0);
      list[index] = item;
      this.entryIndentDetails.set(list);
    }
  }

  setEntryIndentField(field: 'indentDate' | 'deliveryDate' | 'remarks', value: any): void {
    const current = this.entryIndentForm();
    const next: any = { ...current };
    next[field] = value;
    this.entryIndentForm.set(next);
  }

  saveIndent(): void {
    debugger;
    // Save now follows: Preview -> Confirm -> Save.
    this.previewIndentBeforeSave();

  }

  closePreviewDialog(): void {
    this.displayPreviewDialog = false;
    this.previewLoading.set(false);
    this.indentPreview.set(null);
  }

  private buildCreatePayloadDto(): any | null {
    const payload = this.indentForm.value;

    if (payload?.indentDate == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Indent date is required' });
      return null;
    }
    if (payload?.deliveryDate == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delivery date is required' });
      return null;
    }
    if (!payload?.orderId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order is required' });
      return null;
    }
    if (!Array.isArray(payload?.salesIndentDetails) || payload.salesIndentDetails.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sales indent details are required' });
      return null;
    }

    return {
      indentId: payload.indentId,
      indentDate: Common.toISOString(payload.indentDate),
      deliveryDate: Common.toISOString(payload.deliveryDate),
      orderId: payload.orderId,
      remarks: payload.remarks,
      entryUsrId: this.userId,
      entryBy: Common.setWorkflower(this.currentUser),
      indentDetails: payload.salesIndentDetails.map((d: any) => ({
        indentItemId: d.indentItemId,
        productId: d.productId,
        indentQty: d.indentQty
      }))
    };
  }

  private buildPreviewRequest(): { customerId: number; transModeId: number; indentDate: string; items: string } | null {
    const payload = this.indentForm.value;

    const master: any = this
      .selectedSalesOrderMaster();
    const customerId = Number(
      master?.customerId ??
        master?.CustomerId ??
        master?.customerID ??
        master?.CustomerID ??
        payload?.customerId ??
        0
    );

    let transModeId = Number(
      master?.transModeId ??
        master?.TransModeId ??
        master?.transModeID ??
        master?.TransModeID ??
        payload?.transModeId ??
        0
    );

    if (!transModeId) {
      const transModeText = String(master?.transMode ?? master?.TransMode ?? '').trim().toLowerCase();
      if (transModeText === 'advance') transModeId = 1;
      if (transModeText === 'credit') transModeId = 2;
    }
    const indentDate = payload?.indentDate ? Common.toISOString(payload.indentDate) : '';

    if (!customerId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Customer not found for preview' });
      return null;
    }
    if (!transModeId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Trans mode not found for preview' });
      return null;
    }
    if (!indentDate) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Indent date is required for preview' });
      return null;
    }

    const details = Array.isArray(payload?.salesIndentDetails) ? payload.salesIndentDetails : [];
    const itemsList = details
      .filter((d: any) => Number(d?.productId) > 0 && Number(d?.indentQty) > 0)
      .map((d: any) => ({ ProductId: Number(d.productId), IndentQty: Number(d.indentQty) }));

    if (itemsList.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'At least one item is required for preview' });
      return null;
    }

    return {
      customerId,
      transModeId,
      indentDate,
      items: JSON.stringify(itemsList)
    };
  }

  private normalizePreviewData(raw: any): { summary: SalesIndentPreviewSummary; items: SalesIndentPreviewItem[]; freeItems: SalesIndentPreviewItem[] } {
    const data = raw ?? {};
    const summary = (data.Summary ?? data.summary ?? {}) as SalesIndentPreviewSummary;
    const items = (data.Items ?? data.items ?? []) as SalesIndentPreviewItem[];
    const freeItems = (data.FreeItems ?? data.freeItems ?? []) as SalesIndentPreviewItem[];
    return {
      summary: summary ?? {},
      items: Array.isArray(items) ? items : [],
      freeItems: Array.isArray(freeItems) ? freeItems : []
    };
  }

  previewIndentBeforeSave(): void {
    // Quick validation for required fields
    const createPayload = this.buildCreatePayloadDto();
    if (!createPayload) return;

    const previewReq = this.buildPreviewRequest();
    if (!previewReq) return;

    this.displayPreviewDialog = true;
    this.previewLoading.set(true);
    this.indentPreview.set(null);

    this.salesIndentService.calculateIndentPreview(previewReq).subscribe({
      next: (res) => {
        if (res?.statusCode === 200) {
          let preview: any = res?.data;
          if (typeof preview === 'string') {
            try {
              preview = JSON.parse(preview);
            } catch {
              // keep as-is
            }
          }
          this.indentPreview.set(this.normalizePreviewData(preview as SalesIndentPreviewData));
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res?.message || 'Failed to calculate indent preview'
          });
          this.displayPreviewDialog = false;
        }
        this.previewLoading.set(false);
      },
      error: (error) => {
        console.error('Error calculating indent preview:', error);
        this.previewLoading.set(false);
        this.displayPreviewDialog = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to calculate indent preview'
        });
      }
    });
  }

  confirmSaveIndent(): void {
    const payloadDto = this.buildCreatePayloadDto();
    if (!payloadDto) return;

    this.previewLoading.set(true);
    this.salesIndentService.createSalesIndent(payloadDto).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Sales indent created successfully'
          });
          this.loadIndents(1);
          this.displayEntryDialog = false;
          this.closePreviewDialog();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to create sales indent'
          });
        }
        this.previewLoading.set(false);
      },
      error: (error) => {
        console.error('Error creating sales indent:', error);
        this.previewLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create sales indent'
        });
      }
    });
  }

  executeSearch(): void {
    const pending = (this.pendingSearchText() || '').trim();
    if (pending === (this.appliedSearchText() || '').trim()) return;
    this.appliedSearchText.set(pending);
  }

  onViewModeChange(): void {
    this.pageNumber = 1;
    this.loadIndents(1);
  }

  onPageChange(event: any): void {
    const rows = event?.rows ?? this.pageSize;
    const first = event?.first ?? 0;
    this.pageSize = rows;
    const newPageNumber = Math.floor(first / rows) + 1;
    this.loadIndents(newPageNumber);
  }

  loadIndents(pageNumber: number = 1): void {
    this.loading.set(true);
    this.pageNumber = pageNumber;

    const workId = (this.userPrivilege?.workId ?? this.currentUser?.workId ?? 0) as number;

    this.salesIndentService
      .getSalesIndents({
        userId: this.userId,
        pageNumber,
        pageSize: this.pageSize,
        viewMode: this.selectedViewMode,
        workId
      })
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.indents.set(response.data ?? []);

            const apiTotal = (response as any)?.totalRecords;
            if (typeof apiTotal === 'number' && apiTotal > 0) {
              this.totalRecords = apiTotal;
            } else {
              const pageDataCount = (response.data ?? []).length;
              if (pageDataCount === 0) {
                this.totalRecords = (this.pageNumber - 1) * this.pageSize;
              } else if (pageDataCount < this.pageSize) {
                this.totalRecords = (this.pageNumber - 1) * this.pageSize + pageDataCount;
              } else {
                this.totalRecords = Math.max(this.totalRecords, this.pageNumber * this.pageSize + 1);
              }
            }
          } else {
            this.indents.set([]);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading sales indents:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load sales indents'
          });
          this.indents.set([]);
          this.loading.set(false);
        }
      });
  }

  viewIndentDetails(indent: SalesIndent): void {
    this.selectedIndent.set(indent);
    this.selectedDetailLoading.set(true);
    this.displayDetailDialog = true;
    this.indentDetails.set([]);

    this.salesIndentService.getSalesIndentDetail(indent.indentId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          const extracted = this.extractMasterDetails(response);
          if (extracted?.master) {
            this.selectedIndent.set(this.normalizeIndent(extracted.master));
          }
          this.indentDetails.set(this.normalizeIndentDetails(extracted?.details ?? []));
        }
        this.selectedDetailLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading indent details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load indent details'
        });
        this.selectedDetailLoading.set(false);
      }
    });
  }

  closeDetailDialog(): void {
    this.displayDetailDialog = false;
    this.detailDialogMaximized = false;
    this.selectedIndent.set(null);
    this.indentDetails.set([]);
    this.selectedDetailLoading.set(false);
  }

  private extractMasterDetails(payload: any): { master: any; details: any[] } | null {
    const data = payload?.data ?? payload;
    if (!data) return null;

    const master = data.master ?? data.Master ?? data.data?.master ?? data.data?.Master ?? null;
    const details = data.details ?? data.Details ?? data.data?.details ?? data.data?.Details ?? [];
    return { master, details: Array.isArray(details) ? details : [] };
  }

  private toNumberOrZero(value: unknown): number {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private normalizeIndent(master: any): SalesIndent {
    const m = master ?? {};
    return {
      indentId: this.toNumberOrZero(m.indentId ?? m.IndentId),
      indentRefNo: String(m.indentRefNo ?? m.IndentRefNo ?? ''),
      indentDate: String(m.indentDate ?? m.IndentDate ?? ''),
      depotName: String(m.depotName ?? m.DepotName ?? ''),

      customerId: this.toNumberOrZero(m.customerId ?? m.CustomerId),
      customerLocationId: this.toNumberOrZero(m.customerLocationId ?? m.CustomerLocationId),
      depotId: this.toNumberOrZero(m.depotId ?? m.DepotId),
      poNumber: String(m.poNumber ?? m.PoNumber ?? ''),

      customerName: String(m.customerName ?? m.CustomerName ?? ''),
      locationName: String(m.locationName ?? m.LocationName ?? ''),
      salesOfficer: String(m.salesOfficer ?? m.SalesOfficer ?? ''),
      transMode: String(m.transMode ?? m.TransMode ?? ''),

      creditLimitAmt: Number(m.creditLimitAmt ?? m.CreditLimitAmt ?? 0),
      creditDays: Number(m.creditDays ?? m.CreditDays ?? 0),
      creditBalance: Number(m.creditBalance ?? m.CreditBalance ?? 0),
      vatAmt: Number(m.vatAmt ?? m.VatAmt ?? 0),
      orderAmt: Number(m.orderAmt ?? m.OrderAmt ?? 0),

      entryBy: (m.entryBy ?? m.EntryBy ?? null) as any,
      entryDate: (m.entryDate ?? m.EntryDate ?? null) as any,
      checkBy: (m.checkBy ?? m.CheckBy ?? null) as any,
      checkDate: (m.checkDate ?? m.CheckDate ?? null) as any,
      approveBy: (m.approveBy ?? m.ApproveBy ?? null) as any,
      approveDate: (m.approveDate ?? m.ApproveDate ?? null) as any,
      workFollowPosition: this.toNumberOrZero(m.workFollowPosition ?? m.WorkFollowPosition)
    } as SalesIndent;
  }

  private normalizeIndentDetails(details: any[]): SalesIndentDetail[] {
    const list = Array.isArray(details) ? details : [];
    return list.map((d) => {
      const x = d ?? {};
      return {
        indentItemId: Number(x.indentItemId ?? x.IndentItemId ?? 0) || 0,
        productCode: String(x.productCode ?? x.ProductCode ?? ''),
        productId: Number(x.productId ?? x.ProductId ?? 0) || 0,
        productName: String(x.productName ?? x.ProductName ?? ''),
        packSize: x.packSize ?? x.PackSize,
        ivPrice: Number(x.ivPrice ?? x.IvPrice ?? 0) || 0,
        orderQty: Number(x.orderQty ?? x.OrderQty ?? 0) || 0,
        stockQty: Number(x.stockQty ?? x.StockQty ?? 0) || 0,
        salesQty: Number(x.salesQty ?? x.SalesQty ?? 0) || 0,
        bonusQty: Number(x.bonusQty ?? x.BonusQty ?? 0) || 0,
        tradePrice: Number(x.tradePrice ?? x.TradePrice ?? 0) || 0,
        vatAmt: Number(x.vatAmt ?? x.VatAmt ?? 0) || 0,
        netSalesQty: Number(x.netSalesQty ?? x.NetSalesQty ?? 0) || 0,
        salesAmt: Number(x.salesAmt ?? x.SalesAmt ?? 0) || 0,
        specDiscAmt: Number(x.specDiscAmt ?? x.SpecDiscAmt ?? 0) || 0,
        damageDiscAmt: Number(x.damageDiscAmt ?? x.DamageDiscAmt ?? 0) || 0,
        netSalesAmt: Number(x.netSalesAmt ?? x.NetSalesAmt ?? 0) || 0,
        isFreeProduct: Boolean(x.isFreeProduct ?? x.IsFreeProduct ?? false)
      } as SalesIndentDetail;
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTransModeSeverity(mode: string): 'success' | 'warn' | 'info' {
    const normalized = (mode || '').toLowerCase();
    if (normalized === 'credit') return 'warn';
    if (normalized === 'advance') return 'success';
    return 'info';
  }
}