const popup        = document.getElementById('photo-popup');
const popupPhoto   = document.getElementById('popup-photo');
const popupClose   = document.getElementById('popup-close');
const popupDownload = document.getElementById('popup-download');
const popupOpenTab  = document.getElementById('popup-open');

const metaEl = {
    camera:   document.getElementById('popup-camera'),
    lens:     document.getElementById('popup-lens'),
    date:     document.getElementById('popup-date'),
    location: document.getElementById('popup-location'),
};

const metaRow = {
    camera:   document.getElementById('popup-camera-row'),
    lens:     document.getElementById('popup-lens-row'),
    date:     document.getElementById('popup-date-row'),
    location: document.getElementById('popup-location-row'),
};

const openPopup = (item) => {
    const img = item.querySelector('img');
    const rawSrc = item.dataset.raw || img.src;

    popupPhoto.src = img.src;
    popupPhoto.alt = img.alt;
    popupDownload.href = rawSrc;
    popupDownload.setAttribute('download', img.alt || 'photo');
    popupOpenTab.href = rawSrc;

    for (const key of Object.keys(metaEl)) {
        const value = (item.dataset[key] || '').trim();
        metaEl[key].textContent = value;
        metaRow[key].hidden = !value;
    }

    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
};

const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
};

document.querySelectorAll('.grid-item').forEach((item) => {
    item.addEventListener('click', () => openPopup(item));
});

popupClose.addEventListener('click', closePopup);

popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup();
});
