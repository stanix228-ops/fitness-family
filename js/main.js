/**
 * FITNESS FAMILY Петропавловск и СКО - Интерактивная логика сайта
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHorizontalCoachesCarousel();
  initGallerySlider();
  initBmiCalculator();
  initModalsAndForms();
});

/* ----------------------------------------------------
 * 1. Шапка и мобильное меню
 * ---------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Фиксация шапки при скролле
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-[#080808]/95', 'backdrop-blur-md', 'border-b', 'border-[#222222]', 'py-2');
    } else {
      header.classList.remove('py-2');
    }
  });

  // Мобильное меню (100% непрозрачное)
  if (mobileToggle && mobileMenu) {
    const icon = mobileToggle.querySelector('i');

    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    };

    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.closeMobileMenu = closeMenu;
  }
}

/* ----------------------------------------------------
 * 2. Фотогалерея залов Fitness Family (Слайдер + Свайпы)
 * ---------------------------------------------------- */
function initGallerySlider() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');

  if (!track) return;

  const getScrollStep = () => {
    const card = track.querySelector('.gallery-card');
    return card ? card.offsetWidth + 20 : 340;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
  }

  // Мышиное перетаскивание на десктопе
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('active');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('active');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* ----------------------------------------------------
 * 2.1. Горизонтальная анимированная карусель тренеров (14 тренеров сети)
 * ---------------------------------------------------- */
