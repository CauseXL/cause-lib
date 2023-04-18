export const showLoading = () => {
  document.querySelector('.loading')?.classList.remove('hidden');
};

export const hideLoading = () => {
  document.querySelector('.loading')?.classList.add('hidden');
};
