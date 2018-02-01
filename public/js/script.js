$(document).ready(function() {
  console.log("loading up");
  const $userFav = $("#user-favorite");
  const data = { name: $("#res_name").val() };
  //console.log(data);
  $userFav.click(e => {
    e.preventDefault();
    $.ajax({
      url: "/users/profile",
      data: data,
      type: "POST",
      success: function(data) {
        window.location.href = `/users/profile`;
      },
      error: function(xhr, status, error) {}
    });
  });
  const $updateRatingDropDown = $(".update-rating");
  $updateRatingDropDown.submit(e => {
    e.preventDefault();
    var data = {};
    var rating = $(".rating").val();
    console.log("this is rating in ajax call:", rating);
    //e.target.getAttribute("value");
    var id = $(".user_id").val();
    var name = $(`.name`).val();
    //$(".restaurant_name").val();
    console.log(rating, id, name);
    data = { rating: rating, id: id, name: name };
    $.ajax({
      method: "PUT",
      url: "/users/favorites",
      data: data,
      dataType: "json",
      success: function(data) {
        window.location.href = "/users/favorites";
      },
      error: function(xhr, status, error) {}
    });
  });
  const $deleteFavButtons = $(".delete-favorite");
  $deleteFavButtons.click(e => {
    e.preventDefault();
    var data = {};
    var id = $(".user_id").val();
    var name = e.target.getAttribute("value");
    data = { id: id, name: name };
    console.log(data);
    $.ajax({
      url: "/users/favorites",
      data: data,
      type: "DELETE",
      success: function(data) {
        window.location.href = "/users/favorites";
      },
      error: function(xhr, status, error) {}
    });
  });
  $(".dayNum").each(function(el) {
    $.ajax({
      url: `/day`,
      data: {
        dayNum: el
      },
      method: "GET",
      success: function(response) {
        console.log("result:", response);
        $(`#a${el}`).text(response);
      },
      error: function(xhr, status, error) {}
    });
  });
});