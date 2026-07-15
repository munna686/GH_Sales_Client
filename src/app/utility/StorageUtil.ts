import * as CryptoJS from 'crypto-js';

export class StorageUtil {
  private static secretKey: string = '4s4af4sd54dsd4gd4g3dsa41g54gs';

  private static encrypt(data: any): string {
    const text = JSON.stringify(data);
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  private static decrypt(cipherText: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      const plainText = bytes.toString(CryptoJS.enc.Utf8);
      if (!plainText) {
        return null;
      }
      return JSON.parse(plainText);
    } catch {
      return null;
    }
  }

  static setItem(key: string, value: any): void {
    localStorage.setItem(key, this.encrypt(value));
  }

  static getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }

    const decrypted = this.decrypt(value);
    if (decrypted !== null) {
      return decrypted as T;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  static getDecodedItem<T>(key: string): T | null {
    return this.getItem<T>(key);
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  static setLoggedInUser(user: any): void {
    this.setItem('user', user);
  }

  static getLoggedInUser<T = any>(): T | null {
    return this.getItem<T>('user');
  }

  static setCompanyContext(company: 'gh' | 'bloop'): void {
    this.setItem('selectedCompany', company);
    this.setItem('selectedBrand', company);
    this.setItem('companyId', company === 'bloop' ? 2 : 1);
  }

  static getCompanyId(): number {
    const value = this.getItem<number | string>('companyId');
    const parsed = Number(value);
    return parsed === 2 ? 2 : 1;
  }

  static getSelectedCompany(): 'gh' | 'bloop' {
    const company = this.getItem<'gh' | 'bloop'>('selectedCompany') ?? this.getItem<'gh' | 'bloop'>('selectedBrand');
    return company === 'bloop' ? 'bloop' : 'gh';
  }

  static getCurrentUser(): any {
    return this.getLoggedInUser();
  }

  static getCurrentUserMenu(): any {
    return this.getItem('selectedMenu');
  }
}
