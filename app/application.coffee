App = require 'app'
header = require 'views/templates/header'
home = require 'views/templates/home'
Router = require 'routes'
Checkin = require 'checkin'
class Application
  init: ->
    @$el = $ '#main'

    $(window).on 'hashchange', @router

    @render()

    @router()

  render: ->
    $('header').html header()

  router: ->
    hash = window.location.hash.replace('#', '')
    console.log hash
    switch hash
      when ''
        $('#main').html home()

      when 'checkin'
        Checkin.start()

module.exports = new Application
