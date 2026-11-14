import { describe, expect, it } from 'vitest';
import { findReaction } from './reactions';

describe('tepkime arama', () => {
  it('sıra önemsiz', () => {
    expect(findReaction(['sirke', 'karbonat'])?.id).toBe('r05');
    expect(findReaction(['karbonat', 'sirke'])?.id).toBe('r05');
  });
  it('araç farkı: demir çivi + su', () => {
    expect(findReaction(['demir-civi', 'su'])).toBeNull();
    expect(findReaction(['demir-civi', 'su'], 'zaman')?.id).toBe('r41');
  });
  it('araçlı tek madde', () => {
    expect(findReaction(['su'], 'ates')?.id).toBe('r26');
    expect(findReaction(['su'], 'elektrik')?.id).toBe('r45');
    expect(findReaction(['su'])).toBeNull();
  });
  it('bilinmeyen birleşim → genel sonuç (null)', () => {
    expect(findReaction(['su', 'helyum'])).toBeNull();
    expect(findReaction([])).toBeNull();
  });
  it('araçlı eşleşme yoksa araçsız tepkimeye düşer', () => {
    expect(findReaction(['sirke', 'karbonat'], 'zaman')?.id).toBe('r05');
  });
  it('tepkime yok türü de kayıtlıdır', () => {
    expect(findReaction(['bakir', 'tuz-ruhu'])?.kind).toBe('tepkime-yok');
  });
});
