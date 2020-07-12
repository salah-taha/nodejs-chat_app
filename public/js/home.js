$(document).ready(function () {
  $("favourite").on("submit", function (e) {
    e.preventDefault();
    var id = $("#id").val();
    var clubName = $("#club_Name").val();

    $.ajax({
      type: "POST",
      url: "/home",
      data: { id, clubName },
      success: function (response) {},
    });
  });
});
