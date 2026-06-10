export function scrollToCalculator({
  documentObject = document,
  windowObject = window,
} = {}) {
  const calculator = documentObject.getElementById('calculator');
  if (!calculator) return false;

  const headerHeight = documentObject.querySelector('header')?.offsetHeight ?? 0;
  const currentScroll = windowObject.scrollY ?? windowObject.pageYOffset ?? 0;
  const top = Math.max(
    0,
    calculator.getBoundingClientRect().top + currentScroll - headerHeight - 12,
  );
  const prefersReducedMotion = windowObject
    .matchMedia?.('(prefers-reduced-motion: reduce)')
    .matches;

  windowObject.scrollTo({
    top,
    left: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
  windowObject.history.replaceState(null, '', '#calculator');

  return true;
}

export function scrollToCalculatorFromHash(options = {}) {
  const windowObject = options.windowObject ?? window;
  if (windowObject.location.hash !== '#calculator') return false;

  return scrollToCalculator({ ...options, windowObject });
}
