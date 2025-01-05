console.log("test");

// Определение функций для каждой страницы
const pageFunctions = {
    home(container) {
      initGeneral(container);
      initHome(container);
    },
    contacts(container) {
      initGeneral(container);
      initContact(container);
    },
  };
  
  // Функция инициализации
  function initializePage() {
    // Ищем элемент с классом main-w и нужными атрибутами
    const mainElement = $('.main-w[data-page][data-container]');
    if (mainElement.length === 0) {
      console.warn("Элемент с классом 'main-w' и атрибутами [data-page][data-container] не найден.");
      return;
    }
  
    const namespace = mainElement.attr('data-page');
    const container = mainElement; // Используем сам элемент как контейнер
  
    // Автоматический вызов функции, если она существует
    pageFunctions[namespace]?.(container);
  }
  
  // Пример функций
  function initGeneral(container) {
    container = container || $(document);
    console.log('Инициализация общих функций');
    $('#year').text(new Date().getFullYear()); //Copyright
  }
  
  function initHome(container) {
    container = container || $(document);
    console.log('Инициализация главной страницы');

  }
  
  function initContact(container) {
    container = container || $(document);
    console.log('Инициализация страницы контактов');
  }

  
  // Запуск после загрузки страницы
  $(document).ready(initializePage);