var app = angular.module("app", ["xeditable"]);
var serialize = function (obj, prefix) {
	var str = [];
	for (var p in obj) {
		if (p.startsWith("_")) {
			continue;
		} else if (obj.hasOwnProperty(p)) {
			if (typeof obj[p] == "function") {
				continue;
			}

			var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];

			var x = undefined;

			if (typeof v == "object") {
				if (v instanceof Date) {
					x = encodeURIComponent(k) + "=" + encodeURIComponent(moment(v).format("YYYY-MM-DD HH:mm:ss"));
				} else {
					x = serialize(v, k) ;
				}
			} else {
				x = encodeURIComponent(k) + "=" + (angular.isDefined(v) ? encodeURIComponent(v) : "");
			}

			str.push( x);
		}
	}
	return str.join("&");
}

Object.toparams = serialize;
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  editableOptions.icon_set = "font-awesome";
});

app.controller('Ctrl', function($scope) {
	$scope.user = {
		name: 'awesome user',
		date: "2017-05-05 00:00:00",
		date2: new Date()
	};  

	$scope.saveEntityObject = function() {
		console.log(Object.toparams($scope.user))
	};


});