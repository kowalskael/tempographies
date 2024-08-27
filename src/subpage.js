function mobileNav() {

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener("click", () => {
        if (mobileMenu.style.display === 'none') {
            mobileMenu.style.display = 'flex';
            hamburger.classList.add('open');
            document.body.style.overflowY = 'hidden';
        } else {
            hamburger.classList.remove('open');
            mobileMenu.style.display = 'none';

        }
    })
}

mobileNav();