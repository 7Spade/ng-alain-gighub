import { TestBed } from '@angular/core/testing';

import { ErrorStateService, AppError, ErrorCategory, ErrorSeverity } from './error-state.service';

describe('ErrorStateService', () => {
  let service: ErrorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorStateService);
  });

  afterEach(() => {
    // Clean up all errors after each test
    service.clearAll();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty errors', () => {
      expect(service.errors()).toEqual([]);
      expect(service.errorHistory()).toEqual([]);
    });

    it('should have hasErrors as false initially', () => {
      expect(service.hasErrors()).toBeFalse();
    });

    it('should have errorCount as 0 initially', () => {
      expect(service.errorCount()).toBe(0);
    });
  });

  describe('Adding Errors', () => {
    it('should add a new error', () => {
      const error = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Test error'
      });

      expect(error).toBeDefined();
      expect(error.id).toBeTruthy();
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.dismissed).toBeFalse();
      expect(service.errors().length).toBe(1);
    });

    it('should add error with all properties', () => {
      const errorData = {
        category: 'Validation' as ErrorCategory,
        severity: 'warning' as ErrorSeverity,
        message: 'Invalid input',
        details: { field: 'email', value: 'invalid' },
        context: 'LoginForm'
      };

      const error = service.addError(errorData);

      expect(error.category).toBe('Validation');
      expect(error.severity).toBe('warning');
      expect(error.message).toBe('Invalid input');
      expect(error.details).toEqual({ field: 'email', value: 'invalid' });
      expect(error.context).toBe('LoginForm');
    });

    it('should generate unique IDs for multiple errors', () => {
      const error1 = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Error 1'
      });

      const error2 = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Error 2'
      });

      expect(error1.id).not.toBe(error2.id);
    });

    it('should add error to history', () => {
      service.addError({
        category: 'System',
        severity: 'error',
        message: 'Test error'
      });

      expect(service.errorHistory().length).toBe(1);
    });

    it('should update hasErrors computed signal', () => {
      expect(service.hasErrors()).toBeFalse();

      service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Test error'
      });

      expect(service.hasErrors()).toBeTrue();
    });

    it('should update errorCount computed signal', () => {
      expect(service.errorCount()).toBe(0);

      service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Error 1'
      });
      service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Error 2'
      });

      expect(service.errorCount()).toBe(2);
    });
  });

  describe('Computed Signals', () => {
    beforeEach(() => {
      // Add errors of different severities
      service.addError({ category: 'System', severity: 'critical', message: 'Critical error' });
      service.addError({ category: 'Network', severity: 'error', message: 'Standard error' });
      service.addError({ category: 'Validation', severity: 'warning', message: 'Warning message' });
      service.addError({ category: 'BusinessLogic', severity: 'info', message: 'Info message' });
    });

    it('should filter criticalErrors correctly', () => {
      const critical = service.criticalErrors();
      expect(critical.length).toBe(1);
      expect(critical[0].severity).toBe('critical');
    });

    it('should filter standardErrors correctly', () => {
      const standard = service.standardErrors();
      expect(standard.length).toBe(1);
      expect(standard[0].severity).toBe('error');
    });

    it('should filter warnings correctly', () => {
      const warnings = service.warnings();
      expect(warnings.length).toBe(1);
      expect(warnings[0].severity).toBe('warning');
    });

    it('should filter infos correctly', () => {
      const infos = service.infos();
      expect(infos.length).toBe(1);
      expect(infos[0].severity).toBe('info');
    });

    it('should set hasCriticalErrors when critical error exists', () => {
      expect(service.hasCriticalErrors()).toBeTrue();
    });

    it('should update hasCriticalErrors when critical error is dismissed', () => {
      const critical = service.criticalErrors()[0];
      service.dismissError(critical.id);

      // Wait for state update
      setTimeout(() => {
        expect(service.hasCriticalErrors()).toBeFalse();
      }, 350);
    });
  });

  describe('Dismissing Errors', () => {
    it('should dismiss a specific error', done => {
      const error = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Test error'
      });

      service.dismissError(error.id);

      // Check immediately - error should be marked as dismissed
      const currentErrors = service.errors();
      const dismissedError = currentErrors.find(e => e.id === error.id);
      expect(dismissedError?.dismissed).toBeTrue();

      // Wait for cleanup and check error is removed
      setTimeout(() => {
        expect(service.errors().some(e => e.id === error.id)).toBeFalse();
        expect(service.errorCount()).toBe(0);
        done();
      }, 350);
    });

    it('should dismiss all errors', done => {
      service.addError({ category: 'Network', severity: 'error', message: 'Error 1' });
      service.addError({ category: 'System', severity: 'error', message: 'Error 2' });
      service.addError({ category: 'Validation', severity: 'warning', message: 'Warning' });

      expect(service.errors().length).toBe(3);

      service.dismissAll();

      // Wait for cleanup
      setTimeout(() => {
        expect(service.errorCount()).toBe(0);
        expect(service.hasErrors()).toBeFalse();
        done();
      }, 350);
    });

    it('should update history when error is dismissed', done => {
      const error = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Test error'
      });

      service.dismissError(error.id);

      setTimeout(() => {
        const historyError = service.errorHistory().find(e => e.id === error.id);
        expect(historyError?.dismissed).toBeTrue();
        done();
      }, 350);
    });
  });

  describe('Removing Errors', () => {
    it('should remove a specific error', () => {
      const error = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Test error'
      });

      service.removeError(error.id);

      expect(service.errors().some(e => e.id === error.id)).toBeFalse();
    });

    it('should not affect other errors when removing one', () => {
      const error1 = service.addError({ category: 'Network', severity: 'error', message: 'Error 1' });
      const error2 = service.addError({ category: 'System', severity: 'error', message: 'Error 2' });

      service.removeError(error1.id);

      expect(service.errors().length).toBe(1);
      expect(service.errors()[0].id).toBe(error2.id);
    });
  });

  describe('Clearing Errors', () => {
    beforeEach(() => {
      service.addError({ category: 'Network', severity: 'error', message: 'Error 1' });
      service.addError({ category: 'System', severity: 'error', message: 'Error 2' });
    });

    it('should clear all errors and history', () => {
      service.clearAll();

      expect(service.errors()).toEqual([]);
      expect(service.errorHistory()).toEqual([]);
      expect(service.hasErrors()).toBeFalse();
    });

    it('should clear active errors but keep history', () => {
      service.clearActiveErrors();

      expect(service.errors()).toEqual([]);
      expect(service.errorHistory().length).toBe(2);
      expect(service.hasErrors()).toBeFalse();
    });
  });

  describe('Filtering Methods', () => {
    beforeEach(() => {
      service.addError({ category: 'Network', severity: 'critical', message: 'Network critical', context: 'API' });
      service.addError({ category: 'Network', severity: 'error', message: 'Network error', context: 'API' });
      service.addError({ category: 'Validation', severity: 'warning', message: 'Validation warning', context: 'Form' });
      service.addError({ category: 'System', severity: 'info', message: 'System info', context: 'Background' });
    });

    it('should filter by severity', () => {
      const critical = service.getErrorsBySeverity('critical');
      const errors = service.getErrorsBySeverity('error');
      const warnings = service.getErrorsBySeverity('warning');

      expect(critical.length).toBe(1);
      expect(errors.length).toBe(1);
      expect(warnings.length).toBe(1);
    });

    it('should filter by category', () => {
      const networkErrors = service.getErrorsByCategory('Network');
      const validationErrors = service.getErrorsByCategory('Validation');

      expect(networkErrors.length).toBe(2);
      expect(validationErrors.length).toBe(1);
    });

    it('should filter by context', () => {
      const apiErrors = service.getErrorsByContext('API');
      const formErrors = service.getErrorsByContext('Form');

      expect(apiErrors.length).toBe(2);
      expect(formErrors.length).toBe(1);
    });

    it('should exclude dismissed errors from filters', done => {
      const networkErrors = service.getErrorsByCategory('Network');
      const firstError = networkErrors[0];

      service.dismissError(firstError.id);

      setTimeout(() => {
        const filteredErrors = service.getErrorsByCategory('Network');
        expect(filteredErrors.length).toBe(1);
        done();
      }, 350);
    });
  });

  describe('Auto-Dismiss', () => {
    it('should auto-dismiss non-critical errors', done => {
      service.updateConfig({ autoDismissTimeout: 100 });

      service.addError({
        category: 'Network',
        severity: 'info',
        message: 'Auto dismiss test'
      });

      expect(service.errors().length).toBe(1);

      // Wait for auto-dismiss
      setTimeout(() => {
        expect(service.errorCount()).toBe(0);
        done();
      }, 450);
    });

    it('should NOT auto-dismiss critical errors', done => {
      service.updateConfig({ autoDismissTimeout: 100 });

      service.addError({
        category: 'System',
        severity: 'critical',
        message: 'Critical - no auto dismiss'
      });

      expect(service.errors().length).toBe(1);

      // Wait longer than auto-dismiss timeout
      setTimeout(() => {
        expect(service.errors().length).toBe(1);
        expect(service.hasCriticalErrors()).toBeTrue();
        done();
      }, 200);
    });

    it('should cancel auto-dismiss when manually dismissed', done => {
      service.updateConfig({ autoDismissTimeout: 200 });

      const error = service.addError({
        category: 'Network',
        severity: 'warning',
        message: 'Manual dismiss test'
      });

      // Manually dismiss before auto-dismiss
      setTimeout(() => {
        service.dismissError(error.id);
      }, 50);

      // Check that it's dismissed manually, not by auto-dismiss
      setTimeout(() => {
        expect(service.errorCount()).toBe(0);
        done();
      }, 400);
    });

    it('should disable auto-dismiss when timeout is 0', done => {
      service.updateConfig({ autoDismissTimeout: 0 });

      service.addError({
        category: 'Network',
        severity: 'error',
        message: 'No auto dismiss'
      });

      setTimeout(() => {
        expect(service.errors().length).toBe(1);
        expect(service.errorCount()).toBe(1);
        done();
      }, 200);
    });
  });

  describe('History Management', () => {
    it('should keep errors in history', () => {
      const error = service.addError({
        category: 'Network',
        severity: 'error',
        message: 'Test error'
      });

      service.removeError(error.id);

      expect(service.errors().length).toBe(0);
      expect(service.errorHistory().length).toBe(1);
    });

    it('should respect maxHistorySize limit', () => {
      service.updateConfig({ maxHistorySize: 3 });

      for (let i = 0; i < 5; i++) {
        service.addError({
          category: 'System',
          severity: 'info',
          message: `Error ${i}`
        });
      }

      expect(service.errorHistory().length).toBe(3);
    });

    it('should keep most recent errors when history exceeds limit', () => {
      service.updateConfig({ maxHistorySize: 3 });

      const errors: AppError[] = [];
      for (let i = 0; i < 5; i++) {
        errors.push(
          service.addError({
            category: 'System',
            severity: 'info',
            message: `Error ${i}`
          })
        );
      }

      const history = service.errorHistory();
      expect(history.length).toBe(3);
      // Should keep errors 2, 3, 4 (most recent)
      expect(history.some(e => e.id === errors[2].id)).toBeTrue();
      expect(history.some(e => e.id === errors[3].id)).toBeTrue();
      expect(history.some(e => e.id === errors[4].id)).toBeTrue();
      expect(history.some(e => e.id === errors[0].id)).toBeFalse();
      expect(history.some(e => e.id === errors[1].id)).toBeFalse();
    });
  });

  describe('Configuration', () => {
    it('should update configuration', () => {
      service.updateConfig({
        maxHistorySize: 50,
        autoDismissTimeout: 3000
      });

      // Add more than 50 errors to test maxHistorySize
      for (let i = 0; i < 60; i++) {
        service.addError({
          category: 'System',
          severity: 'info',
          message: `Error ${i}`
        });
      }

      expect(service.errorHistory().length).toBe(50);
    });

    it('should allow partial configuration updates', () => {
      service.updateConfig({ maxHistorySize: 25 });

      // Add errors to test updated config
      for (let i = 0; i < 30; i++) {
        service.addError({
          category: 'System',
          severity: 'info',
          message: `Error ${i}`
        });
      }

      expect(service.errorHistory().length).toBe(25);
    });
  });

  describe('Multiple Simultaneous Errors', () => {
    it('should handle multiple errors of different types', () => {
      service.addError({ category: 'Network', severity: 'error', message: 'Network error' });
      service.addError({ category: 'Validation', severity: 'warning', message: 'Validation warning' });
      service.addError({ category: 'System', severity: 'critical', message: 'System critical' });
      service.addError({ category: 'Authorization', severity: 'error', message: 'Auth error' });

      expect(service.errors().length).toBe(4);
      expect(service.errorCount()).toBe(4);
      expect(service.criticalErrors().length).toBe(1);
      expect(service.warnings().length).toBe(1);
    });

    it('should maintain correct state when dismissing multiple errors', done => {
      const error1 = service.addError({ category: 'Network', severity: 'error', message: 'Error 1' });
      const error2 = service.addError({ category: 'System', severity: 'error', message: 'Error 2' });
      service.addError({ category: 'Validation', severity: 'warning', message: 'Warning' });

      service.dismissError(error1.id);
      service.dismissError(error2.id);

      setTimeout(() => {
        expect(service.errorCount()).toBe(1);
        expect(service.errors()[0].severity).toBe('warning');
        done();
      }, 350);
    });
  });

  describe('Error State Reset', () => {
    it('should properly reset state after clearAll', () => {
      // Add various errors
      service.addError({ category: 'Network', severity: 'critical', message: 'Critical' });
      service.addError({ category: 'System', severity: 'error', message: 'Error' });

      service.clearAll();

      expect(service.errors()).toEqual([]);
      expect(service.errorHistory()).toEqual([]);
      expect(service.hasErrors()).toBeFalse();
      expect(service.hasCriticalErrors()).toBeFalse();
      expect(service.errorCount()).toBe(0);
    });
  });
});

