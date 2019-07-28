//---------------------Variables----------------------------------------
require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require('./keys');
var inquirer = require("inquirer");
var moment = require("moment");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var reviewCondition = false;
var omdb = process.env.OMDB_API;


//---------------------Functions----------------------------------------

//================================== File System use =============================================
function writeData(data) {
    fs.appendFile("log.txt", data, function(err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }
    });
};

//========================================== SPOTIFY =============================================
var artistName = function(artist) {
    return JSON.stringify(artist.name);
}


//SPOTIFY Function Call
function spotifyAxiosCall(reviewCondition) {

    // If the conditions are false
    if (reviewCondition == false) {
        // Use inquirer to prompt response from user
        inquirer.prompt([{
                type: "input",
                message: "What song would you like to get info on?",
                name: "input"
            }, ])
            .then(function(inqResponse) {
                querySearch = inqResponse.input;

                // Use the default response if theres no input
                if (querySearch == "") {
                    querySearch = "The Sign";
                };

                // Spotify API call default (The Sign)
                spotify
                    .search({ type: 'track', query: querySearch })
                    .then(function(data) {
                        // Make the border using the ♫ unicode charcter 
                        console.log('\n');
                        writeData('\n');
                        console.log('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫');
                        writeData('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫\r\n');

                        // Use Moment for time formatting
                        time = (('Time logged: ') + (moment().format("MM-DD-YYYY hh:mma")));
                        console.log(time);
                        writeData(time + '\r\n');

                        var songs = data.tracks.items;

                        // Loop thru response data to pull required parameters
                        for (var i = 0; i < songs.length; i++) {

                            count = i + 1;
                            console.log(count);
                            writeData(count + '\r\n');

                            artist = ('Artist(s): ', songs[i].artists.map(artistName).join(", "));
                            console.log(artist);
                            writeData(artist + '\r\n');

                            song = ('Song name: ', songs[i].name);
                            console.log(song);
                            writeData(song + '\r\n');

                            previewURL = ('Preview song: ', songs[i].preview_url);
                            console.log(previewURL);
                            writeData(previewURL + '\r\n');

                            album = ('Album: ', songs[i].album.name);
                            console.log(album);
                            writeData(album + '\r\n')

                            console.log('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫');
                            writeData('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫\r\n');
                        }
                    })

                // Error handling function
                .catch(function(err) {
                    console.error('Error occurred: ' + err);
                });
            });


        // If the conditions are true      
    } else if (reviewCondition == true) {

        // Spotify API call for selected
        spotify
            .search({ type: 'track', query: querySearch })
            .then(function(data) {
                reviewCondition = false;

                //Starting border for music
                console.log('\n');
                writeData('\n');
                console.log('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫');
                writeData('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫\r\n');

                // Use Moment for time formatting
                time = (('Time logged: ') + (moment().format("MM-DD-YYYY hh:mma")));
                console.log(time);
                writeData(time + '\r\n');

                var songs = data.tracks.items;

                // Loop thru response data to pull required parameters
                for (var i = 0; i < songs.length; i++) {

                    count = i + 1;
                    console.log(count);
                    writeData(count + '\r\n');

                    artist = ('Artist(s): ', songs[i].artists.map(artistName).join(", "));
                    console.log(artist);
                    writeData(artist + '\r\n');

                    song = ('Song name: ', songs[i].name);
                    console.log(song);
                    writeData(song + '\r\n');

                    previewURL = ('Preview song: ', songs[i].preview_url);
                    console.log(previewURL);
                    writeData(previewURL + '\r\n');

                    album = ('Album: ', songs[i].album.name);
                    console.log(album);
                    writeData(album + '\r\n')

                    console.log('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫');
                    writeData('♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫  ♫\r\n');
                }
            })
            .catch(function(err) {
                console.error('Error occurred: ' + err);
            });

    };
};

//========================================= SPOTIFY End ==========================================

