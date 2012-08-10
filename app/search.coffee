hslToHex = require 'lib/hslToHex'
Data = require 'lib/data'
Geocode = require 'lib/geocode'
render = require 'templates/info'
listRender = require 'templates/list'
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
						_this.draw Data.lastLatlng
						_this.drawList()
					else
						Geocode.getLatLong near, _this.draw, ->
							alert 'Could not draw map :('

				else
					alert "Something went wrong :(\n(toilets aren't supported yet)"

	drawList: ->
		listResults = []
		compare = (a, b) ->
			if a.general
				if b.general
					if a.general < b.general
						return -1
					else if a.general > b.general
						return 1
					else
						return 0
				else
					return 1
			else
				if b.general
					return -1
				else
					return 0

		for result in _this.data.results
			if result.general
				result.generalColour = getColour result.general
				result.general = Math.round result.general * 10
			listResults.push result

		console.log listResults

		$('#searchList ul').html(list listResults).listview 'refresh'

	draw: (center) ->
		compare = (a, b) ->
			if a.general
				if b.general
					if a.general < b.general
						return 1
					else if a.general > b.general
						return -1
					else
						return 0
				else
					return -1
			else
				if b.general
					return 1
				else
					return 0

		$('#searchList ul').html ''

		_this.data.results = _this.data.results.sort compare

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

			el = $(listRender place).appendTo $ '#searchList ul'

			_this.markerClick place, marker, map, el

		$.mobile.hidePageLoadingMsg()

		# This is *SO* hacky, but I'm running :(
		try
			$('#searchList ul').listview 'refresh'
		catch error
			console.log error

	markerClick: (place, marker, map, list) ->
		clickFunc = ->
			$.mobile.changePage '#info'

			$('#infoPanel ul').html render place
			$('#infoPanel ul').listview 'refresh'

			service = new google.maps.places.PlacesService map
			service.getDetails reference: place.reference, (pd, status) ->
				if status is google.maps.places.PlacesServiceStatus.OK
					console.log pd
					place.extraInfo = true
					place.phone = if pd.formatted_phone_number then pd.formatted_phone_number else false
					place.openAvailable = if pd.opening_hours then true else false
					place.open = if place.openAvailable then pd.opening_hours.open_now else null
					if pd.formatted_address
						place.address = pd.formatted_address
						place.encodedAddress = encodeURI pd.formatted_address
					else
						place.address = false
					place.currentLocation = if Data.lastLatlng then Data.lastLatlng.Xa + ',' + Data.lastLatlng.Ya else false
					place.website = if pd.website then pd.website else false
					if pd.reviews
						place.reviews = []
						for review in pd.reviews
							if review.author_name is 'A Google User'
								review.author_name = 'Anonymous'

							place.reviews.push review
					$('#infoPanel ul').html render place
					$('#infoPanel ul').listview 'refresh'
				else
					console.log status
					$('#infoPanel .loading').text 'Could not load details.'

			$('#infoPanel a.rate').live 'click', ->
				Data.nearbyAvailable = on
				$.mobile.changePage '#rate-nearby'
				Data.place = place
				Rate.rate place

		google.maps.event.addListener marker, 'click', clickFunc
		list.on 'click', clickFunc

getColour = (val) ->
	hslToHex val / 3, 0.99, 0.6

module.exports = _this = new Search