/*
    AUTHOR: MINT IT MEDIA
    http://mintitmedia.cm

    File with MINT functions
*/



var mintsiteApp = angular.module('mintsiteApp', ['mainControllers',]);

mintsiteApp.config(['$interpolateProvider',
	function($interpolateProvider) {
		$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
	}
]);

var mainControllers = angular.module('mainControllers', []);

mainControllers.controller('mainCtrl', ['$scope', '$http','$timeout',
	function ($scope, $http, $timeout) {
		var lang = 'EN';
		var messages = {
				'EN':{
						'required_fields':'Please fill required fields.',
						'invalid_email' : 'Please use a valid email.',
						'sending':'Sending, please wait...',
						'network_error':'There was a network error. Try again later.'
				}
			}

		$scope.submitted = false;
		$scope.result_msg = false;
		$scope.messages = [];

		$scope.submit = function(form){
			$scope.messages = [];
			$scope.submitted = true;
			$scope.result_msg = false;

			if (form.$invalid) {
				if (form.$error.email){
					$scope.messages.push(messages[lang].invalid_email);
				}
				
				if(form.email.$error.required || form.message.$error.required || form.name.$error.required){
					$scope.messages.push(messages[lang].required_fields);
				}

				$('#form-messages').removeClass().addClass('alert alert-danger');

				return;
			}

			var config = {
				params : {
					'name' : $scope.name,
					'email' : $scope.email,
					'phone': $scope.phone,
					'message': $scope.message
				},
			};

			$('#form-messages').removeClass().addClass('alert alert-info');
			$scope.messages = [messages[lang].sending];
			$http.get('http://api.mintitmedia.com/send_msg', config)
				.success(function(data, status, headers, config) {
					$scope.messages = [data.msg];
					if(typeof data.status != 'undefined' && data.status == 1){
						$('#form-messages').removeClass().addClass('alert alert-success');
						$scope.resetForm();
					}else{
						$('#form-messages').removeClass().addClass('alert alert-danger');
					}	
				})
				.error(function(data, status, headers, config) {
					$('#form-messages').removeClass().addClass('alert alert-danger');
					$scope.messages = [messages[lang].network_error];
				});
		}

		$scope.resetForm = function(){
			$scope.result_msg = true;
			$scope.name = null;
			$scope.email = null;
			$scope.phone = null;
			$scope.message = null;
			$scope.submitted = false;
			$timeout(function() {
				$scope.result_msg = false;
				$scope.messages = null;
			}, 3000);
		}

		$scope.init = function(){
			$('.navigator').click(function(){
				$('html, body').animate({
					scrollTop: $('#'+$(this).attr('data-to')).offset().top - 51
				}, 300);
			});
			$('.section').css('min-height',($(window).height() - 51));
			$('.vertical_aligner').css('height', $(window).height() - 111);
		}
		$scope.init();
	}
]);
