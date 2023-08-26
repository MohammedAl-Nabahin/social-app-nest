import * as bcrypt from 'bcrypt';

export function encode(rawPassword: string) {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, SALT);
}

export function compare(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}
