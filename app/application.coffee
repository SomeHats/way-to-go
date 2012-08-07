
class Application
  init: ->
    $('[href=#]').on 'click', ->
      #$.mobile.changePage('', {transition: 'slideup'});
      #
    _this = @

    $(window).on 'hashchange', ->
      if window.location.hash is '#rate'
        _this.rate()

    $(window).trigger 'hashchange'

    if navigator.geolocation
      @geo = navigator.geolocation
    else @geo = off

  rate: ->
    if @geo
      @geo.getCurrentPosition @rateGeo, @rateNoGeo
    else 
      @rateNoGeo()

  rateGeo: (pos) ->
    alert 'GEO!';

  rateNoGeo: ->
    alert 'No geo :('

  geo: off

module.exports = new Application
