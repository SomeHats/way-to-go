Data = require 'lib/data'

module.exports = 
	getAddr: (geo, success, fail) ->
		if geo is off
			fail()
		else
			geo.getCurrentPosition (pos) ->
				latlng = new google.maps.LatLng pos.coords.latitude, pos.coords.longitude
				geocoder = new google.maps.Geocoder

				Data.lastLatlng = latlng

				geocoder.geocode latLng: latlng, (results, status) ->
					if status is google.maps.GeocoderStatus.OK
						success results[0].formatted_address

					else
						console.log status
						fail()
			, ->
				fail()
	getLatLong: (addr, success, fail) ->
		geocoder = new google.maps.Geocoder
		geocoder.geocode {address: addr}, (results, status) ->
			if status is google.maps.GeocoderStatus.OK
				success results[0].geometry.location
			else
				console.log status
				fail()