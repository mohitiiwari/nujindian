// ============================================
// NUJ India Website — Optimized & Fixed
// ============================================
(function () {
    'use strict';

    // ──────────────────────────────────────────
    // 0.  UTILITY
    // ──────────────────────────────────────────
    /** Wait for DOM if needed, then run cb. */
    function onReady(cb) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', cb);
        } else {
            cb();
        }
    }

    // ──────────────────────────────────────────
    // 1.  MOBILE MENU
    // ──────────────────────────────────────────
    function initMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const menu   = document.getElementById('mobileMenu');
        const close  = document.getElementById('menuClose');
        if (!toggle || !menu || !close) return;

        function open()  { menu.classList.add('active');    document.body.style.overflow = 'hidden'; }
        function shut()  { menu.classList.remove('active'); document.body.style.overflow = '';       }

        toggle.addEventListener('click', open);
        close.addEventListener('click', shut);

        // Direct nav links (no submenu) → close menu
        menu.querySelectorAll('.mobile-nav-list > li > a').forEach(link => {
            link.addEventListener('click', function () {
                if (!this.parentElement.classList.contains('mobile-has-sub')) shut();
            });
        });

        // Any submenu link → close menu
        menu.querySelectorAll('.mobile-sub a').forEach(link => {
            link.addEventListener('click', shut);
        });
    }

    // ──────────────────────────────────────────
    // 2.  MOBILE SUBMENU EXPAND / COLLAPSE
    // ──────────────────────────────────────────
    function initMobileSubmenus() {
        document.querySelectorAll('.mobile-has-sub').forEach(item => {
            const link = item.querySelector(':scope > a');
            if (!link) return;

            link.addEventListener('click', function (e) {
                e.preventDefault();
                const isOpen = item.classList.contains('open');

                // Close every other open submenu
                document.querySelectorAll('.mobile-has-sub.open').forEach(other => {
                    if (other !== item) other.classList.remove('open');
                });

                item.classList.toggle('open', !isOpen);
            });
        });
    }

    // ──────────────────────────────────────────
    // 3.  DESKTOP MEGAMENU  (click-to-open for
    //     touch; Escape / outside-click to close)
    // ──────────────────────────────────────────
    function initMegamenu() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        const dropdowns = nav.querySelectorAll('.has-dropdown');

        function closeAll() {
            dropdowns.forEach(d => d.classList.remove('megamenu-open'));
        }

        dropdowns.forEach(li => {
            const link = li.querySelector(':scope > a');
            if (!link) return;

            link.addEventListener('click', function (e) {
                if (!window.matchMedia('(min-width: 969px)').matches) return;
                e.preventDefault();
                const wasOpen = li.classList.contains('megamenu-open');
                closeAll();
                if (!wasOpen) li.classList.add('megamenu-open');
            });
        });

        document.addEventListener('click',  e => { if (!nav.contains(e.target)) closeAll(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    }

    // ──────────────────────────────────────────
    // 4.  STATE-UNITS ZONE PANEL SWITCHER
    // ──────────────────────────────────────────
    function initZonePanels() {
        const host = document.querySelector('.has-dropdown.has-megamenu');
        if (!host) return;

        const zonesCol  = host.querySelector('.megamenu-column-zones');
        const panelsCol = host.querySelector('.megamenu-column-panels');
        const zoneItems = host.querySelectorAll('.megamenu-zones li[data-zone]');
        const panels    = host.querySelectorAll('.megamenu-panel[data-panel]');

        let hideTimer = null;
        const DELAY  = 180;

        function showPanel(zone) {
            panels.forEach(p => p.classList.toggle('is-visible', p.dataset.panel === zone));
        }
        function hideAll()     { panels.forEach(p => p.classList.remove('is-visible')); }
        function scheduleHide() { hideTimer = setTimeout(hideAll, DELAY); }
        function cancelHide()  { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }

        zoneItems.forEach(li => {
            li.addEventListener('mouseenter', () => { cancelHide(); showPanel(li.dataset.zone); });
        });

        if (zonesCol)  zonesCol.addEventListener('mouseleave',  scheduleHide);
        if (panelsCol) {
            panelsCol.addEventListener('mouseenter', cancelHide);
            panelsCol.addEventListener('mouseleave', scheduleHide);
        }
    }

    // ──────────────────────────────────────────
    // 5.  SMOOTH SCROLL
    // ──────────────────────────────────────────
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ──────────────────────────────────────────
    // 6.  CONTENT CAROUSEL  (scrollContent helper)
    // ──────────────────────────────────────────
    window.scrollContent = function (type, direction) {
        const container = document.getElementById(type + '-cards');
        if (!container) return;
        const card = container.querySelector('.content-card');
        if (!card) return;
        container.scrollBy({ left: direction * (card.offsetWidth + 20), behavior: 'smooth' });
    };

    // ──────────────────────────────────────────
    // 7.  ENQUIRY FORM
    // ──────────────────────────────────────────
    window.handleEnquiry = function (event) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        console.log('Form submitted:', data);
        alert('Thank you for your ' + data.type + '! We will get back to you soon.');
        event.target.reset();
        return false;
    };

    // ──────────────────────────────────────────
    // 8.  STICKY / HIDE-ON-SCROLL HEADER
    // ──────────────────────────────────────────
    function initStickyHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        header.style.transition = 'transform 0.3s ease';
        let lastY = 0;

        window.addEventListener('scroll', () => {
            const y = window.pageYOffset;
            if (y <= 0) {
                header.style.transform = 'translateY(0)';
            } else if (y > lastY && y > 100) {
                header.style.transform = 'translateY(-100%)';   // scrolling down
            } else {
                header.style.transform = 'translateY(0)';       // scrolling up
            }
            lastY = y;
        });
    }

    // ──────────────────────────────────────────
    // 9.  SCROLL-REVEAL ANIMATION
    // ──────────────────────────────────────────
    function initScrollReveal() {
        const targets = document.querySelectorAll('.feature-card, .leader-card, .gallery-item');
        if (!targets.length) return;

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity    = '1';
                    e.target.style.transform  = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        targets.forEach(el => {
            el.style.cssText += 'opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease;';
            obs.observe(el);
        });
    }

    // ──────────────────────────────────────────
    // 10. NEWSLETTER FORM
    // ──────────────────────────────────────────
    function initNewsletter() {
        document.querySelectorAll('.newsletter-form').forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                console.log('Newsletter subscription:', email);
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            });
        });
    }

    // ──────────────────────────────────────────
    // 11. "IN FOCUS" SLIDESHOW  (.news-highlights)
    // ──────────────────────────────────────────
    function initInFocusSlideshow() {
        const container = document.querySelector('.news-highlights .slideshow-container');
        if (!container) return;

        const slides     = container.querySelectorAll('.slide');
        const indicators = document.querySelectorAll('.news-highlights .slide-indicators .indicator');
        if (!slides.length) return;

        let current  = 0;
        let timer    = null;
        const DELAY  = 5000;

        function show(i) {
            current = (i + slides.length) % slides.length;
            slides.forEach((s, idx)     => s.classList.toggle('active', idx === current));
            indicators.forEach((ind, idx) => ind.classList.toggle('active', idx === current));
        }

        function startAuto() {
            if (timer) clearInterval(timer);
            timer = setInterval(() => show(current + 1), DELAY);
        }

        // Expose globals used by HTML onclick attributes (if any)
        window.changeSlide = function (dir) { show(current + dir); startAuto(); };
        window.currentSlide = function (i)  { show(i - 1);         startAuto(); };

        show(0);
        startAuto();
    }

    // ──────────────────────────────────────────
    // 12. NEWS SLIDER  (photo-strip, .news-slider)
    // ──────────────────────────────────────────
    function initNewsSlider() {
        const wrapper = document.querySelector('.news-slider .slider-wrapper');
        if (!wrapper) return;

        const slides = wrapper.querySelectorAll('.slide');
        const dots   = document.querySelectorAll('.news-slider .dot');
        if (!slides.length) return;

        let idx   = 0;
        let timer = null;

        // Ensure first slide starts active
        slides.forEach((s, i) => s.classList.toggle('active', i === 0));
        dots.forEach((d, i)   => d.classList.toggle('active', i === 0));

        function tick() {
            slides[idx].classList.remove('active');
            if (dots[idx]) dots[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
            if (dots[idx]) dots[idx].classList.add('active');
        }

        function startAuto() { if (timer) clearInterval(timer); timer = setInterval(tick, 4000); }
        function stopAuto()  { if (timer) { clearInterval(timer); timer = null; } }

        wrapper.addEventListener('mouseenter', stopAuto);
        wrapper.addEventListener('mouseleave', startAuto);

        startAuto();
    }

    // ──────────────────────────────────────────
    // 13. HERO BANNER SLIDER  (.slider-container)
    // ──────────────────────────────────────────
    function initHeroBanner() {
        const container = document.querySelector('.slider-container');
        if (!container) return;

        const slidesList = container.querySelector('.slides');
        const slides     = slidesList ? slidesList.querySelectorAll('li') : [];
        const prevBtn    = container.querySelector('.flex-prev');
        const nextBtn    = container.querySelector('.flex-next');
        const dotsOl     = container.querySelector('.flex-control-nav');
        if (!slides.length || !dotsOl) return;

        let current = 0;
        const total = slides.length;
        let autoTimer = null;
        const AUTO_MS = 4000;
        const SWIPE   = 60;

        function show(i) {
            current = (i + total) % total;
            slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
            dotsOl.querySelectorAll('li').forEach((d, idx) => d.classList.toggle('active', idx === current));
        }

        function startAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = setInterval(() => show(current + 1), AUTO_MS); }
        function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

        // Init slides (clear any stale active)
        slides.forEach(s => s.classList.remove('active'));
        show(0);

        // Build dots
        dotsOl.innerHTML = '';
        for (let d = 0; d < total; d++) {
            const li = document.createElement('li');
            li.setAttribute('role', 'button');
            li.setAttribute('aria-label', 'Slide ' + (d + 1));
            li.addEventListener('click', (e) => { e.preventDefault(); show(d); startAuto(); });
            dotsOl.appendChild(li);
        }
        // Mark first dot active after build
        show(0);

        // Arrow buttons
        if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); show(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); show(current + 1); startAuto(); });

        // Touch swipe
        let startX = 0;
        container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        container.addEventListener('touchend',   e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > SWIPE) { diff > 0 ? show(current + 1) : show(current - 1); startAuto(); }
        }, { passive: true });

        // Pause on hover
        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);

        startAuto();
    }

    // ──────────────────────────────────────────
    // 14. MEDIA CLIPPINGS GALLERY SLIDER
    // ──────────────────────────────────────────
    function initGallerySlider() {
        const container = document.querySelector('.gallery-container .media-clippings-slider');
        if (!container) return;

        const viewport = container.querySelector('.gallery-slider-viewport');
        const track    = container.querySelector('.gallery-slider-track');
        const items    = track ? track.querySelectorAll('.gallery-item') : [];
        const prevBtn  = container.querySelector('.gallery-slider-prev');
        const nextBtn  = container.querySelector('.gallery-slider-next');
        const dotsEl   = document.querySelector('.gallery-container .gallery-slider-dots');
        if (!viewport || !track || !items.length) return;

        const total   = items.length;
        const GAP_PX  = 20;
        const AUTO_MS = 5000;
        let currentPage  = 0;
        let itemsPerPage = 3;
        let totalPages   = 1;
        let autoTimer    = null;

        function getItemsPerPage() {
            const w = window.innerWidth;
            if (w <= 480) return 1;
            if (w <= 768) return 2;
            return 3;
        }

        function buildDots() {
            if (!dotsEl) return;
            dotsEl.innerHTML = '';
            for (let d = 0; d < totalPages; d++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-label', 'Go to slide ' + (d + 1));
                btn.classList.toggle('active', d === 0);
                btn.addEventListener('click', () => { goToPage(d); startAuto(); });
                dotsEl.appendChild(btn);
            }
        }

        function goToPage(page) {
            currentPage = ((page % totalPages) + totalPages) % totalPages;
            const vw        = viewport.offsetWidth;
            const itemWidth = (vw - (itemsPerPage - 1) * GAP_PX) / itemsPerPage;
            track.style.transform = 'translateX(-' + (currentPage * (itemWidth + GAP_PX)) + 'px)';

            if (dotsEl) {
                dotsEl.querySelectorAll('[role="tab"]').forEach((d, i) => d.classList.toggle('active', i === currentPage));
            }
        }

        function updateLayout() {
            itemsPerPage = getItemsPerPage();
            totalPages   = Math.max(1, Math.ceil(total / itemsPerPage));
            if (currentPage >= totalPages) currentPage = totalPages - 1;

            const vw        = viewport.offsetWidth;
            const itemWidth = (vw - (itemsPerPage - 1) * GAP_PX) / itemsPerPage;
            track.style.width = (total * itemWidth + (total - 1) * GAP_PX) + 'px';
            track.style.gap   = GAP_PX + 'px';
            items.forEach(it => { it.style.flex = '0 0 ' + itemWidth + 'px'; });

            buildDots();      // rebuild dots every resize so count stays correct
            goToPage(currentPage);
        }

        function next()      { goToPage(currentPage + 1); startAuto(); }
        function prev()      { goToPage(currentPage - 1); startAuto(); }
        function startAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = setInterval(next, AUTO_MS); }
        function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

        // Init
        updateLayout();

        if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); prev(); });
        if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); next(); });
        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);

        // Touch swipe on viewport
        let tStart = 0;
        viewport.addEventListener('touchstart', e => { tStart = e.touches[0].clientX; }, { passive: true });
        viewport.addEventListener('touchend',   e => {
            const diff = tStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
        }, { passive: true });

        window.addEventListener('resize', updateLayout);
        startAuto();
    }

    // ──────────────────────────────────────────
    // 15. LIGHTBOX  (single unified instance)
    // ──────────────────────────────────────────
    function initLightbox() {
        // Use the first lightbox in DOM (Photo Gallery full-screen viewer)
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        // Must use the img inside this lightbox so the correct image loads when we show it
        const lightboxImg = lightbox.querySelector('#lightbox-image') || lightbox.querySelector('img') ||
            document.getElementById('lightbox-image') || document.getElementById('lightbox-img');
        const lightboxCaption = lightbox.querySelector('#lightbox-caption') || lightbox.querySelector('.lightbox-caption') ||
            document.getElementById('lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close, .close');
        const prevBtn  = lightbox.querySelector('.lightbox-prev, .prev');
        const nextBtn  = lightbox.querySelector('.lightbox-next, .next');
        if (!lightboxImg) return;

        // ── Image data pool: prefer Photo Gallery .photo-item (matches onclick="openLightbox(0)" etc.)
        let images = [];
        document.querySelectorAll('.photo-item').forEach(item => {
            const img = item.querySelector('img');
            const titleEl = item.querySelector('.overlay-text');
            if (img) {
                images.push({
                    src: img.src || img.getAttribute('src') || '',
                    alt: img.alt || '',
                    title: titleEl ? titleEl.textContent.trim() : '',
                    subtitle: ''
                });
            }
        });

        // Fallback: .gallery-item (Media Clippings slider)
        if (!images.length) {
            document.querySelectorAll('.gallery-item').forEach(item => {
                const img = item.querySelector('img');
                const titleEl = item.querySelector('.overlay-content h3');
                const subEl = item.querySelector('.overlay-content p');
                if (img) {
                    images.push({
                        src: img.src || img.getAttribute('src') || '',
                        alt: img.alt || '',
                        title: titleEl ? titleEl.textContent : '',
                        subtitle: subEl ? subEl.textContent : ''
                    });
                }
            });
        }

        // Fallback: hard-coded (same order as Photo Gallery)
        if (!images.length) {
            images = [
                { src: 'images/1766290219_G8IgXNpb0AAF9GH (1).jpg', alt: 'All India Media Meet', title: 'All India Media Meet', subtitle: '' },
                { src: 'images/1766290098_WhatsApp_Image_2025-12-15_at_08_07_25_871f23f6.jpg', alt: "Governor's Address", title: "Governor's Address", subtitle: '' },
                { src: 'images/1769686728679_image.png', alt: 'Press Conference', title: 'Press Conference', subtitle: '' },
                { src: 'images/ras_bihari.jpg', alt: 'Leadership Summit', title: 'Leadership Summit', subtitle: '' },
                { src: 'images/pradeep_tiwari.jpg', alt: 'Annual Convention', title: 'Annual Convention', subtitle: '' },
                { src: 'images/1766290219_G8IgXNpb0AAF9GH (1).jpg', alt: 'Regional Workshop', title: 'Regional Workshop', subtitle: '' }
            ];
        }

        let currentIdx = 0;

        // ── Counter overlay ──
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.style.cssText = 'position:absolute;top:30px;left:50%;transform:translateX(-50%);color:#fff;font-size:18px;background:rgba(0,0,0,.7);padding:10px 20px;border-radius:5px;z-index:10000;';
        lightbox.appendChild(counter);

        // ── Core helpers ──
        function renderImage(i) {
            currentIdx = ((i % images.length) + images.length) % images.length;
            const cur  = images[currentIdx];

            lightboxImg.src = cur.src;
            lightboxImg.alt = cur.alt;

            if (lightboxCaption) {
                lightboxCaption.innerHTML = cur.title
                    ? '<strong>' + cur.title + '</strong>' + (cur.subtitle ? '<br>' + cur.subtitle : '')
                    : cur.subtitle || '';
            }
            counter.textContent = (currentIdx + 1) + ' / ' + images.length;
        }

        function open(index) {
            if (!images.length) return;
            renderImage(index);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // ── Expose globally so HTML onclick="openLightbox(0)" and changeLightboxImage(±1) work ──
        window.openLightbox = open;
        window.closeLightbox = close;
        window.changeLightboxImage = function (delta) { renderImage(currentIdx + delta); };

        // ── Wire Photo Gallery .photo-item clicks (indices 0–5) ──
        document.querySelectorAll('.photo-item').forEach((item, idx) => {
            item.addEventListener('click', () => open(idx));
        });
        // ── Wire Media Clippings .gallery-item clicks ──
        document.querySelectorAll('.gallery-item').forEach((item, idx) => {
            item.addEventListener('click', () => open(idx));
        });

        // ── Buttons (first lightbox uses .lightbox-close, .lightbox-prev, .lightbox-next) ──
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (prevBtn)  prevBtn.addEventListener('click', () => renderImage(currentIdx - 1));
        if (nextBtn)  nextBtn.addEventListener('click', () => renderImage(currentIdx + 1));

        // ── Click-outside closes ──
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

        // ── Keyboard (single listener) ──
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape')     close();
            else if (e.key === 'ArrowLeft')  renderImage(currentIdx - 1);
            else if (e.key === 'ArrowRight') renderImage(currentIdx + 1);
        });

        // ── Touch swipe ──
        let swipeStartX = 0;
        lightbox.addEventListener('touchstart', e => { swipeStartX = e.changedTouches[0].screenX; }, { passive: true });
        lightbox.addEventListener('touchend',   e => {
            const diff = swipeStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) { diff > 0 ? renderImage(currentIdx + 1) : renderImage(currentIdx - 1); }
        }, { passive: true });

        // ── Image load / error feedback ──
        lightboxImg.addEventListener('error', () => {
            if (lightboxCaption) lightboxCaption.innerHTML = 'Image failed to load';
        });

        console.log('Lightbox initialized: ' + images.length + ' images');
    }

    // ──────────────────────────────────────────
    // 16. LAZY LOAD  (gallery images)
    // ──────────────────────────────────────────
    function initLazyLoad() {
        if (!('IntersectionObserver' in window)) return;

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            });
        }, { rootMargin: '50px', threshold: 0.01 });

        document.querySelectorAll('.gallery-item img[data-src], img[data-src]').forEach(img => obs.observe(img));
    }

    // ──────────────────────────────────────────
    // 17. GALLERY LOAD STAGGER ANIMATION
    // ──────────────────────────────────────────
    function initGalleryStagger() {
        window.addEventListener('load', () => {
            document.querySelectorAll('.gallery-item').forEach((item, i) => {
                item.style.opacity    = '0';
                item.style.transform  = 'translateY(30px)';
                item.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    item.style.opacity   = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 + i * 50);
            });
        });
    }

    // ──────────────────────────────────────────
    // 18. PREVENT CONTEXT-MENU ON GALLERY IMAGES
    // ──────────────────────────────────────────
    function initNoContextMenu() {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('contextmenu', e => e.preventDefault());
        });
    }

    // ──────────────────────────────────────────
    // 19. HORIZONTAL AUTO-SCROLLER  (.scroller-track)
    // ──────────────────────────────────────────
    function initAutoScroller() {
        const track = document.querySelector('.scroller-track');
        if (!track) return;

        let pos      = 0;
        let interval = null;

        function tick() {
            pos += 1;
            if (pos >= track.scrollWidth - track.clientWidth) pos = 0;
            track.scrollLeft = pos;
        }

        function startScroll() { if (!interval) interval = setInterval(tick, 20); }
        function stopScroll()  { if (interval)  { clearInterval(interval); interval = null; } }

        track.addEventListener('mouseenter', stopScroll);
        track.addEventListener('mouseleave', startScroll);

        startScroll();
    }

    // ──────────────────────────────────────────
    // 20. IMAGE SCROLLER  (#imageScroller)
    // ──────────────────────────────────────────
    function initImageScroller() {
        const scroller          = document.getElementById('imageScroller');
        const scrollLeftBtn     = document.getElementById('scrollLeft');
        const scrollRightBtn    = document.getElementById('scrollRight');
        const indicatorsWrapper = document.getElementById('scrollIndicators');
        if (!scroller || !scrollLeftBtn || !scrollRightBtn || !indicatorsWrapper) {
            console.warn('Image scroller: required elements not found.');
            return;
        }

        const SCROLL_AMT = 370;   // one item width + gap
        let isDragging   = false;
        let startX       = 0;
        let savedScrollL = 0;

        // ── Indicators ──
        function buildIndicators() {
            const items  = scroller.querySelectorAll('.scroll-item');
            const count  = Math.ceil(items.length / 3);
            indicatorsWrapper.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('div');
                dot.classList.add('indicator');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    scroller.scrollTo({ left: i * SCROLL_AMT * 3, behavior: 'smooth' });
                });
                indicatorsWrapper.appendChild(dot);
            }
        }

        function updateIndicators() {
            const active = Math.round(scroller.scrollLeft / (SCROLL_AMT * 3));
            indicatorsWrapper.querySelectorAll('.indicator').forEach((dot, i) => {
                dot.classList.toggle('active', i === active);
            });
        }

        function updateButtons() {
            const atStart = scroller.scrollLeft <= 0;
            const atEnd   = scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1;

            scrollLeftBtn.style.opacity      = atStart ? '0.5' : '1';
            scrollLeftBtn.style.pointerEvents = atStart ? 'none' : 'auto';
            scrollRightBtn.style.opacity      = atEnd   ? '0.5' : '1';
            scrollRightBtn.style.pointerEvents = atEnd   ? 'none' : 'auto';
        }

        // ── Buttons ──
        scrollLeftBtn.addEventListener('click',  e => { e.preventDefault(); scroller.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' }); });
        scrollRightBtn.addEventListener('click', e => { e.preventDefault(); scroller.scrollBy({ left:  SCROLL_AMT, behavior: 'smooth' }); });

        // ── Mouse-drag scroll ──
        scroller.addEventListener('mousedown', e => {
            isDragging = true;
            scroller.classList.add('dragging');
            scroller.style.cursor = 'grabbing';
            startX       = e.pageX - scroller.offsetLeft;
            savedScrollL = scroller.scrollLeft;
            e.preventDefault();
        });

        function endDrag() {
            isDragging = false;
            scroller.classList.remove('dragging');
            scroller.style.cursor = 'grab';
        }
        scroller.addEventListener('mouseleave', endDrag);
        scroller.addEventListener('mouseup',    endDrag);

        scroller.addEventListener('mousemove', e => {
            if (!isDragging) return;
            e.preventDefault();
            scroller.scrollLeft = savedScrollL - ((e.pageX - scroller.offsetLeft) - startX) * 2;
        });

        // ── Touch scroll ──
        let touchStart = 0, touchSavedL = 0;
        scroller.addEventListener('touchstart', e => {
            touchStart  = e.touches[0].pageX;
            touchSavedL = scroller.scrollLeft;
        }, { passive: true });
        scroller.addEventListener('touchmove', e => {
            scroller.scrollLeft = touchSavedL + (touchStart - e.touches[0].pageX) * 1.5;
        }, { passive: true });

        // ── Scroll event → update UI ──
        scroller.addEventListener('scroll', () => { updateIndicators(); updateButtons(); });

        // ── Keyboard (only when lightbox is NOT open) ──
        document.addEventListener('keydown', e => {
            const lb = document.getElementById('lightbox');
            if (lb && (lb.classList.contains('active') || lb.style.display === 'block')) return;  // let lightbox handle arrows
            if (e.key === 'ArrowLeft')  scroller.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' });
            if (e.key === 'ArrowRight') scroller.scrollBy({ left:  SCROLL_AMT, behavior: 'smooth' });
        });

        // ── Init ──
        buildIndicators();
        updateButtons();
        scroller.style.cursor = 'grab';
        console.log('Image scroller initialized.');
    }

    // ──────────────────────────────────────────
    // BOOT — wire everything up
    // ──────────────────────────────────────────
    onReady(function () {
        initMobileMenu();
        initMobileSubmenus();
        initMegamenu();
        initZonePanels();
        initSmoothScroll();
        initStickyHeader();
        initScrollReveal();
        initNewsletter();
        initInFocusSlideshow();
        initNewsSlider();
        initHeroBanner();
        initGallerySlider();
        initLightbox();
        initLazyLoad();
        initGalleryStagger();
        initNoContextMenu();
        initAutoScroller();
        initImageScroller();

        console.log('NUJ India website loaded successfully.');
    });

})();
/* ============================================
   HORIZONTAL GALLERY NAVIGATION JAVASCRIPT
   ADD THIS TO YOUR script.js FILE (at the end)
   ============================================ */

