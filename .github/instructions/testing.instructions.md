---
applyTo: "**/*.spec.ts"
excludeAgent: "code-review"
---

# Testing Instructions

## Testing Framework
- **Framework**: Karma + Jasmine
- **Coverage Target**: Minimum 80% for new code, 90%+ for shared module
- **Test Types**: Unit tests, integration tests

## Test Structure

### Component Tests
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my-component.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]  // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test signal inputs
  it('should update when input signal changes', () => {
    fixture.componentRef.setInput('data', 'test-value');
    expect(component.data()).toBe('test-value');
  });

  // Test signal outputs
  it('should emit output event', () => {
    const spy = jasmine.createSpy('outputSpy');
    component.changed.subscribe(spy);
    
    component.triggerChange('new-value');
    expect(spy).toHaveBeenCalledWith('new-value');
  });
});
```

### Service Tests with Signals
```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my-service.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test signal state
  it('should update signal state', () => {
    service.setState('new-state');
    expect(service.state()).toBe('new-state');
  });

  // Test computed signals
  it('should compute derived state', () => {
    service.setState('test');
    expect(service.computedState()).toBe('PROCESSED: test');
  });
});
```

### Testing Supabase Operations
```typescript
import { TestBed } from '@angular/core/testing';
import { SupabaseService } from '@core';
import { BlueprintService } from './blueprint.service';

describe('BlueprintService', () => {
  let service: BlueprintService;
  let supabaseMock: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SupabaseService', ['from']);
    
    TestBed.configureTestingModule({
      providers: [
        BlueprintService,
        { provide: SupabaseService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(BlueprintService);
    supabaseMock = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
  });

  it('should fetch blueprints', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    supabaseMock.from.and.returnValue({
      select: jasmine.createSpy().and.returnValue({
        data: mockData,
        error: null
      })
    } as any);

    const result = await service.getAll();
    expect(result).toEqual(mockData);
  });
});
```

## Best Practices

### Do's
- **Test behavior, not implementation**
- **Use TestBed for Angular testing utilities**
- **Mock external dependencies** (HTTP, Supabase, etc.)
- **Test edge cases and error conditions**
- **Keep tests focused and atomic**
- **Use descriptive test names** (should do X when Y)

### Don'ts
- **Don't test framework code** (Angular's functionality)
- **Don't test third-party libraries**
- **Don't write brittle tests** (tightly coupled to implementation)
- **Don't skip async handling** (use async/await or fakeAsync)
- **Don't forget to test error paths**

## Running Tests

```bash
# Run all tests (watch mode)
yarn test

# Run with coverage
yarn test-coverage

# Run specific test file
ng test --include='**/my-component.spec.ts'
```

## Coverage Requirements
- **Shared module**: 90%+ coverage
- **Core services**: 85%+ coverage
- **Route components**: 80%+ coverage
- **New code**: 80%+ coverage

## Testing Signals
```typescript
// Test signal creation
it('should create signal with initial value', () => {
  const sig = signal(10);
  expect(sig()).toBe(10);
});

// Test signal updates
it('should update signal value', () => {
  const sig = signal(10);
  sig.set(20);
  expect(sig()).toBe(20);
});

// Test computed signals
it('should compute derived value', () => {
  const count = signal(5);
  const doubled = computed(() => count() * 2);
  expect(doubled()).toBe(10);
  
  count.set(10);
  expect(doubled()).toBe(20);
});

// Test effects (if needed)
it('should trigger effect on signal change', () => {
  let effectValue = 0;
  const count = signal(5);
  
  TestBed.runInInjectionContext(() => {
    effect(() => {
      effectValue = count();
    });
  });
  
  count.set(10);
  expect(effectValue).toBe(10);
});
```

## Reference
- Testing guide: `docs/38-測試指南.md`
- Testing rules: `.cursor/rules/testing.mdc`
- Angular testing docs: https://angular.dev/guide/testing
