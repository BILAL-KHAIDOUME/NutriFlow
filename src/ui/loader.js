const loaderEl = document.getElementById('loader');

export function showLoader() {
  if (loaderEl) {
    loaderEl.classList.remove('nf-loader--hidden');
  }
}

export function hideLoader() {
  if (loaderEl) {
    loaderEl.classList.add('nf-loader--hidden');
  }
}