// Media Gallery Horizontal Scroll Navigation
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.gallery-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.gallery-nav-btn.next-btn');
    const scrollContainer = document.querySelector('.video-scroll-container');
    
    if (prevBtn && nextBtn && scrollContainer) {
        // Scroll amount (width of one video item + gap)
        const scrollAmount = () => {
            const videoItem = document.querySelector('.video-item');
            if (videoItem) {
                return videoItem.offsetWidth + 24; // 24px is the gap
            }
            return 300; // fallback
        };
        
        // Previous button click
        prevBtn.addEventListener('click', function() {
            scrollContainer.scrollBy({
                left: -scrollAmount(),
                behavior: 'smooth'
            });
        });
        
        // Next button click
        nextBtn.addEventListener('click', function() {
            scrollContainer.scrollBy({
                left: scrollAmount(),
                behavior: 'smooth'
            });
        });
        
        // Hide/show arrows based on scroll position
        function updateArrows() {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const currentScroll = scrollContainer.scrollLeft;
            
            // Hide prev arrow at start
            if (currentScroll <= 0) {
                prevBtn.style.opacity = '0.3';
                prevBtn.style.cursor = 'default';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
            
            // Hide next arrow at end
            if (currentScroll >= maxScroll - 5) {
                nextBtn.style.opacity = '0.3';
                nextBtn.style.cursor = 'default';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }
        
        // Update arrows on scroll
        scrollContainer.addEventListener('scroll', updateArrows);
        
        // Initial arrow state
        updateArrows();
        
        // Update on window resize
        window.addEventListener('resize', updateArrows);
    }
});