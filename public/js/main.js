require(['jquery', 'semantic'], function ($) {
  console.log('form init');

  (function () {
    $('.ui.dropdown').dropdown();
    $('.ui.checkbox').checkbox();
    $('.message .close').on('click', function() {
      $(this)
        .closest('.message')
        .transition('fade');
    }); 
  }());

  let formData;

  // Validation Form
  $('.ui.form').form({
    onSuccess: function (event, fields) {
      console.log($(this));

      // formData = JSON.stringify(fields);
      formData = $(this).serialize();

      console.log(formData);
    },
    fields: {
      name: {
        identifier: 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your {name}'
          }
        ]
      },
      secondname: {
        identifier: 'secondname',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your {name}'
          },
          {
            type: 'minLength[3]',
            prompt: "Field '{identifier}' should contain from {ruleValue} to 60 letters"
          },
          {
            type: 'maxLength[60]',
            prompt: "Field '{identifier}' should contain from 3 to {ruleValue} letters"
          }
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type: 'regExp',
            value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            prompt: 'Email is not valid'
          }
        ]
      },
      gender: {
        identifier  : 'gender',
        rules: [
          {
            type   : 'empty',
            prompt : "Field '{identifier}' is required"
          }
        ]
      },
      pass: {
        identifier  : 'pass',
        rules: [
          {
            type   : 'empty',
            prompt : "Field '{identifier}' is required"
          },
          {
            type   : 'minLength[7]',
            prompt : "{name} is too short"
          }
        ]
      },
      checked: {
        rules: [
          {
            type   : 'checked',
            prompt : 'You must agree to the conditions'
          }
        ]
      }
    },
    inline : true,
    on : 'blur'
  });

  // Submit Form
  $('.ui.form').on('submit', function (e) {
    e.preventDefault();

    let url = 'http://codeit.pro/frontTestTask/user/registration';

    $.post(url, formData)
      .done((data) => {
        console.log(formData);
        console.log(data);

        switch (data.status) {
          case "Form Error":
            $('.ui.message .header').html('<p>' + data.status + '</p>');
            $('.ui.message .message__content').html('<p>' + data.message + '</p>');
            $('.ui.message').addClass('negative').fadeIn(300);
            break;
          case "Error":
            $('.ui.message .header').html('<p>' + data.status + '</p>');
            $('.ui.message .message__content').html('<p>' + data.message + '</p>');
            $('.ui.message').addClass('warning').fadeIn(300);
            break;
          case "OK":
            $('.ui.message .header').html('<p>' + data.status + '</p>');
            $('.ui.message .message__content').html('<p>' + data.message + '</p>');
            $('.ui.message').addClass('positive').fadeIn(300);
            window.location = '/company'
            break;
        }

      })
      .fail((error) => {
        console.log(error);
      });
  });
});
