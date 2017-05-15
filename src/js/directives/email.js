    angular.module('xeditable').directive("editableEmail", ['editableDirectiveFactory',
      function(editableDirectiveFactory) {
        return editableDirectiveFactory({
          directiveName: "editableEmail",
          inputTpl: '<input type="email" user-email-async-validator fc-check-unique="{{attrs.fcCheckUnique}}">',
          render: function() {
            this.parent.render.call(this);

            //Add bootstrap simple input groups
            if (this.attrs.eInputgroupleft || this.attrs.eInputgroupright) {
              this.inputEl.wrap('<div class="input-group"></div>');

              if (this.attrs.eInputgroupleft) {
                var inputGroupLeft = angular.element('<span class="input-group-addon">' + this.attrs.eInputgroupleft + '</span>');
                this.inputEl.parent().prepend(inputGroupLeft);
              }

              if (this.attrs.eInputgroupright) {
                var inputGroupRight = angular.element('<span class="input-group-addon">' + this.attrs.eInputgroupright + '</span>');
                this.inputEl.parent().append(inputGroupRight);
              }
            }

            // Add label to the input
            if (this.attrs.eLabel) {
              var label = angular.element('<label>' + this.attrs.eLabel + '</label>');
              if (this.attrs.eInputgroupleft || this.attrs.eInputgroupright) {
                this.inputEl.parent().parent().prepend(label);
              } else {
                this.inputEl.parent().prepend(label);
              }
            }
            
            // Add classes to the form
            if (this.attrs.eFormclass) {
              this.editorEl.addClass(this.attrs.eFormclass);
            }
          },
          autosubmit: function() {
            var self = this;
            self.inputEl.bind('keydown', function(e) {
                //submit on tab
                if (e.keyCode === 9 && self.editorEl.attr('blur') === 'submit') {
                  self.scope.$apply(function() {
                    self.scope.$form.$submit();
                  });
                }
              });
          }
        });
      }]);

    angular.module('xeditable').directive("userEmailAsyncValidator", ["$q", "$http", function userEmailAsyncValidator($q, $http) {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

          ctrl.$asyncValidators.email_exists = function(modelValue, viewValue) {

            if (attrs.fcCheckUnique === "false" || ctrl.$isEmpty(modelValue)) {
              return $q.when();
            }

            var def = $q.defer();

            $http({
              method: "post",
              url: "/UserRegController/JSONView/checkIfEmailExists.html",
              data: Object.toparams({email : modelValue})
            }).then(function (result) {
              if (result.data.model.email_exists === "0") {
                def.resolve();
              } else {
                def.reject(); 
              }
            });



            return def.promise;
          };
        }
      };
    }]);


