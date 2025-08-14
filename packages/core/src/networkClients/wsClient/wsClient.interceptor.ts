export class InterceptorManager {
  private interceptor?: (message: string) => string;

  setInterceptor(interceptor?: (message: string) => string): void {
    this.interceptor = interceptor;
  }

  applyInterceptor(message: string): string {
    return this.interceptor ? this.interceptor(message) : message;
  }

  cleanup(): void {
    this.interceptor = undefined;
  }
}
