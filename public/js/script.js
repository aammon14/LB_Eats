$(document).ready(function() {
    console.log('loading up');
    const $userFav = $('#user-favorite');
    const data = $('#res_name').val();
    $userFav.click((e) => {
      e.preventDefault();
      $.ajax({
        url: "/users/profile",
        data: data,
        type: "POST",
        success: function(data) {
        window.location.href = `/users/profile`;
      },
      error: function(xhr, status, error) {},
    });
  });
  })
     