template = require 'views/templates/checkin'

class Checkin
  start: ->
   @render()

  render: ->
    $('#main').html template()

module.exports = new Checkin