function initHorizontalCoachesCarousel() {
  const viewport = document.getElementById('h-carousel-viewport');
  const track = document.getElementById('h-carousel-track');
  const prevBtn = document.getElementById('h-carousel-prev');
  const nextBtn = document.getElementById('h-carousel-next');
  const playPauseBtn = document.getElementById('h-carousel-playpause');
  const playPauseIcon = document.getElementById('h-playpause-icon');
  const filterBtns = document.querySelectorAll('.h-filter-btn');

  if (!viewport || !track) return;

  // Отрисовка карточек из базы данных
  const renderCoaches = (filter = 'all') => {
    const list = window.FITNESS_COACHES || (typeof FITNESS_COACHES !== 'undefined' ? FITNESS_COACHES : null);
    if (!list || !Array.isArray(list)) return;

    const filtered = filter === 'all'
      ? list
      : list.filter(c => c.directionTag === filter);

    track.innerHTML = filtered.map(coach => `
      <div class="h-coach-card group" data-id="${coach.id}" data-tag="${coach.directionTag}">
        <!-- Портретное фото тренера (без надписей на самом фото) -->
        <div class="coach-img-wrapper">
          <img src="${coach.image}" alt="${coach.name} — тренер сети Fitness Family" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-85 group-hover:opacity-30 transition-opacity duration-300"></div>
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/90 border border-[#333333] text-accent font-oswald text-[11px] font-bold tracking-wider uppercase shadow-md">
            ${coach.badge || coach.direction}
          </span>
        </div>

        <!-- Информация о тренере в HTML-разметке сайта -->
        <div class="coach-info flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] uppercase tracking-wider font-oswald font-bold text-accent mb-1">
              ${coach.direction}
            </div>
            <h3 class="font-oswald font-bold text-xl sm:text-2xl text-white group-hover:text-accent transition-colors leading-tight mb-2">
              ${coach.name}
            </h3>
            <p class="text-xs text-neutral-300 font-montserrat leading-relaxed mb-3">
              ${coach.description}
            </p>
          </div>

          <div>
            <!-- Локация филиалов -->
            <div class="flex items-start gap-2 text-[11px] text-neutral-400 font-montserrat mb-4 pt-3 border-t border-[#1F1F1F]">
              <i class="fa-solid fa-location-dot text-accent text-xs mt-0.5 shrink-0"></i>
              <span class="leading-tight">${coach.branches}</span>
            </div>

            <!-- Кнопка перехода в Instagram профиль тренера -->
            <a href="https://www.instagram.com/${coach.instagram}/" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-coach-insta mb-2">
              <i class="fa-brands fa-instagram text-base"></i>
              <span>ЗАПИСАТЬСЯ В INSTAGRAM</span>
            </a>

            <!-- Кнопка быстрой записи через клуб -->
            <button onclick="openBookingModal('Тренер: ${coach.name}', 'Запись на тренировку к тренеру: ${coach.name} (${coach.direction})')"
              class="w-full py-2 rounded bg-transparent hover:bg-white/5 border border-[#262626] hover:border-neutral-500 text-[11px] font-oswald tracking-wider uppercase text-neutral-400 hover:text-white transition-all">
              ИЛИ ЗАПИСАТЬСЯ ЧЕРЕЗ САЙТ
            </button>
          </div>
        </div>
      </div>
    `).join('');
  };

  // Первоначальный рендер всех 14 тренеров
  renderCoaches('all');

  // Расчет шага скролла (ширина карточки + отступ)
  const getScrollStep = () => {
    const card = track.querySelector('.h-coach-card');
    return card ? card.offsetWidth + 24 : 344;
  };

  // Автопрокрутка
  let autoScrollTimer = null;
  let isAutoScrollPaused = false;
  let isHovered = false;
  let isInteracting = false;
  let resumeTimeout = null;

  const pauseTemporarily = (ms = 4500) => {
    isInteracting = true;
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isInteracting = false;
    }, ms);
  };

  const doAutoScrollStep = () => {
    if (isAutoScrollPaused || isHovered || isInteracting) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    if (maxScroll <= 5) return;

    const step = getScrollStep();
    if (viewport.scrollLeft >= maxScroll - 20) {
      // Плавно возвращаемся в начало карусели
      viewport.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      viewport.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const startAutoScroll = () => {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(doAutoScrollStep, 3200);
  };

  // Запуск автопрокрутки
  startAutoScroll();

  // Остановка при наведении курсора мыши (чтобы пользователь мог спокойно прочитать и нажать кнопку)
  viewport.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  viewport.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Кнопка Пауза / Плей
  if (playPauseBtn && playPauseIcon) {
    playPauseBtn.addEventListener('click', () => {
      isAutoScrollPaused = !isAutoScrollPaused;
      if (isAutoScrollPaused) {
        playPauseIcon.className = 'fa-solid fa-play text-sm text-neutral-400';
        playPauseBtn.setAttribute('title', 'Включить автопрокрутку');
      } else {
        playPauseIcon.className = 'fa-solid fa-pause text-sm text-accent';
        playPauseBtn.setAttribute('title', 'Приостановить автопрокрутку');
      }
    });
  }

  // Ручная прокрутка кнопками Влево / Вправо
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseTemporarily(6000);
      const step = getScrollStep();
      if (viewport.scrollLeft <= 10) {
        viewport.scrollTo({ left: viewport.scrollWidth - viewport.clientWidth, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseTemporarily(6000);
      const step = getScrollStep();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= maxScroll - 10) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: step, behavior: 'smooth' });
      }
    });
  }

  // Ручное перетаскивание мышью на десктопе
  let isMouseDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasMoved = false;

  viewport.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    hasMoved = false;
    startX = e.pageX - viewport.offsetLeft;
    scrollStart = viewport.scrollLeft;
    pauseTemporarily(6000);
  });

  window.addEventListener('mouseup', () => {
    if (isMouseDown) {
      isMouseDown = false;
      pauseTemporarily(3500);
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) hasMoved = true;
    viewport.scrollLeft = scrollStart - walk;
  });

  // Защита от случайного клика по карточке при свайпе мышью
  viewport.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Ручной свайп пальцем на мобильных устройствах
  viewport.addEventListener('touchstart', () => {
    pauseTemporarily(7000);
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    pauseTemporarily(4000);
  }, { passive: true });

  // Фильтрация по направлениям
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderCoaches(filter);
      viewport.scrollTo({ left: 0, behavior: 'smooth' });
      pauseTemporarily(5000);
    });
  });
}

/* ----------------------------------------------------
 * 3. Интерактивный калькулятор ИМТ
 * ---------------------------------------------------- */
