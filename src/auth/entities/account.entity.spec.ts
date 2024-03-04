import { Account } from "./account.entity";

describe('AccountEntity', () => {

    it('CreateNew', () => {
      const password = 'pwd123';
      let account = Account.NewAccount('email', 'name', password);
      expect(account).toBeDefined();
      expect(account.email).toEqual('email');
      expect(account.password).not.toEqual(password);
    });
});