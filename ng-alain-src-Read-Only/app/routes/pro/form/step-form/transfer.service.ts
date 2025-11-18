import { Injectable } from '@angular/core';

@Injectable()
export class TransferService {
  step = 1;

  /**
   * 付款賬戶
   */
  pay_account = '';

  /**
   * 收款賬戶類型
   */
  receiver_type: 'alipay' | 'bank' = 'alipay';

  get receiver_type_str(): string {
    return this.receiver_type === 'alipay' ? '支付寶' : '銀行';
  }

  /**
   * 收款賬戶
   */
  receiver_account = '';

  /**
   * 收款姓名
   */
  receiver_name = '';

  /**
   * 金額
   */
  amount = 500;

  /**
   * 支付密碼
   */
  password = '123456';

  again(): void {
    this.step = 0;
    this.pay_account = 'ant-design@alipay.com';
    this.receiver_type = 'alipay';
    this.receiver_account = 'test@example.com';
    this.receiver_name = 'asdf';
    this.amount = 500;
  }

  constructor() {
    this.again();
  }
}
