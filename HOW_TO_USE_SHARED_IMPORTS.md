# 🎯 How to Use Shared Common Imports

## Quick Start

### For New Components

```typescript
import { Component } from '@angular/core';
import { COMMON_IMPORTS } from '@/shared/common-imports';

@Component({
  selector: 'app-my-component',
  imports: [...COMMON_IMPORTS],  // ⚡ Just add this!
  templateUrl: './my-component.html'
})
export class MyComponent {
  // Your component code
}
```

---

## What's Included in COMMON_IMPORTS?

### Angular Core
- `CommonModule` - *ngIf, *ngFor, pipes, etc.
- `FormsModule` - Template-driven forms, ngModel
- `ReactiveFormsModule` - FormBuilder, FormGroup, FormArray

### PrimeNG Components
- **Tables**: TableModule
- **Forms**: InputTextModule, TextareaModule, InputNumberModule, CheckboxModule, SelectModule, MultiSelectModule, DatePickerModule, ToggleSwitch, FileUpload
- **Buttons**: ButtonModule
- **Icons**: IconFieldModule, InputIconModule
- **Dialogs**: Dialog, ConfirmDialog, ToastModule
- **Navigation**: TabsModule
- **Layout**: DividerModule, FloatLabel
- **Display**: TagModule, AvatarModule, Tooltip

---

## When to Use

### ✅ Use COMMON_IMPORTS when you need:
- Basic Angular directives (*ngIf, *ngFor)
- Forms (reactive or template-driven)
- Common PrimeNG components (buttons, inputs, tables, dialogs)
- Multiple PrimeNG modules in one component

### ❌ Don't use COMMON_IMPORTS when you need:
- Only 1-2 specific modules (import directly)
- Non-standard PrimeNG modules not in the list
- Third-party libraries (Chart.js, etc.)

---

## Examples

### Example 1: Simple Form Component
```typescript
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { COMMON_IMPORTS } from '@/shared/common-imports';

@Component({
  selector: 'app-user-form',
  imports: [...COMMON_IMPORTS],
  template: `
    <form [formGroup]="userForm">
      <p-floatlabel>
        <input pInputText id="name" formControlName="name" />
        <label for="name">Name</label>
      </p-floatlabel>
      
      <p-button label="Save" (onClick)="save()" />
    </form>
  `
})
export class UserFormComponent {
  userForm = this.fb.group({
    name: ['', Validators.required]
  });
  
  constructor(private fb: FormBuilder) {}
  
  save() {
    console.log(this.userForm.value);
  }
}
```

### Example 2: Data Table Component
```typescript
import { Component } from '@angular/core';
import { COMMON_IMPORTS } from '@/shared/common-imports';

@Component({
  selector: 'app-employee-list',
  imports: [...COMMON_IMPORTS],
  template: `
    <p-table [value]="employees">
      <ng-template #header>
        <tr>
          <th>Name</th>
          <th>Department</th>
        </tr>
      </ng-template>
      <ng-template #body let-emp>
        <tr>
          <td>{{ emp.name }}</td>
          <td>{{ emp.department }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class EmployeeListComponent {
  employees = [
    { name: 'John', department: 'IT' },
    { name: 'Jane', department: 'HR' }
  ];
}
```

### Example 3: Component with Additional Imports
```typescript
import { Component } from '@angular/core';
import { COMMON_IMPORTS } from '@/shared/common-imports';
import { ChartModule } from 'primeng/chart';  // Not in COMMON_IMPORTS
import { MyCustomPipe } from './my-custom.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    ...COMMON_IMPORTS,  // Spread common imports
    ChartModule,         // Add specific module
    MyCustomPipe         // Add custom pipe
  ],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  // Your code
}
```

---

## Adding New Modules to Shared Imports

If you find yourself importing the same module across multiple components:

### Step 1: Open `src/app/shared/common-imports.ts`

### Step 2: Add the import
```typescript
import { MyNewModule } from 'primeng/mynewmodule';
```

### Step 3: Add to COMMON_IMPORTS array
```typescript
export const COMMON_IMPORTS = [
  CommonModule,
  FormsModule,
  // ... existing imports
  MyNewModule,  // Add here
] as const;
```

### Step 4: Use in your components
Now all components using `...COMMON_IMPORTS` automatically get `MyNewModule`!

---

## Migration Guide

### Converting Existing Component

**Before:**
```typescript
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';

@Component({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    Dialog
  ]
})
```

**After:**
```typescript
import { COMMON_IMPORTS } from '@/shared/common-imports';

@Component({
  imports: [...COMMON_IMPORTS]  // ✨ Much cleaner!
})
```

**Result:**
- 5 import statements → 1 import statement ✅
- Cleaner code ✅
- Easier to maintain ✅

---

## Benefits

### 1. **Consistency**
All components use the same module versions and configurations

### 2. **Maintainability**
Update imports in one place, all components benefit

### 3. **Developer Experience**
- Less typing
- Fewer imports to remember
- Copy-paste friendly

### 4. **Bundle Size**
Better tree-shaking and code splitting by Angular compiler

### 5. **Readability**
Focus on component logic, not boilerplate imports

---

## FAQ

### Q: Will this increase my bundle size?
**A:** No! Angular's tree-shaking removes unused code. You only pay for what you use.

### Q: What if I only need one module?
**A:** You can still import directly:
```typescript
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule]  // Skip COMMON_IMPORTS if you want
})
```

### Q: Can I use this with lazy-loaded modules?
**A:** Yes! Each lazy-loaded component can import `COMMON_IMPORTS` independently.

### Q: How do I know what's in COMMON_IMPORTS?
**A:** Check `src/app/shared/common-imports.ts` or use your IDE's autocomplete.

---

## Best Practices

### ✅ DO:
- Use `COMMON_IMPORTS` for components with multiple PrimeNG modules
- Keep the list focused on truly common modules
- Document changes when adding new modules
- Use spread operator: `[...COMMON_IMPORTS]`

### ❌ DON'T:
- Add rarely-used modules to COMMON_IMPORTS
- Add business-logic specific modules
- Forget to import additional modules when needed
- Mix NgModule and standalone component patterns

---

## Need Help?

If you're unsure whether to add a module to COMMON_IMPORTS, ask:
1. **Is it used in 3+ components?** → Yes = Add it
2. **Is it a core UI module?** → Yes = Add it
3. **Is it specific to one feature?** → No = Import directly

---

## Examples in Codebase

See these files for reference:
- `src/app/pages/uikit/employee-component/employee-component.ts` - Full implementation
- `src/app/shared/common-imports.ts` - Module definition

---

Happy coding! 🚀
