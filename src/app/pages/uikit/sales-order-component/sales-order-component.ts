import { Component, OnInit, signal, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  SalesOrderService,
  SalesOrder,
  SalesOrderDetail,
  CreateSalesOrderRequest,
  SaveSalesOrderRequest,
  VWCustomerDTO,
  VWCustomerLocationDTO,
  VWProductDTO,
  VWUserDepoDTO,
  CustomerProductPriceDTO
} from '../../service/sales-order.service';
import { StorageUtil } from '@/utility/StorageUtil';
import { ExcelUtil } from '@/utility/ExcelUtil';
import { Common } from '@/utility/Common';
import { COMMON_IMPORTS } from '@/shared/common-imports';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserTransPolicyDTO, UserTransPolicyService } from '../../service/user-trans-policy.service';
import Swal from 'sweetalert2';
import { EMPTY_USER_PRIVILEGE, UserPrivilege } from '@/Model/user-privilege.model';

import { BaseIcon } from "primeng/icons/baseicon";
import { WorkflowService } from '@/pages/service/WorkFlow.service';

@Component({
  selector: 'app-sales-order-component',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sales-order-component.html',
  styleUrl: './sales-order-component.scss',
  providers: [MessageService]
})
export class SalesOrderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly createFormReset$ = new Subject<void>();

  detailDialogMaximized = false;
  createDialogMaximized = false;
  userPrivilege: UserPrivilege = EMPTY_USER_PRIVILEGE;

  salesOrders = signal<SalesOrder[]>([]);
  // Search UX:
  // - `pendingSearchText` tracks what's typed in the input.
  // - `appliedSearchText` is what has been executed against the API.
  pendingSearchText = signal('');
  appliedSearchText = signal('');
  salesOrderDetails = signal<SalesOrderDetail[]>([]);
  selectedOrder = signal<SalesOrder | null>(null);
  selectedDetailLoading = signal(false);
  displayDetailDialog = false;
  loading = signal(false);
  isCreateDialogVisible = false;
  createDialogMode: 'create' | 'edit' = 'create';
  editOrderRefNo = signal('');
  formGroup: FormGroup;
  createSubmitting = signal(false);
  transOpenPolicyId = 1; // for sales

  // checkDate controls whether date restriction is enforced
  checkDate = true;
  orderDateMin: Date | null = null;
  orderDateMax: Date | null = null;

  customers = signal<(VWCustomerDTO & { display: string })[]>([]);
  customerLocations = signal<(VWCustomerLocationDTO & { display: string })[]>([]);
  depots = signal<(VWUserDepoDTO & { display: string })[]>([]);
  products = signal<(VWProductDTO & { display: string })[]>([]);
  selectedCreditBalance = signal<number | null>(null);
  ViewModes = { Draft: 'Draft', Workflow: 'Workflow' } as const;
  selectedViewMode: 'Draft' | 'Workflow' = 'Draft';

  createTotalQty = signal(0);
  createTotalAmount = signal(0);

  // Table rows come from API search results.
  filteredSalesOrders = computed(() => this.salesOrders());

  detailTotalQuantity = computed(() =>
    this.salesOrderDetails().reduce((sum, item) => sum + (Number((item as any)?.orderQty) || 0), 0)
  );

  detailTotalAmount = computed(() =>
    this.salesOrderDetails().reduce((sum, item) => sum + (Number((item as any)?.orderAmt) || 0), 0)
  );

  detailTotalDiscount = computed(() =>
    this.salesOrderDetails().reduce((sum, item) => sum + (Number((item as any)?.discAmt) || 0), 0)
  );

  totalRecords = 0;
  pageSize = 10;
  pageNumber = 1;
  userId: number = 0;
  currentUser: any = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private userTransPolicyService: UserTransPolicyService,
    private messageService: MessageService,
    private workflowService: WorkflowService,
    private fb: FormBuilder
  ) {
    this.initializeUserData();
    this.formGroup = this.buildCreateForm();
  }

  private readPrivilegeFromStorage(): UserPrivilege {
    const stored = StorageUtil.getItem<UserPrivilege | UserPrivilege[]>('privilege');
    if (Array.isArray(stored)) {
      return stored[0] ?? EMPTY_USER_PRIVILEGE;
    }
    return stored ?? EMPTY_USER_PRIVILEGE;
  }

  public isAdminPrivilegeUser(): boolean {
    const user: any = this.currentUser ?? {};
    // Only treat as admin when the explicit "admin privilege type" flag is present.
    // Avoid using other similarly-named fields that may have different meanings.
    const flag = user.adminPriviegeType ?? user.adminPrivilegeType ?? 0;
    return Number(flag) === 1;
  }

  private toNumberOrZero(value: unknown): number {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private startOfDay(date: Date): Date {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }

  private endOfDay(date: Date): Date {
    const dt = new Date(date);
    dt.setHours(23, 59, 59, 999);
    return dt;
  }

  private parseApiDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;
    const dt = new Date(dateStr);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  private extractMasterDetails(payload: any): { master: any; details: any[] } | null {
    const data = payload?.data ?? payload;
    if (!data) return null;

    const master = data.master ?? data.Master ?? data.data?.master ?? data.data?.Master ?? null;
    const details = data.details ?? data.Details ?? data.data?.details ?? data.data?.Details ?? [];

    return { master, details: Array.isArray(details) ? details : [] };
  }

  private normalizeSalesOrder(master: any): SalesOrder {
    const m = master ?? {};

    return {
      orderId: this.toNumberOrZero(m.orderId ?? m.OrderId),
      orderRefNo: String(m.orderRefNo ?? m.OrderRefNo ?? ''),
      orderDate: String(m.orderDate ?? m.OrderDate ?? ''),
      depotName: String(m.depotName ?? m.DepotName ?? ''),
      exptDlvDate: String(m.exptDlvDate ?? m.ExptDlvDate ?? ''),
      customerName: String(m.customerName ?? m.CustomerName ?? ''),
      locationName: String(m.locationName ?? m.LocationName ?? ''),
      salesOfficer: String(m.salesOfficer ?? m.SalesOfficer ?? ''),
      transMode: String(m.transMode ?? m.TransMode ?? ''),
      creditLimitAmt: Number(m.creditLimitAmt ?? m.CreditLimitAmt ?? 0),
      creditDays: Number(m.creditDays ?? m.CreditDays ?? 0),
      creditBalance: Number(m.creditBalance ?? m.CreditBalance ?? 0),
      vatAmt: Number(m.vatAmt ?? m.VatAmt ?? 0),
      orderAmt: Number(m.orderAmt ?? m.OrderAmt ?? 0),

      customerId: this.toNumberOrZero(m.customerId ?? m.CustomerId),
      customerLocationId: this.toNumberOrZero(m.customerLocationId ?? m.CustomerLocationId),
      depotId: this.toNumberOrZero(m.depotId ?? m.DepotId),
      poNumber: String(m.poNumber ?? m.PoNumber ?? ''),
      remarks: String(m.remarks ?? m.Remarks ?? ''),

      custRegCode: m.custRegCode ?? m.CustRegCode ?? m.customerCode ?? m.CustomerCode,
      customerCode: m.customerCode ?? m.CustomerCode,
      locationCode: m.locationCode ?? m.LocationCode,
      customerLocationCode: m.customerLocationCode ?? m.CustomerLocationCode,
      entryBy: (m.entryBy ?? m.EntryBy ?? null) as any,
      entryDate: (m.entryDate ?? m.EntryDate ?? null) as any,
      checkBy: (m.checkBy ?? m.CheckBy ?? null) as any,
      checkDate: (m.checkDate ?? m.CheckDate ?? null) as any,
      approveBy: (m.approveBy ?? m.ApproveBy ?? null) as any,
      approveDate: (m.approveDate ?? m.ApproveDate ?? null) as any,
      workFollowPosition: this.toNumberOrZero(m.workFollowPosition ?? m.WorkFollowPosition)
    } as SalesOrder;
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

  canForwardAction(): boolean {
    return  Number(this.userPrivilege?.workId ?? 0) === 1;
  }

  canCheckAction(): boolean {
    return  Number(this.userPrivilege?.workId ?? 0) === 2 && this.userPrivilege.isCheckFor === 1;
  }

  canApproveAction(): boolean {
    return  Number(this.userPrivilege?.workId ?? 0) === 12 && this.userPrivilege.isApproveFor === 1;
  }
  canRevertAction(): boolean {
    return  this.userPrivilege.isRevert === true;
  }

  private executeWorkflowAction(
    moduleId: number,
    tableId: number,
    pkId: number,
    workId: number,
    actionId: number,
    actionName: string
  ): void {

    this.workflowService
      .processWorkFlow(
        this.userId,
        moduleId,
        tableId,
        pkId,
        workId,
        actionId,
        ''
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Workflow action completed successfully.'
          });

          console.log(
            `Workflow action completed: ${actionName}. OrderId:`,
            pkId
          );

          // keep list in sync after workflow actions
          this.loadSalesOrders(this.pageNumber);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while processing the workflow action.'
          });

          console.error(
            `Error occurred while processing workflow action: ${actionName}. OrderId:`,
            pkId,
            error
          );
        }
      });
  }

  confirmWorkflowAction(action: 'forward' | 'check' | 'approve' | 'revert' | 'reject'): void {
    const pkId = this.selectedOrder()?.orderId;
    if (!pkId) return;

    const tableId = 45; // Sales Order table ID - adjust if different
    const moduleId = 11; // Module ID for Sales - adjust if different
    const workId = Number(this.selectedOrder()?.workfollowPosition ?? 0);
    const actionId = action === 'forward' ? 1 : action === 'check' ? 1 : action === 'approve' ? 1 : action === 'revert' ? 2 : action === 'reject' ? 3 : 0;
    const actionName = action;

    const title = action === 'forward'
      ? 'Forward Order'
      : action === 'check'
        ? 'Check Order'
        : action === 'approve'
          ? 'Approve Order'
          : 'Revert Order';

    void Swal.fire({
      title,
      text: `Do you want to ${action} this order?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeWorkflowAction(moduleId, tableId, pkId, workId, actionId, actionName);
      }
    });
  }

  onWorkflowActionFromList(order: SalesOrder, action: 'forward' | 'check' | 'approve' | 'revert'): void {
    if (!order?.orderId) return;

    // Ensure we have workFollowPosition for workflow processing.
    if (Number(order.workfollowPosition ?? 0) > 0) {
      this.selectedOrder.set(order);
      this.confirmWorkflowAction(action);
      return;
    }

    this.salesOrderService.getSalesOrderDetail(order.orderId).subscribe({
      next: (res) => {
        const md = this.extractMasterDetails(res);
        const normalized = md?.master ? this.normalizeSalesOrder(md.master) : null;
        this.selectedOrder.set(normalized ?? order);
        this.confirmWorkflowAction(action);
      },
      error: (err) => {
        console.error('Workflow action load failed', err);
        this.selectedOrder.set(order);
        this.confirmWorkflowAction(action);
      }
    });
  }

  private normalizeSalesOrderDetails(details: any[]): SalesOrderDetail[] {
    const list = Array.isArray(details) ? details : [];
    return list.map((d) => {
      const x = d ?? {};
      return {
        orderItemId: Number(x.orderItemId ?? x.OrderItemId ?? 0) || 0,
        productId: Number(x.productId ?? x.ProductId ?? 0) || 0,
        productCode: String(x.productCode ?? x.ProductCode ?? ''),
        productName: String(x.productName ?? x.ProductName ?? ''),
        packSize: Number(x.packSize ?? x.PackSize ?? 0) || 0,
        orderQty: Number(x.orderQty ?? x.OrderQty ?? 0) || 0,
        stockQty: Number(x.stockQty ?? x.StockQty ?? 0) || 0,
        tradePrice: Number(x.tradePrice ?? x.TradePrice ?? 0) || 0,
        discAmt: Number(x.discAmt ?? x.DiscAmt ?? 0) || 0,
        orderAmt: Number(x.orderAmt ?? x.OrderAmt ?? 0) || 0
      } as SalesOrderDetail;
    });
  }

  private addDays(base: Date, days: number): Date {
    const dt = new Date(base);
    dt.setDate(dt.getDate() + Number(days || 0));
    return dt;
  }

  private clampDate(value: Date, min: Date | null, max: Date | null): Date {
    const time = value.getTime();
    if (min && time < min.getTime()) return min;
    if (max && time > max.getTime()) return max;
    return value;
  }

  private applyTransPolicyDateWindow(policy: UserTransPolicyDTO | null): void {
    if (!this.checkDate || !policy) {
      this.orderDateMin = null;
      this.orderDateMax = null;
      return;
    }

    if (this.isAdminPrivilegeUser()) {
      const min = this.parseApiDate(policy.mopFromDate);
      const max = this.parseApiDate(policy.mopToDate);

      this.orderDateMin = min ? this.startOfDay(min) : null;
      this.orderDateMax = max ? this.endOfDay(max) : null;
    } else {
      const today = new Date();
      const bw = this.toNumberOrZero(policy.aopBwDays);
      const fw = this.toNumberOrZero(policy.aopFwDays);
      const min = this.addDays(today, -bw);
      const max = this.addDays(today, fw);

      this.orderDateMin = this.startOfDay(min);
      this.orderDateMax = this.endOfDay(max);
    }

    // Ensure order date is within bounds
    const orderCtrl = this.formGroup.get('orderDate');
    const orderVal = orderCtrl?.value ? new Date(orderCtrl.value) : null;

    if (orderVal && !Number.isNaN(orderVal.getTime())) {
      orderCtrl?.setValue(this.clampDate(orderVal, this.orderDateMin, this.orderDateMax), { emitEvent: false });
    }
  }

  private loadTransPolicyAndApplyDateWindow(): void {
    if (!this.checkDate) {
      this.applyTransPolicyDateWindow(null);
      return;
    }

    this.userTransPolicyService.getByTransPolicyId(this.transOpenPolicyId).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data) && res.data.length) {
          this.applyTransPolicyDateWindow(res.data[0]);
        } else {
          this.applyTransPolicyDateWindow(null);
        }
      },
      error: (err) => {
        console.error('Trans policy load failed', err);
        this.applyTransPolicyDateWindow(null);
      }
    });
  }

  /**
   * Initialize user data from localStorage
   */
  private initializeUserData(): void {
    const user: any = StorageUtil.getItem('user');
    
    if (!user) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No user session found. Please login first.'
      });
      this.userId = 44; // Fallback default
      return;
    }

    this.currentUser = user;
    console.log('Current User Data:', user);
    
    // Extract userId - adjust based on your user object structure
    this.userId = user.userId || user.id || user.employeeId || 44;
  }

  ngOnInit() {
    this.userPrivilege = this.readPrivilegeFromStorage();
    console.log('User Privileges:', this.userPrivilege);
    console.log('User Privileges isNew:', this.userPrivilege.isNew);
    this.loadSalesOrders();
  }

  private buildCreateForm(): FormGroup {
    const fg = this.fb.group({
      orderId: [0, []],
      customerId: [null, Validators.required],
      customerLocationId: this.fb.control({ value: null, disabled: true }, Validators.required),
      depotId: [null, Validators.required],
      orderDate: [new Date(), Validators.required],
      expDeliveryDate: [new Date(), Validators.required],
      salesPersonId: [this.userId || null, Validators.required],
      poNumber: ['', []],
      remarks: ['', []],
      isSaveAndForward: [false, []],
      action: ['SAVE', []],
      items: this.fb.array([this.buildItemRow()])
    });

    // initialize totals for default single row
    this.recalculateCreateTotals(fg.get('items') as FormArray);
    return fg;
  }

  getDialogHeader(): string {
    if (this.createDialogMode === 'edit') {
      const ref = (this.editOrderRefNo() || '').trim();
      return ref ? `Edit Order - ${ref}` : 'Edit Order';
    }
    return 'Create New Order';
  }

  private buildItemRow(): FormGroup {
    const row = this.fb.group({
      orderItemId: [null, []],
      productId: [null, Validators.required],
      orderQty: [1, [Validators.required, Validators.min(1)]],
      unitPrice: this.fb.control({ value: null, disabled: true }),
      lineTotal: this.fb.control({ value: 0, disabled: true })
    });

    this.setupItemRowRecalculation(row);
    return row;
  }

  private setupItemRowRecalculation(row: FormGroup): void {
    const qtyCtrl = row.get('orderQty');
    const unitCtrl = row.get('unitPrice');

    qtyCtrl?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.createFormReset$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.recalculateLineTotal(row);
      });

    unitCtrl?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.createFormReset$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.recalculateLineTotal(row);
      });
  }

  private recalculateLineTotal(row: FormGroup): void {
    const qtyRaw = row.get('orderQty')?.value;
    const unitRaw = row.get('unitPrice')?.value;

    const qty = Math.max(1, Number(qtyRaw ?? 1));
    const unitPrice = Number(unitRaw ?? 0);
    const lineTotal = unitPrice > 0 ? qty * unitPrice : 0;

    row.get('lineTotal')?.setValue(lineTotal, { emitEvent: false });
    // Guard: during initial form construction, subscriptions can fire before `formGroup` is assigned.
    const itemsArray = (this.formGroup?.get('items') as FormArray | null) ?? null;
    if (itemsArray) {
      this.recalculateCreateTotals(itemsArray);
    }
  }

  private recalculateCreateTotals(itemsArray: FormArray): void {
    const rows = itemsArray?.controls ?? [];
    let totalQty = 0;
    let totalAmount = 0;

    for (const ctrl of rows) {
      const row = ctrl as FormGroup;
      const qty = Math.max(0, Number(row.get('orderQty')?.value ?? 0));
      const unit = Number(row.get('unitPrice')?.value ?? 0);
      totalQty += qty;
      totalAmount += qty * unit;
    }

    this.createTotalQty.set(totalQty);
    this.createTotalAmount.set(totalAmount);
  }

  onViewModeChange(): void {
    this.pageNumber = 1; // reset pagination
    this.loadSalesOrders(1);
  }
  get itemsArray(): FormArray {
    // Defensive: avoid crashing if accessed before formGroup is initialized.
    const items = this.formGroup?.get('items') as FormArray | null;
    return items ?? (this.fb.array([]) as unknown as FormArray);
  }
  

  canAddItemRow(): boolean {
    const customerId = Number(this.formGroup.get('customerId')?.value ?? 0);
    if (!customerId) return false;

    return this.itemsArray.controls.every((ctrl) => {
      const row = ctrl as FormGroup;
      return !!row.get('productId')?.value;
    });
  }

  addItemRow(): void {
    const customerId = Number(this.formGroup.get('customerId')?.value ?? 0);
    if (!customerId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select Customer',
        detail: 'Please select a customer first.'
      });
      return;
    }

    if (!this.canAddItemRow()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Complete Current Row',
        detail: 'Please select product in the current row before adding a new item.'
      });
      return;
    }

    this.itemsArray.push(this.buildItemRow());
    this.recalculateCreateTotals(this.itemsArray);
  }

  private getCreateValidationMessage(): string {
    const missing: string[] = [];
    const customerIdCtrl = this.formGroup.get('customerId');
    const customerLocCtrl = this.formGroup.get('customerLocationId');
    const depotCtrl = this.formGroup.get('depotId');
    const orderDateCtrl = this.formGroup.get('orderDate');
    const expDeliveryDateCtrl = this.formGroup.get('expDeliveryDate');

    if (customerIdCtrl?.invalid) missing.push('Customer');
    if (customerLocCtrl?.enabled && customerLocCtrl?.invalid) missing.push('Customer Location');
    if (depotCtrl?.invalid) missing.push('Depot');
    if (orderDateCtrl?.invalid) missing.push('Order Date');
    if (expDeliveryDateCtrl?.invalid) missing.push('Expected Delivery Date');

    // Items validation
    const hasInvalidItem = this.itemsArray.controls.some((ctrl) => {
      const row = ctrl as FormGroup;
      return row.invalid || !row.get('productId')?.value;
    });
    if (hasInvalidItem) missing.push('Items');

    if (!missing.length) return 'Please fill all required fields.';
    return `Required: ${missing.join(', ')}`;
  }

  removeItemRow(index: number): void {
    if (this.itemsArray.length <= 1) return;
    this.itemsArray.removeAt(index);
    this.recalculateCreateTotals(this.itemsArray);
  }

  private resetCreateForm(): void {
    // stop subscriptions from the previous form instance
    this.createFormReset$.next();
    this.formGroup = this.buildCreateForm();
    this.selectedCreditBalance.set(null);
    this.customerLocations.set([]);
    this.recalculateCreateTotals(this.itemsArray);

    // keep dropdown data already loaded
  }

  loadSalesOrders(pageNumber: number = 1, searchText?: string) {
    this.loading.set(true);
    this.pageNumber = pageNumber;

    const workId = (this.userPrivilege?.workId ?? this.currentUser?.workId ?? 0) as number;
    const resolvedSearchText = (typeof searchText === 'string' ? searchText : this.appliedSearchText()).trim();

    this.salesOrderService.getSalesOrders({
    userId: this.userId,
    pageNo: pageNumber,
    pageSize: this.pageSize,
    viewMode: this.selectedViewMode,
    workId,
    searchText: resolvedSearchText
  }).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.salesOrders.set(response.data);

          const apiTotal = (response as any)?.totalRecords;
          if (typeof apiTotal === 'number' && apiTotal > 0) {
            this.totalRecords = apiTotal;
          } else {
            const pageDataCount = response.data.length;
            if (pageDataCount === 0) {
              this.totalRecords = (this.pageNumber - 1) * this.pageSize;
            } else if (pageDataCount < this.pageSize) {
              this.totalRecords = (this.pageNumber - 1) * this.pageSize + pageDataCount;
            } else {
              // Keep next page visible when full page is returned but API total is unknown.
              this.totalRecords = Math.max(this.totalRecords, this.pageNumber * this.pageSize + 1);
            }
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading sales orders:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load sales orders'
        });
        this.loading.set(false);
      }
    });
  }

  viewOrderDetails(order: SalesOrder) {
    this.selectedOrder.set(order);
    this.selectedDetailLoading.set(true);
    this.displayDetailDialog = true;

    this.salesOrderService.getSalesOrderDetail(order.orderId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          const extracted = this.extractMasterDetails(response);
          if (extracted?.master) {
            this.selectedOrder.set(this.normalizeSalesOrder(extracted.master));
          }
          this.salesOrderDetails.set(this.normalizeSalesOrderDetails(extracted?.details ?? []));
        }
        this.selectedDetailLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load order details'
        });
        this.selectedDetailLoading.set(false);
      }
    });
  }

  closeDetailDialog() {
    this.displayDetailDialog = false;
    this.detailDialogMaximized = false;
    this.selectedOrder.set(null);
    this.salesOrderDetails.set([]);
    this.selectedDetailLoading.set(false);
  }

  onPageChange(event: any) {
    const rows = event?.rows ?? this.pageSize;
    const first = event?.first ?? 0;

    // Important: update pageSize from paginator selection (5/10/20).
    this.pageSize = rows;

    const newPageNumber = Math.floor(first / rows) + 1;
    this.loadSalesOrders(newPageNumber);
  }

  onSearchChange(value: string) {
    this.pendingSearchText.set(value || '');
  }

  executeSearch(): void {
    const pending = (this.pendingSearchText() || '').trim();
    if (pending === (this.appliedSearchText() || '').trim()) {
      return;
    }

    this.appliedSearchText.set(pending);
    this.loadSalesOrders(1, pending);
  }

  onCreateOrder() {
    this.createDialogMode = 'create';
    this.editOrderRefNo.set('');
    this.isCreateDialogVisible = true;
    this.resetCreateForm();
    this.loadCreateFormLookups();
    this.loadTransPolicyAndApplyDateWindow();
  }

  onHideCreateDialog(): void {
    this.isCreateDialogVisible = false;
    this.createDialogMaximized = false;
    this.createSubmitting.set(false);
    this.createDialogMode = 'create';
    this.editOrderRefNo.set('');
  }

  onEditOrder(order: SalesOrder): void {
    if (this.selectedViewMode !== 'Draft') return;

    this.createDialogMode = 'edit';
    this.isCreateDialogVisible = true;
    this.resetCreateForm();
    this.loadCreateFormLookups();
    this.loadTransPolicyAndApplyDateWindow();

    this.salesOrderService.getSalesOrderDetail(order.orderId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          const extracted = this.extractMasterDetails(res);
          if (extracted?.master) {
            this.patchEditFormFromApi(extracted.master as any, extracted.details as any);
            return;
          }
          this.messageService.add({
            severity: 'warn',
            summary: 'Edit',
            detail: res.message || 'Unable to load order for editing.'
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Edit',
            detail: res.message || 'Unable to load order for editing.'
          });
        }
      },
      error: (err) => {
        console.error('Edit order load failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Edit',
          detail: 'Unable to load order for editing.'
        });
      }
    });
  }

  onForwardOrder(order: SalesOrder): void {
    if (this.selectedViewMode !== 'Draft') return;
    this.selectedOrder.set(order);
    console.log('Forwarding order with workFollowPosition:', order);
    this.confirmWorkflowAction('forward');
  }

  private patchEditFormFromApi(master: any, details: any[]): void {
    const orderId = Number(master?.orderId ?? master?.OrderId ?? 0);
    const customerId = Number(master?.customerId ?? master?.CustomerId ?? 0);
    const customerLocationId = Number(
      master?.customerLocationId ?? master?.CustomerLocationId ?? master?.locationId ?? master?.LocationId ?? 0
    );
    const depotId = Number(master?.depotId ?? master?.DepotId ?? 0);
    const poNumber = String(master?.poNumber ?? master?.PoNumber ?? '');
    const remarks = String(master?.remarks ?? master?.Remarks ?? '');

    const orderRefNo = String(master?.orderRefNo ?? master?.OrderRefNo ?? '');
    this.editOrderRefNo.set(orderRefNo);

    const orderDate = this.parseApiDate(master?.orderDate ?? master?.OrderDate) ?? new Date();
    const expDeliveryDate = this.parseApiDate(master?.exptDlvDate ?? master?.ExptDlvDate ?? master?.expDeliveryDate ?? master?.ExpDeliveryDate) ?? new Date();

    // Patch master fields
    this.formGroup.patchValue(
      {
        orderId,
        customerId: customerId || null,
        depotId: depotId || null,
        orderDate,
        expDeliveryDate,
        poNumber,
        remarks,
        isSaveAndForward: false,
        action: 'SAVE'
      },
      { emitEvent: false }
    );

    // Load customer locations then set selected location
    if (customerId) {
      this.formGroup.get('customerLocationId')?.disable({ emitEvent: false });
      this.salesOrderService.getCustomerLocations(customerId).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            const mapped = this.normalizeArray<VWCustomerLocationDTO>(res).map((l) => ({
              ...l,
              display: `${l.locationCode} - ${l.locationName}`
            }));
            this.customerLocations.set(mapped);
            if (mapped.length) {
              this.formGroup.get('customerLocationId')?.enable({ emitEvent: false });
            }

            if (customerLocationId) {
              this.formGroup.patchValue({ customerLocationId }, { emitEvent: false });
              const loc = mapped.find((x) => Number(x.locationId) === Number(customerLocationId));
              this.selectedCreditBalance.set(typeof loc?.creditBalance === 'number' ? loc.creditBalance : null);
            }
          } else {
            this.customerLocations.set([]);
          }
        },
        error: () => this.customerLocations.set([])
      });
    }

    // Patch items
    const itemsArray = this.formGroup.get('items') as FormArray;
    while (itemsArray.length) itemsArray.removeAt(0);

    const detailList = Array.isArray(details) ? details : [];
    for (const d of detailList) {
      const row = this.buildItemRow();
      const orderItemId = Number((d as any)?.orderItemId ?? (d as any)?.OrderItemId ?? 0) || 0;
      const productId = Number((d as any)?.productId ?? (d as any)?.ProductId ?? 0);
      const productCode = String((d as any)?.productCode ?? (d as any)?.ProductCode ?? '');
      const resolvedProductId =
        productId ||
        (this.products().find((p) => String(p.productCode) === productCode)?.productId ?? 0);

      row.patchValue(
        {
          orderItemId: orderItemId > 0 ? orderItemId : null,
          productId: resolvedProductId || null,
          orderQty: Math.max(1, Number((d as any)?.orderQty ?? (d as any)?.OrderQty ?? 1)),
          unitPrice: Number((d as any)?.tradePrice ?? (d as any)?.TradePrice ?? 0),
          lineTotal: 0
        },
        { emitEvent: false }
      );

      // compute line total and totals
      const qty = Math.max(1, Number(row.get('orderQty')?.value ?? 1));
      const unit = Number(row.get('unitPrice')?.value ?? 0);
      row.get('lineTotal')?.setValue(unit > 0 ? qty * unit : 0, { emitEvent: false });

      itemsArray.push(row);
    }

    if (itemsArray.length === 0) {
      itemsArray.push(this.buildItemRow());
    }
    this.recalculateCreateTotals(itemsArray);
  }

  private loadCreateFormLookups(): void {
    // salesPersonId comes from logged-in user
    this.formGroup.patchValue({
      salesPersonId: this.userId,
      depotId: null,
      customerId: null,
      customerLocationId: null
    });

    this.formGroup.get('customerLocationId')?.disable({ emitEvent: false });

    this.salesOrderService.getCustomers().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          const mapped = this.normalizeArray<VWCustomerDTO>(res).map((c) => ({
            ...c,
            display: `${c.custRegCode} - ${c.customerName}`
          }));
          this.customers.set(mapped);
        } else {
          this.customers.set([]);
        }
      },
      error: () => this.customers.set([])
    });

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

    if (this.userId) {
      this.salesOrderService.getUserDepot(this.userId).subscribe({
        next: (res) => {
          console.log('User depot response:', res);
          if (res.statusCode === 200) {
            const mapped = this.normalizeArray<VWUserDepoDTO>(res).map((d) => ({
              ...d,
              display: `${d.depotId} - ${d.depotName}`
            }));
            this.depots.set(mapped);

            if (mapped.length === 1) {
              this.formGroup.patchValue({ depotId: mapped[0].depotId });
            }
          } else {
            this.depots.set([]);
          }
        },
        error: () => this.depots.set([])
      });
    }
  }

  onCustomerChange(customerId: number | null): void {
    this.formGroup.patchValue({ customerLocationId: null }, { emitEvent: false });
    this.formGroup.get('customerLocationId')?.disable({ emitEvent: false });
    this.customerLocations.set([]);
    this.selectedCreditBalance.set(null);

    // pricing depends on customer
    for (const ctrl of this.itemsArray.controls) {
      const row = ctrl as FormGroup;
      row.patchValue({ productId: null, unitPrice: null, lineTotal: 0, orderQty: 1 }, { emitEvent: false });
    }
    this.recalculateCreateTotals(this.itemsArray);

    if (!customerId) return;

    this.salesOrderService.getCustomerLocations(customerId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          const mapped = this.normalizeArray<VWCustomerLocationDTO>(res).map((l) => ({
            ...l,
            display: `${l.locationCode} - ${l.locationName}`
          }));
          this.customerLocations.set(mapped);

          if (mapped.length) {
            this.formGroup.get('customerLocationId')?.enable({ emitEvent: false });
          }
        } else {
          this.customerLocations.set([]);
        }
      },
      error: () => this.customerLocations.set([])
    });
  }

  onProductChange(rowIndex: number, productId: number | null): void {
    const customerId = Number(this.formGroup.get('customerId')?.value ?? 0);
    const row = this.itemsArray.at(rowIndex) as FormGroup | null;
    if (!row) return;

    row.patchValue({ unitPrice: null, lineTotal: 0 }, { emitEvent: false });
    this.recalculateCreateTotals(this.itemsArray);

    if (!productId) {
      return;
    }

    // Prevent duplicate product selection across rows
    const isDuplicate = this.itemsArray.controls.some((ctrl, idx) => {
      if (idx === rowIndex) return false;
      const other = ctrl as FormGroup;
      return Number(other.get('productId')?.value) === Number(productId);
    });

    if (isDuplicate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Product',
        detail: 'This product is already selected in another row.'
      });
      row.patchValue({ productId: null, unitPrice: null, lineTotal: 0, orderQty: 1 }, { emitEvent: false });
      this.recalculateCreateTotals(this.itemsArray);
      return;
    }

    if (!customerId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select Customer',
        detail: 'Please select a customer first to load trade price.'
      });
      row.patchValue({ productId: null }, { emitEvent: false });
      return;
    }

    this.salesOrderService.getCustomerProductPrice(customerId, Number(productId)).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data) {
          const dto = res.data as CustomerProductPriceDTO;
          const tradePrice = Number(dto.tradePrice ?? 0);
          row.get('unitPrice')?.setValue(tradePrice);
          // ensure qty default
          const qty = Math.max(1, Number(row.get('orderQty')?.value ?? 1));
          row.get('orderQty')?.setValue(qty, { emitEvent: true });
          this.recalculateLineTotal(row);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Price',
            detail: res.message || 'Unable to load trade price.'
          });
          row.patchValue({ unitPrice: null, lineTotal: 0 }, { emitEvent: false });
          this.recalculateCreateTotals(this.itemsArray);
        }
      },
      error: (err) => {
        console.error('Customer product price load failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Price',
          detail: 'Unable to load trade price.'
        });
        row.patchValue({ unitPrice: null, lineTotal: 0 }, { emitEvent: false });
        this.recalculateCreateTotals(this.itemsArray);
      }
    });
  }

  private normalizeArray<T>(res: any): T[] {
    const direct = res?.data;
    if (Array.isArray(direct)) return direct as T[];

    const nested = res?.data?.data;
    if (Array.isArray(nested)) return nested as T[];

    return [];
  }

  onLocationChange(locationId: number | null): void {
    if (!locationId) {
      this.selectedCreditBalance.set(null);
      return;
    }

    const loc = this.customerLocations().find((x) => x.locationId === locationId);
    this.selectedCreditBalance.set(typeof loc?.creditBalance === 'number' ? loc.creditBalance : null);
  }

  submitOrder(isSaveAndForward: boolean = false): void {
    this.formGroup.patchValue({ isSaveAndForward }, { emitEvent: false });

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: this.getCreateValidationMessage()
      });
      return;
    }

    const raw = this.formGroup.getRawValue();

    const orderId = Number(raw.orderId ?? 0);

    const orderDateIso = Common.toISOString(raw.orderDate);
    const expDeliveryIso = Common.toISOString(raw.expDeliveryDate);
    if (!orderDateIso || !expDeliveryIso) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please select valid dates.'
      });
      return;
    }

    const items = (raw.items || [])
      .filter((x: any) => !!x?.productId && Number(x?.orderQty) > 0)
      .map((x: any) => ({
        orderItemId: x?.orderItemId ? Number(x.orderItemId) : undefined,
        productId: Number(x.productId),
        orderQty: Number(x.orderQty)
      }));

    if (!items.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please add at least one product item.'
      });
      return;
    }

    const payloadBase: CreateSalesOrderRequest = {
      orderId: orderId > 0 ? orderId : undefined,
      orderRefNo: this.createDialogMode === 'edit' ? (this.editOrderRefNo() || '') : undefined,
      customerId: Number(raw.customerId),
      customerLocationId: Number(raw.customerLocationId ?? 0),
      depotId: Number(raw.depotId),
      orderDate: orderDateIso,
      expDeliveryDate: expDeliveryIso,
      salesPersonId: Number(raw.salesPersonId ?? this.userId ?? 0),
      poNumber: raw.poNumber || '',
      remarks: raw.remarks || '',
      entryUserId: Number(this.userId ?? 0),
      entryBy: Common.setWorkflower(this.currentUser),
      isSaveAndForward: !!raw.isSaveAndForward,
      action: raw.action || 'SAVE',
      items
    };

    this.createSubmitting.set(true);
    const request$ =
      this.createDialogMode === 'edit' && orderId > 0
        ? this.salesOrderService.saveOrder(payloadBase as SaveSalesOrderRequest)
        : this.salesOrderService.createSalesOrder(payloadBase);

    request$.subscribe({
      next: (res) => {
        this.createSubmitting.set(false);
        if (res.statusCode === 200) {
          this.messageService.add({
            severity: 'success',
            summary: this.createDialogMode === 'edit' ? 'Updated' : 'Created',
            detail: this.createDialogMode === 'edit' ? 'Sales order updated successfully.' : 'Sales order created successfully.'
          });
          this.isCreateDialogVisible = false;
          this.loadSalesOrders(1);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.createDialogMode === 'edit' ? 'Update Failed' : 'Create Failed',
            detail: res.message || (this.createDialogMode === 'edit' ? 'Unable to update sales order.' : 'Unable to create sales order.')
          });
        }
      },
      error: (err) => {
        console.error(this.createDialogMode === 'edit' ? 'Save sales order failed' : 'Create sales order failed', err);
        this.createSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.createDialogMode === 'edit' ? 'Update Failed' : 'Create Failed',
          detail: this.createDialogMode === 'edit' ? 'Unable to update sales order.' : 'Unable to create sales order.'
        });
      }
    });
  }

  exportOrdersToExcel() {
    const rows = this.filteredSalesOrders().map((order) => ({
      OrderNo: order.orderRefNo,
      OrderDate: this.formatDate(order.orderDate),
      Customer: order.customerName,
      SalesOfficer: order.salesOfficer,
      PaymentMode: order.transMode,
      VatAmount: order.vatAmt,
      CreditBalance: order.creditBalance,
      OrderAmount: order.orderAmt
    }));

    if (!rows.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Export',
        detail: 'No data available to export.'
      });
      return;
    }

    ExcelUtil.exportToExcel(rows, 'Sales_Orders');
  }

  getTransModeSeverity(mode: string): 'success' | 'warn' | 'info' {
    const normalized = (mode || '').toLowerCase();
    if (normalized === 'credit') {
      return 'warn';
    }

    if (normalized === 'advance') {
      return 'success';
    }

    return 'info';
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
}
