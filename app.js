document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', mainNav.classList.contains('active') ? 'x' : 'menu');
                lucide.createIcons();
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 3. Scroll Header & Floating CTA & Active Nav
    const header = document.querySelector('.main-header');
    const floatingCta = document.getElementById('floating-cta');
    const heroSection = document.getElementById('home');
    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }

    function handleScroll(scrollY) {
        // Header shadow
        if (header) {
            header.style.boxShadow = scrollY > 60 ? '0 4px 24px rgba(0,0,0,0.06)' : 'none';
        }

        // Floating CTA
        if (floatingCta && heroSection) {
            const heroHeight = heroSection.offsetHeight;
            floatingCta.classList.toggle('visible', scrollY > heroHeight - 120);
        }

        // Active nav link
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(faq => faq.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // 5. Testimonial Carousel
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    }

    window.goToSlide = function(index) {
        showSlide(index);
        resetInterval();
    };

    function startInterval() { slideInterval = setInterval(nextSlide, 5000); }
    function resetInterval() { clearInterval(slideInterval); startInterval(); }
    if (slides.length > 0) startInterval();

    // 6. Appointment Booking
    const bookingForm = document.getElementById('clinic-booking-form');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const dateInput = document.getElementById('consult-date');

    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => successModal.classList.remove('active'));
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) successModal.classList.remove('active');
        });
    }

    let currentFormattedMessage = '';

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patient-name').value.trim();
            const phone = document.getElementById('patient-phone').value.trim();
            const service = document.getElementById('consult-service').value;
            const date = document.getElementById('consult-date').value;
            const time = document.getElementById('consult-time').value;
            const symptoms = document.getElementById('patient-symptoms').value.trim();

            if (!name || !phone || !service || !date || !time) {
                alert('Please fill in all required fields.');
                return;
            }

            const chosenDate = new Date(date);
            const isSunday = chosenDate.getDay() === 0;
            const bookingId = 'AW-' + Math.floor(10000 + Math.random() * 90000);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDateStr = chosenDate.toLocaleDateString('en-IN', options);

            document.getElementById('ticket-id').textContent = bookingId;
            document.getElementById('ticket-name').textContent = name;
            document.getElementById('ticket-service').textContent = service;
            document.getElementById('ticket-datetime').textContent = `${formattedDateStr} (${time})`;

            const ticketStatus = successModal.querySelector('.ticket-status');
            if (isSunday) {
                ticketStatus.textContent = 'Tentative (Sunday)';
                ticketStatus.style.backgroundColor = '#fef3c7';
                ticketStatus.style.color = '#b45309';
            } else {
                ticketStatus.textContent = 'Awaiting Confirmation';
                ticketStatus.style.backgroundColor = '#eff6ff';
                ticketStatus.style.color = '#2563eb';
            }

            currentFormattedMessage = `Hello Dr. Barun Sharma, I'd like to consult for an appointment.\n\n` +
                `*Booking ID:* ${bookingId}\n` +
                `*Patient Name:* ${name}\n` +
                `*Mobile Number:* ${phone}\n` +
                `*Service Needed:* ${service}\n` +
                `*Preferred Date:* ${formattedDateStr}${isSunday ? ' (Tentative Sunday)' : ''}\n` +
                `*Preferred Slot:* ${time}\n` +
                `*Symptoms/Notes:* ${symptoms ? symptoms : 'None specified'}\n\n` +
                `Please verify and confirm my slot. Thank you!`;

            successModal.classList.add('active');

            const whatsappModalBtn = document.getElementById('modal-proceed-whatsapp');
            if (whatsappModalBtn) {
                whatsappModalBtn.onclick = () => openWhatsAppMessage(currentFormattedMessage);
            }

            openWhatsAppMessage(currentFormattedMessage);
            bookingForm.reset();
        });
    }

    function openWhatsAppMessage(message) {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919650729533?text=${encodedMessage}`, '_blank');
    }

    window.printTicket = function() {
        const ticketContent = document.getElementById('appointment-ticket').outerHTML;
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Appointment Receipt</title>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Outfit', sans-serif; padding: 40px; display: flex; justify-content: center; align-items: center; background: #f8fafc; color: #0f172a; }
                    .appointment-ticket { background: #fff; border: 2px dashed #cbd5e1; border-radius: 8px; width: 100%; max-width: 460px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                    .ticket-header { background: #f1f5f9; padding: 12px 18px; border-bottom: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; }
                    .ticket-header h4 { margin: 0; font-size: 0.85rem; text-transform: uppercase; font-weight: 700; }
                    .ticket-status { font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: #eff6ff; color: #2563eb; }
                    .ticket-body { padding: 18px; }
                    .ticket-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; }
                    .t-label { color: #64748b; }
                    .t-val { font-weight: 600; }
                    .ticket-footer { padding: 12px 18px; background: #f1f5f9; border-top: 1px solid #cbd5e1; font-size: 0.75rem; color: #64748b; text-align: center; }
                </style>
            </head>
            <body>
                ${ticketContent}
                <script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // 7. Symptom Guide
    let selectedSymptomData = null;

    window.selectSymptom = function(symptomKey, serviceTitle, description) {
        document.querySelectorAll('.symptom-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-symptom') === symptomKey) btn.classList.add('active');
        });

        const resultPanel = document.getElementById('symptom-result');
        const urgencyBadge = document.getElementById('result-urgency');
        const serviceTitleEl = document.getElementById('result-service-title');
        const descriptionEl = document.getElementById('result-description');

        serviceTitleEl.textContent = `${serviceTitle} Consultation`;
        descriptionEl.textContent = description;

        if (symptomKey === 'dental') {
            urgencyBadge.textContent = 'Dental Panel Care';
            urgencyBadge.style.backgroundColor = '#e0f2fe';
            urgencyBadge.style.color = '#0369a1';
        } else if (symptomKey === 'fever' || symptomKey === 'cough') {
            urgencyBadge.textContent = 'Acute Evaluation';
            urgencyBadge.style.backgroundColor = '#ffe4e6';
            urgencyBadge.style.color = '#9f1239';
        } else if (symptomKey === 'bp' || symptomKey === 'sugar') {
            urgencyBadge.textContent = 'Chronic Disease Care';
            urgencyBadge.style.backgroundColor = '#fef3c7';
            urgencyBadge.style.color = '#92400e';
        } else {
            urgencyBadge.textContent = 'Standard Care';
            urgencyBadge.style.backgroundColor = '#d1fae5';
            urgencyBadge.style.color = '#065f46';
        }

        resultPanel.classList.remove('hidden');
        selectedSymptomData = { service: serviceTitle, symptom: symptomKey };
    };

    window.applySymptomToBooking = function() {
        if (!selectedSymptomData) return;
        const serviceSelect = document.getElementById('consult-service');
        const symptomsTextarea = document.getElementById('patient-symptoms');
        if (serviceSelect) serviceSelect.value = selectedSymptomData.service;
        if (symptomsTextarea) {
            symptomsTextarea.value = `Patient feeling general symptoms related to ${selectedSymptomData.service}.`;
        }
        const bookingSection = document.getElementById('booking');
        if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
    };

    window.prefillSymptom = function(serviceVal) {
        const serviceSelect = document.getElementById('consult-service');
        if (serviceSelect) serviceSelect.value = serviceVal;
    };

    // ═══════════════════════════════════════════════════
    // 8. PREMIUM SCROLL REVEAL — Multi-variant animations
    // ═══════════════════════════════════════════════════
    const revealVariants = {
        'reveal-element': { selector: '.trust-card, .service-card, .form-card, .symptom-widget, .faq-item, .contact-info-card, .gallery-item, .review-slide' },
        'reveal-blur': { selector: '.about-image-side, .about-content-side, .booking-info-side, .booking-form-side' },
        'reveal-scale': { selector: '.credential-item, .carousel-wrapper' },
        'reveal-left': { selector: '.faq-left' },
        'reveal-right': { selector: '.faq-right' }
    };

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        Object.entries(revealVariants).forEach(({ selector }) => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(selector);
                revealObserver.observe(el);
            });
        });
    } else {
        // Fallback
        Object.entries(revealVariants).forEach(({ selector }) => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(selector);
                el.classList.add('active');
            });
        });
    }

    // ═══════════════════════════════════════════════════
    // 9. JOURNEY TIMELINE — Scroll-driven animation
    // ═══════════════════════════════════════════════════
    const journeySteps = document.querySelectorAll('.journey-step');
    const journeyLineFill = document.getElementById('journey-line-fill');

    if (journeySteps.length > 0 && 'IntersectionObserver' in window) {
        const journeyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    journeyObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -80px 0px'
        });

        journeySteps.forEach(step => journeyObserver.observe(step));

        // Animate the timeline fill line
        function updateJourneyLine() {
            if (!journeyLineFill) return;
            const revealedSteps = document.querySelectorAll('.journey-step.revealed');
            if (revealedSteps.length > 0) {
                const lastRevealed = revealedSteps[revealedSteps.length - 1];
                const timeline = document.querySelector('.journey-timeline');
                if (timeline) {
                    const timelineRect = timeline.getBoundingClientRect();
                    const stepRect = lastRevealed.getBoundingClientRect();
                    const progress = ((stepRect.top - timelineRect.top + stepRect.height / 2) / timelineRect.height) * 100;
                    journeyLineFill.style.height = Math.min(progress, 100) + '%';
                }
            }
        }

        window.addEventListener('scroll', updateJourneyLine, { passive: true });
        setTimeout(updateJourneyLine, 500);
    }

    // ═══════════════════════════════════════════════════
    // 10. PARALLAX — Background decorations
    // ═══════════════════════════════════════════════════
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    let parallaxTicking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.03;
            const rect = el.parentElement.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const offset = (elementCenter - viewportCenter) * speed;
            el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });

        parallaxTicking = false;
    }

    function onParallaxScroll() {
        if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', onParallaxScroll, { passive: true });
        updateParallax();
    }

    // ═══════════════════════════════════════════════════
    // 11. MOUSE PARALLAX — Hero section depth effect
    // ═══════════════════════════════════════════════════
    const heroSectionEl = document.getElementById('home');
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');

    if (heroSectionEl && heroImageWrapper) {
        heroSectionEl.addEventListener('mousemove', (e) => {
            const rect = heroSectionEl.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const imageCard = heroImageWrapper.querySelector('.image-card');
            if (imageCard) {
                imageCard.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
            }

            const glowRings = heroImageWrapper.querySelectorAll('.glow-ring');
            glowRings.forEach((ring, i) => {
                const factor = (i + 1) * 8;
                ring.style.transform = `translate(calc(-50% + ${x * factor}px), calc(-50% + ${y * factor}px))`;
            });
        });

        heroSectionEl.addEventListener('mouseleave', () => {
            const imageCard = heroImageWrapper.querySelector('.image-card');
            if (imageCard) {
                imageCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
                imageCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { imageCard.style.transition = ''; }, 600);
            }
        });
    }

    // ═══════════════════════════════════════════════════
    // 12. BUTTON RIPPLE EFFECT
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ═══════════════════════════════════════════════════
    // 13. SYMPTOM BUTTON ANIMATION — Enhanced selection
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'symptomPulse 0.4s ease-out';
        });
    });

    const symptomPulseStyle = document.createElement('style');
    symptomPulseStyle.textContent = `
        @keyframes symptomPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(symptomPulseStyle);

    // ═══════════════════════════════════════════════════
    // 14. SMOOTH SECTION SCROLL — Enhanced behavior
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════
    // 15. COUNTER ANIMATION — Hero stats
    // ═══════════════════════════════════════════════════
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const match = text.match(/(\d+)/);
            if (!match) return;

            const target = parseInt(match[1]);
            const suffix = text.replace(match[1], '');
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);

                stat.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counter animation when hero stats are visible
    if ('IntersectionObserver' in window && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statNumbers[0].closest('.hero-stats'));
    }

    // ═══════════════════════════════════════════════════
    // 16. FORM INPUT FOCUS ANIMATIONS
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('.input-with-icon input, .input-with-icon select, .input-with-icon textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.input-with-icon').style.transform = 'scale(1.01)';
            this.closest('.input-with-icon').style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        input.addEventListener('blur', function() {
            this.closest('.input-with-icon').style.transform = 'scale(1)';
        });
    });

    // ═══════════════════════════════════════════════════
    // 17. SERVICE CARD HOVER — Image zoom simulation
    // ═══════════════════════════════════════════════════
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.animation = 'none';
                icon.offsetHeight;
                icon.style.animation = 'iconFloat 0.5s ease-out';
            }
        });
    });

    const iconFloatStyle = document.createElement('style');
    iconFloatStyle.textContent = `
        @keyframes iconFloat {
            0% { transform: scale(1) rotate(0deg); }
            40% { transform: scale(1.15) rotate(-8deg); }
            100% { transform: scale(1.1) rotate(-5deg); }
        }
    `;
    document.head.appendChild(iconFloatStyle);
});
