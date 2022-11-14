export class LocalStorageHelper {
  public static SetItem<T>(key: string, value: T, overwrite: boolean = true): void {
    const existingValue = this.GetItem(key);

    if (!existingValue || (existingValue && overwrite)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public static GetItem<T>(key: string): T | null {
    const existingValue = localStorage.getItem(key);

    if (existingValue) {
      return JSON.parse(existingValue) as T;
    }

    return null;
  }
}
