var component = angular.module('mapComponent', []);

component.directive('map', function () {
    'use strict';

var directionsDisplay = new google.maps.DirectionsRenderer(),
    directionsService = new google.maps.DirectionsService(),
    geocoder = new google.maps.Geocoder(),
    map,
    marker,
    mapObj,
    infowindow;

mapObj = {
    restrict: 'EAC',
    scope: {
        end: '@',
        markerContent: '@',
        zoom: '=',
        type: '@',
        directions: '@'
    },
replace: true,
    template: '<form novalidate name="mapContainer" class="mapContainer panel">' +
    '<div id="theMap"></div>' +
    '<div class="directions" ng-show="directions || directions==undefined">' +
    '<label>start:</label>' +
    '<input type="text" ng-model="origin" name="origin"  required>' +
    '<small class="error" id="wrongAddress">Error: \n ' +
    '<span>Sorry this is not a valid address.</span>' +
    '</small>' +
    '<label>end:</label>' +
    '<input ng-model="endPoint" type="text" name="endPoint">' +
    '<button class="getDirections" ng-click="getDirections()" ng-disabled="mapContainer.$invalid">Get Directions</button> ' +
    '<button class="clearDirections alert" ng-click="clearDirections()" ng-disabled="mapContainer.$invalid">Clear</button>' +
    '<div id="directionsList"></div>' +
    '</div>' +
    '</form>', // todo: use template url and template file

    link: function (scope, element, attrs) {
    scope.init = function () {
        var mapOptions = {
            zoom: scope.zoom !== undefined ? scope.zoom : 15,
            mapTypeId: scope.type.toLowerCase(),
            streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById('theMap'), mapOptions);
        // scope.endPoint = scope.destination !== undefined ? scope.destination : 'City Hall, Philadelphia, PA';
        scope.endPoint = scope.destination !== undefined ? scope.destination : 'City Hall, Philadelphia, PA';

            //$scope.map = {center: {latitude: 39.9523400, longitude: -75.1637900}, zoom: 14 };
            // $scope.options = {scrollwheel: false};

            geocoder.geocode({
                address: scope.endPoint
                }, function (results, status) {
                    var location = results[0].geometry.location;
                    if (status === google.maps.GeocoderStatus.OK) {
                    map.setCenter(location);
                    marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    animation: google.maps.Animation.DROP
                    });
                    infowindow = new google.maps.InfoWindow({
                    content: scope.markerContent !== undefined ? scope.markerContent : 'City Hall'
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                    return infowindow.open(map, marker);
                    });

                    } else {
                    alert('Cannot Geocode');
                    }

                    });
            };

            scope.init();

            scope.getDirections = function () {
                var request = {
                    origin: scope.origin,
                    destination: scope.endPoint,
                    travelMode: google.maps.DirectionsTravelMode.TRANSIT
                };
                directionsService.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response)
                        document.getElementById('wrongAddress').style.display = "none";
                    } else {
                        document.getElementById('wrongAddress').style.display = "block";
                    }
                });
                directionsDisplay.setMap(map);

                directionsDisplay.setPanel(document.getElementById('directionsList'));

            };

            scope.clearDirections = function () {
                scope.init();
                directionsDisplay.setPanel(null);
                scope.origin = '';
            };
        }
    };

    return mapObj;
});