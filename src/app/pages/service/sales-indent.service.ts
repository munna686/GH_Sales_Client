import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  statusCode: number;
  message: string | null;
  objectId: string | null;
  data: T;
  totalRecords?: number;
}

export interface SalesIndent {
  indentId: number;
  indentRefNo: string;
  orderId: number;
  orderRefNo: string;

  indentDate: string;

  depotName: string;
  customerId?: number;
  customerLocationId?: number;
  depotId?: number;
  poNumber?: string;

  customerName: string;
  locationName: string;
  salesOfficer: string;
  transMode: string;

  creditLimitAmt: number;
  creditDays: number;
  creditBalance: number;
  vatAmt: number;
  orderAmt: number;
  TPAmt: number;
  specDiscAmt: number;
  damageDiscAmt: number;
  netSalesAmt: number;

  // Workflow history
  entryBy?: string | null;
  entryDate?: string | null;
  checkBy?: string | null;
  checkDate?: string | null;
  approveBy?: string | null;
  approveDate?: string | null;
  workFollowPosition?: number | null;
}

export interface SalesIndentDetail {
  indentItemId?: number;
  productCode: string;
  productId?: number;
  productName: string;
  packSize?: number | string;

  ivPrice?: number;
  orderQty: number;
  stockQty: number;
  salesQty?: number;
  bonusQty?: number;
  tradePrice?: number;

  vatAmt?: number;
  netSalesQty?: number;
  salesAmt?: number;
  specDiscAmt?: number;
  damageDiscAmt?: number;
  netSalesAmt?: number;

  isFreeProduct?: boolean;
}

export interface SalesIndentListResponse {
  statusCode: number;
  message: string;
  objectId: string | null;
  data: SalesIndent[];
  totalRecords?: number;
}

export interface SalesIndentDetailResponse {
  statusCode: number;
  message: string;
  objectId: string | null;
  data: {
    master?: SalesIndent;
    details?: SalesIndentDetail[];
    Master?: SalesIndent;
    Details?: SalesIndentDetail[];
  };
}

// Indent preview (CalculateIndentPreview)
export interface SalesIndentPreviewSummary {
  CustomerRegCode?: string;
  CustomerName?: string;
  CustomerBalance?: number;
  TotalAmount?: number;
  InsufficientBalance?: number;
  IncentiveDiscPerc?: number;
  DamagePerc?: number;
  TotalSalesAmt?: number;
  TotalSpecDisc?: number;
  TotalSlabDisc?: number;
  TotalRatioDisc?: number;
  TotalBuyDisc?: number;
  TotalDamageDisc?: number;
  TotalVAT?: number;
  TotalNetAmt?: number;
}

export interface SalesIndentPreviewItem {
  ProductId: number;
  ProductCode?: string;
  ProductName?: string;
  IndentQty: number;
  TradePrice?: number;
  MRPPrice?: number;
  VATPrice?: number;
  GenDiscPrice?: number;
  SalesAmt?: number;
  SpecDiscAmt?: number;
  SlabDiscAmt?: number;
  RatioDiscAmt?: number;
  BuyDiscAmt?: number;
  DamageDiscAmt?: number;
  TotalDiscAmt?: number;
  GrossSalesAmt?: number;
  VATAmt?: number;
  NetAmt?: number;
}

export interface SalesIndentPreviewData {
  Summary?: SalesIndentPreviewSummary;
  Items?: SalesIndentPreviewItem[];
  FreeItems?: SalesIndentPreviewItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SalesIndentService {
  private apiUrl = environment.apiUrl + 'api/SalesIndent';

  constructor(private http: HttpClient) {}

  getSalesIndents(options: {
    userId: number;
    pageNumber?: number;
    pageSize?: number;
    viewMode?: string;
    workId?: number | null;
  }): Observable<SalesIndentListResponse> {
    const userId = Number(options?.userId ?? 0);
    const pageNumber = Number(options?.pageNumber ?? 1);
    const pageSize = Number(options?.pageSize ?? 20);
    const viewMode = (options?.viewMode ?? 'Draft') as string;
    const workId = options?.workId;

    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('viewMode', viewMode);

    if (workId !== null && workId !== undefined && Number(workId) > 0) {
      params = params.set('workId', Number(workId).toString());
    }

    return this.http.get<SalesIndentListResponse>(this.apiUrl, { params });
  }

  getSalesIndentDetail(indentId: number): Observable<SalesIndentDetailResponse> {
    const params = new HttpParams().set('indentId', indentId.toString());
    return this.http.get<SalesIndentDetailResponse>(`${this.apiUrl}/By`, { params });
  }

  createSalesIndent(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, payload);
  }

  calculateIndentPreview(options: {
    customerId: number;
    transModeId: number;
    indentDate: string;
    items: string;
  }): Observable<ApiResponse<SalesIndentPreviewData | string | any>> {
    const customerId = Number(options?.customerId ?? 0);
    const transModeId = Number(options?.transModeId ?? 0);
    const indentDate = String(options?.indentDate ?? '');
    const items = String(options?.items ?? '[]');

    const params = new HttpParams()
      .set('customerId', customerId.toString())
      .set('transModeId', transModeId.toString())
      .set('indentDate', indentDate)
      .set('items', items);

    return this.http.get<ApiResponse<SalesIndentPreviewData | string | any>>(
      `${this.apiUrl}/CalculateIndentPreview`,
      { params }
    );
  }
  
}
