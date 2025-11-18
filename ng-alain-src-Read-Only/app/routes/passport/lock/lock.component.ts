import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService, User } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'passport-lock',
  standalone: true,
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.less'],
  imports: [SHARED_IMPORTS]
})
export class UserLockComponent {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly settings = inject(SettingsService);
  private readonly router = inject(Router);

  f = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  get user(): User {
    return this.settings.user;
  }

  submit(): void {
    this.f.controls.password.markAsDirty();
    this.f.controls.password.updateValueAndValidity();
    if (this.f.valid) {
      console.log('Valid!');
      console.log(this.f.value);
      this.tokenService.set({
        token: '123'
      });
      this.router.navigate(['dashboard']);
    }
  }
}
