const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const scrollModuleUrl = pathToFileURL(
  path.join(__dirname, '../apps/web/src/lib/scroll-to-calculator.js'),
).href;

async function loadScrollModule() {
  try {
    return await import(scrollModuleUrl);
  } catch {
    return null;
  }
}

test('scrollToCalculator uses one native scroll with the sticky header offset', async () => {
  const scrollModule = await loadScrollModule();
  assert.equal(typeof scrollModule?.scrollToCalculator, 'function');

  const calls = [];
  const calculator = {
    getBoundingClientRect: () => ({ top: 580 }),
  };
  const documentObject = {
    getElementById: (id) => id === 'calculator' ? calculator : null,
    querySelector: (selector) => selector === 'header' ? { offsetHeight: 81 } : null,
  };
  const windowObject = {
    scrollY: 20,
    scrollTo: (options) => calls.push(options),
    matchMedia: () => ({ matches: false }),
    history: {
      replaceState: (...args) => calls.push(args),
    },
  };

  const didScroll = scrollModule.scrollToCalculator({ documentObject, windowObject });

  assert.equal(didScroll, true);
  assert.deepEqual(calls, [
    { top: 507, left: 0, behavior: 'smooth' },
    [null, '', '#calculator'],
  ]);
});

test('scrollToCalculator respects reduced motion', async () => {
  const scrollModule = await loadScrollModule();
  assert.equal(typeof scrollModule?.scrollToCalculator, 'function');
  const calls = [];

  scrollModule.scrollToCalculator({
    documentObject: {
      getElementById: () => ({ getBoundingClientRect: () => ({ top: 100 }) }),
      querySelector: () => null,
    },
    windowObject: {
      scrollY: 0,
      scrollTo: (options) => calls.push(options),
      matchMedia: () => ({ matches: true }),
      history: { replaceState: () => {} },
    },
  });

  assert.equal(calls[0].behavior, 'auto');
});

test('scrollToCalculatorFromHash handles a calculator link after the homepage mounts', async () => {
  const scrollModule = await loadScrollModule();
  assert.equal(typeof scrollModule?.scrollToCalculatorFromHash, 'function');
  const calls = [];
  const windowObject = {
    location: { hash: '#calculator' },
    scrollY: 0,
    scrollTo: (options) => calls.push(options),
    matchMedia: () => ({ matches: false }),
    history: { replaceState: () => {} },
  };

  const didScroll = scrollModule.scrollToCalculatorFromHash({
    documentObject: {
      getElementById: () => ({ getBoundingClientRect: () => ({ top: 580 }) }),
      querySelector: () => ({ offsetHeight: 81 }),
    },
    windowObject,
  });

  assert.equal(didScroll, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].top, 487);
});

test('global CSS does not force smooth scrolling for every scroll operation', () => {
  const css = fs.readFileSync(
    path.join(__dirname, '../apps/web/src/index.css'),
    'utf8',
  );

  assert.doesNotMatch(css, /html\s*\{\s*scroll-behavior:\s*smooth;\s*\}/);
});
