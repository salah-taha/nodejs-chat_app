$(document).ready(function () {
  var socket = io();

  var room = $("#groupName").val();
  var sender = $("#sender").val();

  socket.on("connect", function () {
    var params = { sender: sender };
    socket.emit("joinRequest", params, function () {
      console.log("joined");
    });
  });

  socket.on("newFriendRequest", function (friend) {
    $("#reload").load(location.href + " #reload");

    $(document).on("click", "#accept_friend", function () {
      var senderId = $("#senderId").val();
      var senderName = $("#senderName").val();

      $.ajax({
        url: "/group/" + room,
        type: "POST",
        data: {
          senderId,
          senderName,
        },
        success: function (e) {
          $(this).parent().eq(1).remove();
        },
      });
      $("#reload").load(location.href + " #reload");
    });

    $(document).on("click", "#cancel_friend", function () {
      var user_id = $("#user_Id").val();

      $.ajax({
        url: "/group/" + room,
        type: "POST",
        data: {
          user_id,
        },
        success: function (e) {
          $(this).parent().eq(1).remove();
        },
      });
      $("#reload").load(location.href + " #reload");
    });
  });

  $("#add_friend").on("submit", function (e) {
    e.preventDefault();

    var receiverName = $("#receiverName").val();

    $.ajax({
      type: "POST",
      url: "/group/" + room,
      data: {
        receiverName: receiverName,
      },
      success: function (response) {
        socket.emit(
          "friendRequest",
          {
            reciver: receiverName,
            sender: sender,
          },
          function () {
            console.log("Request sent");
          }
        );
      },
    });
  });

  $("#accept_friend").on("click", function () {
    var senderId = $("#senderId").val();
    var senderName = $("#senderName").val();

    $.ajax({
      url: "/group/" + room,
      type: "POST",
      data: {
        senderId,
        senderName,
      },
      success: function (e) {
        $(this).parent().eq(1).remove();
      },
    });
    $("#reload").load(location.href + " #reload");
  });

  $("#cancel_friend").on("click", function () {
    var user_id = $("#user_Id").val();

    $.ajax({
      url: "/group/" + room,
      type: "POST",
      data: {
        user_id,
      },
      success: function (e) {
        $(this).parent().eq(1).remove();
      },
    });
    $("#reload").load(location.href + " #reload");
  });
});
