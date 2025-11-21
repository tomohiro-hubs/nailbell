document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toTopButton = document.querySelector('.to-top');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    const yearSpan = document.getElementById('year');

    // Set current year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile navigation toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Back to top button visibility
    const toggleToTopButton = () => {
        if (!toTopButton) return;
        if (window.scrollY > 400) {
            toTopButton.classList.add('show');
        } else {
            toTopButton.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggleToTopButton);
    toggleToTopButton();

    if (toTopButton) {
        toTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // FAQ accordion
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!button || !answer) return;

        button.addEventListener('click', () => {
            const isActive = item.getAttribute('aria-expanded') === 'true';

            // Close all other items for accessibility
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.setAttribute('aria-expanded', 'false');
                    const otherButton = otherItem.querySelector('.faq-question');
                    otherButton?.setAttribute('aria-expanded', 'false');
                }
            });

            item.setAttribute('aria-expanded', String(!isActive));
            button.setAttribute('aria-expanded', String(!isActive));
        });
    });

    // Contact form validation (front-end only demonstration)
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            let isValid = true;

            const requiredFields = ['name', 'email', 'agree'];
            requiredFields.forEach(fieldName => {
                const field = contactForm.querySelector(`[name="${fieldName}"]`);
                const errorElement = contactForm.querySelector(`[data-error-for="${fieldName}"]`);
                if (!field || !errorElement) return;

                let errorMessage = '';

                if (fieldName === 'agree') {
                    if (!(field instanceof HTMLInputElement && field.checked)) {
                        isValid = false;
                        errorMessage = 'プライバシーポリシーへの同意が必要です。';
                    }
                } else if (!formData.get(fieldName)?.toString().trim()) {
                    isValid = false;
                    errorMessage = '必須項目です。';
                } else if (fieldName === 'email') {
                    const emailValue = formData.get('email');
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailValue && !emailPattern.test(emailValue.toString())) {
                        isValid = false;
                        errorMessage = 'メールアドレスの形式が正しくありません。';
                    }
                }

                errorElement.textContent = errorMessage;
            });

            const successMessage = contactForm.querySelector('.form-success');
            if (!isValid) {
                successMessage && (successMessage.textContent = '入力内容をご確認ください。');
                return;
            }

            successMessage && (successMessage.textContent = '送信が完了しました。折り返しのご連絡までお待ちください。');
            contactForm.reset();

            // Reset checkbox styling after reset
            const agreeError = contactForm.querySelector('[data-error-for="agree"]');
            if (agreeError) agreeError.textContent = '';
        });
    }

    // Newsletter demo submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', event => {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[name="newsletter-email"]');
            if (!emailInput) return;

            const emailValue = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                emailInput.classList.add('is-invalid');
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.setAttribute('aria-describedby', 'newsletter-error');
                let errorElement = newsletterForm.querySelector('#newsletter-error');
                if (!errorElement) {
                    errorElement = document.createElement('p');
                    errorElement.id = 'newsletter-error';
                    errorElement.style.fontSize = '0.85rem';
                    errorElement.style.color = '#ffd1dc';
                    errorElement.style.marginTop = '6px';
                    newsletterForm.appendChild(errorElement);
                }
                errorElement.textContent = 'メールアドレスの形式をご確認ください。';
                return;
            }

            emailInput.classList.remove('is-invalid');
            emailInput.removeAttribute('aria-invalid');
            emailInput.removeAttribute('aria-describedby');
            const errorElement = newsletterForm.querySelector('#newsletter-error');
            if (errorElement) {
                errorElement.textContent = '';
            }

            emailInput.value = '';
            const confirmation = document.createElement('p');
            confirmation.textContent = 'ご登録ありがとうございました。最新情報をお届けします。';
            confirmation.style.fontSize = '0.85rem';
            confirmation.style.color = '#fff';
            confirmation.style.marginTop = '6px';
            newsletterForm.appendChild(confirmation);

            setTimeout(() => {
                confirmation.remove();
            }, 4000);
        });
    }
});
