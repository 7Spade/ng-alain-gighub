import { CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Dynamically load the start page
 *
 * 動態加載啟動頁
 */
export const startPageGuard: CanActivateFn = (): boolean | Observable<boolean> => {
  // Re-jump according to the first item of the menu, you can re-customize the logic
  // 以下代碼是根據菜單的第一項進行重新跳轉，你可以重新定製邏輯
  // const menuSrv = inject(MenuService);
  // if (menuSrv.find({ url: state.url }) == null) {
  //   inject(Router).navigateByUrl(menuSrv.menus[0].link!);
  //   return false;
  // }
  return true;
};
