import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { StorageUtil } from '@/utility/StorageUtil';
import { IdleTimeoutService } from '@/services/idleTimeout.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface LoginApiResponse {
  statusCode: number;
  message: string;
  objectId: string | null;
  data: {
    adminPrivilegeType: any;
    userId: any;
    loginId: string;
    employeeId: number;
    userName: string;
    department: string;
    designation: string;
  } | null;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, Toast, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
  providers: [MessageService],
  template: `
    <p-toast />
    <app-floating-configurator />

    <!-- Main Container with Animated Background -->
    <div class="login-wrapper">
      <!-- Animated Background Elements -->
      <div class="bg-decoration decoration-1"></div>
      <div class="bg-decoration decoration-2"></div>
      <div class="bg-decoration decoration-3"></div>
      <div class="snowflakes" aria-hidden="true">
        <div class="snowflake" *ngFor="let i of snowflakeArray">❄</div>
      </div>

      <!-- Login Container -->
      <div class="login-container">
        <!-- Left Panel - Brand Showcase -->
        <div class="login-left">
          <!-- Dual Brand Logos -->
          <div class="brand-logos">
            <div class="brand-item" [class.active]="selectedBrand === 'gh'" (click)="selectBrand('gh')">
              <span class="brand-selected-badge" *ngIf="selectedBrand === 'gh'">
                <i class="pi pi-check"></i>
              </span>
              <img src="assets/logo/GH.png" alt="Golden Harvest" class="brand-logo" />
              <div class="brand-info">
                <h3>Golden Harvest</h3>
                <p>Frozen Foods Division</p>
              </div>
            </div>
            <div class="brand-divider"></div>
            <div class="brand-item" [class.active]="selectedBrand === 'bloop'" (click)="selectBrand('bloop')">
              <span class="brand-selected-badge" *ngIf="selectedBrand === 'bloop'">
                <i class="pi pi-check"></i>
              </span>
              <img src="assets/logo/bloop.png" alt="Bloop Ice Cream" class="brand-logo" />
              <div class="brand-info">
                <h3>Bloop</h3>
                <p>Ice Cream Division</p>
              </div>
            </div>
          </div>

          <!-- Welcome Message -->
          <div class="welcome-content">
            <h1>Sales Operations Portal</h1>
            <p>Unified sales workspace for field and office teams</p>
          </div>

          <!-- Features List -->
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <span>Employee self-service portal</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span>Sales pipeline and opportunity tracking</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span>Customer performance and revenue snapshots</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span>Order updates and territory visibility</span>
            </div>
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="login-right">
          <div class="login-form-container">
            <div class="form-header">
              <h2>Sales Login</h2>
              <p>Access your sales dashboard and daily workflow</p>
            </div>

            <div class="selected-company-summary">
              <span class="summary-label">Selected Company</span>
              <span class="summary-value">{{ selectedCompany === 'gh' ? 'Golden Harvest' : 'Bloop' }}</span>
            </div>

            <!-- Email/Username -->
            <div class="form-group">
              <label class="form-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                User ID / Email
              </label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                  </svg>
                </span>
                <input 
                  pInputText 
                  type="text" 
                  [(ngModel)]="email"
                  placeholder="Enter your employee ID or email"
                  class="custom-input"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="form-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Password
              </label>
              <div class="password-wrapper">
                <p-password 
                  [(ngModel)]="password" 
                  placeholder="Enter your password" 
                  [toggleMask]="true" 
                  [feedback]="false"
                  styleClass="custom-password-input"
                  [fluid]="true"
                  [inputStyleClass]="'custom-password-field'"
                />
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="form-footer">
              <div class="remember-wrapper">
                <p-checkbox [(ngModel)]="checked" binary inputId="remember" />
                <label for="remember" class="remember-label">Remember me</label>
              </div>
              <a href="javascript:void(0)" class="forgot-link">Forgot Password?</a>
            </div>

            <!-- Sign In Button -->
            <p-button 
              label="Sign In" 
              icon="pi pi-sign-in"
              pRipple 
              styleClass="login-button"
              (click)="login()"
            />

            <!-- Help Section -->
            <div class="help-section">
              <p>Need help? Contact Sales Operations</p>
              <a href="tel:+880123456789">+880-123-456-789</a>
              <p class="help-email">
                <a href="mailto:sales.ops@goldenharvest.com.bd">sales.ops@goldenharvest.com.bd</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      /* Custom PrimeNG Overrides */
      .p-password {
        width: 100%;
      }

      .custom-password-input .p-password-input {
        width: 100%;
        padding-left: 3rem !important;
      }

      .custom-password-field {
        width: 100%;
        padding: 0.875rem 1rem 0.875rem 3rem !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 0.75rem !important;
        font-size: 0.9375rem !important;
        transition: all 0.3s ease !important;
      }

      .custom-password-field:focus {
        border-color: var(--brand-primary) !important;
        box-shadow: 0 0 0 4px var(--brand-glow) !important;
      }

      .p-password .p-icon {
        right: 1rem !important;
        color: #6b7280 !important;
      }

      .login-button {
        width: 100%;
        padding: 1rem !important;
        background: var(--brand-gradient) !important;
        border: none !important;
        border-radius: 0.75rem !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      .login-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 28px rgba(16, 185, 129, 0.3) !important;
      }

      .login-button .p-button-icon {
        font-size: 1.125rem !important;
      }

      .p-checkbox .p-checkbox-box {
        border-radius: 0.375rem !important;
        border-color: #d1d5db !important;
      }

      .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight {
        background: var(--brand-primary) !important;
        border-color: var(--brand-primary) !important;
      }

      .custom-company-select.p-select {
        border: 2px solid #e5e7eb !important;
        border-radius: 0.75rem !important;
        padding: 0.125rem 0.25rem !important;
      }

      .custom-company-select.p-select:not(.p-disabled):hover {
        border-color: var(--brand-primary) !important;
      }

      .custom-company-select.p-select.p-focus {
        border-color: var(--brand-primary) !important;
        box-shadow: 0 0 0 4px var(--brand-glow) !important;
      }

      .custom-company-select .p-select-label {
        padding: 0.65rem 0.75rem !important;
        font-size: 0.9375rem !important;
      }
    }

    /* CSS Variables for Brand Colors */
    :host {
      --brand-primary: #10b981;
      --brand-secondary: #059669;
      --brand-accent: #34d399;
      --brand-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
      --brand-glow: rgba(16, 185, 129, 0.2);
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --surface: #ffffff;
      --surface-alt: #f9fafb;
    }

    :host(.bloop-theme) {
      --brand-primary: #ec4899;
      --brand-secondary: #db2777;
      --brand-accent: #f472b6;
      --brand-gradient: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
      --brand-glow: rgba(236, 72, 153, 0.2);
    }

    /* Main Wrapper */
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
      position: relative;
      overflow: hidden;
    }

    /* Animated Background Decorations */
    .bg-decoration {
      position: fixed;
      border-radius: 50%;
      opacity: 0.08;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-1 {
      width: 500px;
      height: 500px;
      background: var(--brand-gradient);
      top: -200px;
      right: -150px;
      animation: float 20s ease-in-out infinite;
    }

    .decoration-2 {
      width: 350px;
      height: 350px;
      background: var(--brand-gradient);
      bottom: -100px;
      left: -100px;
      animation: float 15s ease-in-out infinite reverse;
    }

    .decoration-3 {
      width: 250px;
      height: 250px;
      background: linear-gradient(135deg, #ec4899, #f472b6);
      top: 50%;
      left: 20%;
      animation: pulse 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.06; }
      50% { transform: scale(1.15); opacity: 0.1; }
    }

    /* Snowflakes Animation */
    .snowflakes {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .snowflake {
      position: absolute;
      top: -10%;
      color: rgba(16, 185, 129, 0.3);
      font-size: 1.5rem;
      animation: fall linear infinite;
    }

    .snowflake:nth-child(1) { left: 10%; animation-duration: 15s; animation-delay: 0s; }
    .snowflake:nth-child(2) { left: 20%; animation-duration: 18s; animation-delay: 2s; }
    .snowflake:nth-child(3) { left: 30%; animation-duration: 12s; animation-delay: 4s; }
    .snowflake:nth-child(4) { left: 40%; animation-duration: 20s; animation-delay: 1s; }
    .snowflake:nth-child(5) { left: 50%; animation-duration: 16s; animation-delay: 3s; }
    .snowflake:nth-child(6) { left: 60%; animation-duration: 14s; animation-delay: 5s; }
    .snowflake:nth-child(7) { left: 70%; animation-duration: 19s; animation-delay: 2s; }
    .snowflake:nth-child(8) { left: 80%; animation-duration: 17s; animation-delay: 4s; }
    .snowflake:nth-child(9) { left: 90%; animation-duration: 13s; animation-delay: 1s; }

    @keyframes fall {
      0% { top: -10%; transform: translateX(0) rotate(0deg); }
      100% { top: 110%; transform: translateX(50px) rotate(360deg); }
    }

    /* Login Container */
    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1100px;
      background: var(--surface);
      border-radius: 1.5rem;
      box-shadow: 
        0 20px 60px rgba(16, 185, 129, 0.15),
        0 0 0 1px rgba(16, 185, 129, 0.05);
      display: grid;
      grid-template-columns: 45% 55%;
      overflow: hidden;
      animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Left Panel */
    .login-left {
      background: var(--brand-gradient);
      padding: 3rem;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .login-left::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
      animation: float 12s ease-in-out infinite;
    }

    /* Brand Logos Section */
    .brand-logos {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      z-index: 1;
      animation: fadeIn 1s ease-out 0.3s both;
    }

    .brand-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      position: relative;
    }

    .brand-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .brand-item.active {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .brand-selected-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.95);
      color: #065f46;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    .brand-selected-badge .pi-check {
      font-size: 0.72rem;
      font-weight: 700;
    }

    .brand-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
    }

    .brand-info {
      text-align: center;
    }

    .brand-info h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .brand-info p {
      font-size: 0.75rem;
      opacity: 0.9;
    }

    .brand-divider {
      width: 2px;
      height: 80px;
      background: rgba(255, 255, 255, 0.3);
    }

    /* Welcome Content */
    .welcome-content {
      margin-top: 2rem;
      position: relative;
      z-index: 1;
      animation: fadeIn 1s ease-out 0.5s both;
    }

    .welcome-content h1 {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 0.75rem;
    }

    .welcome-content p {
      font-size: 1rem;
      opacity: 0.95;
      line-height: 1.5;
    }

    /* Features List */
    .features-list {
      margin-top: 2rem;
      position: relative;
      z-index: 1;
      animation: fadeIn 1s ease-out 0.7s both;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      margin-bottom: 1rem;
      font-size: 0.9375rem;
      opacity: 0.95;
    }

    .feature-icon {
      width: 2.25rem;
      height: 2.25rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-icon svg {
      width: 1.25rem;
      height: 1.25rem;
      color: white;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Right Panel - Login Form */
    .login-right {
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 1s ease-out 0.4s both;
    }

    .login-form-container {
      width: 100%;
      max-width: 420px;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .selected-company-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding: 0.65rem 0.875rem;
      border: 1px solid #d1fae5;
      border-radius: 0.75rem;
      background: #f0fdf4;
    }

    .summary-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #065f46;
    }

    .summary-value {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--brand-secondary);
    }

    /* Form Groups */
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .label-icon {
      width: 1rem;
      height: 1rem;
      color: var(--brand-primary);
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-secondary);
      z-index: 1;
      pointer-events: none;
    }

    .input-icon svg {
      width: 100%;
      height: 100%;
    }

    .custom-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      transition: all 0.3s ease;
      background: white;
    }

    .custom-input:focus {
      outline: none;
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 4px var(--brand-glow);
    }

    .custom-input::placeholder {
      color: #9ca3af;
    }

    .custom-select {
      padding-left: 1rem;
      appearance: none;
      background-image: linear-gradient(45deg, transparent 50%, #6b7280 50%), linear-gradient(135deg, #6b7280 50%, transparent 50%);
      background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
      background-size: 6px 6px, 6px 6px;
      background-repeat: no-repeat;
      cursor: pointer;
    }

    .password-wrapper {
      position: relative;
    }

    .password-wrapper::before {
      content: '';
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      z-index: 2;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0110 0v4'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }

    /* Form Footer */
    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .remember-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .remember-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      cursor: pointer;
      user-select: none;
    }

    .forgot-link {
      font-size: 0.875rem;
      color: var(--brand-primary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .forgot-link:hover {
      color: var(--brand-secondary);
      text-decoration: underline;
    }

    /* Help Section */
    .help-section {
      margin-top: 2rem;
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .help-section p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .help-section a {
      font-size: 0.9375rem;
      color: var(--brand-primary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .help-section a:hover {
      color: var(--brand-secondary);
    }

    .help-email {
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }

    .help-email a {
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 968px) {
      .login-container {
        grid-template-columns: 1fr;
      }

      .login-left {
        padding: 2rem;
      }

      .brand-logo {
        width: 60px;
        height: 60px;
      }

      .welcome-content h1 {
        font-size: 1.5rem;
      }

      .login-right {
        padding: 2rem;
      }
    }

    @media (max-width: 640px) {
      .login-left {
        display: none;
      }

      .login-right {
        padding: 1.5rem;
      }

      .login-wrapper {
        padding: 1rem;
      }
    }
  `]
})
export class Login implements OnInit {
  private readonly loginApiUrl = 'https://localhost:7098/api/WfUserRegistration/login';