//========================================== OBMD Call ===========================================
function omdbCall(reviewCondition) {

    if (reviewCondition == false) {
        // Use inquirer to get user to input movie
        inquirer.prompt([{
                type: "input",
                message: "What flick would you like info on?",
                name: "input"
            }, ])
            .then(function(inqResponse) {
                querySearch = inqResponse.input;

                // default as required
                if (querySearch == "") {
                    querySearch = "Mr. Nobody";
                };

                apikey = keys.omdb.api;

                // omdb api url
                request("http://www.omdbapi.com/?t=" + querySearch + "&y=&plot=short&r=json" + "&apikey=" + apikey, function(error, response, body) {

                    var jsonData = JSON.parse(body);

                    // If response code was 200 (good call)
                    if (!error && response.statusCode === 200) {

                        indent = ('\n');
                        console.log(indent);
                        writeData(indent + '\r\n');

                        divider = ("★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★");
                        console.log(divider);
                        writeData(divider + '\r\n');

                        time = (('Time logged: ') + (moment().format("MM-DD-YYYY hh:mma")));
                        console.log(time);
                        writeData(time + '\r\n');

                        title = ("Title: ", jsonData.Title);
                        console.log(title);
                        writeData(title + '\r\n');

                        yrReleased = ("Year Released: " + jsonData.Year);
                        console.log(yrReleased);
                        writeData(yrReleased + '\r\n');

                        IMDBRating = ("IMDB Rating: " + jsonData.imdbRating);
                        console.log(IMDBRating);
                        writeData(IMDBRating + '\r\n');

                        RT = ("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
                        console.log(RT);
                        writeData(RT + '\r\n');

                        country = ("Country Made: " + jsonData.Country);
                        console.log(country);
                        writeData(country + '\r\n');

                        lang = ("Language: " + jsonData.Language);
                        console.log(lang);
                        writeData(lang + '\r\n');

                        plot = ("Plot: " + jsonData.Plot);
                        console.log(plot);
                        writeData(plot + '\r\n');

                        actors = ("Actors: " + jsonData.Actors);
                        console.log(actors);
                        writeData(actors + '\r\n');

                        console.log(divider);
                        writeData(divider + '\r\n');

                    };
                });
            });

        // If conditions are true
    } else if (reviewCondition == true) {

        apikey = keys.omdb.api;
        reviewCondition = false;
        // OMDB call
        request("http://www.omdbapi.com/?t=" + querySearch + "&y=&plot=short&r=json" + "&apikey=" + apikey, function(error, response, body) {

            var jsonData = JSON.parse(body);

            // If response code was 200 (all good)
            if (!error && response.statusCode === 200) {

                indent = ('\n');
                console.log(indent);
                writeData(indent + '\r\n');

                divider = ("★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★  ★");
                console.log(divider);
                writeData(divider + '\r\n');

                time = (('Time logged: ') + (moment().format("MM-DD-YYYY hh:mma")));
                console.log(time);
                writeData(time + '\r\n');

                title = ("Title: ", jsonData.Title);
                console.log(title);
                writeData(title + '\r\n');

                yrReleased = ("Year Released: " + jsonData.Year);
                console.log(yrReleased);
                writeData(yrReleased + '\r\n');

                IMDBRating = ("IMDB Rating: " + jsonData.imdbRating);
                console.log(IMDBRating);
                writeData(IMDBRating + '\r\n');

                RT = ("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
                console.log(RT);
                writeData(RT + '\r\n');

                country = ("Country Made: " + jsonData.Country);
                console.log(country);
                writeData(country + '\r\n');

                lang = ("Language: " + jsonData.Language);
                console.log(lang);
                writeData(lang + '\r\n');

                plot = ("Plot: " + jsonData.Plot);
                console.log(plot);
                writeData(plot + '\r\n');

                actors = ("Actors: " + jsonData.Actors);
                console.log(actors);
                writeData(actors + '\r\n');

                console.log(divider);
                writeData(divider + '\r\n');
            };
        });

    };
};
//============================================ OBMD END =================================================

//===================================== BANDS-IN-TOWN call function =====================================
function bitApiCall(reviewCondition) {

    if (reviewCondition == false) {

        // Use inquirer for user input
        inquirer.prompt([{
                type: "input",
                message: "Which artist or band would you be interested in seeing live?",
                name: "input"
            }, ])
            .then(function(inqResponse) {
                querySearch = inqResponse.input;

                // There was no default defines inthe homework instructions so I chose Andrea Bocelli
                if (querySearch == "") {
                    querySearch = "Andrea Bocelli";
                };

                // Bands-In-Town API Call
                apikey = keys.bands.api;

                // Bands in Town API URL 
                request("https://rest.bandsintown.com/artists/" + querySearch + "/events?app_id=" + apikey + "&date=upcoming", function(error, response, body) {

                    var events = JSON.parse(body);

                    // If response code was 200 (all good)
                    if (!error && response.statusCode === 200) {

                        indent = ('\n');
                        console.log(indent);
                        writeData(indent + '\r\n');

                        performer = ('Events for: ', querySearch);
                        console.log(performer);
                        writeData(performer + '\r\n');

                        divider = ("♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪");
                        console.log(divider);
                        writeData(divider + '\r\n');

                        for (var i = 0; i < events.length; i++) {

                            console.log(i + 1);
                            console.log('Name of Venue: ', events[i].venue.name);
                            console.log('Location: ' + events[i].venue.city + ', ' + events[i].venue.country);
                            console.log('Date of Event: ', moment(events[i].datetime).format("MM-DD-YYYY"));
                            console.log('Time: ', moment(events[i].datetime).format("hh:mm a"))
                            console.log('');
                            console.log("♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪");

                        };
                    };
                });
            });
    } else if (reviewCondition = true) {

        // BIT API Call
        apikey = keys.bands.api;
        reviewCondition = false;

        // BIT API URL
        request("https://rest.bandsintown.com/artists/" + querySearch + "/events?app_id=" + apikey + "&date=upcoming", function(error, response, body) {

            var events = JSON.parse(body);

            // if response code was 200 (all good)
            if (!error && response.statusCode === 200) {

                console.log('\n');
                console.log('Events for: ', querySearch);
                console.log("♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪");

                // console.log("Bands in town data: ", events);
                for (var i = 0; i < events.length; i++) {

                    console.log(i + 1);
                    console.log('Name of Venue: ', events[i].venue.name);
                    console.log('Location: ' + events[i].venue.city + ', ' + events[i].venue.country);
                    console.log('Date of Event: ', events[i].datetime);
                    console.log('');
                    console.log("♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪  ♪");

                };
            };
        });
    };
};
//===================================== BANDS-IN-TOWN END =====================================




//====================================== DO-WHAT-IT-SAYS =======================================
function dwisFunc() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // error handling
        if (error) {
            return console.log(error);
        }

        // write to the log
        console.log(data);

        // Split it by commas
        var dataArr = data.split(",");
        operator = dataArr[0];
        querySearch = dataArr[1];

        console.log(dataArr);
        figureFunc(operator, querySearch, reviewCondition);

    });
};
//====================================== DO-WHAT-IT-SAYS end =======================================
//============================================ TV maze =============================================

