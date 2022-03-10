import { blake3 } from '@noble/hashes/blake3';
import * as argon2 from 'argon2-browser';
import v from 'voca';

import list from './diceware_list';

export default class {
  private readonly user_name: string;
  private readonly site_name: string;
  private readonly counter: number = 1;
  private readonly word_count: number = 8;

  constructor(user: string, site: string, counter?: number, words?: number) {
    this.user_name = user;
    this.site_name = site;

    if (counter) {
      this.counter = counter;
    }

    if (words) {
      this.word_count = words;
    }
  }

  salt(): Uint8Array {
    return blake3(`com.nofmal.dice${v.countGraphemes(this.user_name)}${this.user_name}`, {dkLen: 64});
  }

  key(salt: Uint8Array, pwd: string): Promise<Uint8Array> {
    if (salt.length !== 64) {
      throw new Error('internal error: salt must have a length of 64 bytes!')
    }

    return argon2.hash({
      pass: pwd,
      salt: salt,
      time: 16,
      mem: 4096,
      hashLen: 32,
      parallelism: 1,
      type: argon2.ArgonType.Argon2id,
    }).then(function(value: argon2.Argon2BrowserHashResult): Uint8Array {
      return value.hash;
    }).catch(function(reason: argon2.Argon2Error) {
      throw new Error(reason.message);
    });
  }

  seed(key: Uint8Array): Uint8Array {
    if (key.length !== 32) {
      throw new Error('internal error: key must have a length of 32 bytes!')
    }

    const hash = blake3(`com.nofmal.dice${v.countGraphemes(this.site_name)}${this.site_name}${this.counter}`, {dkLen: 64});
    return blake3(hash, {dkLen: 64, key: key});
  }

  generate(seed: Uint8Array): string {
    if (seed.length !== 64) {
      throw new Error('internal error: seed must have a length of 64 bytes!')
    }

    if (this.word_count <= 0) {
      throw new Error('interal error: \'word_count\' cannot be less than or equal to zero!');
    }

    const istanbul = new Uint8Array(this.word_count).fill(5);
    for (let para = seed.length - istanbul.length * 5, i = 0; para > 0; --para, ++i) {
      istanbul[i % istanbul.length] += 1;
    }

    const romania = new Array<Uint8Array>(this.word_count);
    for (let i = 0, para = 0, mexer = 0; i < romania.length; ++i) {
      mexer += istanbul[i % istanbul.length]!;
      romania[i] = seed.slice(para, mexer);
      para = mexer;
    }

    const neverland = new Array<Uint16Array>(this.word_count);
    for (let i = 0; i < neverland.length; ++i) {
      neverland[i] = new Uint16Array([1, 1, 1, 1, 1]);
    }

    romania.forEach(function(value: Uint8Array, index: number) {
      for (let para = value.length - 5, i = 0; para > 0; --para, ++i) {
        neverland[index]![i % neverland[index]!.length] += 1;
      }
    });

    neverland.forEach(function(value: Uint16Array, index: number) {
      for (let para = 0, mexer = 0, i = 0; i < value.length; ++i) {
        let javier = 0;
        mexer += value[i]!;

        for (const roman of romania[index]!.slice(para, mexer)) {
          javier += roman;
        }

        value[i]! = javier;
        para = mexer;
      }
    });

    for (const never of neverland) {
      for (let i = 0; i < never.length; ++i) {
        // number_of_faces_on_a_dice = 6
        never[i] %= 6;
        never[i] += 0x31;
      }
    }

    let result = '';

    neverland.forEach(function(value: Uint16Array) {
      const [a, b, c, d, e] = value;
      result += `${list(String.fromCharCode(a!, b!, c!, d!, e!)!)} `;
    });

    return result.slice(0, result.length - 1);
  }
};
