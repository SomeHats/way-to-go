hslToHex = require 'lib/hslToHex'
Data = require 'lib/data'
Geocode = require 'lib/geocode'
render = require 'templates/info'
Rate = require 'rate'

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

					if Data.geolocAdd and near.trim().toLowerCase() is Data.geolocAdd.trim().toLowerCase()
						_this.drawMap Data.lastLatlng
					else
						Geocode.getLatLong near, _this.drawMap, ->
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

			if place.general isnt undefined
				place.generalColour = getColour place.general
				place.general = Math.round place.general * 10
				place.generalRender = on

				if place.access isnt undefined
					place.accessColour = getColour place.access
					place.access = Math.round place.access * 10
					place.accessRender = on

				if place.parking isnt undefined
					place.parkingColour = getColour place.parking
					place.parking = Math.round place.parking * 10
					place.parkingRender = on

				if place.toilet isnt undefined
					place.toiletColour = getColour place.toilet
					place.toilet = Math.round place.toilet * 10
					place.toiletRender = on

				if place.staff isnt undefined
					place.staffColour = getColour place.staff
					place.staff = Math.round place.staff * 10
					place.staffRender = on

			else
				place.generalColour = '7D93BA'
			
			pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.75|0|" + place.generalColour + '|3',
        new google.maps.Size(39, 51),
        new google.maps.Point(0,0),
        null);

			marker = new google.maps.Marker
				position: loc
				map: map
				title: place.name
				icon: pinImage

			_this.markerClick place, marker

		$.mobile.hidePageLoadingMsg()

	markerClick: (place, marker) ->
		google.maps.event.addListener marker, 'click', ->
			$.mobile.changePage '#info'

			$('#infoPanel ul').html render place
			$('#infoPanel ul').listview 'refresh'
			$('#infoPanel a.rate').on 'click', ->
				Data.nearbyAvailable = on
				$.mobile.changePage '#rate-nearby'
				Data.place = place
				Rate.rate place

getColour = (val) ->
	hslToHex val / 3, 0.99, 0.6

module.exports = _this = new Search