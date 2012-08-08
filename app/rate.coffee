Data = require 'data'
Render = require 'templates/rate'

class Rate
  start: (e) ->
    el = $ @
    place =  Data.nearby[el.attr 'data-index']
    $('#rate-nearby h2').text 'Rate - ' + place.name
    $('#rate-nearby [data-role=content]').html(Render place).trigger 'create'

    $('#rate-nearby input[type=checkbox]').on('change', ->
      $this = $ @
      name = $this.attr('name').replace '-chk', ''
      console.log (if $this.prop 'checked' then 'enabled' else 'disabled')
      $('#rate-nearby input[name=' + name + ']').checkboxradio(if $this.prop('checked') then 'enable' else 'disable')
    ).trigger 'change'

module.exports = new Rate
