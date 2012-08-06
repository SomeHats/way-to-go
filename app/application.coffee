App = require 'app'
Router = require 'routes'
module.exports = class Application extends Backbone.View
  tagName: 'div'

  initialize: ->
    Backbone.sync = (method, model, success, error) ->
      success()

    # Init everything!

    App.router = new Router
    Backbone.history.start
      pushState: true
      root: '/'
