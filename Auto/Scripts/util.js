$(function () {

    // $('#chatBody').hide();
    //$('#loginBlock').show();
    // Ссылка на автоматически-сгенерированный прокси хаба
    var chat = $.connection.chatHub;
    // Объявление функции, которая хаб вызывает при получении сообщений
    chat.client.addMessage = function (name, message) {
        // Добавление сообщений на веб-страницу 
        $('#chatroom').append('<p>' + name
            + ': ' + message + '</p>');
    };

    // Функция, вызываемая при подключении нового пользователя
    chat.client.onConnected = function (id, userName) {

        // установка в скрытых полях имени и id текущего пользователя
        $('#hdId').val(id);
        $('#username').val(userName);

    }

    // Открываем соединение
    $.connection.hub.start().done(function () {

        var flag = false;

        $('#sendmessage').click(function () {
            if (flag == false) {
                var name = $("#username").val();
                var SpeachId = $('#SpeachId').val();
                chat.server.connect(name, SpeachId);
                flag = true;
                $('#header').html('<h3>' + flag.value);
            }
            // Вызываем у хаба метод Send
            chat.server.send($('#username').val(), $('#SpeachId').val(), $('#message').val());
            send();
            $('#message').val('');

        });
    });
});
function send() {
    var message = $("#message").val();
    var SpeachId = $("#SpeachId").val();
    var name = $("#username").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: '{"message":"' + message + '","name":"' + name + '","SpeachId":"' + SpeachId + '"}',
        url: "sendmsg",
        dataType: "json",
    });
}