//========================================== TV Maze end ===========================================
//=================================== Decide Function (logic flow) =================================
// Switch statement
function figureFunc(operator) {
    switch (operator) {
        case "spotify-this-song":
            spotifyAxiosCall(reviewCondition);
            break;

        case "movie-this":
            omdbCall(reviewCondition);
            break;

        case "concert-this":
            bitApiCall(reviewCondition);
            break;

        case "do-what-it-says":
            reviewCondition = true;
            dwisFunc(reviewCondition);
            break;

        default:
            console.log('Check to see your operation command was spelled correctly!');
            break;
    };
};
//======================================== Decide Function End =====================================


// app logic
function startApp() {
    //ask user question of what they would like to do
    inquirer.prompt([
            // Here we create a list of choices
            {
                type: "list",
                message: "What command would you like to run?",
                choices: ['spotify-this-song', 'movie-this', 'concert-this', 'do-what-it-says'],
                name: "command"
            },

        ])
        .then(function(inqResponse) {

            var operator = inqResponse.command;
            // var querySearch = inqResponse.input;


            //Switch case to decide what to do based on the operator specifiec
            figureFunc(operator);

        });
};

//--------------------------------------Intro console Logs--------------------------------
console.log("                                                           \n");
console.log('                          Thank you for checking out Liri.\n');
console.log("                     Some of our robot friends are here to assist");
console.log('                         you in finding some entertainment');
console.log('                                                              / = \\  ');
console.log('  you can choose from the list                               | oo  )  ');
console.log('  below, the options are:                                   __\\ = /__ ');
console.log('    spotify-this-song                       _____          /    _    \\ ');
console.log('    movie-this                             / ()  \\        / /| /.\\ |\\ \\ ');
console.log('    concert-this                        __|_______|__    | |   \\_/   | | ');
console.log('    do-what-it-says                    |  |  ===  |  |   | | | \\ / | | | ');
console.log('  and our robot friends will scour     |__|   O   |__|     # \\_   _/ #   ');
console.log('  the interplanetary net to get you     | |   O   | |        |  |  |  ');
console.log('  the information you seek!            _| | __*__ | |_       |  |  |  ');
console.log('         please, give it a shot!       | = \\_____/ = |       [] | []  ');
console.log('                                      / = \\ / = \\ / = \\      |  |  | ');
console.log('                                      [___] [___] [___]     /__] [__\\ ');
//-------------------------------------------- Intro End ---------------------------------

//------------------------------------------- Program Start ------------------------------

startApp();