var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var app = express();

app.get('/', function(req, res){

    // The URL we will scrape from - in our example Anchorman 2.
    url = 'http://www.imdb.com/title/tt1229340/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            $('.header').filter(function(){

                // Let's store the data we filter into a variable so we can easily see what's going on.
                var data = $(this);

               // In examining the DOM we notice that the title rests within the first child element of the header tag.
               // Utilizing jQuery we can easily navigate and get the text by writing the following code:
                title = data.children().first().text();

                // Once we have our title, we'll store it to the our json object.
                json.title = title;
            })
        }
        else {
            console.log("error!");
        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!');
    })
})

var server = app.listen(6003, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('gather listening at http://%s:%s', host, port);
});

exports = module.exports = app;
