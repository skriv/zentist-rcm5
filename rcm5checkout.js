$(document).ready(function () {

    var cookieValue = Cookies.get('myCookie'); // Чтение значения cookie
    
    if (cookieValue) {
        $('#company').val(cookieValue); // Установка значения в текстовое поле
    }else{
        console.log("tttt")
    }

});