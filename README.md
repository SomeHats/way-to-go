Way To Go
=========

Way To Go: an accessibility web app using crowdsourced and open data. Made in Brighton for #YRS2012

Users can search for places by entering accessibility criteria. Generic information about each place comes from the Google Places API. The accessibility information is crowdsourced from people using the app: when they visit a place, they are invited to fill out information about the place, such as how accessibile it is, friendlyness of staff, facilities available etc. 

## To Install:-
1. Run `git clone https://github.com/SomeHats/way-to-go.git`
2. Install [node.js](http://nodejs.org/#download)
3. Install [MongoDB](http://www.mongodb.org/downloads)
4. Run:
 * `cd way-to-go`
 * `npm install`
5. Pull database snapshot

## To Run:-
1. Start Mongo
2. Run `brunch build`
3. Run `node app.js`
