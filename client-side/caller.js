
$(document).ready(function() {
    console.log('Document is ready');
      $('#signup-btn').click(function(event) {
        console.log('SignUp button clicked!');
        event.preventDefault();
          var names = $('#names').val();
          var email = $('#email').val();
          var password = $('#password').val();
          var confirmpassword = $('#confirmpassword').val();
  
          if (password !== confirmpassword) {
              showAlert('Passwords do not match!', 'alert-danger');
          } else {
              axios.post('http://localhost:5000/users', {
                  names: names,
                  email: email,
                  password: password
              })
              .then(function(response) {
                  console.log(`Registration Successful ${response}`);
                  showAlert('Registered successfully! Redirecting...', 'alert-success');
                  setTimeout(function() {
                      window.location.href = 'login.html';
                  }, 3000);
              })
              .catch(function(error) {
                  showAlert('Error registering user: ' + error.message, 'alert-danger');
              });
          }
      });
  
      function showAlert(message, className) {
          var alertDiv = $('<div>').addClass('alert ' + className).text(message);
          var container = $('.signup-container');
          var form = $('#signup');
  
          container.prepend(alertDiv);
  
          setTimeout(function() {
              alertDiv.remove();
          }, 3000);
      }
  });
