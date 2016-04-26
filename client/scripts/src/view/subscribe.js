define(["jquery", "backbone", "underscore", "alerts", "utils"],
       function($, B, _, alerts, $u) {
           return B.View.extend({
               events: {
                   "click #subscribe": "onClickSubscribe",
                   "submit #subscribe-form": "onSubmit"
               },

               onClickSubscribe: function() {
                   $("#subscribe-form").show()
                       .find("input").focus();
               },

               onSubmit: function(e) {
                   console.log("Submitted");
                   var form = e.target,
                       self = this;
                   $.ajax("/user/subscribe",
                          {method: "POST",
                           data: {query: JSON.stringify(this.collection.query),
                                  csrfmiddlewaretoken: $u.getCookie("csrftoken"),
                                  email: form.email.value},
                           dataType: "json"})
                       .done(function(resp) {
                           if (resp.new_user) {
                               alerts.show(
                                   ["Thanks for registering!<br>",
                                    "We're sending an email to <b>",
                                    _.escape(resp.email), "</b> with ",
                                    "instructions on how to complete the ",
                                    "process"].join(""),
                                   "info");
                           } else {

                           }
                       })
                       .fail(function(err) {
                           self.showError(err.error);
                       });

                   e.preventDefault();
               },

               showError: function(message) {
                   if (message) {
                       $("#subscribe-form .error")
                           .html(_.escape(message))
                           .show();
                   } else {
                       this.hideError();
                   }
               },

               hideError: function() {
                   
               }
           });
       });
