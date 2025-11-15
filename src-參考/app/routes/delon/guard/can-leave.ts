import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { GuardComponent } from './guard.component';

export const canLeave: CanDeactivateFn<GuardComponent> = (): Observable<boolean> => {
  const srv = inject(NzModalService);
  return new Observable(observer => {
    srv.confirm({
      nzTitle: '確認要離開嗎？',
      nzContent: '你已經填寫了部分表單離開會放棄已經填寫的內容。',
      nzOkText: '離開',
      nzCancelText: '取消',
      nzOnOk: () => {
        observer.next(true);
        observer.complete();
      },
      nzOnCancel: () => {
        observer.next(false);
        observer.complete();
      }
    });
  });
};
