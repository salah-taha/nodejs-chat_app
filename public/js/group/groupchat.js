$(document).ready(function () {
  var socket = io();

  var room = $("#groupName").val();
  var sender = $("#sender").val();

  socket.on("connect", function () {
    console.log("Yea !");

    var params = {
      room: room,
      name: sender,
    };
    socket.emit("join", params, function () {
      console.log("user joind this channel");
    });
  });

  socket.on("usersList", function (users) {
    var ol = $("<ol></ol>");
    users.forEach((user) => {
      ol.append(
        "<p><a id='val' data-toggle='modal' data-target='#myModal'>" +
          user +
          "</a></p>"
      );
    });

    $("#numValue").text("(" + users.length + ")");

    $("#users").html(ol);
  });

  socket.on("newMessage", function (data) {
    var template = $("#message-template").html();
    var message = Mustache.render(template, {
      text: data.text,
      sender: data.from,
    });

    $("#messages").append(message);
  });

  $("#message-form").on("submit", function (e) {
    e.preventDefault();

    var msg = $("#msg").val();

    if (msg !== "") {
      socket.emit(
        "createMessage",
        {
          text: msg,
          room: room,
          sender: sender,
        },
        function () {
          $("#msg").val("");
        }
      );
    }
  });
});