  email: string = '';
  password: string = '';
  checked: boolean = false;
  selectedBrand: 'gh' | 'bloop' = 'gh';
  selectedCompany: 'gh' | 'bloop' = 'gh';
  snowflakeArray = Array(9).fill(0);

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private idleService: IdleTimeoutService
  ) {
    // Load remembered credentials on component initialization
    this.loadRememberedCredentials();
  }

  ngOnInit() {
    // Check if user is already logged in (auto-login)
    const user = StorageUtil.getItem('user');
    if (user) {
      // Check if the session has expired (for remembered sessions)
      const sessionExpiry = localStorage.getItem('userSessionExpiry');
      if (sessionExpiry) {
        const expiryDate = new Date(parseInt(sessionExpiry));
        const now = new Date();
        
        if (now > expiryDate) {
          // Session expired, clear it
          StorageUtil.removeItem('user');
          localStorage.removeItem('userSessionExpiry');
          this.clearRememberedCredentials();
        } else {
          // User is still authenticated, redirect to dashboard
          this.router.navigate(['/dashboard']);
          return;
        }
      } else {
        // No expiry means it's a session storage login (current session only)
        this.router.navigate(['/dashboard']);
        return;
      }
    }

    // Load saved company/brand preference
    const savedCompany = StorageUtil.getItem('selectedCompany');
    const savedBrand = StorageUtil.getItem('selectedBrand');
    const companyToUse = savedCompany ?? savedBrand;
    if (companyToUse === 'gh' || companyToUse === 'bloop') {
      this.selectedBrand = companyToUse;
      this.selectedCompany = companyToUse;
      this.selectBrand(companyToUse);
    } else {
      // Keep a default company id in localStorage for request headers.
      this.persistCompanySelection(this.selectedCompany);
    }
  }

  selectBrand(brand: 'gh' | 'bloop') {
    this.selectedBrand = brand;
    this.selectedCompany = brand;
    this.persistCompanySelection(brand);

    // Update CSS variables based on selected brand
    if (brand === 'bloop') {
      document.documentElement.style.setProperty('--brand-primary', '#ec4899');
      document.documentElement.style.setProperty('--brand-secondary', '#db2777');
      document.documentElement.style.setProperty('--brand-accent', '#f472b6');
      document.documentElement.style.setProperty('--brand-gradient', 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)');
      document.documentElement.style.setProperty('--brand-glow', 'rgba(236, 72, 153, 0.2)');
    } else {
      document.documentElement.style.setProperty('--brand-primary', '#10b981');
      document.documentElement.style.setProperty('--brand-secondary', '#059669');
      document.documentElement.style.setProperty('--brand-accent', '#34d399');
      document.documentElement.style.setProperty('--brand-gradient', 'linear-gradient(135deg, #10b981 0%, #059669 100%)');
      document.documentElement.style.setProperty('--brand-glow', 'rgba(16, 185, 129, 0.2)');
    }
  }

  private persistCompanySelection(company: 'gh' | 'bloop') {
    StorageUtil.setCompanyContext(company);
  }

  /**
   * Load remembered credentials from localStorage
   * Credentials are stored in base64 for basic obfuscation
   * Automatically clears credentials if they've expired (15 days)
   */
  private loadRememberedCredentials() {
    try {
      const rememberMe = localStorage.getItem('rememberMe');
      const expiryTimestamp = localStorage.getItem('rememberMeExpiry');
      
      if (rememberMe === 'true') {
        // Check if credentials have expired
        if (expiryTimestamp) {
          const expiryDate = new Date(parseInt(expiryTimestamp));
          const now = new Date();
          
          if (now > expiryDate) {
            // Credentials expired, clear them
            this.clearRememberedCredentials();
            return;
          }
        }
        
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedCompany = localStorage.getItem('rememberedCompany');
        const savedBrand = localStorage.getItem('rememberedBrand');
        
        if (savedEmail) {
          // Decode from base64
          this.email = atob(savedEmail);
          this.checked = true;
        }
        
        const rememberedCompany = savedCompany ?? savedBrand;
        if (rememberedCompany === 'gh' || rememberedCompany === 'bloop') {
          this.selectedCompany = rememberedCompany;
          this.selectBrand(rememberedCompany);
        }
      }
    } catch (error) {
      console.error('Error loading remembered credentials:', error);
      this.clearRememberedCredentials();
    }
  }

  /**
   * Save credentials to localStorage when Remember Me is checked
   * Only email is saved (never save password in localStorage!)
   * Credentials expire after 15 days
   */
  private saveRememberedCredentials() {
    try {
      if (this.checked) {
        // Encode email in base64 for basic obfuscation
        const encodedEmail = btoa(this.email);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 15); // 15 days from now
        
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', encodedEmail);
        localStorage.setItem('rememberedCompany', this.selectedCompany);
        localStorage.setItem('rememberedBrand', this.selectedBrand);
        localStorage.setItem('rememberMeExpiry', expirationDate.getTime().toString());
      } else {
        this.clearRememberedCredentials();
      }
    } catch (error) {
      console.error('Error saving remembered credentials:', error);
    }
  }

  /**
   * Clear all remembered credentials from localStorage
   */
  private clearRememberedCredentials() {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedCompany');
    localStorage.removeItem('rememberedBrand');
    localStorage.removeItem('rememberMeExpiry');
  }

  login() {
    if (!this.email?.trim() || !this.password?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Credentials',
        detail: 'Please enter your user ID/email and password.'
      });
      return;
    }

    this.persistCompanySelection(this.selectedCompany);

    const payload = {
      loginId: this.email.trim(),
      password: this.password
    };

    this.http.post<LoginApiResponse>(this.loginApiUrl, payload).subscribe({
      next: (response) => {
        if (response?.statusCode !== 200 || !response?.data) {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: response?.message || 'Unable to login. Please try again.'
          });
          return;
        }

        const apiData = response.data;
        const user = {
          userId: apiData.userId,
          employeeId: apiData.employeeId,
          employeeCode: apiData.loginId,
          employeeName: apiData.userName,
          roleId: 0,
          roleName: apiData.designation,
          isAdmin: false,
          company: this.selectedCompany,
          loginCredential: apiData.loginId,
          department: apiData.department,
          designation: apiData.designation,
          adminPrivilegeType: apiData.adminPrivilegeType
        };
        console.log('Logged in user:', apiData);
        StorageUtil.setLoggedInUser(apiData);

        // Save remembered credential preferences.
        if (this.checked) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 15);

          localStorage.setItem('userSessionExpiry', expirationDate.getTime().toString());
          this.saveRememberedCredentials();
        } else {
          localStorage.removeItem('userSessionExpiry');
          this.clearRememberedCredentials();
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Login successful'
        });

        this.idleService.markSessionStart();
        this.goToDashboard();
      },
      error: (error: { error?: { message?: string } }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error?.error?.message || 'Invalid login credentials or server error.'
        });
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}