
// SETUP WEB SERVER AND SOCKET
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

// SETUP TWITTER TLS HANDSHAKE SECRET KEY
var twit = new twitter({
  consumer_key: 'CONSUMER_KEY',
  consumer_secret: 'CONSUMER_SECRET',
  access_token_key: 'ACCESS_TOKEN_KEY',
  access_token_secret: 'ACCESS_TOKEN_SECRET'
}),
stream = null;
dbdata= new String();
Search_array = new Array();

console.log("We Are Live..")
// USE 8081 LOCAL PORT
server.listen(process.env.PORT || 8081);

// ROUTING SETUP
app.use(express.static(__dirname + '/public'));

function filterMatch(itemStr, keyword) {
  var words = keyword.split(' '),
    i = 0,
    w, reg;
  for (; w = words[i++];) {
    reg = new RegExp(w, 'ig');
    if (reg.test(itemStr) === false) return false; // word not found
    itemStr = itemStr.replace(reg, ''); // remove matched word from original string
  }
  return true;
}

//Load Python Shell Interaction
var PythonShell = require('python-shell');
// REGEX TO CLEAN OUT THE #HASHTAGS HTTPS::/ @REFFERENCES NON-ASCII Characters
var re = /(#\S*)|([^\x00-\x7F]+)|(http.?:\/\/\S*)|(\d+)|(@\S*)/g;

// Extract timestamps out of the Tweets
var t_stamp = /(:\d\d\s)/g;

//WebSocket On connection Operations
io.sockets.on('connection', function (socket) {
  socket.on("start tweets", function(input_field, adv_search) {
    var temp_str = input_field.toString();
    // Configure Python-Shell Options
    var options = {
    mode: 'text',
    pythonPath: '~/anaconda2/envs/conda_virtualenv/bin/python',
    pythonOptions: ['-u'],
    args: [temp_str]
    };
    if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
      twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
          stream.on('data', function(data) {
              // Does the JSON result have coordinates
              if (data.coordinates && adv_search === true){
                if (data.coordinates && data.lang === 'en'){
                  //-----------------TWITT POST PROCESS--------------------
                      PythonShell.run('dbpedia.py', options, function (err, results) {
                      if (err) throw err;
		      // Apply Deep Matching Pattern between DBPEDIA results and Tweet
                      else
                      {
                        Search_array = results.toString().toLowerCase().split(',');
                        sanitized_tweet = data.text.toString().toLowerCase().replace(re, '');

                        for ( i=0; i < Search_array.length;i++)
                        {
                        if(filterMatch(sanitized_tweet, Search_array[i]))
                          {
			    // TIMESTAMPS
                            if(data.created_at){
                              t_date = data.created_at;
                              time_stamp = t_date.toString().toLowerCase().match(t_stamp);
                              dt = time_stamp[0]
                              dt = dt.replace(':', '')
                              var stamped_tweet = {'t':Number(dt),'v':1}
			      // Socket Emit timestamp
                              socket.broadcast.emit("timestamp",stamped_tweet);
                              socket.emit('timestamp', stamped_tweet);
                            }
                            var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};
                            socket.broadcast.emit("twitter-stream", outputPoint);
                            // Send Tweet's Geolocation to Google Heat Map Layer
                            socket.emit('twitter-stream', outputPoint);
                            break;
                          }
                        else
                          {
                            continue;
                          }
                        }
                      }
                    });
                }
              }
           });
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });
              stream.on('warning', function(warning) {
                return console.log(warning);
              });
              stream.on('disconnect', function(disconnectMessage) {
                socket.emit('disconnect', function(){});
              });
          });
    }
  });
    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});
