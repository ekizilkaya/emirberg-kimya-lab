// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../data/config';
import { createSave } from '../domain/progress';

/** jsdom'da olmayan tarayıcı API'leri */
beforeAll(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null) as never;
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.resetModules();
});

describe('uygulama duman testi', () => {
  it('ilk açılışta tanıtım gelir', async () => {
    const { App } = await import('./App');
    render(<App />);
    expect(screen.getByText('Merhaba! Ben Mol. Burası senin laboratuvarın.')).toBeTruthy();
    expect(screen.getByDisplayValue('Emir')).toBeTruthy();
  });

  it('tanıtım bittiyse periyodik tablo 118 elementle açılır ve kart açılır', async () => {
    const save = { ...createSave('Emir'), tutorial: 'done' as const, toursSeen: ['tablo'] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    const { App } = await import('./App');
    render(<App />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(118);
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/^6 Karbon/));
    });
    expect(screen.getByRole('heading', { name: 'Karbon' })).toBeTruthy();
    expect(screen.getByText('Kurşun kalem ucunda, kömürde ve bütün canlılarda.')).toBeTruthy();
  });

  it('bozuk kayıtta çökmez ve temiz başlar', async () => {
    localStorage.setItem(STORAGE_KEY, '{bozuk json');
    const { App } = await import('./App');
    render(<App />);
    expect(screen.getByText('Merhaba! Ben Mol. Burası senin laboratuvarın.')).toBeTruthy();
    expect(localStorage.getItem('emirberg-kimya-lab:save-bozuk-yedek')).toBe('{bozuk json');
  });
});
