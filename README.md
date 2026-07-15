# 🏢 GH HRM Client - Human Resource Management System

A comprehensive enterprise-grade Human Resource Management System built with Angular 20, PrimeNG, and Tailwind CSS. This system provides complete HR management capabilities including employee management, attendance tracking, leave management, performance evaluation, and role-based access control.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Core Modules](#core-modules)
- [Authentication & Authorization](#authentication--authorization)
- [API Integration](#api-integration)
- [Development Guidelines](#development-guidelines)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)
- [Documentation](#documentation)

---

## 🎯 Overview

**GH HRM Client** is a modern, responsive, and feature-rich Human Resource Management System designed for enterprise use. It provides a complete solution for managing employees, tracking attendance, handling leave applications, conducting performance evaluations, and implementing role-based access control with workflow permissions.

### Key Highlights

- ✅ **Enterprise-Ready**: Built for scalability and performance
- ✅ **Modern UI/UX**: Responsive design with PrimeNG components and Tailwind CSS
- ✅ **Role-Based Access Control**: Granular permissions and workflow management
- ✅ **Real-Time Updates**: Reactive data management with RxJS
- ✅ **Security First**: Authentication guards, interceptors, and secure token management
- ✅ **Excel Export**: Built-in data export capabilities for reports
- ✅ **Multi-Language Support**: Internationalization ready

---

## 🚀 Features

### 1. **Employee Management**
- Complete employee lifecycle management (hire to retire)
- Employee profile with personal, professional, and contact details
- Document management and photo uploads
- Department, designation, and location assignments
- Salary and compensation tracking
- Employment type and grade management
- Work station assignments
- Change detection and edit mode restrictions

### 2. **Attendance Management**
- Daily attendance tracking with IN/OUT time
- Manual attendance marking with validation
- Multiple attendance status (Present, Absent, Late, Half Day, Leave)
- Working hours calculation
- Overtime tracking
- Date range filters and department/location-based filtering
- Multi-employee selection for bulk reports
- Excel export for attendance records
- AM/PM time format support

### 3. **Leave Management**
- Leave type configuration (Casual, Sick, Annual, etc.)
- Leave application submission
- Leave balance tracking
- Approval workflow integration
- Leave history and reports
- Calendar view for leave planning

### 4. **Performance Evaluation**
- Periodic performance reviews
- KPI-based evaluations
- Rating and feedback system
- Historical performance tracking
- Performance reports and analytics

### 5. **Workflow & Permissions**
- Dynamic workflow configuration
- Multi-level approval processes
- Role-based menu access
- Granular permission rules (View, Add, Edit, Delete, Approve)
- User and role management
- Menu management with hierarchy

### 6. **System Features**
- Dashboard with key metrics and charts
- User authentication and session management
- Idle timeout detection
- Loading indicators and spinners
- Toast notifications for user feedback
- Global search and filtering
- Pagination and data tables
- Responsive design for mobile devices

---

## 🛠️ Technology Stack

### Frontend Framework
- **Angular 20**: Latest version with standalone components
- **TypeScript 5.8**: Strong typing and modern JavaScript features
- **RxJS 7.8**: Reactive programming for async operations

### UI Components & Styling
- **PrimeNG 20**: Comprehensive UI component library
- **PrimeIcons 7**: Icon library
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **@primeuix/themes**: PrimeNG theme customization
- **Chart.js 4.4**: Data visualization and charts

### Utilities & Libraries
- **XLSX**: Excel file generation and parsing
- **jsPDF**: PDF generation for reports
- **html2canvas-pro**: HTML to canvas conversion
- **dom-to-image-more**: DOM to image conversion
- **file-saver**: Client-side file saving
- **crypto-js**: Encryption and security utilities
- **ngx-spinner**: Loading spinner components

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Karma & Jasmine**: Testing framework
- **Angular DevKit**: Build and development tools

---

## 📁 Project Structure

```
GH_HRM_Client/
├── src/
│   ├── app/
│   │   ├── guards/                    # Route guards
│   │   │   └── auth.guard.ts          # Authentication guard
│   │   ├── interceptor/               # HTTP interceptors
│   │   │   └── loading.interceptor.ts # Loading state management
│   │   ├── layout/                    # Application layout
│   │   │   ├── component/             # Layout components
│   │   │   │   ├── app.layout.ts      # Main layout
│   │   │   │   ├── app.topbar.ts      # Top navigation bar
│   │   │   │   ├── app.sidebar.ts     # Sidebar navigation
│   │   │   │   ├── app.menu.ts        # Menu component
│   │   │   │   └── app.footer.ts      # Footer component
│   │   │   └── service/
│   │   │       └── layout.service.ts  # Layout state management
│   │   ├── Model/                     # Data models/DTOs
│   │   │   ├── EmployeeAttendanceDTO.ts
│   │   │   ├── EmployeeEvulationDTO.ts
│   │   │   ├── LeaveApplicationDTO.ts
│   │   │   ├── LeaveBalanceDTO.ts
│   │   │   ├── LeaveTypeDTO.ts
│   │   │   ├── MenuModel.ts
│   │   │   ├── MenuWorkflowRoleDTO.ts
│   │   │   └── SPResponseDTO.ts
│   │   ├── pages/                     # Feature modules
│   │   │   ├── auth/                  # Authentication pages
│   │   │   │   ├── login.ts           # Login component
│   │   │   │   ├── access.ts          # Access denied
│   │   │   │   └── error.ts           # Error pages
│   │   │   ├── dashboard/             # Dashboard module
│   │   │   │   └── dashboard.ts
│   │   │   ├── uikit/                 # Main feature components
│   │   │   │   ├── employee-component/
│   │   │   │   ├── attendence-component/
│   │   │   │   ├── leave-application-component/
│   │   │   │   ├── leave-setup-component/
│   │   │   │   ├── performance-evulation-component/
│   │   │   │   ├── application-user-component/
│   │   │   │   ├── menu-management-component/
│   │   │   │   ├── rolePermissionComponent/
│   │   │   │   ├── permission-rule-component/
│   │   │   │   └── workflow-permisson-component/
│   │   │   └── service/               # API services
│   │   │       ├── employee.service.ts
│   │   │       ├── attendence.service.ts
│   │   │       ├── leave.service.ts
│   │   │       ├── evulation.service.ts
│   │   │       ├── login.service.ts
│   │   │       ├── applicationUser.service.ts
│   │   │       ├── menuRoles.service.ts
│   │   │       ├── WorkFlow.service.ts
│   │   │       ├── PermissonRule.service.ts
│   │   │       ├── department.service.ts
│   │   │       ├── location.service.ts
│   │   │       ├── company.service.ts
│   │   │       ├── division.service.ts
│   │   │       ├── country.service.ts
│   │   │       └── common-data.service.ts
│   │   ├── services/                  # Global services
│   │   │   ├── spinner.service.ts     # Loading spinner
│   │   │   ├── busy.service.ts        # Busy state
│   │   │   └── idleTimeout.service.ts # Session timeout
│   │   ├── shared/                    # Shared modules
│   │   │   └── common-imports.ts      # Reusable imports
│   │   ├── utility/                   # Utility classes
│   │   │   ├── Common.ts              # Common utilities
│   │   │   ├── ExcelUtil.ts           # Excel export
│   │   │   └── StorageUtil.ts         # Local storage
│   │   ├── app.component.ts           # Root component
│   │   ├── app.config.ts              # App configuration
│   │   └── app.routes.ts              # Route definitions
│   ├── assets/                        # Static assets
│   │   ├── demo/                      # Demo resources
│   │   ├── layout/                    # Layout styles
│   │   │   ├── _core.scss
│   │   │   ├── _menu.scss
│   │   │   ├── _topbar.scss
│   │   │   ├── _responsive.scss
│   │   │   └── layout.scss
│   │   ├── logo/                      # Application logos
│   │   ├── styles.scss                # Global styles
│   │   └── tailwind.css               # Tailwind imports
│   ├── environments/                  # Environment configs
│   │   ├── environment.ts             # Development
│   │   └── environment.prod.ts        # Production
│   ├── index.html                     # Main HTML
│   └── main.ts                        # Application entry
├── angular.json                       # Angular configuration
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencies
├── eslint.config.js                   # ESLint rules
├── vercel.json                        # Vercel deployment
├── FORM_VALIDATION_GUIDE.md          # Form validation docs
├── HOW_TO_USE_SHARED_IMPORTS.md      # Shared imports guide
├── ONPUSH_FIX.md                     # OnPush strategy docs
├── PERFORMANCE_OPTIMIZATION.md        # Performance guide
├── TAB_REORGANIZATION_GUIDE.md       # Tab structure docs
└── README.md                          # This file
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Angular CLI**: v20.x
- **Backend API**: Running HRM backend server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GH_HRM_Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Update src/environments/environment.ts with your API URL
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open browser**
   ```
   Navigate to: http://localhost:4200/
   ```

The application will automatically reload when you modify source files.

---

## ⚙️ Configuration

### Environment Variables

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://10.0.0.64:8080/'
};
```

### API Configuration

All API services extend base configuration with proper error handling:
- Base URL configured in environment files
- HTTP interceptors for loading states
- Centralized error handling
- Token-based authentication

---

## 📦 Core Modules

### Employee Module
**Path**: `/dashboard/uikit/employee`

Features:
- Employee creation and management
- Multi-tab interface (General, Professional, Family, Bank, Document, etc.)
- Form validation with required fields
- Edit mode with field restrictions
- Photo upload and management
- Excel export capabilities

### Attendance Module
**Path**: `/dashboard/uikit/attendence`

Features:
- View employee attendance records
- Date range filtering (From Date - To Date)
- Department and location filters
- Multi-employee selection
- Manual attendance marking
- Time validation (IN/OUT with AM/PM format)
- Working hours calculation
- Excel export for reports
- Status indicators (Present, Absent, Late, Leave, Half Day)

### Leave Management Module
**Path**: `/dashboard/uikit/leave-application` & `/dashboard/uikit/leave-setup`

Features:
- Leave type configuration
- Leave application submission
- Leave balance tracking
- Approval workflow
- Leave history and reports

### Performance Evaluation Module
**Path**: `/dashboard/uikit/performance-evulation`

Features:
- Performance review management
- Rating system
- KPI tracking
- Historical evaluations

### Access Control Module
**Paths**: 
- `/dashboard/uikit/application-user` - User management
- `/dashboard/uikit/menu-management` - Menu configuration
- `/dashboard/uikit/rolePermission` - Role permissions
- `/dashboard/uikit/permission-rule` - Permission rules
- `/dashboard/uikit/workflow-permisson` - Workflow permissions

Features:
- User account management
- Menu hierarchy management
- Role-based permissions (View, Add, Edit, Delete, Approve)
- Workflow assignment
- Permission rules configuration

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login** (`/` or `/auth/login`)
   - Username/password authentication
   - Token generation and storage
   - User profile retrieval

2. **Auth Guard**
   - Protects all dashboard routes
   - Validates token existence
   - Redirects to login if unauthorized

3. **Token Management**
   - Stored in LocalStorage via `StorageUtil`
   - Auto-included in HTTP requests
   - Session timeout handling with idle detection

### Authorization

**Role-Based Access Control (RBAC)**:
```typescript
// Permission check example
if (this.userPrivileges?.canAdd || this.currentUser.isAdmin) {
  // Show/enable add functionality
}
```

**Workflow Permissions**:
- Dynamic workflow assignment per user
- Multi-level approval processes
- Flow type and sequence management

---

## 🌐 API Integration

### Service Architecture

All services follow a consistent pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = environment.apiUrl + 'api/employee';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  saveEmployee(data: Employee): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
```

### Key Services

| Service | Purpose |
|---------|---------|
| `employee.service.ts` | Employee CRUD operations |
| `attendence.service.ts` | Attendance management |
| `leave.service.ts` | Leave applications |
| `evulation.service.ts` | Performance evaluations |
| `login.service.ts` | Authentication |
| `menuRoles.service.ts` | Menu & role management |
| `WorkFlow.service.ts` | Workflow operations |
| `common-data.service.ts` | Master data (departments, locations, etc.) |

---

## 👨‍💻 Development Guidelines

### Code Standards

1. **TypeScript Strict Mode**: Enabled for type safety
2. **ESLint + Prettier**: Code formatting and linting
3. **Component Structure**: Standalone components (Angular 20)
4. **Change Detection**: OnPush strategy for performance
5. **Reactive Forms**: Template-driven and reactive forms
6. **RxJS Best Practices**: Proper subscription management

### Component Template

```typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { COMMON_IMPORTS } from '@/shared/common-imports';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-feature',
  imports: [...COMMON_IMPORTS],
  providers: [MessageService],
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
})
export class FeatureComponent implements OnInit {
  constructor(
    private service: FeatureService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getData().subscribe({
      next: (data) => {
        // Handle success
        this.cdr.markForCheck();
      },
      error: (err) => {
        // Handle error
        this.cdr.markForCheck();
      }
    });
  }
}
```

### Form Validation

Refer to [FORM_VALIDATION_GUIDE.md](FORM_VALIDATION_GUIDE.md) for comprehensive validation patterns:
- Required field validation
- Dynamic validation rules
- Change detection in edit mode
- Custom validators

### Shared Imports

Use centralized imports for consistency:
```typescript
import { COMMON_IMPORTS } from '@/shared/common-imports';
```

See [HOW_TO_USE_SHARED_IMPORTS.md](HOW_TO_USE_SHARED_IMPORTS.md) for details.

### Performance Optimization

See [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md) for:
- OnPush change detection strategy
- RxJS optimization
- Lazy loading
- Bundle size optimization

---

## 🏗️ Build & Deployment

### Development Build

```bash
npm start
# or
ng serve
```

### Production Build

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

### Build Configurations

- **Development**: `ng build`
- **Production**: `ng build --configuration production`
- **Watch Mode**: `ng build --watch --configuration development`

### Deployment

**Vercel Deployment**:
```bash
# Configuration in vercel.json
vercel deploy --prod
```

**Manual Deployment**:
1. Build production bundle: `ng build --configuration production`
2. Copy `dist/` folder to web server
3. Configure server for SPA routing
4. Ensure API URL is correctly configured

### Server Configuration

For proper routing, configure your server to redirect all routes to `index.html`:

**Nginx Example**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache Example**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🧪 Testing

### Unit Tests

```bash
npm test
# or
ng test
```

Uses Karma test runner and Jasmine framework.

### Code Coverage

```bash
ng test --code-coverage
```

### Linting

```bash
npm run format    # Format code with Prettier
ng lint          # Run ESLint
```

---

## 📚 Documentation

### Additional Guides

- **[FORM_VALIDATION_GUIDE.md](FORM_VALIDATION_GUIDE.md)**: Comprehensive form validation patterns
- **[HOW_TO_USE_SHARED_IMPORTS.md](HOW_TO_USE_SHARED_IMPORTS.md)**: Shared imports usage
- **[ONPUSH_FIX.md](ONPUSH_FIX.md)**: OnPush change detection strategy
- **[PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md)**: Performance best practices
- **[TAB_REORGANIZATION_GUIDE.md](TAB_REORGANIZATION_GUIDE.md)**: Tab structure organization

### Component Documentation

Each major component includes inline documentation and examples:
- Component purpose and features
- Input/Output properties
- Service dependencies
- Usage examples

---

## 🤝 Contributing

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -m 'Add some feature'`
4. **Push to branch**: `git push origin feature/your-feature`
5. **Create Pull Request**

### Code Review Process

- All changes require code review
- Follow existing code patterns
- Ensure tests pass
- Update documentation as needed

### Coding Standards

- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused

---

## 📊 Key Features & Capabilities

### Data Management
- ✅ CRUD operations for all entities
- ✅ Advanced filtering and search
- ✅ Pagination and sorting
- ✅ Excel export functionality
- ✅ Bulk operations support

### User Experience
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications for feedback
- ✅ Loading indicators
- ✅ Form validation with error messages
- ✅ Confirmation dialogs
- ✅ Date and time pickers with localization

### Security
- ✅ Token-based authentication
- ✅ Route guards
- ✅ Role-based access control
- ✅ Session management
- ✅ Idle timeout detection
- ✅ Secure API communication

### Performance
- ✅ Lazy loading modules
- ✅ OnPush change detection
- ✅ Optimized bundle size
- ✅ HTTP request optimization
- ✅ Efficient rendering

---

## 🐛 Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Change port in angular.json or use:
ng serve --port 4201
```

**2. Module not found**
```bash
npm install
```

**3. API connection failed**
- Check API URL in environment files
- Verify backend server is running
- Check CORS configuration

**4. Build errors**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
ng build
```

---

## 📝 License

This project is licensed under the terms specified in [LICENSE.md](LICENSE.md).

---

## 📧 Support

For issues, questions, or contributions:
- **Email**: support@example.com
- **Issue Tracker**: GitHub Issues
- **Documentation**: Project Wiki

---

## 🔄 Version History

### Version 20.0.0 (Current)
- Angular 20 upgrade
- Standalone components
- PrimeNG 20 integration
- Tailwind CSS 4 implementation
- Enhanced performance optimizations

---

## 👥 Team

- **Project Lead**: [Name]
- **Lead Developer**: [Name]
- **UI/UX Designer**: [Name]
- **QA Engineer**: [Name]

---

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- PrimeNG Team for UI components
- Tailwind CSS Team for utility-first CSS
- All contributors and supporters

---

**Built with ❤️ using Angular, PrimeNG, and Tailwind CSS**
