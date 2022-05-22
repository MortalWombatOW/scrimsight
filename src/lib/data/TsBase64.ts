import {PackedReport} from './types';

// Original: https://github.com/michael-mcanulty/tsBase64

export class TsBase64 {
  private static _b64chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;
  private static _re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;

  private static _cb_btou(cccc: string): string {
    switch (cccc.length) {
      case 4:
        const cp =
            ((0x07 & cccc.charCodeAt(0)) << 18) |
            ((0x3f & cccc.charCodeAt(1)) << 12) |
            ((0x3f & cccc.charCodeAt(2)) << 6) |
            (0x3f & cccc.charCodeAt(3)),
          offset = cp - 0x10000;
        return (
          String.fromCharCode((offset >>> 10) + 0xd800) +
          String.fromCharCode((offset & 0x3ff) + 0xdc00)
        );
      case 3:
        return String.fromCharCode(
          ((0x0f & cccc.charCodeAt(0)) << 12) |
            ((0x3f & cccc.charCodeAt(1)) << 6) |
            (0x3f & cccc.charCodeAt(2)),
        );
      default:
        return String.fromCharCode(
          ((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1)),
        );
    }
  }

  private static _cb_decode(cccc: string): string {
    const b64tab = {};
    for (let i = 0, l = TsBase64._b64chars.length; i < l; i++)
      b64tab[TsBase64._b64chars.charAt(i)] = i;
    const len = cccc.length,
      padlen = len % 4,
      n =
        (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) |
        (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) |
        (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) |
        (len > 3 ? b64tab[cccc.charAt(3)] : 0),
      chars = [
        String.fromCharCode(n >>> 16),
        String.fromCharCode((n >>> 8) & 0xff),
        String.fromCharCode(n & 0xff),
      ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
  }

  private static _cb_encode(ccc): string {
    const padlen = [0, 2, 1][ccc.length % 3],
      ord =
        (ccc.charCodeAt(0) << 16) |
        ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) |
        (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
      chars = [
        TsBase64._b64chars.charAt(ord >>> 18),
        TsBase64._b64chars.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : TsBase64._b64chars.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : TsBase64._b64chars.charAt(ord & 63),
      ];
    return chars.join('');
  }

  private static _cb_utob(c: string): string {
    if (c.length < 2) {
      const cc = c.charCodeAt(0);
      return cc < 0x80
        ? c
        : cc < 0x800
        ? String.fromCharCode(0xc0 | (cc >>> 6)) +
          String.fromCharCode(0x80 | (cc & 0x3f))
        : String.fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) +
          String.fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
          String.fromCharCode(0x80 | (cc & 0x3f));
    } else {
      const cc =
        0x10000 +
        (c.charCodeAt(0) - 0xd800) * 0x400 +
        (c.charCodeAt(1) - 0xdc00);
      return (
        String.fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) +
        String.fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) +
        String.fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
        String.fromCharCode(0x80 | (cc & 0x3f))
      );
    }
  }

  private static _re_btou(): RegExp {
    return new RegExp(
      [
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}',
      ].join('|'),
      'g',
    );
  }

  private static _atob(a: string): string {
    return a.replace(/[\s\S]{1,4}/g, this._cb_decode);
  }

  private static _btoa(b: string): string {
    return b.replace(/[\s\S]{1,3}/g, this._cb_encode);
  }

  private static _btou(b: any): string {
    return b.replace(this._re_btou, this._cb_btou);
  }

  private static _decode(a: string): string {
    const _decode = (a) => {
      return this._btou(this._atob(a));
    };
    return _decode(
      String(a)
        .replace(/[-_]/g, (m0) => {
          return m0 == '-' ? '+' : '/';
        })
        .replace(/[^A-Za-z0-9\+\/]/g, ''),
    );
  }

  private static _encode(u: string, urisafe = false): string {
    const _encode = (u) => {
      return this._btoa(this._utob(u));
    };
    return !urisafe
      ? _encode(String(u))
      : _encode(String(u))
          .replace(/[+\/]/g, (m0) => {
            return m0 == '+' ? '-' : '_';
          })
          .replace(/=/g, '');
  }

  public static EncodeURI(u): string {
    return this._encode(u, true);
  }

  public static Decode(c: string): string {
    return this._decode(c);
  }

  public static Encode(packed: string): string {
    return this._encode(packed, true);
  }

  private static _utob(u: string): string {
    return u.replace(this._re_utob, this._cb_utob);
  }
}
