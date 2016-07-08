var GreatCircle = require('./GreatCircle');

function circumscribedRadius( radius, nsides ){
  return radius * (1.0 / (Math.cos(Math.PI/nsides)));
}

/**
 * Create a circumscribed polygon of nsides centered on point, with radius
 * geojson coordinates are in [longitude, latitude, elevation].
 * polygonCircumscribe calculates with north bearing (0.0,or 360.0)
 * northing side (top-ish) should be parallel to longitude and thus the first
 * two points should share latitude.
 * this means than Minimum Bounding Rectangle is defined as polygonCircumscribe
 * with nsides == 4 where the resulting rectangle is square to the grid.
 * @param {Number[]} point[longitude,latitude]
 * @param {Number} radius in KM
 * @param {Number} number of sides from 3 to ?
 */
function polygonCircumscribe( point, radius, nsides ){
  var polygon = { type: "Polygon" };
  var coordinates = [];
  var cradius = circumscribedRadius(radius,nsides);
  var destination = GreatCircle.destination;
  var anglePerSide = 360.0/nsides;
  var bearing = -(anglePerSide/2.0);
  for( var side = 0; side < nsides; side++ ){
    var coordinate = destination(point, bearing, cradius, "KM");
    coordinates.push(coordinate);
    bearing += anglePerSide;
  }
  coordinates.push(coordinates[0]);
  polygon.coordinates = [coordinates];
  return polygon;
}

function updateRoM( location, nsides ){
  location.rom = polygonCircumscribe( location.loc.coordinates, location.radius, nsides );
}


module.exports = {
  circumscribedRadius : circumscribedRadius,
  polygonCircumscribe : polygonCircumscribe,
  updateRoM : updateRoM,
  updateRoM8 : function(loc){ updateRoM(loc,8); },
  updateRoM128 : function(loc){ updateRoM(loc,128); }
};
