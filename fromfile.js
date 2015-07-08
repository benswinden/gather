// Pinterest Scrape - Takes in an html file from input/ and enters into an sqlite database

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var sqlite3 = require("sqlite3").verbose();
var fs = require('fs');

var app = express();

app.get('/', function(req, res){

    var filename = 'input/clothes.html';
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

            // Loop through each top level element
            $( '.pinWrapper' ).each(function( index ) {


                var link = "'" + $( this ).children().children().children('.pinImageWrapper').attr('href') + "'";

                //Grab the image link, trim it and add the correct start to get a reference to the large version of the image instead of the provided small version
                var src = $( this ).children().children('.pinHolder').children().children().children().children().children('img').attr('src')
                var img = "'" + 'https://s-media-cache-ak0.pinimg.com/7' + src.substring(38, src.length) + "'";

                var board = "'" +  boardName + "'";

                console.log(index + " : " + link);

                // var stmt = "INSERT INTO images ('link','img','board') VALUES (" + link + "," + img + ","+ board +") ";
                // db.run(stmt);
            });

        });

        // $( '.pinHolder' ).each(function( index ) {
        //
        //     console.log( index + ": " + $( this ).attr('href') );
        // });

        // // Finally, we'll define the variables we're going to capture
        // var title, release, rating;
        // var json = { title : "", release : "", rating : ""};
        //
        // $('.header').filter(function(){
        //
        //     // Let's store the data we filter into a variable so we can easily see what's going on.
        //     var data = $(this);
        //
        //    // In examining the DOM we notice that the title rests within the first child element of the header tag.
        //    // Utilizing jQuery we can easily navigate and get the text by writing the following code:
        //     title = data.children().first().text();
        //
        //     // Once we have our title, we'll store it to the our json object.
        //     json.title = title;
        //     json.release = "Xx";
        //
        //     console.log(title);
        // })
        //
        // // To write to the system we will use the built in 'fs' library.
        // // In this example we will pass 3 parameters to the writeFile function
        // // Parameter 1 :  output.json - this is what the created filename will be called
        // // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // // Parameter 3 :  callback function - a callback function to let us know the status of our function
        // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        //
        //     console.log('File successfully written! - Check your project directory for the output.json file');
        //
        // })

    });
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!');
})

var server = app.listen(6003, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('gather listening at http://%s:%s', host, port);
});

exports = module.exports = app;
