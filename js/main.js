/**
 * VM GYM Петропавловск (@vmgymkz) - Интерактивная логика сайта
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initTimetable();
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

  // Мобильное меню
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ----------------------------------------------------
 * 2. Анимированные счетчики статистики
 * ---------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const handleScroll = () => {
    if (animated) return;
    const trigger = window.innerHeight * 0.85;

    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top <= trigger) {
        animated = true;
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const increment = target / (duration / 25);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target + (counter.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            counter.innerText = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
          }
        }, 25);
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
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

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const goal = document.getElementById('bmi-goal').value;

    if (!height || !weight || height <= 0 || weight <= 0) {
      showToast('Пожалуйста, введите корректный рост и вес', 'error');
      return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let status = '';
    let advice = '';

    if (bmi < 18.5) {
      status = 'Дефицит массы';
      advice = 'Рекомендуем силовую программу бодибилдинга и профицит калорий с тренером VM GYM для набора мышечной массы.';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      status = 'Нормальный баланс';
      advice = 'Отличная форма! Вам подойдут силовые тренировки, пауэрлифтинг и функциональный тренинг в залах VM GYM.';
    } else if (bmi >= 25 && bmi < 29.9) {
      status = 'Избыточный вес';
      advice = 'Рекомендуем сочетание силовых нагрузок и кардио-сессий в VM GYM для эффективного жиросжигания и рельефа.';
    } else {
      status = 'Высокий индекс массы';
      advice = 'Рекомендуем персональные тренировки с наставником VM GYM и составление индивидуального плана питания.';
    }

    bmiValueElem.innerText = bmi;
    bmiStatusElem.innerText = status;
    bmiAdviceElem.innerText = advice;

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  window.openBookingModal = function(title = 'Запись на тренировку в VM GYM', sub = 'Выберите филиал и оставьте контактный номер', extra = '') {
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

      if (!name || !phone) {
        showToast('Пожалуйста, заполните имя и телефон', 'error');
        return;
      }

      showToast(`Спасибо, ${name}! Заявка в VM GYM принята. Мы свяжемся с вами в WhatsApp в ближайшее время.`, 'success');
      modalForm.reset();
      closeBookingModal();
    });
  }

  // Главная форма заявки
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value;
      const phone = document.getElementById('lead-phone').value;

      if (!name || !phone) {
        showToast('Пожалуйста, заполните контактные данные', 'error');
        return;
      }

      showToast(`Заявка принята, ${name}! Ждем вас на тренировке в VM GYM.`, 'success');
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
      ? 'bg-black/95 border-white text-white'
      : isError
      ? 'bg-black/95 border-red-500 text-white'
      : 'bg-black/95 border-[#333333] text-white'
  }`;

  const icon = isSuccess ? '✅' : isError ? '⚠️' : 'ℹ️';

  toast.innerHTML = `
    <span class="text-base">${icon}</span>
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
