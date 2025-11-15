---
applyTo: "src/app/core/**/*"
---

# Core Module Instructions

## Purpose
The `core` module contains singleton services, guards, and interceptors that are instantiated once for the entire application.

## Key Rules

### Singleton Services
- All services in `core/` are **singletons**
- Provide in root: `providedIn: 'root'`
- Must be stateless or manage global application state
- No component-specific logic

### Core Module Contents
- **HTTP Interceptors**: Authentication, error handling, logging
- **Route Guards**: Authentication, authorization
- **Global Services**: Authentication, configuration, logging
- **Application Initializers**: Bootstrap logic

## Dependencies
- **Can import from**: `@shared`
- **Cannot import from**: `routes/`, `layout/`
- Core should not depend on feature modules

## Common Core Services

### Authentication Service
```typescript
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  
  // Use signals for auth state
  user = signal<User | null>(null);
  isAuthenticated = computed(() => this.user() !== null);
  
  async signIn(credentials: Credentials): Promise<void> {
    const { data, error } = await this.supabase.auth.signIn(credentials);
    if (error) throw error;
    this.user.set(data.user);
  }
  
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.user.set(null);
    this.router.navigate(['/auth/login']);
  }
}
```

### HTTP Interceptor Pattern
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

### Route Guard Pattern
```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/auth/login');
};
```

## Security Guidelines
- **Never expose sensitive data** in services
- **Validate permissions** before operations
- **Use RLS policies** for database access
- **Log security events** appropriately

## State Management
- Use **Signals** for reactive state
- Keep state minimal and focused
- Prefer stateless services when possible

## Testing
- Mock external dependencies
- Test singleton behavior
- Test security logic thoroughly
- Minimum 85% coverage for core services

## Reference
- Module-specific rules: `.cursor/rules/core-specific.mdc`
- Security guidelines: `.cursor/rules/security.mdc`
- API design: `.cursor/rules/api-design.mdc`
