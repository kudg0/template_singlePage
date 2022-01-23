window.addEventListener('DOMContentLoaded', initJs);

function initJs() {
  let body = document.querySelector('body');
}

// = include '_base.js'

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
