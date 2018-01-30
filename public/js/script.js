$(document).ready(function() {
    console.log('loading up');
    const $userFav = $('#user-favorite');
    const data = {name: $('#res_name').val()};
    console.log(data);
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

  const $deleteFavButtons = $('.delete-favorite');
  $deleteFavButtons.click(e => {
    e.preventDefault();
    var data = {};
    var id = $('.user_id').val();
    var name = e.target.getAttribute('value');
    data = {id: id, name: name};
    console.log(data);
    $.ajax({
      url: '/users/favorites',
      data: data,
      type: 'DELETE',
      success: function(data) {
        window.location.href = "/users/favorites";
      },
      error: function(xhr, status, error) {},
    })
  });
})
     
