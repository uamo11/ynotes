/**
 * yNotes — Script Principal
 * Funcionalidad: Tema claro/oscuro, Navegación móvil, Galería interactiva, FAQ y Scroll Reveal
 * 100% Sin dependencias externas ni telemetría
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GESTIÓN DE TEMA (CLARO / OSCURO)
  initTheme();

  // 2. HEADER Y NAVEGACIÓN MÓVIL
  initNavigation();

  // 3. ANIMACIONES DE SCROLL REVEAL
  initScrollReveal();

  // 4. GALERÍA DE CAPTURAS INTERACTIVA
  initGallery();

  // 5. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
  initFAQ();
});

/**
 * Control del Modo Oscuro / Claro con persistencia en localStorage
 * y sincronización con las preferencias del sistema operativo.
 */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const params = new URLSearchParams(window.location.search);
  const urlTheme = params.get('theme');
  const storedTheme = localStorage.getItem('ynotes_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleBtn) {
      const isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      toggleBtn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
  }

  // Determinar tema inicial
  if (urlTheme === 'dark' || urlTheme === 'light') {
    applyTheme(urlTheme);
  } else if (storedTheme === 'dark' || storedTheme === 'light') {
    applyTheme(storedTheme);
  } else {
    applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
  }

  // Escuchar botón de cambio manual
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('ynotes_theme', newTheme);
    });
  }

  // Escuchar cambios del sistema en tiempo real si el usuario no tiene preferencia fija
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('ynotes_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Control del header con blur al hacer scroll y menú móvil responsive
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  // Efecto scrolled en header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Menú hamburguesa móvil
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Cerrar menú al hacer clic en cualquier enlace
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Animaciones suaves al hacer scroll mediante IntersectionObserver
 */
function initScrollReveal() {
  document.documentElement.classList.add('js-loaded');
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para navegadores antiguos
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * Galería interactiva con información detallada de cada pantalla
 */
const galleryScreens = [
  {
    id: 'dashboard',
    title: 'Pantalla Principal Limpia y Elegante',
    subtitle: 'Tus notas organizadas con máxima legibilidad y acceso veloz.',
    src: 'assets/screenshots/ynotes-main-dashboard.webp',
    alt: 'Pantalla principal de yNotes con notas guardadas, buscador y botón de nueva nota',
    bullets: [
      'Saludo dinámico según la hora del día y contador de notas guardadas.',
      'Buscador instantáneo por título, contenido o palabra clave con filtros avanzados.',
      'Tarjetas con distribución inteligente tipo masonry y soporte de previsualización oculta.',
      'Botón flotante con degradado suave para redactar una nueva nota al instante.'
    ]
  },
  {
    id: 'editor',
    title: 'Editor Markdown con Formato en Tiempo Real',
    subtitle: 'Escribe sin restricciones y dale estructura a tus ideas en segundos.',
    src: 'assets/screenshots/ynotes-markdown-editor.webp',
    alt: 'Editor de notas con formato Markdown, barra de herramientas y contador de palabras',
    bullets: [
      'Barra inferior de herramientas rápidas: Negrita, Cursiva, Encabezados (H1, H2, H3), Citas y Código.',
      'Soporte completo de sintaxis Markdown estándar y listas de tareas con casillas de verificación.',
      'Contador de palabras y caracteres en tiempo real para un control preciso de tus textos.',
      'Guardado automático instantáneo y opción de anclar notas importantes en la parte superior.'
    ]
  },
  {
    id: 'vault',
    title: 'Bóveda Segura con Cifrado AES-256-GCM',
    subtitle: 'El rincón impenetrable para tus notas más íntimas y secretos.',
    src: 'assets/screenshots/ynotes-secure-vault.webp',
    alt: 'Bóveda Segura de yNotes con cifrado AES-256-GCM y aplicaciones ocultas',
    bullets: [
      'Cifrado simétrico AES-256-GCM de alta seguridad con protección activa contra volcado de memoria.',
      'Sección de "Aplicaciones Ocultas" para camuflar accesos a apps confidenciales.',
      'Distinción visual con identificador de clave criptográfica y botón dedicado "Nuevo Secreto".',
      'Aislamiento total: nada de lo que entra en la bóveda sale sin tu permiso.'
    ]
  },
  {
    id: 'options',
    title: 'Personalización Completa y Modo Enfoque',
    subtitle: 'Adapta cada nota a su contexto y concéntrate sin distracciones.',
    src: 'assets/screenshots/ynotes-note-options.webp',
    alt: 'Hoja de opciones de nota en yNotes con selector de color, modo enfoque y widgets',
    bullets: [
      'Paleta de colores distintivos por nota para clasificar visualmente tus proyectos.',
      'Modo Enfoque a pantalla completa: oculta barras e interfaces para escribir en calma total.',
      'Ocultar previsualización: protege el texto de miradas indiscretas en la lista general.',
      'Fijar en Widget de pantalla de inicio para tener notas esenciales siempre a mano.'
    ]
  },
  {
    id: 'settings',
    title: 'Ajustes de Zona Segura y Estilos de Interfaz',
    subtitle: 'Control total de la privacidad, sensaciones y apariencia del sistema.',
    src: 'assets/screenshots/ynotes-settings-security.webp',
    alt: 'Ajustes de Zona Segura con selección de temas visuales, huella dactilar y camuflaje',
    bullets: [
      'Estilos de interfaz intercambiables: Material You Modern (por defecto), Google y Samsung.',
      'Feedback sonoro sutil al interactuar, borrar o acceder a la zona protegida.',
      'Bloqueo biométrico por huella dactilar respaldado por el hardware de Android.',
      'Accesos directos con camuflaje de app (App Hiding) para desviar miradas curiosas.'
    ]
  }
];

function initGallery() {
  const tabsContainer = document.getElementById('galleryTabs');
  const showcaseImg = document.getElementById('galleryImg');
  const showcaseTitle = document.getElementById('galleryTitle');
  const showcaseSub = document.getElementById('gallerySub');
  const showcaseBullets = document.getElementById('galleryBullets');
  const thumbsContainer = document.getElementById('galleryThumbs');

  if (!tabsContainer || !showcaseImg) return;

  function setScreen(index) {
    const screen = galleryScreens[index];
    if (!screen) return;

    // Actualizar tabs activas
    tabsContainer.querySelectorAll('.gallery-tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', (i === index).toString());
    });

    // Actualizar miniaturas activas
    if (thumbsContainer) {
      thumbsContainer.querySelectorAll('.thumb-card').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
      });
    }

    // Efecto suave de transición
    showcaseImg.style.opacity = '0.3';
    showcaseImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      showcaseImg.src = screen.src;
      showcaseImg.alt = screen.alt;
      showcaseTitle.textContent = screen.title;
      showcaseSub.textContent = screen.subtitle;

      // Renderizar viñetas
      showcaseBullets.innerHTML = screen.bullets.map(b => `
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${b}</span>
        </li>
      `).join('');

      showcaseImg.style.opacity = '1';
      showcaseImg.style.transform = 'scale(1)';
    }, 140);
  }

  // Eventos en botones de tabs
  tabsContainer.querySelectorAll('.gallery-tab-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => setScreen(idx));
  });

  // Eventos en miniaturas inferiores
  if (thumbsContainer) {
    thumbsContainer.querySelectorAll('.thumb-card').forEach((thumb, idx) => {
      thumb.addEventListener('click', () => setScreen(idx));
    });
  }

  // Inicializar en la primera pantalla
  setScreen(0);
}

/**
 * Acordeón accesible para preguntas frecuentes
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cerrar otros si se desea comportamiento exclusivo
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar estado actual
      item.classList.toggle('open', !isOpen);
      questionBtn.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });
}
