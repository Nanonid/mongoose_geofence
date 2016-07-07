var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var assert = require('assert');
var polycirc = require('./polycirc');
var GreatCircle = require('./GreatCircle');

function dist( p1, p2 ){
  console.log( p1[0], p1[1], p2[0], p2[1] );
  console.log("Distance between: " + GreatCircle.distance( p1[0], p1[1], p2[0], p2[1], "KM" )  + " KM" );
}
console.log('\n===========');
console.log(' mongoose version: %s', mongoose.version);
console.log('========\n\n');

var dbname = 'geojson';
mongoose.connect('localhost', dbname);
mongoose.connection.on('error', function() {
    console.error('connection error', arguments);
});


// schema
var schema = new Schema({
    loc: {
        type: {
            type: String
        },
        coordinates: []
    },
    rom : {
      type: {
          type: String
      },
      coordinates: []
    },
     radius : {
      type : 'Number'
     }
});

schema.index({
    loc: '2dsphere',
});

schema.index({
    rom: '2dsphere',
});


var RoM = mongoose.model('RoM', schema);
var roms = require('./rom.json');
console.log("RoM before:\n" + JSON.stringify(roms,null,2) );
roms.forEach( polycirc.updateRoM8 );
console.log("RoM after 8 sided polygon:\n" + JSON.stringify(roms,null,2) );

function createRoMs(err){
  if(err) return done(err);
  RoM.create(roms, onCreated );
}

function onCreated(err,docs){
  if(err) return done(err);
  console.log("Created RoMs:");
  console.log(JSON.stringify(docs,null,2));
  RoM.count().then( function (count){
    console.log("Count after create:" + count);
  } );
  var loc = require('./location.json');
  var locq = [];
  loc.forEach( function (l){ locq.push(queryPoint(l)); });
  Promise.all(locq).then( function(){
    done();
  });
  console.log("end");
}

function queryPoint(pt){
  return RoM.find( pt, function(err,docs){
    console.log("Location Query:");
    console.log(JSON.stringify(pt,null,2));
    if(err){
      console.log("Err:" + err );
      return;
    }
    docs.forEach( function(doc){
      roms.forEach( function(rom){
        dist( doc.loc.coordinates, rom.loc.coordinates );
      })
    });
    console.log("query result:" + docs.length + "\n" + JSON.stringify(docs,null,2));
  } );
}

mongoose.connection.on('open', function() {
    RoM.on('index', function(err) {
        if (err) return done(err);
        RoM.count().then( function(c){
          console.log("Existing count:" + c);
          if( isClean() ){
            console.log("Removing all records first.");
            RoM.remove({}, createRoMs );
          }else{
            createRoMs();
          }
        });
    });
});

function isClean(){
  return process.argv.includes("clean");
}

function isSave(){
  return process.argv.includes("save");
}

function done(err) {
   console.log("done");
    if (err) console.error(err.stack);
    if( isSave() ){
      console.log("saving db");
      mongoose.connection.close();
    } else {
        console.log("dropping db");
        mongoose.connection.db.dropDatabase(function() {
          mongoose.connection.close();
      });
    }
}
