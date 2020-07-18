import User from '../../../src/models/User';

const testUser = { username: 'username', password: 'password' };

it('save(). When: password is created. Expected: created salt and hashed password.', async () => {
  const user = new User(testUser);

  expect(user.password).toBe(testUser.password);
  expect(user.salt).toBeUndefined();

  await user.save();

  expect(user.password).not.toBe(testUser.password);
  expect(user.salt).not.toBeNull();
});

it('save(). When: password is changed. Expected: changed salt and password.', async () => {
  const user = new User(testUser);
  await user.save();

  const newPassword = 'password1';
  const salt = user.salt;
  const hash = user.password;

  user.password = newPassword;
  await user.save();

  expect(user.password).not.toBe(hash);
  expect(user.salt).not.toBe(salt);
});

it('save(). When: password is not changed. Expected: not changed salt and password.', async () => {
  const user = new User(testUser);
  await user.save();

  const salt = user.salt;
  const hash = user.password;

  user.username = 'new_username';
  await user.save();

  expect(user.password).toBe(hash);
  expect(user.salt).toBe(salt);
});

it('validatePassword(). When: password not hashed. Expected: true.', async () => {
  const user = new User(testUser);
  await user.save();

  expect(user.validatePassword(testUser.password)).toBeTruthy();
});
