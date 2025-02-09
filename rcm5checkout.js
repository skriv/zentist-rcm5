$(document).ready(function () {

    // Функция для установки значения в текстовое поле и логирования
    function setValueAndLog(cookieName, elementId, noValueMessage) {
        let cookieValue = Cookies.get(cookieName);
        if (cookieValue) {
            $(elementId).val(cookieValue); // Установка значения в текстовое поле
        } else {
            console.log(noValueMessage);
        }
    }

    // Установка значений для различных полей
    setValueAndLog('org', '#company', "NO ORGANIZATION");
    setValueAndLog('info', '#information', "NO ATTENDEES");
    setValueAndLog('locations', '#locations', "NO LOCATIONS");
    setValueAndLog('preEvent', '#preevent', "NO PRE EVENT");
    setValueAndLog('type', '#type', "NO TYPE");
    setValueAndLog('utm', '#utms', "NO UTMs")
});