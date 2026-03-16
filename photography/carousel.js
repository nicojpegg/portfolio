const photoAccordions = Array.from(document.querySelectorAll('.photo-details'));

photoAccordions.forEach((accordion) => {
    const summaryButton = accordion.querySelector('.photo-summary');

    if (!summaryButton) {
        return;
    }

    summaryButton.addEventListener('click', () => {
        photoAccordions.forEach((otherAccordion) => {
            const otherButton = otherAccordion.querySelector('.photo-summary');

            if (!otherButton) {
                return;
            }

            const isCurrent = otherAccordion === accordion;
            otherAccordion.classList.toggle('is-open', isCurrent);
            otherButton.setAttribute('aria-expanded', String(isCurrent));
        });
    });
});
