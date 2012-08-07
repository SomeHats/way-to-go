
class Application
  init: ->
    $('[href=#]').on 'click', ->
      #$.mobile.changePage('', {transition: 'slideup'});
      #
    _this = @

    $(window).on 'hashchange', ->
      switch window.location.hash
        when '#rate'
          _this.rate()
        when '#rate_geo'
          if data.waitingForGeo is false
            $.mobile.changePage '#home'


    $(window).trigger 'hashchange'

    if navigator.geolocation
      @geo = navigator.geolocation
    else @geo = off

  rate: ->
    if @geo
      @geo.getCurrentPosition @rateGeo, @rateNoGeo
    else
      console.log 'Geo not allowed'
      @rateNoGeo()

  rateGeo: (pos) ->
    data.waitingForGeo = true
    $.mobile.changePage '#rate_geo', transition: 'none'

    #location = new google.maps.LatLng pos.coords.latitude, pos.coords.longitude
    #
    #map = new google.maps.Map $('#rate-map')[0],
    #  mapTypeId: google.maps.MapTypeId.ROADMAP
    #  center: location
    #  zoom: 15

    $.ajax '/gm/maps/api/place/search/json',
      data:
        key: 'AIzaSyALj6zax-yPF5UIfk77oOH4thM3BeEesVw'
        location: pos.coords.latitude + ',' + pos.coords.longitude
        radius: pos.coords.accuracy * 2 + 100
        sensor: true
      context: @
      dataType: 'json'
      error: ->
        console.log 'Error!'
      success: (data) ->
        console.log data


  rateNoGeo: ->
    $.mobile.changePage '#rate_no-geo', transition: 'pop'

data =
  geo: off
  key: 'AIzaSyALj6zax-yPF5UIfk77oOH4thM3BeEesVw'
  waitingForGeo: false

module.exports = new Application
