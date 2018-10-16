import * as random from 'randomstring';
import * as uuidv4 from 'uuid/v4';
import * as shortid from 'shortid';

export function randomString(length?: number): string {
  return random.generate(length);
}

export function randomNumber(length: number = 6): string {
  return random.generate({ length, charset: 'numeric' });
}

export function uuid(): string {
  return uuidv4();
}

export function randomId(): string {
  return shortid.generate();
}
