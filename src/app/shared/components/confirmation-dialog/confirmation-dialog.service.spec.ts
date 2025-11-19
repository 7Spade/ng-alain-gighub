import { TestBed } from '@angular/core/testing';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService', () => {
  let service: ConfirmationDialogService;
  let modalService: jasmine.SpyObj<NzModalService>;

  beforeEach(() => {
    const modalServiceSpy = jasmine.createSpyObj('NzModalService', ['confirm', 'warning', 'success', 'error', 'info']);

    TestBed.configureTestingModule({
      providers: [ConfirmationDialogService, { provide: NzModalService, useValue: modalServiceSpy }]
    });

    service = TestBed.inject(ConfirmationDialogService);
    modalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call modal.confirm with correct config', () => {
    service.confirm({
      title: '測試標題',
      content: '測試內容'
    });

    expect(modalService.confirm).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nzTitle: '測試標題',
        nzContent: '測試內容'
      })
    );
  });

  it('should call confirmDelete with danger type', () => {
    service.confirmDelete({
      itemName: '測試項目'
    });

    expect(modalService.confirm).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nzOkDanger: true
      })
    );
  });

  it('should call modal.success', () => {
    service.success({
      title: '成功',
      content: '操作成功'
    });

    expect(modalService.success).toHaveBeenCalled();
  });

  it('should call modal.error', () => {
    service.error({
      title: '錯誤',
      content: '操作失敗'
    });

    expect(modalService.error).toHaveBeenCalled();
  });
});
