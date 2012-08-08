Data = require 'data'
Types = require 'types'
RateNearby = require 'templates/rate-nearby'
Rate = require 'rate'

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
        when '#rate-nearby'
          if Data.nearbyAvailable is false
            $.mobile.changePage '#home'


    $(window).trigger 'hashchange'

    if navigator.geolocation
      @geo = navigator.geolocation
    else @geo = off

  rate: ->
    $('#rate-nogeo-notice, #rate-loading-notice').addClass 'hidden'
    $('#rate-geo-notice').removeClass 'hidden'
    if @geo
      @geo.getCurrentPosition @rateGeo, @rateNoGeo
    else
      console.log 'Geo not allowed'
      @rateNoGeo()

  rateGeo: (pos) ->
    Data.waitingForGeo = true
    $('#rate-loading-notice').removeClass 'hidden'
    $.mobile.showPageLoadingMsg()

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
        types: Types
      context: @
      dataType: 'json'
      error: ->
        console.log 'Error!'
        @rateNoGeo()
      success: (data) ->
        $.mobile.hidePageLoadingMsg()
        console.log data
        Data.nearbyAvailable = true
        Data.nearby = data.results
        `for (i=0; i < data.results.length; i++) {
          data.results[i].index = i
        }`
        $.mobile.changePage '#rate-nearby', transition: 'none'
        $('#rate-nearby [data-role=content]').html(RateNearby data).trigger 'create'
        $('#rate-nearby [data-role=content] a').on 'click', Rate.start


  rateNoGeo: ->
    $('#rate-geo-notice, #rate-loading-notice').addClass 'hidden'
    $('#rate-nogeo-notice').removeClass 'hidden'

Data.geo = off
Data.key = 'AIzaSyALj6zax-yPF5UIfk77oOH4thM3BeEesVw'
Data.waitingForGeo = false
Data.nearbyAvailable = false

module.exports = new Application
