const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('section[id]'));
const year = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalStack = document.getElementById('modalStack');
const modalImage = document.getElementById('modalImage');

const LIFTLINK_POST_URL = 'https://liftlink.link';

// year.textContent = new Date().getFullYear();


const setHeaderState = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  mainNav.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: '-42% 0px -50% 0px',
  threshold: 0,
});

sections.forEach((section) => navObserver.observe(section));

const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => {
      entry.target.classList.add('revealed');
    }, delay);

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -70px 0px',
});

revealItems.forEach((item) => revealObserver.observe(item));

const openModal = (modal) => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
};

const closeModal = (modal) => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
};

document.querySelectorAll('.details-btn').forEach((button) => {
  button.addEventListener('click', () => {
    modalTitle.textContent = button.dataset.project;
    modalDescription.textContent = button.dataset.description;
    modalStack.textContent = button.dataset.stack;
    if (modalImage) {
      modalImage.src = button.dataset.image || '';
      modalImage.alt = button.dataset.project || 'Project preview';
    }
    openModal(projectModal);
  });
});

document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal(overlay);
  });
});

document.querySelectorAll('.modal-close').forEach((button) => {
  button.addEventListener('click', () => {
    closeModal(button.closest('.modal-overlay'));
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
});

const buildPayload = (form) => {
  const formData = new FormData(form);
  return {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    projectType: String(formData.get('projectType') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    source: 'metadataflow.com',
    sentAt: new Date().toISOString(),
  };
};

const postToLiftlink = async (payload) => {
  const params = new URLSearchParams(payload);
  const requestUrl = `${LIFTLINK_POST_URL}?${params.toString()}`;

  // Static site: no backend is required here.
  // Parameters are sent in the request URL while keeping the HTTP method as POST.
  await fetch(requestUrl, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
  });
};

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('.submit-btn');
  const payload = buildPayload(contactForm);

  submitButton.disabled = true;
  submitButton.classList.add('loading');

  const startedAt = Date.now();

  try {
    await postToLiftlink(payload);
  } catch (error) {
    console.warn('Request was not confirmed by browser, but the user flow continues:', error);
  } finally {
    const elapsed = Date.now() - startedAt;
    const remainingDelay = Math.max(0, 2300 - elapsed);

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      contactForm.reset();
      openModal(successModal);
    }, remainingDelay);
  }
});

const hero = document.querySelector('.hero');
const codeCard = document.querySelector('.code-card');

window.addEventListener('mousemove', (event) => {
  if (window.innerWidth < 900 || !hero || !codeCard) return;

  const rect = hero.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  codeCard.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
});

window.addEventListener('mouseleave', () => {
  if (!codeCard) return;
  codeCard.style.transform = '';
});
