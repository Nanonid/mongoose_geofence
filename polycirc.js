var GreatCircle = require('./GreatCircle');
/**
 * circumscribed radius (Rc) is the hypotenuse of the bisected triangle of
 * a regular polygon side whose median is the circle radius, Rp.
 * The angle a for each side of the polygon is 2Pi/nsides, and so the ratio
 * of the hypotenuse (Rc) of the right triangle to the radius (Rp) is cos(a/2)
 * or cos(Pi/nsides), cos(a/2) = Rp/Rc, and so Rc = Rp/cos(a/2).
 * For the unit circle, Rc = Rp*1/cos(a/2).
 * The ratio is ~1.0824 for n==8, and approaches 1.0 for more sides.
 * @param {Number} Radius of the circle
 * @param {Number} number of sides of the polygon
 * @return {Number} the radius required to circumscribe or enclose the circle.
 */
function circumscribedRadius( radius, nsides ){
  return radius * (1.0 / (Math.cos(Math.PI/nsides)));
}

/**
 * Create a circumscribed polygon of nsides centered on point, with radius
 * geojson coordinates are in [longitude, latitude, elevation].
 * polygonCircumscribe calculates with north bearing (0.0,or 360.0)
 * northing side (top-ish) should be parallel to longitude and thus the first
 * two points should share latitude.
 * this means Minimum Bounding Rectangle is defined as polygonCircumscribe
 * with nsides == 4 where the resulting rectangle is square to the grid.
 * @param {Number[]} point[longitude,latitude]
 * @param {Number} radius in KM
 * @param {Number} number of sides from 3 to ?
 * @return {Object} geojson object of type "Polygon" containing one outer ring
 * of an N-sided regular polygon circumscribing the circle of radius, where
 * the first two points are normal to 0 bearing.
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
