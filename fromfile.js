// Pinterest Scrape - Takes in an html file from input/ and enters into an sqlite database

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var sqlite3 = require("sqlite3").verbose();
var fs = require('fs');

var app = express();

var inputs = ['clothes.html', 'colour.html', 'draw.html', 'flora.html', 'goods.html', 'graphic.html', 'humans.html', 'illustrate.html', 'image.html', 'interface.html', 'line.html', 'motion.html', 'object.html', 'photo.html', 'print.html', 'space.html', 'symbol.html', 'tattoo.html', 'type.html'];
var tableInputIndex = 0;

app.get('/', function(req, res){

    inputSingleTable('type');
    //inputTable();

    res.send('--------');
})

function inputSingleTable(inp) {

    var filename = 'input/' + inp + ".html";
    var boardName = filename.substring(6, filename.length).slice(0, -5);

    // Read the html file
    fs.readFile(filename, 'utf8', function read(err, input) {

        // Error reading the html
        if (err) throw err;

        // Load html into the html/jquery parses cheerio
        var $ = cheerio.load(input);

        // Open the database
        var file = "data/data.db";
        var exists = fs.existsSync(file);

        if(!exists) {
            console.log("Error : DB file is missing");
        }

        var db = new sqlite3.Database(file);

        db.serialize(function() {

            console.log("Create table: " + inp);
            db.run( 'CREATE TABLE ' + inp + '( link TEXT, img TEXT )' );

            // Just to keep track of the number of items inputed for the console
            var counter = 0;

            // Loop through each top level element
            $( '.pinWrapper' ).each(function( index ) {

                counter++;

                var link = "'" + $( this ).children().children().children('.pinImageWrapper').attr('href') + "'";

                //Grab the image link, trim it and add the correct start to get a reference to the large version of the image instead of the provided small version
                var src = $( this ).children().children('.pinHolder').children().children().children().children().children('img').attr('src')
                var img = "'" + 'https://s-media-cache-ak0.pinimg.com/7' + src.substring(38, src.length) + "'";

                var stmt = "INSERT INTO " + inp + " ('link','img') VALUES (" + link + "," + img +") ";
                db.run(stmt);
            });

            console.log(tableInputIndex + ' : ' + inp + '  : Entries: ' + counter);
        });

        db.close();
    });
}

function inputTable() {

    if (tableInputIndex < inputs.length) {

        var filename = 'input/' + inputs[tableInputIndex];
        var boardName = filename.substring(6, filename.length).slice(0, -5);

        // Read the html file
        fs.readFile(filename, 'utf8', function read(err, input) {

            // Error reading the html
            if (err) throw err;

            // Load html into the html/jquery parses cheerio
            var $ = cheerio.load(input);

            // Open the database
            var file = "data/data.db";
            var exists = fs.existsSync(file);

            if(!exists) {
                console.log("Error : DB file is missing");
            }

            var db = new sqlite3.Database(file);

            db.serialize(function() {

                // create table
                console.log("Create table: " + boardName);
                db.run( 'CREATE TABLE ' + boardName + '( link TEXT, img TEXT )' );

                // Just to keep track of the number of items inputed for the console
                var counter = 0;

                // Loop through each top level element
                $( '.pinWrapper' ).each(function( index ) {

                    counter++;

                    var link = "'" + $( this ).children().children().children('.pinImageWrapper').attr('href') + "'";

                    //Grab the image link, trim it and add the correct start to get a reference to the large version of the image instead of the provided small version
                    var src = $( this ).children().children('.pinHolder').children().children().children().children().children('img').attr('src')
                    var img = "'" + 'https://s-media-cache-ak0.pinimg.com/7' + src.substring(38, src.length) + "'";

                    //console.log(index + " : " + link);

                    var stmt = "INSERT INTO " + boardName + " ('link','img') VALUES (" + link + "," + img +") ";
                    db.run(stmt);
                });

                console.log(tableInputIndex + ' : ' + boardName + '  : Entries: ' + counter);

                tableInputIndex++;
                inputTable();
            });

            db.close();
        });
    }
}

var server = app.listen(6003, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('gather listening at http://%s:%s', host, port);
});

exports = module.exports = app;
