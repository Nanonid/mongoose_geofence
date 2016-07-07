var GreatCircle = require('./GreatCircle');

function circumscribedRadius( radius, nsides ){
  return radius * (1.0 / (Math.cos(Math.PI/nsides)));
}

function polygonCircumscribe( point, radius, nsides ){
  var polygon = { type: "Polygon" };
  var coordinates = [];
  var cradius = circumscribedRadius(radius,8);
  var destination = GreatCircle.destination;
  var anglePerSide = 360.0/nsides;
  for( var side = 0; side < nsides; side++ ){
    var angle = anglePerSide * side;
    var coordinate = destination(point[0], point[1], angle, cradius, "KM");
    coordinates.push(coordinate);
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
