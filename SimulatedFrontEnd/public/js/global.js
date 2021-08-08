$('#logoutButton').on('click', function(event) {
    event.preventDefault();
    sessionStorage.clear();
    window.location.replace('/home.html');
});