// from https://raw.githubusercontent.com/mwgg/GreatCircle/master/GreatCircle.js
// geojson coordinates are in [longitude, latitude, elevation]
function validateRadius(unit) {
    var r = {'KM': 6371.009, 'MI': 3958.761, 'NM': 3440.070, 'YD': 6967420, 'FT': 20902260};
    if ( unit in r ) return r[unit];
    else return unit;
}

function distance(pt1, pt2, unit) {
    var lon1 = pt1[0];
    var lat1 = pt1[1];
    var lon2 = pt2[0];
    var lat2 = pt2[1];
    if ( unit === undefined ) unit = 'KM';
    var r = validateRadius(unit);
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lon2 *= Math.PI / 180;
    var lonDelta = lon2 - lon1;
    var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
    var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
    var angle = Math.atan2(Math.sqrt(a) , b);

    return angle * r;
}

function bearing(pt1,pt2) {
    var lon1 = pt1[0];
    var lat1 = pt1[1];
    var lon2 = pt2[0];
    var lat2 = pt2[1];
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lon2 *= Math.PI / 180;
    var lonDelta = lon2 - lon1;
    var y = Math.sin(lonDelta) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
    var brng = Math.atan2(y, x);
    brng = brng * (180 / Math.PI);

    if ( brng < 0 ) { brng += 360; }

    return brng;
}

function destination(pt1, brng, dt, unit) {
    var lon1 = pt1[0];
    var lat1 = pt1[1];
    if ( unit === undefined ) unit = 'KM';
    var r = validateRadius(unit);
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dt / r) + Math.cos(lat1) * Math.sin(dt / r) * Math.cos( brng * Math.PI / 180 ));
    var lon3 = lon1 + Math.atan2(Math.sin( brng * Math.PI / 180 ) * Math.sin(dt / r) * Math.cos(lat1) , Math.cos(dt / r) - Math.sin(lat1) * Math.sin(lat3));

    return [
        lon3 * 180 / Math.PI,
        lat3 * 180 / Math.PI
    ];
}


module.exports = {
  validateRadius : validateRadius,
  distance : distance,
  bearing : bearing,
  destination : destination
};
