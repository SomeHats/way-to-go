Data = require 'lib/data'
Types = require 'lib/types'
RateNearby = require 'templates/rate-nearby'
Rate = require 'rate'
Geocode = require 'lib/geocode'
Search = require 'search'

class Application
  init: ->
    $('[href=#]').on 'click', ->
      #$.mobile.changePage('', {transition: 'slideup'});
      #
    _this = @

    Data.hCont = off

    $('.h-cont').on 'click', ->
      if Data.hCont is off
        theme = 'c'
        Data.hCont = on
      else
        theme = 'a'
        Data.hCont = off

      console.log(theme)


      $.mobile.page.prototype.options.backBtnTheme = theme

      # Page
      $.mobile.page.prototype.options.headerTheme = theme  # Page header only
      $.mobile.page.prototype.options.contentTheme = theme
      $.mobile.page.prototype.options.footerTheme = theme

      # Listviews
      $.mobile.listview.prototype.options.headerTheme = theme  # Header for nested lists
      $.mobile.listview.prototype.options.theme           = theme  # List items / content
      $.mobile.listview.prototype.options.dividerTheme    = theme  # List divider

      $.mobile.listview.prototype.options.splitTheme   = theme
      $.mobile.listview.prototype.options.countTheme   = theme
      $.mobile.listview.prototype.options.filterTheme = theme

      $.mobile.activePage.find('.ui-btn').not('.ui-li-divider').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e').addClass('ui-btn-up-' + theme).attr('data-theme', theme);

        #target the list divider elements, then iterate through them to check if they have a theme set, if a theme is set then do nothing, otherwise change its theme to `b` (this is the jQuery Mobile default for list-dividers)
      $.mobile.activePage.find('.ui-li-divider').each (index, obj) -> 
        if ($(this).parent().attr('data-divider-theme') is undefined)
          $(this).removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e').addClass('ui-bar-' + theme).attr('data-theme', theme);


      $.mobile.activePage.find('.ui-btn').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e').addClass('ui-btn-up-' + theme).attr('data-theme', theme);

      #reset the header/footer widgets
      $.mobile.activePage.find('.ui-header, .ui-footer').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e').addClass('ui-bar-' + theme).attr('data-theme', theme);

    #reset the page widget
      $.mobile.activePage.removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e').addClass('ui-body-' + theme).attr('data-theme', theme);



      #$('[data-theme]').attr('data-theme', 'c').trigger 'enhance'
      #$('[data-role]').trigger 'create'

    #$('#searchlist').listview()
    $('#searchlist:visible').listview 'option', 'filterCallback', (text, search) ->
      if text.trim().toLowerCase() is 'search near:'
        false
      else if text.toLowerCase().indexOf(search) is -1
        true
      else
        false

    $('#searchlist a').on 'click', ->
      $el = $ @
      location = $('#location').val()
      console.log location
      if location.trim() is ''
        alert 'Please enter a location'
      else
        Search.start $el.attr('data-term'), location

    $(window).on 'hashchange', ->
      switch window.location.hash
        when '#rate'
          _this.rate()
        when '#rate-nearby'
          if Data.nearbyAvailable is false
            $.mobile.changePage '#home'
        when '#map', '#list', '#info'
          if Data.searchTerm is off
            $.mobile.changePage '#home'


    $(window).trigger 'hashchange'

    if navigator.geolocation
      @geo = navigator.geolocation
    else @geo = off

    Geocode.getAddr @geo, (addr) ->
      $loc = $ '#location'
      $loc.attr 'placeholder', ''
      if $loc.val() is ''
        $loc.val addr
        Data.geolocAdd = addr
    , ->
      console.log 'fail'
      Data.geolocAdd = ''
      $('#location').attr 'placeholder', ''

  rate: ->
    $('#rate-nogeo-notice, #rate-loading-notice').addClass 'hidden'
    $('#rate-geo-notice').removeClass 'hidden'
    $('#rate-nearby h2').text 'Rate'
    if @geo
      $.mobile.showPageLoadingMsg()
      @geo.getCurrentPosition @rateGeo, @rateNoGeo
    else
      console.log 'Geo not allowed'
      @rateNoGeo()

  rateGeo: (pos) ->
    Data.waitingForGeo = true
    $('#rate-loading-notice').removeClass 'hidden'

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
        rankby: 'distance'
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
Data.searchTerm = off

module.exports = new Application
