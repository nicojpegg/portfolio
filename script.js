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

if (imagePopup && popupImage) {
  const openImagePopup = (imageElement) => {
    popupImage.src = imageElement.src;
    popupImage.alt = imageElement.alt || 'Image preview';
    imagePopup.classList.add('is-open');
    imagePopup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
  };

  const closePopup = () => {
    imagePopup.classList.remove('is-open');
    imagePopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
  };

  if (banner) {
    banner.addEventListener('click', () => {
      openImagePopup(banner);
    });
  }

  const projectImages = document.querySelectorAll('.project-image');
  projectImages.forEach((projectImage) => {
    projectImage.addEventListener('click', () => {
      openImagePopup(projectImage);
    });
  });

  imagePopup.addEventListener('click', closePopup);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePopup();
    }
  });
}

const contactPopup = document.getElementById('contact-popup');
const contactPopupTitle = document.getElementById('contact-popup-title');
const contactPopupValue = document.getElementById('contact-popup-value');
const contactCopyButton = document.getElementById('contact-copy-button');
const contactCopyIcon = document.getElementById('contact-copy-icon');
const contactSendButton = document.getElementById('contact-send-button');
const contactCloseButton = document.getElementById('contact-close-button');
const contactTriggers = document.querySelectorAll('[data-contact-type]');

if (
  contactPopup &&
  contactPopupTitle &&
  contactPopupValue &&
  contactCopyButton &&
  contactCopyIcon &&
  contactSendButton &&
  contactCloseButton &&
  contactTriggers.length
) {
  let currentContactValue = '';

  const closeContactPopup = () => {
    contactPopup.classList.remove('is-open');
    contactPopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
    contactCopyIcon.textContent = 'content_copy';
  };

  const openContactPopup = ({ type, value, mailto }) => {
    currentContactValue = value;

    contactPopupTitle.textContent = type;
    contactPopupValue.textContent = value;
    contactCopyIcon.textContent = 'content_copy';
    contactCopyButton.setAttribute('aria-label', type === 'mail' ? 'Copy address' : 'Copy username');

    if (type === 'mail' && mailto) {
      contactSendButton.hidden = false;
      contactSendButton.href = mailto;
    } else {
      contactSendButton.hidden = true;
      contactSendButton.removeAttribute('href');
    }

    contactPopup.classList.add('is-open');
    contactPopup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
  };

  contactTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openContactPopup({
        type: trigger.dataset.contactType || 'contact',
        value: trigger.dataset.contactValue || '',
        mailto: trigger.dataset.contactMailto || ''
      });
    });
  });

  contactCopyButton.addEventListener('click', async () => {
    if (!currentContactValue) {
      return;
    }

    contactCopyIcon.textContent = 'check';

    try {
      await navigator.clipboard.writeText(currentContactValue);
    } catch {
      contactCopyIcon.textContent = 'check';
    }
  });

  contactCloseButton.addEventListener('click', closeContactPopup);

  contactPopup.addEventListener('click', (event) => {
    if (event.target === contactPopup) {
      closeContactPopup();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && contactPopup.classList.contains('is-open')) {
      closeContactPopup();
    }
  });
}

const projectAccordions = document.querySelectorAll('.project-details');

projectAccordions.forEach((accordion) => {
  const summaryButton = accordion.querySelector('.project-summary');
  const panel = accordion.querySelector('.project-panel');

  if (!summaryButton || !panel) {
    return;
  }

  panel.style.maxHeight = '0px';

  const closeAccordion = () => {
    panel.style.maxHeight = `${panel.scrollHeight}px`;

    requestAnimationFrame(() => {
      accordion.classList.remove('is-open');
      summaryButton.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = '0px';
    });
  };

  const openAccordion = () => {
    projectAccordions.forEach((otherAccordion) => {
      if (otherAccordion === accordion || !otherAccordion.classList.contains('is-open')) {
        return;
      }

      const otherButton = otherAccordion.querySelector('.project-summary');
      const otherPanel = otherAccordion.querySelector('.project-panel');

      if (!otherButton || !otherPanel) {
        return;
      }

      otherPanel.style.maxHeight = `${otherPanel.scrollHeight}px`;

      requestAnimationFrame(() => {
        otherAccordion.classList.remove('is-open');
        otherButton.setAttribute('aria-expanded', 'false');
        otherPanel.style.maxHeight = '0px';
      });
    });

    accordion.classList.add('is-open');
    summaryButton.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  };

  summaryButton.addEventListener('click', () => {
    const isOpen = accordion.classList.contains('is-open');

    if (isOpen) {
      closeAccordion();
      return;
    }

    openAccordion();
  });
});
