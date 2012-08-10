Data = require 'lib/data'
Render = require 'templates/rate'

class Rate
  start: (e) ->
    el = $ @
    Data.place = Data.nearby[el.attr 'data-index']
    console.log rate
    rate.rate Data.place

  rate: (place) ->
    $('#rate-nearby h2').text 'Rate - ' + place.name
    $('#rate-nearby [data-role=content]').html(Render place).trigger 'create'

    $('#rate-nearby input[type=checkbox]').on('change', ->
      $this = $ @
      name = $this.attr('name').replace '-chk', ''
      console.log (if $this.prop 'checked' then 'enabled' else 'disabled')
      $('#rate-nearby input[name=' + name + ']').checkboxradio(if $this.prop('checked') then 'enable' else 'disable')
    ).trigger 'change'

    $('#rate-save').on 'click', ->
      $.mobile.showPageLoadingMsg()
      data = $('#rate-form').formParams()

      send =
        place:
          name: Data.place.name
          lat: Data.place.geometry.location.lat
          lng: Data.place.geometry.location.lng
          ref: Data.place.reference

      if data.wheelchair
        send.access = data.wheelchair
      if data['parking-chk'] and data.parking
        send.parking = data.parking
      if data['staff-chk'] and data.staff
        send.staff = data.staff
      if data['toilet-chk'] and data.toilet
        send.toilet = data.toilet

      $.ajax '/api/rate/' + encodeURI(JSON.stringify(send)),
        error: ->
          console.log 'Error'
        success: (data) ->
          data = JSON.parse(data)
          if data.success
            console.log 'Success!'
            $.mobile.hidePageLoadingMsg()
            alert 'Done! Thanks for rating ' + Data.place.name + '!'
            Data.place = null
            $.mobile.changePage '#home'
          else
            console.log 'error'


module.exports = rate = new Rate
