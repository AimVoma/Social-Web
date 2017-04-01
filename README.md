<h1 align="center">
  <b>Social-Web Project 2017 All Rights Reserved</b><br><br>
</h1>

<p align="center">
<b> TEAM 17 </b><br>
    Harry Obaseki<br>
    Ana-Liza Tjon-a-Pauw<br>
    Tibor Vermeij<br>
    Aimilios Voma<br>
    Ediz Yildirim<br>
</p>
<br>
<br>

    
   
    
    
    
<h3 align="center">
<b> Application Description</b>
<br>
</h3>

Provided the search key, the application performs a SPARQL query on the DBpedia searching for synsets of the related string.
At the same time a socket communication is established between the Front Interface and the Server, triggering the Twitter's Public Stream API to receive the incoming tweets.
<br>
<br>
<br>
<p align="center">
![alt tag](http://i.imgur.com/v1RCkQy.jpg)
</p>
<br>
<br>
<br>
Furthermore the DBpedia results(touples) are post-processed and refined, in order to be matched as possible with the tweeter's data layout(short string patterns). Once the touples are refined and the Public Stream is feeding us run time tweets, we permorm a matching operation between the tweets and the synsets touples. On full match between one of the synsets touples and the tweet we visualize the tweet(passing the geolocation from server to Front Interface Heat Map via web sockets), in other case the tweet is simply discarded. Lastly we perform a basic metric graph that sampling the overall tweets throughput in time-frame of 60 seconds, by analyzing the matched tweet timestamps. 
<br>
<br>
<br>
<p align="center">
![alt tag](http://i.imgur.com/8Pa9IyF.jpg)
</p>
<br>
<br>
<br>
The Graph indicates signs of tweet's popularity calculating the mean value of tweet's occurances when sampling time period is finished.
<br>
<br>
<p align="center">
![alt tag](http://i.imgur.com/IWZSAjv.jpg)
</p>
<br>
<br>







# Dependencies

<b> JavaScript </b><br>
npm install package.json

<b> Python </b><br>
Anaconda, NLTK collection

# Run Application
node start_server.js
