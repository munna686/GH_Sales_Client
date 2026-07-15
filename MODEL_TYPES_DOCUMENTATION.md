# Model Types Documentation

This document provides a comprehensive overview of all TypeScript models/DTOs created to replace `any` types throughout the HRM application.

## Purpose
These models were created to:
- Replace all `any` type usages with proper TypeScript interfaces
- Provide type safety across the entire application
- Improve code maintainability and IDE autocomplete
- Enable better error detection at compile time

## Model Files

### 1. **EmployeeDTO.ts**
Contains all employee-related data structures:
- `EmployeeDTO` - Main employee interface
- `EmployeeEducationDTO` - Employee education records
- `EmployeeTrainingDTO` - Employee training records
- `EmployeeExperienceDTO` - Employee work experience
- `EmployeeReferenceDTO` - Employee references
- `EmployeeContactPersonDTO` - Emergency contact persons
- `EmployeeDocumentDTO` - Employee document uploads
- `EmployeeWorkStationDTO` - Employee work station assignments
- `EmployeeSalaryDTO` - Employee salary details

### 2. **UserDTO.ts**
User authentication and authorization models:
- `UserDTO` - Basic user information
- `CurrentUserDTO` - Extended user with permissions and menus
- `UserPermissionDTO` - User menu permissions
- `MenuDTO` - Menu/navigation items

### 3. **WorkflowDTO.ts**
Workflow management interfaces:
- `WorkflowDTO` - Basic workflow information
- `MenuWorkflowDTO` - Menu-workflow associations
- `EmployeeWorkflowDTO` - Employee workflow assignments

### 4. **CompanyDTO.ts**
Organization structure models:
- `CompanyDTO` - Company information
- `DepartmentDTO` - Department details
- `DivisionDTO` - Division details
- `LocationDTO` - Location/branch information
- `DesignationDTO` - Job designations
- `DepotDTO` - Depot/warehouse information
- `CostCenterDTO` - Cost center details
- `BankInfoDTO` - Bank information
- `SalaryAllowanceDTO` - Salary allowance types
- `SuperVisorDTO` - Supervisor information
- `RoleDTO` - User roles
- `GradeDTO` - Employee grades

### 5. **LeaveReasonDTO.ts**
Leave reason data structure

### 6. **LeaveTypeDTO.ts** (Updated)
Leave type configuration - removed `any` types for date fields

### 7. **EvulationDTO.ts**
Performance evaluation models:
- `EvulationAssessmentDTO` - Assessment criteria
- `EvulationEventDTO` - Evaluation events
- `EmployeeEvulationDetailsDTO` - Evaluation details

### 8. **RolePermissionDTO.ts**
Role-based access control:
- `RolePermissionDTO` - Role permissions
- `ParentMenuPermissionDTO` - Parent menu permissions
- `MenuPermissionDTO` - Menu-level permissions
- `PermissionRuleDTO` - Permission rules
- `PermissionRuleDetailDTO` - Rule details

### 9. **WorkflowPermissionDTO.ts**
Workflow permission structures:
- `WorkflowPermissionDTO` - Workflow permissions
- `MenuWorkflowRoleDTO` - Menu workflow roles
- `WorkflowRoleDetailDTO` - Role workflow details
- `MenuWorkflowUserDTO` - User workflow assignments
- `WorkflowUserDetailDTO` - User workflow details

### 10. **FormValueDTO.ts**
Form-related types:
- `SelectOption` - Generic dropdown option
- `BankStateOption` - Bank/Mobile banking selector
- `PeriodOption` - Period selection
- `EventValue` - Generic event value
- `FileEventTarget` - File input event target
- `FileInputEvent` - File input event
- `ExcelColumnWidth` - Excel column width config
- `FilterCriteria` - Filter form criteria

### 11. **StatusDTO.ts**
Status-related types:
- `StatusOption` - Generic status option
- `AttendanceStatusDTO` - Attendance status
- `WorkflowStatusDTO` - Workflow status

### 12. **ManualAttendanceDTO.ts**
Manual attendance entry:
- `ManualAttendanceDTO` - Manual attendance record
- `ManualAttendanceRecordDTO` - Attendance record details

### 13. **TableDataDTO.ts**
Table data structures:
- `TableColumnDTO` - Table column configuration
- `TableDataDTO<T>` - Generic table data with pagination
- Type aliases for specific table types

## Utility Class Updates

### StorageUtil.ts
Updated methods to use generics instead of `any`:
```typescript
static setItem<T>(key: string, value: T): void
static getCurrentUser<T = any>(): T | null
static getCurrentUserMenu<T = any>(): T | null
```

### ExcelUtil.ts
Updated methods to use generics:
```typescript
static exportToExcel<T = any>(data: T[], fileName: string): void
static exportToExcelWithCustomWidths<T = any>(data: T[], fileName: string, columnWidths: { wch: number }[]): void
```

### Common.ts
Updated workflow method:
```typescript
static getMaxSequenceWorkflow<T extends { sequenceOrder: number }>(workflows: T[]): T | null
```

## Usage Examples

### Import Models
```typescript
// Import specific models
import { EmployeeDTO, CompanyDTO, UserDTO } from '@/Model';

// Or import from specific files
import { EmployeeDTO } from '@/Model/EmployeeDTO';
```

### Type Safety in Components
```typescript
// Before
employeeList: any[] = [];

// After
employeeList: EmployeeDTO[] = [];
```

### Service Methods
```typescript
// Before
getAll(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}`);
}

// After
getAll(): Observable<EmployeeDTO[]> {
  return this.http.get<EmployeeDTO[]>(`${this.apiUrl}`);
}
```

### Form Values
```typescript
// Before
onBankStateChange(event: any) { ... }

// After
import { EventValue } from '@/Model';
onBankStateChange(event: EventValue) { ... }
```

## Migration Guide

To update existing code:

1. **Import the appropriate model:**
   ```typescript
   import { EmployeeDTO, CompanyDTO } from '@/Model';
   ```

2. **Replace `any` type with specific model:**
   ```typescript
   // Before
   currentUser: any;
   
   // After
   currentUser: UserDTO | null;
   ```

3. **Update arrays:**
   ```typescript
   // Before
   employeeList: any[] = [];
   
   // After
   employeeList: EmployeeDTO[] = [];
   ```

4. **Update service methods:**
   ```typescript
   // Before
   getEmployees(): Observable<any> {
     return this.http.get<any>(url);
   }
   
   // After
   getEmployees(): Observable<EmployeeDTO[]> {
     return this.http.get<EmployeeDTO[]>(url);
   }
   ```

## Benefits

1. **Type Safety**: Compile-time error detection
2. **IntelliSense**: Better IDE autocomplete and suggestions
3. **Refactoring**: Safer code refactoring with type checking
4. **Documentation**: Self-documenting code with clear interfaces
5. **Maintainability**: Easier to understand and maintain code

## Next Steps

To complete the migration:
1. Update all component properties to use specific types
2. Update all service methods to return typed observables
3. Update event handlers to use proper event types
4. Test all functionality after type updates
5. Enable strict TypeScript checks in tsconfig.json

## Notes

- All models are exported from `@/Model/index.ts` for convenient importing
- Models use optional properties (?) where appropriate
- Date fields accept `Date | string` for flexibility with API responses
- Generic types are provided where flexibility is needed (e.g., `TableDataDTO<T>`)
