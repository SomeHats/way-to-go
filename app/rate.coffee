Data = require 'data'

class Rate
  start: (e) ->
    el = $ @
    place =  Data.nearby[el.attr 'data-index']
    

module.exports = new Rate
