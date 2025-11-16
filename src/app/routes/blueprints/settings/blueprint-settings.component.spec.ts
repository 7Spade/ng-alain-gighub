import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintService, Blueprint, BlueprintStatus } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, throwError } from 'rxjs';

import { BlueprintSettingsComponent } from './blueprint-settings.component';

describe('BlueprintSettingsComponent', () => {
  let component: BlueprintSettingsComponent;
  let fixture: ComponentFixture<BlueprintSettingsComponent>;
  let mockBlueprintService: jasmine.SpyObj<BlueprintService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessage: jasmine.SpyObj<NzMessageService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  const mockBlueprint: Partial<Blueprint> = {
    id: 'test-id-123',
    name: 'Test Blueprint',
    description: 'Test Description',
    project_code: 'TEST-001',
    status: BlueprintStatus.ACTIVE,
    owner_id: 'owner-123',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    // Create mock services
    mockBlueprintService = jasmine.createSpyObj('BlueprintService', ['loadBlueprintById', 'updateBlueprint']);

    // Mock service signals
    (mockBlueprintService as any).loading = signal(false);
    (mockBlueprintService as any).error = signal(null);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessage = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? 'test-id-123' : null)
        }
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [BlueprintSettingsComponent, ReactiveFormsModule],
      providers: [
        { provide: BlueprintService, useValue: mockBlueprintService },
        { provide: Router, useValue: mockRouter },
        { provide: NzMessageService, useValue: mockMessage },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlueprintSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load blueprint on init with valid id', async () => {
      mockBlueprintService.loadBlueprintById.and.resolveTo(mockBlueprint as Blueprint);

      await component.ngOnInit();

      expect(mockBlueprintService.loadBlueprintById).toHaveBeenCalledWith('test-id-123');
      expect(component.blueprint()).toEqual(mockBlueprint as Blueprint);
      expect(component.form.value.name).toBe('Test Blueprint');
      expect(component.form.value.description).toBe('Test Description');
    });

    it('should navigate to blueprints list when id is missing', async () => {
      mockActivatedRoute.snapshot!.paramMap.get = () => null;

      await component.ngOnInit();

      expect(mockMessage.error).toHaveBeenCalledWith('蓝图ID不存在');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/blueprints']);
    });

    it('should handle load error gracefully', async () => {
      mockBlueprintService.loadBlueprintById.and.rejectWith(new Error('Network error'));

      await component.ngOnInit();

      expect(mockMessage.error).toHaveBeenCalledWith('加载蓝图信息失败');
    });

    it('should navigate away when blueprint not found', async () => {
      mockBlueprintService.loadBlueprintById.and.resolveTo(null);

      await component.ngOnInit();

      expect(mockMessage.error).toHaveBeenCalledWith('蓝图不存在');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/blueprints']);
    });
  });

  describe('onSubmit', () => {
    beforeEach(async () => {
      mockBlueprintService.loadBlueprintById.and.resolveTo(mockBlueprint as Blueprint);
      await component.ngOnInit();
    });

    it('should update blueprint successfully', async () => {
      const updatedBlueprint = { ...mockBlueprint, name: 'Updated Name' } as Blueprint;
      mockBlueprintService.updateBlueprint.and.resolveTo(updatedBlueprint);

      component.form.patchValue({ name: 'Updated Name' });
      await component.onSubmit();

      expect(mockBlueprintService.updateBlueprint).toHaveBeenCalledWith(
        'test-id-123',
        jasmine.objectContaining({
          name: 'Updated Name',
          description: 'Test Description'
        })
      );
      expect(mockMessage.success).toHaveBeenCalledWith('蓝图设置更新成功');
      expect(component.blueprint()).toEqual(updatedBlueprint);
    });

    it('should not submit when form is invalid', async () => {
      component.form.patchValue({ name: '' }); // Invalid - required field

      await component.onSubmit();

      expect(mockBlueprintService.updateBlueprint).not.toHaveBeenCalled();
      expect(component.form.get('name')?.dirty).toBe(true);
    });

    it('should handle update error', async () => {
      mockBlueprintService.updateBlueprint.and.rejectWith(new Error('Update failed'));

      component.form.patchValue({ name: 'Updated Name' });
      await component.onSubmit();

      expect(mockMessage.error).toHaveBeenCalledWith('更新蓝图设置失败');
    });

    it('should not submit when blueprintId is missing', async () => {
      component.blueprintId.set('');

      await component.onSubmit();

      expect(mockMessage.error).toHaveBeenCalledWith('蓝图ID不存在');
      expect(mockBlueprintService.updateBlueprint).not.toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    it('should require name field', () => {
      const nameControl = component.form.get('name');

      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBe(true);

      nameControl?.setValue('Valid Name');
      expect(nameControl?.hasError('required')).toBe(false);
    });

    it('should enforce name length constraints', () => {
      const nameControl = component.form.get('name');

      // Too long
      const longName = 'a'.repeat(256);
      nameControl?.setValue(longName);
      expect(nameControl?.hasError('maxlength')).toBe(true);

      // Valid length
      nameControl?.setValue('Valid Name');
      expect(nameControl?.hasError('maxlength')).toBe(false);
    });

    it('should enforce description length constraint', () => {
      const descControl = component.form.get('description');

      // Too long
      const longDesc = 'a'.repeat(1001);
      descControl?.setValue(longDesc);
      expect(descControl?.hasError('maxlength')).toBe(true);

      // Valid length
      descControl?.setValue('Valid description');
      expect(descControl?.hasError('maxlength')).toBe(false);
    });

    it('should allow null description', () => {
      const descControl = component.form.get('description');

      descControl?.setValue(null);
      expect(descControl?.valid).toBe(true);
    });
  });

  describe('resetForm', () => {
    beforeEach(async () => {
      mockBlueprintService.loadBlueprintById.and.resolveTo(mockBlueprint as Blueprint);
      await component.ngOnInit();
    });

    it('should reset form to original values', () => {
      // Modify form
      component.form.patchValue({
        name: 'Modified Name',
        description: 'Modified Description'
      });
      component.form.markAsDirty();

      // Reset
      component.resetForm();

      expect(component.form.value.name).toBe('Test Blueprint');
      expect(component.form.value.description).toBe('Test Description');
      expect(component.form.pristine).toBe(true);
    });
  });

  describe('goBack', () => {
    it('should navigate to blueprint detail when id exists', () => {
      component.blueprintId.set('test-id-123');

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/blueprints', 'test-id-123']);
    });

    it('should navigate to blueprints list when id is empty', () => {
      component.blueprintId.set('');

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/blueprints']);
    });
  });

  describe('status helpers', () => {
    it('should return correct status label', () => {
      expect(component.getStatusLabel('planning')).toBe('规划中');
      expect(component.getStatusLabel('active')).toBe('进行中');
      expect(component.getStatusLabel('on_hold')).toBe('暂停');
      expect(component.getStatusLabel('completed')).toBe('已完成');
      expect(component.getStatusLabel('archived')).toBe('已归档');
      expect(component.getStatusLabel('unknown')).toBe('unknown');
      expect(component.getStatusLabel(null)).toBe('未知');
      expect(component.getStatusLabel(undefined)).toBe('未知');
    });

    it('should return correct status color', () => {
      expect(component.getStatusColor('planning')).toBe('blue');
      expect(component.getStatusColor('active')).toBe('green');
      expect(component.getStatusColor('on_hold')).toBe('orange');
      expect(component.getStatusColor('completed')).toBe('success');
      expect(component.getStatusColor('archived')).toBe('default');
      expect(component.getStatusColor('unknown')).toBe('default');
      expect(component.getStatusColor(null)).toBe('default');
      expect(component.getStatusColor(undefined)).toBe('default');
    });
  });
});
