const CLARITY_PROJECT_ID = 'xou8mte47b';

export function loadClarity() {
  if (!import.meta.env.PROD || typeof window === 'undefined' || window.clarity) return;

  window.clarity = function clarity(...args) {
    (window.clarity.q = window.clarity.q || []).push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
}
