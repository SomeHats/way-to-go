App = require 'application'

$(document).on 'ready', ->
  App.init()

$(document).bind 'mobileinit', ->
  $.mobile.defaultPageTransition = 'none'
