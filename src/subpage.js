function mobileNav() {
    let flag = true;
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.getElementById('mobile-links');
    const mainSpace = document.getElementById("main");
    const contentSpace = document.getElementById('content');

    hamburger.addEventListener("click", () => {
        if (flag) {
            mobileLinks.style.display = 'flex';
            hamburger.classList.add('open');
            document.body.style.overflowY = 'hidden';
            mainSpace.style.height = '100%';
            mobileMenu.style.height = '100%';
            contentSpace.style.display = 'none';
            document.body.style.height = '100%';
            flag = false;
        } else {
            hamburger.classList.remove('open');
            mobileLinks.style.display = 'none';
            contentSpace.style.display = 'flex';
            mobileMenu.style.height = '45px';
            flag = true;
        }
    })
}

mobileNav();