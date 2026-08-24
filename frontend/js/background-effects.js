document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.smartbus-background')) return;

    const background = document.createElement('div');
    background.className = 'smartbus-background';
    background.setAttribute('aria-hidden', 'true');
    background.innerHTML = `
        <div class="smartbus-grid"></div>
        <div class="smartbus-particles">
            <span class="smartbus-particle" style="left: 16%; top: 18%; --particle-duration: 17s; --particle-delay: -2s"></span>
            <span class="smartbus-particle" style="left: 31%; top: 72%; --particle-duration: 21s; --particle-delay: -9s"></span>
            <span class="smartbus-particle" style="left: 48%; top: 29%; --particle-duration: 14s; --particle-delay: -5s"></span>
            <span class="smartbus-particle" style="left: 63%; top: 82%; --particle-duration: 19s; --particle-delay: -12s"></span>
            <span class="smartbus-particle" style="left: 78%; top: 20%; --particle-duration: 23s; --particle-delay: -3s"></span>
            <span class="smartbus-particle" style="left: 89%; top: 58%; --particle-duration: 16s; --particle-delay: -8s"></span>
            <span class="smartbus-particle" style="left: 7%; top: 84%; --particle-duration: 20s; --particle-delay: -15s"></span>
            <span class="smartbus-particle" style="left: 55%; top: 54%; --particle-duration: 18s; --particle-delay: -6s"></span>
        </div>
        <div class="smartbus-route-line route-one"></div>
        <div class="smartbus-route-line route-two"></div>
        <div class="smartbus-route-line route-three"></div>
        <div class="smartbus-gps gps-one"></div>
        <div class="smartbus-gps gps-two"></div>
        <div class="smartbus-gps gps-three"></div>
    `;
    document.body.prepend(background);

    Array.from(document.body.children).forEach((child) => {
        if (child !== background) child.classList.add('smartbus-content');
    });
});
