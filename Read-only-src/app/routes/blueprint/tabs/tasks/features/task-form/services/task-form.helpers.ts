import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import type { TaskIdentityComplete, Task, TaskQuantityPayload } from '@models';

export interface TaskQuantitySnapshot {
  unit: string;
  planned: number;
  installed: number;
  used: number;
}

export type TaskStatusValue = NonNullable<TaskIdentityComplete['status']> | 'todo';
export type TaskPriorityValue = NonNullable<TaskIdentityComplete['priority']> | 'medium';

export interface TaskFormValue extends TaskQuantitySnapshot {
  name: string;
  description: string;
  notes: string;
  tags: string[];
  category: string;
  subcategory: string;
  workType: string;
  discipline: string;
  parentId: string | null;
  status: TaskStatusValue;
  priority: TaskPriorityValue;
  assignedTo: string | null;
}

export interface TaskFormControls {
  name: FormControl<TaskFormValue['name']>;
  description: FormControl<TaskFormValue['description']>;
  notes: FormControl<TaskFormValue['notes']>;
  tags: FormControl<TaskFormValue['tags']>;
  category: FormControl<TaskFormValue['category']>;
  subcategory: FormControl<TaskFormValue['subcategory']>;
  workType: FormControl<TaskFormValue['workType']>;
  discipline: FormControl<TaskFormValue['discipline']>;
  parentId: FormControl<TaskFormValue['parentId']>;
  status: FormControl<TaskFormValue['status']>;
  priority: FormControl<TaskFormValue['priority']>;
  assignedTo: FormControl<TaskFormValue['assignedTo']>;
  quantityUnit: FormControl<TaskFormValue['unit']>;
  plannedQuantity: FormControl<TaskFormValue['planned']>;
  installedQuantity: FormControl<TaskFormValue['installed']>;
  usedQuantity: FormControl<TaskFormValue['used']>;
}

export type TaskFormGroup = FormGroup<TaskFormControls>;

export const DEFAULT_TASK_QUANTITY_NAME = 'Primary Quantity';

const TASK_FORM_DEFAULTS: TaskFormValue = {
  name: '',
  description: '',
  notes: '',
  tags: [],
  category: '',
  subcategory: '',
  workType: '',
  discipline: '',
  parentId: null,
  status: 'todo',
  priority: 'medium',
  assignedTo: null,
  unit: 'item',
  planned: 1,
  installed: 0,
  used: 0
};