function initBmiCalculator() {
  const form = document.getElementById('bmi-form');
  const resultBox = document.getElementById('bmi-result-box');
  const bmiValueElem = document.getElementById('bmi-value');
  const bmiStatusElem = document.getElementById('bmi-status');
  const bmiAdviceElem = document.getElementById('bmi-advice');
  const bmiBookBtn = document.getElementById('bmi-book-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    const goalSelect = document.getElementById('bmi-goal');

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const goal = goalSelect ? goalSelect.value : 'tone';

    if (!height || !weight || height < 80 || height > 260 || weight < 25 || weight > 350) {
      showToast('Пожалуйста, введите корректный рост (см) и вес (кг)', 'error');
      return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Сброс подсветки строк таблицы
    document.querySelectorAll('.bmi-range-row').forEach(row => {
      row.classList.remove('bg-accent/20', 'border-accent', 'shadow-lg');
      row.classList.add('bg-[#151515]', 'border-transparent');
    });

    let status = '';
    let advice = '';
    let activeRowId = '';

    if (bmi < 18.5) {
      status = 'Дефицит массы';
      activeRowId = 'bmi-row-1';
      advice = 'Ваш ИМТ ниже нормы. Рекомендуем программу силового набора массы в тренажерном зале, упражнения со свободными весами и протеиновые коктейли в нашем Кафе правильного питания.';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      status = 'Нормальный баланс';
      activeRowId = 'bmi-row-2';
      advice = 'Превосходный здоровый баланс! Вам отлично подойдут Bungee Fitness, функциональный тренинг, Cycle Studio и поддержка тонуса в залах Fitness Family.';
    } else if (bmi >= 25 && bmi < 29.9) {
      status = 'Избыточный вес';
      activeRowId = 'bmi-row-3';
      advice = 'ИМТ находится в зоне избыточного веса. Рекомендуем высокоинтенсивные заезды в Cycle Studio, круговые тренировки Tabata и сеансы лимфодренажного массажа для ускоренного жиросжигания.';
    } else {
      status = 'Высокий индекс';
      activeRowId = 'bmi-row-4';
      advice = 'Высокий показатель ИМТ. Рекомендуем щадящие для суставов тренировки Bungee Fitness, плавание, стретчинг, консультацию тренера и сбалансированное меню в кафе Fitness Family.';
    }

    // Подсветка активной строки
    const activeRow = document.getElementById(activeRowId);
    if (activeRow) {
      activeRow.classList.remove('bg-[#151515]', 'border-transparent');
      activeRow.classList.add('bg-accent/20', 'border-accent', 'shadow-lg');
    }

    if (bmiValueElem) bmiValueElem.innerText = bmi;
    if (bmiStatusElem) bmiStatusElem.innerText = status;
    if (bmiAdviceElem) bmiAdviceElem.innerText = advice;

    if (bmiBookBtn) {
      bmiBookBtn.onclick = () => {
        openBookingModal(
          `Программа под ИМТ ${bmi} (${status})`,
          `Запись на пробную тренировку со скидкой 50% в Fitness Family`
        );
      };
    }

    if (resultBox) {
      resultBox.classList.remove('hidden');
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast(`ИМТ рассчитан: ${bmi} (${status})`, 'success');
  });
}

/* ----------------------------------------------------
 * 4. Модальные окна и формы заявки
 * ---------------------------------------------------- */
function initModalsAndForms() {
  const modal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal-booking-form');
  const leadForm = document.getElementById('main-lead-form');

  // Глобальная функция открытия модального окна
  window.openBookingModal = function(title = 'Запись на тренировку в Fitness Family', sub = 'Выберите филиал и оставьте контактный номер со скидкой 50%', extra = '') {
    if (!modal) return;
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-subtitle').innerText = sub;
    const inputExtra = document.getElementById('modal-extra-field');
    if (inputExtra) inputExtra.value = extra;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeBookingModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  // Отправка модальной формы
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name').value;
      const phone = document.getElementById('modal-phone').value;
      const branchSelect = document.getElementById('modal-branch');
      const branchText = branchSelect ? branchSelect.options[branchSelect.selectedIndex].text : '';

      if (!name || !phone) {
        showToast('Пожалуйста, заполните имя и телефон', 'error');
        return;
      }

      showToast(`Спасибо, ${name}! Ваша заявка в Fitness Family принята. Менеджер филиала (${branchText.split('(')[0].trim()}) свяжется с вами в WhatsApp.`, 'success');
      modalForm.reset();
      closeBookingModal();
    });
  }

  // Главная форма заявки на странице
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value;
      const phone = document.getElementById('lead-phone').value;
      const branchSelect = document.getElementById('lead-branch');
      const branchText = branchSelect ? branchSelect.options[branchSelect.selectedIndex].text : '';

      if (!name || !phone) {
        showToast('Пожалуйста, заполните контактные данные', 'error');
        return;
      }

      showToast(`Заявка принята, ${name}! Ждем вас со скидкой 50% в Fitness Family (${branchText.split('(')[0].trim()}).`, 'success');
      leadForm.reset();
    });
  }
}

/* ----------------------------------------------------
 * 5. Всплывающие уведомления (Toast Alerts)
 * ---------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const isError = type === 'error';

  toast.className = `pointer-events-auto p-4 rounded shadow-2xl border backdrop-blur-xl animate-toast flex items-start gap-3 text-xs font-montserrat font-medium ${
    isSuccess
      ? 'bg-black/95 border-accent text-white'
      : isError
      ? 'bg-black/95 border-red-500 text-white'
      : 'bg-black/95 border-[#333333] text-white'
  }`;

  const icon = isSuccess ? '⚡' : isError ? '⚠️' : 'ℹ️';

  toast.innerHTML = `
    <span class="text-base text-accent">${icon}</span>
    <div class="flex-1">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-neutral-400 hover:text-white">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}
