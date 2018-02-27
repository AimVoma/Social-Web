var tweets = []
trigger=false;

//Utilizing Canva.js Library to render Run-Time Tweets on Chart Graph
function ShowGraph () {
      var chart = new CanvasJS.Chart(document.getElementById("chartContainer"),{
        animationEnabled: false,
        backgroundColor: '#131E23', 
        title :{
          text: "Volume Of Incoming Tweets",
          fontColor: "lightblue"
        },        
        axisX:{
          title: "Time Frame Of 60K ms",
          titleFontColor: "lightblue",
          lineThickness: 3,
          lineColor: "lightblue",  
          labelFontColor: "lightblue",
          color:'#A4E4FF'
        },
        axisY:{
          title: "Sampling Metrics",
          titleFontColor: "lightblue",
          lineThickness: 3,
          lineColor: "lightblue",  
          labelFontColor: "lightblue"
      },
        legend: {
          fontColor: "lightblue"
        },
        data: [{
          type: "stackedArea",
          showInLegend: true, 
          name: "series1",
          legendText: "Tweets",
          dataPoints : tweets
        }]
      });

      chart.render();
}

//Initializing Google Maps[Heat Map] Layer
function initialize(submit_field, adv_search) 
{
  var dark_style_theme = 
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];
  //Initialize Google Maps
  var Gmap = new google.maps.Map(document.getElementById("map_canvas"),
  {
    styles: dark_style_theme,
    zoom: 3,
    center: {lat: 53.120, lng: 3.164},
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    }
  });
  
  //Setup heat map and link to Twitter array[MVC] in which we will append data
  var heatmap;
  var liveTweets = new google.maps.MVCArray();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: liveTweets,
    radius: 25
  });
  var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)', 
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
heatmap.setMap(Gmap);

  if(io !== undefined) 
  {
      // Web Sockets Initialiation
      var socket = io.connect('/');

      //Add Listener callback to Twitter-Stream channel for incoming tweets
      socket.on('twitter-stream', function (data) {

      //Add tweet to the heat map array.
      var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
      liveTweets.push(tweetLocation);

      //Flash a tweet dot onto the map quickly
      var image = "css/twitter-dot.png";
      var marker = new google.maps.Marker({
        position: tweetLocation,
        map: Gmap,
        icon: image
      });
      //(visualization interval delay : 600ms)
      setTimeout(function(){
        marker.setMap(null);  
      },600);

    });
    //Listen for tweets timestamps
    socket.on('timestamp', function(tweet){
      found = false;
      //Provide Illustration Graph depended on incoming tweets timestamp
      if(tweets.length == 0)
      {
        tweets[0] = {x:tweet.t,y:tweet.v};
      }
      else if(tweets[0].x === tweet.t  && !trigger)
      {
        for(var i=0;i< tweets.length;i++)
        {
          if(tweets[i].x === 00)
          {
            var sum_y= 0
            var average = 0
            for(var i=0;i< tweets.length;i++)
            {
              sum_y+=tweets[i].y
            }
            average = sum_y / 60;
            console.log(average);
            for(var i=0;i< tweets.length;i++)
            {
              tweets[i].y = average;
              console.log(tweets[i].x)
            }

            setTimeout(function() {ShowGraph()}, 750); 
            trigger=true;
            break;
          }
        } 
      }
      else
      {
        if(trigger)
          ;
        else
        {
        for(var i=0;i< tweets.length;i++)
        {
          if(tweets[i].x === tweet.t)
          {
            tweets[i].y+=1
            found = true;
            break;
          }
          continue;
        }
        if(!found)
        {
          tweets.push({x: tweet.t, y: tweet.v});
        }
        }
      }
      if(!trigger)
      {
        setTimeout(function() {ShowGraph()}, 450);
      }
    });

    // Listens for a success response from the server
    socket.on("connected", function(r) {

    //Emit to the server that we are ready to start receiving tweets.
    socket.emit("start tweets", submit_field, adv_search);
    });
  }
}
