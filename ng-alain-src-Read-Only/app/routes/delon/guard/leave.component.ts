import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-guard-leave',
  standalone: true,
  template: `
    <p>離開時需要確認</p>
    <button nz-button [nzType]="'primary'" [routerLink]="['/delon/guard']">
      <span>我要離開</span>
    </button>
  `,
  imports: SHARED_IMPORTS
})
export class GuardLeaveComponent {}
