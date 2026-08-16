/* ============================================
   OrthoMeriti — Scripts Principais
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initActiveNav();
        initCarousel();
        initAccordionFAQ();
        initWhatsAppFloat();
    }

    /* --------------------------------------------
       HEADER — Scroll Effect
       -------------------------------------------- */
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;

        function handleScroll() {
            if (window.scrollY > 60) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* --------------------------------------------
       MOBILE MENU
       -------------------------------------------- */
    function initMobileMenu() {
        var hamburger = document.getElementById('hamburger');
        var mobileMenu = document.getElementById('mobileMenu');
        var mobileClose = document.getElementById('mobileClose');
        var mobileOverlay = document.getElementById('mobileOverlay');
        var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link') : [];

        if (!hamburger || !mobileMenu) return;

        function openMenu() {
            hamburger.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', function () {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (mobileClose) {
            mobileClose.addEventListener('click', closeMenu);
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMenu);
        }

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* --------------------------------------------
       SMOOTH SCROLL
       -------------------------------------------- */
    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                var headerHeight = document.getElementById('header').offsetHeight || 70;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* --------------------------------------------
       SCROLL ANIMATIONS — Intersection Observer
       -------------------------------------------- */
    function initScrollAnimations() {
        var animatedElements = document.querySelectorAll('.animate-in');
        if (!animatedElements.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animatedElements.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* --------------------------------------------
       ACTIVE NAV — Highlight on scroll
       -------------------------------------------- */
    function initActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.header__nav-link');
        if (!sections.length || !navLinks.length) return;

        function updateActiveNav() {
            var scrollPos = window.scrollY + 150;

            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav();
    }

    /* --------------------------------------------
       CAROUSEL — Depoimentos
       -------------------------------------------- */
    function initCarousel() {
        var track = document.getElementById('depoimentosTrack');
        var prevBtn = document.getElementById('depoimentosPrev');
        var nextBtn = document.getElementById('depoimentosNext');
        var dotsContainer = document.getElementById('depoimentosDots');

        if (!track) return;

        var cards = track.querySelectorAll('.depoimento-card');
        var totalSlides = cards.length;
        var currentSlide = 0;
        var autoPlayInterval = null;
        var autoPlayDelay = 6000;

        if (dotsContainer) {
            for (var i = 0; i < totalSlides; i++) {
                var dot = document.createElement('button');
                dot.className = 'depoimentos__dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
                dot.dataset.index = i;
                dot.addEventListener('click', function () {
                    goToSlide(parseInt(this.dataset.index));
                });
                dotsContainer.appendChild(dot);
            }
        }

        var dots = dotsContainer ? dotsContainer.querySelectorAll('.depoimentos__dot') : [];

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

            dots.forEach(function (dot, idx) {
                dot.classList.toggle('active', idx === currentSlide);
            });

            resetAutoPlay();
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        startAutoPlay();

        var carousel = document.getElementById('depoimentosCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', function () {
                clearInterval(autoPlayInterval);
            });
            carousel.addEventListener('mouseleave', function () {
                startAutoPlay();
            });
        }

        var touchStartX = 0;
        var touchEndX = 0;

        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }, { passive: true });
    }

    /* --------------------------------------------
       ACCORDION — FAQ
       -------------------------------------------- */
    function initAccordionFAQ() {
        var faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(function (item) {
            var question = item.querySelector('.faq-item__question');
            if (!question) return;

            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                faqItems.forEach(function (otherItem) {
                    otherItem.classList.remove('active');
                    var otherQuestion = otherItem.querySelector('.faq-item__question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* --------------------------------------------
       WHATSAPP FLOAT — Popup Unit Selector
       -------------------------------------------- */
    function initWhatsAppFloat() {
        var toggleBtn = document.getElementById('whatsappToggle');
        var popup = document.getElementById('whatsappPopup');

        if (!toggleBtn || !popup) return;

        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = popup.classList.contains('active');
            popup.classList.toggle('active');
            toggleBtn.setAttribute('aria-expanded', !isOpen);
        });

        document.addEventListener('click', function (e) {
            if (!popup.contains(e.target) && e.target !== toggleBtn) {
                popup.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                popup.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

})();
