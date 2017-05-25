//textarea
angular.module('xeditable').directive('editableDateTime', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {

    var popupAttrNames = [
    ['eDisabledDate','disabled-date'],
    ['eHiddenTime','hidden-time'],
    ['eHiddenDate','hidden-date'],
    ['eShowSpinners', 'show-spinners'],
    ['eHourStep','hour-step'],
    ['eMinuteStep','minute-step'],
    ['eSecondStep','second-step'],
    ['eReadonlyTime','readonly-time'],
    ['eDateOpened','date-opened'],
    ['eShowButtonBar','show-button-bar'],
    ['eShowMeridian','show-meridian'],
    ['eShowSeconds','show-seconds']
    ];

    var popupAttrDefaults = {
      'eDisabledDate' : false,
      'eHiddenTime' : false,
      'eHiddenDate' : false,
      'eShowSpinners' : true,
      'eHourStep' :  1,
      'eMinuteStep' : 10,
      'eSecondStep' : 10,
      'eReadonlyTime' : false,
      'eShowButtonBar' : true,
      'eShowMeridian' : false,
      'eShowSeconds' : true
    };

    var dir =  editableDirectiveFactory({
      directiveName: 'editableDateTime',
      inputTpl: '<span></span>',
      render: function() {
        var self = this;
        this.parent.render.call(this);

        var attrs = this.attrs;
        var scope = this.scope;

        var inputDatePicker = angular.element('<datetimepicker type="text" ng-model="$parent.$data"></datetimepicker>');

        inputDatePicker.attr('ng-readonly', attrs.eReadonly || false);

        for (var i = popupAttrNames.length - 1; i >= 0; i--) {
          var popupAttr = attrs[popupAttrNames[i][0]];
          if (typeof popupAttr !== 'undefined') {
            inputDatePicker.attr(popupAttrNames[i][1], popupAttr);
          } else {
            var defaultValue = popupAttrDefaults[popupAttrNames[i][0]];
            if (typeof defaultValue !== 'undefined') {
              inputDatePicker.attr(popupAttrNames[i][1], defaultValue);
            }
          }
        }

        if (attrs.eNgChange) {
          inputDatePicker.attr('ng-change', attrs.eNgChange);
          this.inputEl.removeAttr('ng-change');
        }

        if (attrs.eStyle) {
          inputDatePicker.attr('style', attrs.eStyle);
          this.inputEl.removeAttr('style');
        }

        this.inputEl.prepend(inputDatePicker);

        this.inputEl.removeAttr('class');
        this.inputEl.removeAttr('ng-click');
        this.inputEl.removeAttr('is-open');
        this.inputEl.removeAttr('init-date');
        this.inputEl.removeAttr('datepicker-popup');
        this.inputEl.removeAttr('required');
        this.inputEl.removeAttr('ng-model');
        this.inputEl.removeAttr('date-picker-append-to-body');
        this.inputEl.removeAttr('name');

      },
      autosubmit: function() {
        var self = this;
        self.inputEl.bind('change', function() {
          setTimeout(function() {
            self.scope.$apply(function() {
              self.scope.$form.$submit();
            });
          }, 500);
        });

        self.inputEl.bind('keydown', function(e) {
          if (e.keyCode === 9 && self.editorEl.attr('blur') === 'submit') {
            self.scope.$apply(function() {
              self.scope.$form.$submit();
            });
          }
        });
      }
    });

    return dir;

  }

  ]);
