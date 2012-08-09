hslToHex = require 'lib/hslToHex'
Data = require 'lib/data'
Geocode = require 'lib/geocode'

class Search
	start: (term, near) ->
		@near = near
		@term = term
		$.mobile.showPageLoadingMsg()
		$.ajax '/api/search/'+encodeURI(term)+'/'+encodeURI(near),
			dataType: 'json'
			error: ->
				alert 'Something went wrong :('
			success: (data) ->
				console.log(data)
				if data.success
					# Success!
					_this.data = data
					Data.searchTerm = on
					$.mobile.changePage('#map')
					$.mobile.showPageLoadingMsg()

					$('#searchMap').height $(window).innerHeight() - ($('#map [data-role=header]').outerHeight() + $('#map [data-role=footer]').outerHeight() + 2)
					console.log Data.geolocAdd
					if Data.geolocAdd and near.trim().toLowerCase() is Data.geolocAdd.trim().toLowerCase()
						_this.drawMap Data.lastLatlng
					else
						Geocode.getLatLong @near, _this.drawMap, ->
							alert 'Could not draw map :('

				else
					alert "Something went wrong :(\n(toilets aren't supported yet)"

	drawMap: (center) ->
		map = new google.maps.Map $('#searchMap')[0],
			center: center
			zoom: 14
			mapTypeId: google.maps.MapTypeId.ROADMAP

		for place in _this.data.results
			loc = new google.maps.LatLng place.geometry.location.lat, place.geometry.location.lng

			if place.general
				pinColour = hslToHex place.general / 3, 0.99, 0.7
			else
				pinColour = '7D93BA'
			
			pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColour,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

			new google.maps.Marker
				position: loc
				map: map
				title: place.name
				icon: pinImage

		$.mobile.hidePageLoadingMsg()
		

module.exports = _this = new Search