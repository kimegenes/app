// A container for a tweet object.
var Tweet = Backbone.Model.extend({});

// A basic view rendering a single tweet
var TweetView = Backbone.View.extend({
    tagName: "li",
    className: "tweet",

    render: function() {
        var artist = this.model.get("Artist");
        var release = this.model.get("Album:Release");
        // just render the tweet text as the content of this element.
        $(this.el).html(artist.name);
         $(this.el).append('--');       
        //$(this.el).append(release.title);
        return this;
    }
});

// A collection holding many tweet objects.
// also responsible for performing the
// search that fetches them.
var Tweets = Backbone.Collection.extend({
    model: Tweet,
    initialize: function(models, options) {
        this.query = options.query;
    },
    /*
    url: function() {
        return "http://search.twitter.com/search.json?q=" + this.query + "&callback=?";
    },
    */
    //url: "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo",
    url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20music.track.popular&format=json",
    parse: function(data) {
        // note that the original result contains tweets inside of a results array, not at 
        // the root of the response.
        return data.query.results.Track;
        //return data.geonames;
        
    }
});

// A rendering of a collection of tweets.
var TweetsView = Backbone.View.extend({
    tagName: "ul",
    className: "tweets",
    render: function() {

        // for each tweet, create a view and prepend it to the list.
        this.collection.each(function(tweet) {
            var tweetView = new TweetView({
                model: tweet
            });
            $(this.el).prepend(tweetView.render().el);
        }, this);

        return this;
    }
});

// Create a new cat tweet collection
var catTweets = new Tweets([], {
    query: "cats"
});

// create a view that will contain our tweets
var catTweetsView = new TweetsView({
    collection: catTweets
});

// on a successful fetch, update the collection.
catTweets.fetch({
    success: function(collection) {
        $('#example_content').html(catTweetsView.render().el);
    }
});
