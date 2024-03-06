import { Account } from "./account.entity";

describe('AccountEntity', () => {

    it('Create NewAccount', () => {
      const password = 'pwd123';
      let account = Account.NewAccount('email', 'name', password);
      expect(account).toBeDefined();
      expect(account.email).toEqual('email');
      expect(account.password).not.toEqual(password);
    });

    it('Create NewGoogleAccount', () => {
      let account = Account.NewGoogleAccount('googleid', 'email', 'name');
      expect(account).toBeDefined();
      expect(account.googleId).toEqual('googleid');
      expect(account.email).toEqual('email');
    });

    it('Compare password correctly', () => {
      const password = 'pwd123';
      let account = Account.NewAccount('email', 'name', password);
      expect(account.ComparePassword(password)).resolves.toBeTruthy();
      expect(account.ComparePassword('something')).resolves.toBeFalsy();
    });
});