import { APP_CONSTANTS } from './constants/app'

/**
 * جلب رمز المصادقة المخزن
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN)
  } catch {
    return null
  }
}

/**
 * حفظ رمز المصادقة
 */
export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, token)
  } catch {
    // يمكن التعامل مع التخزين إذا كان غير متاح
  }
}
/**
 * حذف رمز المصادقة
 */
export function removeStoredToken(): void {
  try {
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN)
  } catch {
    // يمكن التعامل مع التخزين إذا كان غير متاح
  }
}