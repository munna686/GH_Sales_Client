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

export interface SalesOrder {
    orderId: number;
    orderRefNo: string;
    orderDate: string;
    // IDs needed for edit/forward flows (available in master/detail responses)
    customerId?: number;
    customerLocationId?: number;
    depotId?: number;
    poNumber?: string;
    remarks?: string;
    depotName: string;
    exptDlvDate: string;
    customerName: string;
    // Optional fields (available in some API responses)
    custRegCode?: string;
    customerCode?: string;
    locationName: string;
    locationCode?: number | string;
    customerLocationCode?: number | string;
    salesOfficer: string;
    transMode: string;
    creditLimitAmt: number;
    creditDays: number;
    creditBalance: number;
    vatAmt: number;
    orderAmt: number;

    // Workflow history (optional)
    entryBy?: string | null;
    entryDate?: string | null;
    checkBy?: string | null;
    checkDate?: string | null;
    approveBy?: string | null;
    approveDate?: string | null;
    workfollowPosition?: number | null;
}

export interface SalesOrderDetail {
    // IDs needed for edit/forward flows (some APIs return these)
    orderItemId?: number;
    productId?: number;
    productCode: string;
    productName: string;
    packSize: number;
    orderQty: number;
    stockQty: number;
    tradePrice: number;
    discAmt: number;
    orderAmt: number;
}

export interface SalesOrderResponse {
    statusCode: number;
    message: string;
    objectId: string | null;
    data: SalesOrder[];
    totalRecords?: number;
}

export interface SalesOrderDetailResponse {
    statusCode: number;
    message: string;
    objectId: string | null;
    data: {
        // Old shape
        master?: SalesOrder;
        details?: SalesOrderDetail[];
        // New shape (SalesOrderMasterWithDetailsDTO)
        Master?: SalesOrder;
        Details?: SalesOrderDetail[];
    };
}

export interface SalesOrderToIndentDTO{
    orderId: number;
    orderRefNo: string;
    customerName: string;
    locationName: string;
    salesOfficer: string;
    transMode: string;
    creditLimitAmt: number;
    creditDays: number;
    creditBalance: number;
    orderAmt: number;
}

export interface VWCustomerDTO {
    customerId: number;
    custRegCode: string;
    customerName: string;
}

export interface VWCustomerLocationDTO {
    locationId: number;
    locationCode: number;
    locationName: string;
    creditBalance: number;
}

export interface VWUserDepoDTO {
    depotId: number;
    depotName: string;
}

export interface VWProductDTO {
    productId: number;
    productCode: string;
    productName: string;
}

export interface CustomerProductPriceDTO {
    productId: number;
    customerId: number;
    mrpPrice: number;
    tradePrice: number;
}

export interface CreateSalesOrderItemRequest {
    orderItemId?: number;
    productId: number;
    orderQty: number;
}

export interface CreateSalesOrderRequest {
    // orderId is optional for create, required for edit/forward
    orderId?: number;
    orderRefNo?: string;
    customerId: number;
    customerLocationId: number;
    depotId: number;
    orderDate: string;
    expDeliveryDate: string;
    salesPersonId: number;
    poNumber: string;
    remarks: string;
    entryUserId: number;
    entryBy: string;
    isSaveAndForward: boolean;
    action: string;
    items: CreateSalesOrderItemRequest[];
}

export interface SaveSalesOrderRequest extends CreateSalesOrderRequest {
    orderId: number;
}

@Injectable({
    providedIn: 'root'
})
export class SalesOrderService {
    private apiUrl = environment.apiUrl + 'api/SalesOrder';

    constructor(private http: HttpClient) {}

    getSalesOrders(options: {
        userId: number;
        pageNo?: number;
        pageSize?: number;
        viewMode?: string;
        workId?: number | null;
        searchText?: string | null;
    }): Observable<SalesOrderResponse> {
        const userId = Number(options?.userId ?? 0);
        const pageNo = Number(options?.pageNo ?? 1);
        const pageSize = Number(options?.pageSize ?? 20);
        const viewMode = (options?.viewMode ?? 'Draft') as string;
        const workId = options?.workId;
        const searchText = options?.searchText;

        let params = new HttpParams();

        // New backend param names (as per SP signature)
        params = params
            .set('UserId', userId.toString())
            .set('PageNo', pageNo.toString())
            .set('PageSize', pageSize.toString())
            .set('ViewMode', viewMode);

        if (workId !== null && workId !== undefined && Number(workId) > 0) {
            params = params.set('WorkId', Number(workId).toString());
        }
        if (searchText && String(searchText).trim().length) {
            params = params.set('SearchText', String(searchText).trim());
        }

        // Backward-compatible param names (in case API still expects these)
        params = params
            .set('userId', userId.toString())
            .set('pageNumber', pageNo.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<SalesOrderResponse>(this.apiUrl, { params });
    }

    getSalesOrderDetail(salesOrderId: number): Observable<SalesOrderDetailResponse> {
        const params = new HttpParams().set('salesOrderId', salesOrderId.toString());

        return this.http.get<SalesOrderDetailResponse>(`${this.apiUrl}/By`, { params });
    }

    getCustomers(): Observable<ApiResponse<VWCustomerDTO[]>> {
        return this.http.get<ApiResponse<VWCustomerDTO[]>>(`${this.apiUrl}/Customers`);
    }

    getCustomerLocations(customerId: number): Observable<ApiResponse<VWCustomerLocationDTO[]>> {
        const params = new HttpParams().set('customerId', customerId.toString());
        return this.http.get<ApiResponse<VWCustomerLocationDTO[]>>(`${this.apiUrl}/Customer/Location`, { params });
    }

    getUserDepot(userId: number): Observable<ApiResponse<VWUserDepoDTO[]>> {
        const params = new HttpParams().set('userId', userId.toString());
        return this.http.get<ApiResponse<VWUserDepoDTO[]>>(`${this.apiUrl}/User/Depot`, { params });
    }

    getProductsList(): Observable<ApiResponse<VWProductDTO[]>> {
        return this.http.get<ApiResponse<VWProductDTO[]>>(`${this.apiUrl}/Products`);
    }

    getCustomerProductPrice(customerId: number, productId: number): Observable<ApiResponse<CustomerProductPriceDTO>> {
        const params = new HttpParams()
            .set('customerId', customerId.toString())
            .set('productId', productId.toString());
        return this.http.get<ApiResponse<CustomerProductPriceDTO>>(`${this.apiUrl}/Customer/Product/Price`, { params });
    }

    createSalesOrder(payload: CreateSalesOrderRequest): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, payload);
    }

    // Backend commonly uses same endpoint to both create and update based on presence of `orderId`.
    // If your API has a dedicated update route, adjust this accordingly.
    saveOrder(payload: SaveSalesOrderRequest): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, payload);
    }
    getSalesOrderToIndent(userId: number): Observable<ApiResponse< SalesOrderToIndentDTO[]>> {
        const params = new HttpParams()
            .set('userId', userId.toString())
        return this.http.get<ApiResponse<SalesOrderToIndentDTO[]>>(`${this.apiUrl}/To/Indent`, { params });
    }
}