export function createTaskFormGroup(fb: FormBuilder): TaskFormGroup {
  const nonNullable = fb.nonNullable;
  return fb.group<TaskFormControls>({
    name: nonNullable.control(TASK_FORM_DEFAULTS.name, {
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    description: nonNullable.control(TASK_FORM_DEFAULTS.description),
    notes: nonNullable.control(TASK_FORM_DEFAULTS.notes),
    tags: nonNullable.control(TASK_FORM_DEFAULTS.tags.slice()),
    category: nonNullable.control(TASK_FORM_DEFAULTS.category),
    subcategory: nonNullable.control(TASK_FORM_DEFAULTS.subcategory),
    workType: nonNullable.control(TASK_FORM_DEFAULTS.workType),
    discipline: nonNullable.control(TASK_FORM_DEFAULTS.discipline),
    parentId: fb.control<string | null>(TASK_FORM_DEFAULTS.parentId),
    status: nonNullable.control(TASK_FORM_DEFAULTS.status),
    priority: nonNullable.control(TASK_FORM_DEFAULTS.priority),
    assignedTo: fb.control<string | null>(TASK_FORM_DEFAULTS.assignedTo),
    quantityUnit: nonNullable.control(TASK_FORM_DEFAULTS.unit, {
      validators: [Validators.required, Validators.maxLength(32)]
    }),
    plannedQuantity: nonNullable.control(TASK_FORM_DEFAULTS.planned, {
      validators: [Validators.required, Validators.min(1)]
    }),
    installedQuantity: nonNullable.control(TASK_FORM_DEFAULTS.installed, {
      validators: [Validators.min(0)]
    }),
    usedQuantity: nonNullable.control(TASK_FORM_DEFAULTS.used, {
      validators: [Validators.min(0)]
    })
  });
}

export function taskFormDefaultValues(overrides: Partial<TaskFormValue> = {}): TaskFormValue {
  return {
    ...TASK_FORM_DEFAULTS,
    ...overrides,
    tags: overrides.tags ? [...overrides.tags] : TASK_FORM_DEFAULTS.tags.slice()
  };
}

export function resetTaskFormGroup(form: TaskFormGroup, overrides?: Partial<TaskFormValue>): void {
  form.reset(taskFormDefaultValues(overrides));
}

export function taskIdentityFormValue(task: Partial<TaskIdentityComplete> | null | undefined): Partial<TaskFormValue> {
  if (!task) {
    return {};
  }
  return {
    name: task.name ?? TASK_FORM_DEFAULTS.name,
    description: task.description ?? TASK_FORM_DEFAULTS.description,
    notes: task.notes ?? TASK_FORM_DEFAULTS.notes,
    tags: task.tags ? [...task.tags] : TASK_FORM_DEFAULTS.tags.slice(),
    category: task.category ?? TASK_FORM_DEFAULTS.category,
    subcategory: task.subcategory ?? TASK_FORM_DEFAULTS.subcategory,
    workType: task.workType ?? TASK_FORM_DEFAULTS.workType,
    discipline: task.discipline ?? TASK_FORM_DEFAULTS.discipline,
    parentId: task.parentId ?? TASK_FORM_DEFAULTS.parentId,
    status: task.status ?? TASK_FORM_DEFAULTS.status,
    priority: task.priority ?? TASK_FORM_DEFAULTS.priority,
    assignedTo: task.assignedTo ?? TASK_FORM_DEFAULTS.assignedTo
  };
}

export interface TaskQuantityFormValue {
  quantityUnit: TaskFormValue['unit'];
  plannedQuantity: TaskFormValue['planned'];
  installedQuantity: TaskFormValue['installed'];
  usedQuantity: TaskFormValue['used'];
}

export function taskQuantityFormValue(snapshot: TaskQuantitySnapshot): TaskQuantityFormValue {
  return {
    quantityUnit: snapshot.unit,
    plannedQuantity: snapshot.planned,
    installedQuantity: snapshot.installed,
    usedQuantity: snapshot.used
  };
}

export function extractPrimaryTaskQuantity(task: Task | null | undefined): TaskQuantitySnapshot {
  const material = task?.resource?.materials?.materials?.[0];
  if (!material) {
    return {
      unit: TASK_FORM_DEFAULTS.unit,
      planned: TASK_FORM_DEFAULTS.planned,
      installed: TASK_FORM_DEFAULTS.installed,
      used: TASK_FORM_DEFAULTS.used
    };
  }

  const planned = Math.max(1, Math.floor(material.plannedQuantity ?? TASK_FORM_DEFAULTS.planned));
  const installed = Math.min(Math.max(0, Math.floor(material.installedQuantity ?? TASK_FORM_DEFAULTS.installed)), planned);
  const used = Math.min(Math.max(0, Math.floor(material.usedQuantity ?? installed)), planned);

  return {
    unit: material.unit?.trim() || TASK_FORM_DEFAULTS.unit,
    planned,
    installed,
    used
  };
}

export function buildTaskQuantityPayload(value: TaskQuantityFormValue, name = DEFAULT_TASK_QUANTITY_NAME): TaskQuantityPayload {
  const plannedInput = Number(value.plannedQuantity ?? TASK_FORM_DEFAULTS.planned);
  const installedInput = Number(value.installedQuantity ?? TASK_FORM_DEFAULTS.installed);
  const usedInput = Number(value.usedQuantity ?? installedInput);

  const planned = Math.max(1, Math.floor(plannedInput));
  const installed = Math.min(Math.max(0, Math.floor(installedInput)), planned);
  const used = Math.min(Math.max(0, Math.floor(usedInput)), planned);

  const unit =
    typeof value.quantityUnit === 'string' && value.quantityUnit.trim().length > 0 ? value.quantityUnit.trim() : TASK_FORM_DEFAULTS.unit;

  return {
    unit,
    plannedQuantity: planned,
    installedQuantity: installed,
    usedQuantity: used,
    name
  };
}
