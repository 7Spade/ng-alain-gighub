import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, BlueprintService, Blueprint, BlueprintUpdate } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * Blueprint Settings Form Type Definition
 */
interface BlueprintSettingsFormValue {
  name: string;
  description: string | null;
}

/**
 * Blueprint Settings Component
 *
 * Enterprise-grade settings page for blueprints
 * Features:
 * - Typed reactive forms
 * - Signal-based state management
 * - OnPush change detection
 * - Loading/success/error states
 * - Supabase integration via BlueprintService
 */
@Component({
  selector: 'app-blueprint-settings',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  templateUrl: './blueprint-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintSettingsComponent implements OnInit {
  private blueprintService = inject(BlueprintService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);

  // Signal-based state management
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly blueprint = signal<Blueprint | null>(null);
  readonly blueprintId = signal('');

  // Typed reactive form
  readonly form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
    }),
    description: new FormControl<string | null>('', {
      validators: [Validators.maxLength(1000)]
    })
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.message.error('蓝图ID不存在');
      this.router.navigate(['/blueprints']);
      return;
    }

    this.blueprintId.set(id);
    await this.loadBlueprint(id);
  }

  /**
   * Load blueprint data and populate form
   */
  private async loadBlueprint(id: string): Promise<void> {
    this.loading.set(true);

    try {
      const blueprint = await this.blueprintService.loadBlueprintById(id);

      if (!blueprint) {
        this.message.error('蓝图不存在');
        this.router.navigate(['/blueprints']);
        return;
      }

      this.blueprint.set(blueprint);

      // Populate form with loaded data
      this.form.patchValue({
        name: blueprint.name,
        description: blueprint.description || ''
      });
    } catch (error) {
      this.message.error('加载蓝图信息失败');
      console.error('Failed to load blueprint:', error);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      // Mark all fields as dirty to show validation errors
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const id = this.blueprintId();
    if (!id) {
      this.message.error('蓝图ID不存在');
      return;
    }

    this.submitting.set(true);

    try {
      const formValue = this.form.getRawValue();
      const updateData: BlueprintUpdate = {
        name: formValue.name,
        description: formValue.description,
        updated_at: new Date().toISOString()
      };

      const updatedBlueprint = await this.blueprintService.updateBlueprint(id, updateData);
      this.blueprint.set(updatedBlueprint);

      this.message.success('蓝图设置更新成功');
    } catch (error) {
      this.message.error('更新蓝图设置失败');
      console.error('Failed to update blueprint:', error);
    } finally {
      this.submitting.set(false);
    }
  }

  /**
   * Navigate back to blueprint detail page
   */
  goBack(): void {
    const id = this.blueprintId();
    if (id) {
      this.router.navigate(['/blueprints', id]);
    } else {
      this.router.navigate(['/blueprints']);
    }
  }

  /**
   * Reset form to original values
   */
  resetForm(): void {
    const blueprintData = this.blueprint();
    if (blueprintData) {
      this.form.patchValue({
        name: blueprintData.name,
        description: blueprintData.description || ''
      });
      this.form.markAsPristine();
    }
  }

  /**
   * Get status label for display
   */
  getStatusLabel(status: string | null | undefined): string {
    const statusLabels: Record<string, string> = {
      planning: '规划中',
      active: '进行中',
      on_hold: '暂停',
      completed: '已完成',
      archived: '已归档'
    };
    return statusLabels[status || ''] || status || '未知';
  }

  /**
   * Get status color for tag display
   */
  getStatusColor(status: string | null | undefined): string {
    const statusColors: Record<string, string> = {
      planning: 'blue',
      active: 'green',
      on_hold: 'orange',
      completed: 'success',
      archived: 'default'
    };
    return statusColors[status || ''] || 'default';
  }
}
