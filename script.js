const banner = document.querySelector('.banner');
const imagePopup = document.getElementById('image-popup');
const popupImage = document.getElementById('popup-image');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const root = document.documentElement;

const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

const getSystemTheme = () => (systemThemeMedia.matches ? 'dark' : 'light');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);

  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
};

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme || getSystemTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || getSystemTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });
}

systemThemeMedia.addEventListener('change', (event) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

if (banner && imagePopup && popupImage) {
  const closePopup = () => {
    imagePopup.classList.remove('is-open');
    imagePopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
  };

  banner.addEventListener('click', () => {
    popupImage.src = banner.src;
    popupImage.alt = banner.alt || 'Banner preview';
    imagePopup.classList.add('is-open');
    imagePopup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
  });

  imagePopup.addEventListener('click', closePopup);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePopup();
    }
  });
}
