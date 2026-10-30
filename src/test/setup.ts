import '@testing-library/jest-dom';

// Polyfill window.scrollTo and Element.prototype.scrollIntoView for jsdom
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

// Polyfill ResizeObserver and matchMedia for jsdom tests
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as any);
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

// Polyfill Element.prototype.animate for Web Animations API in jsdom
if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  Element.prototype.animate = () => ({
    onfinish: null,
    cancel: () => {},
    play: () => {},
    pause: () => {},
    finish: () => {},
  } as any);
}
