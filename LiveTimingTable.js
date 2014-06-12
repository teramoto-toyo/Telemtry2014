(function() {
})();

function LiveTimingCtrl($scope, $http, $compile) {

	var INTERVAL = 30,//sec.
		KAZ = '123';
	$scope.list = [];
	$scope.last = [];

	function parse(data) {
		if (typeof data == 'string') {
			try {
				data = JSON.parse(data);
			}
			catch(e) {
				console.error(e);
			}
		}
		try {
			$scope.last = JSON.parse(angular.toJson($scope.list));
		}
		catch (e) {
			console.log(e);
		}
		$scope.list = data;
		checkLapDiff($scope.list, $scope.last);
		getKaz(data);
//		getHero(data);
		flip($scope.list);
		filterBy($scope.filterKey);
		$scope.$apply();
		window.setTimeout(function() {
			$scope.relayout();
		}, 100)
	}

	function load() {
		var url = "/livetiming/lt_analytics.php";

		$.ajax({
			url: url,
			success: success,
			error: error
			//type: 'JSON'
		});

		function success(data) {
			parse(data);
			fire();
		}

		function error() {
			console.log('error has occured');
			console.log(arguments);
			fire();
		}
	}

	function loadExtra() {
		var url = "livetiming/get_extra_data.php";
		$.ajax({
			url: url,
			success: success,
			error: error
		})

		function success(data) {
			if (typeof data == 'string')
				data = JSON.parse(data);
			$scope.extraData = data;
			$scope.$apply();
		}

		function error() {
			console.log(arguments);
		}
	}

	function fire() {
		window.setTimeout(load, INTERVAL*1000);
		window.setTimeout(loadExtra, INTERVAL*1000);
	}

	function find(carNumber, list) {
		var result;
		(list || $scope.list).forEach(function(d) {
			//if (!carNumber - d.carnumber) {
			if (carNumber == d.carnumber) {
				result = d;
			}
		});
		return result;
	}

	function checkLapDiff(newOne, oldOne) {
		//if (!oldOne || !$.isArray(oldOne) || !oldOne.length) return;
		newOne.forEach(function(neu) {
			var old = find(neu.carnumber, oldOne);
			if (!old) return;
			//console.log(neu.laps, old.laps);
			if (neu.laps != old.laps) {
				neu.lapUpdated = 'lap_updated';
			}
		});
	}

	function flip(list) {
		var i = 0;
	}

	function filterBy(className) {
		console.log(className);
		$scope.filterKey = className;
		//var result = [];
		if (!className) {
			$scope.list.forEach(function(d) {
				d.invisible = false;
			});
		}
		else {
			$scope.list.forEach(function(d) {
				if (d.class_name != className)
					d.invisible = true;
				else
					d.invisible = false;
			});
		}
	}

	function getKaz() {
		var kz = find(KAZ);
		if (!kz) return;
		kz.hero = "hero";
		$scope.kz = kz;
		return kz;
	}
	load();
	loadExtra();

	$scope.relayout = function() {
		var headers = $('#livetiming_header div');
		$('.lt').last().find('thead').show();
		$('.lt').last().find('thead th').each(function(idx) {
			$(headers[idx]).css({width: $(this).width()});
			console.log($(this).width(), headers[idx]);
		});
		$('.lt').last().find('thead').hide();

		if ($scope.kz && $scope.kz.position) {
			$('#livetiming_table_wrapper').scrollTop(($scope.kz.position - 8)*36);
			console.log($('#livetiming_table_wrapper').scrollTop, $scope.kz.position);
		}
	}

	$scope.find = find;
	$scope.filterBy = filterBy;
	window.scope = $scope;
}
