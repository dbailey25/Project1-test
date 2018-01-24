$(document).ready(function(){

  var parkNameArray = [];
  var restaurantScoreArray = [];
  var campgroundScoreArray = [];
  var stateAbbreviations = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
   'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  function calculateBougieScore() {
  bougieScoreRestaurant();
  bougieScoreToilets();
  bougieScoreRV();
  bougieScoreInternet();
  bougieScoreUser()
  };

  $("#nanp-input").keyup(function(event) {
      if (event.keyCode === 13) {
          $("#find-nanp").click();
      }
  });



  $("#nanp-input").keyup(function(event) {
      if (event.keyCode === 13) {
          $("#find-nanp").click();
      }
  });

$("#find-nanp").on("click", function(event) {
  event.preventDefault();
  var state = $("#nanp-input").val();
  console.log(state);
  var input = state.toUpperCase();
  console.log("input", input);
  // verify the user input is valid
  var validInput = stateAbbreviations.includes(input)
  if (!validInput) {
    console.log('Input is not valid');
    // modal to instruct user to enter valid state abbreviation
        $('#myModal').modal('show');
        $("#nanp-input").val('');

  } // close if; input validation
  else {
    console.log('Input is valid');
    // clear previous elements
    $(".card-group").remove();
    $("#parksHead").empty();
    $("#parks-table > tbody").empty();
    // display table header
    $("#parksHead").append("<tr><th>Park Name</th><th>Image</th><th>Bad or Bougie</th></tr>");
    // display progress indicator
    var loading = $('<div>', {id:'loading', text:'Loading...'});
    $("#parksHead").append(loading);

  var parksQueryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=ebkHAQqxYcIP2uGebz8ASYNVFfvte7BsrBhfhAvC";


  var parksResults;


  // ajax call to NPS/parks API
  function parksAJAX() {
    return $.ajax({
    url: parksQueryURL,
    method: "GET",
    dataType:"json",
    success: function(parksData) {
      parksResults = (parksData.data);
    } // close function, success
  }); // close ajax call
} //close function, parksAJAX







// NPS/parks API call

  // $.ajax({
  // url: campgroundsQueryURL,
  // method: "GET"
  // }).done(function(campgroundsData) {
  //
  // }

  $.when(parksAJAX()).done(function(parksData) {
    console.log(parksResults);

  for(var i = 0;i<parksResults.length;i++){
    var userRating = -1;
    var restaurantScore = 0;
    var campgroundScore = 0;
    var bougieLabel = 'Calculating...';
    var bougieLabelArray = [];
    var designation = parksResults[i].designation;
    var nationalPark = designation.includes('National Park');
    if(designation === 'National and State Parks' || designation === 'National Park' || designation === 'National Park & Preserve'){

    var parkName = parksResults[i].name;
    parkNameArray.push(parkName);
    var description = parksResults[i].description;
    var parkCode = parksResults[i].parkCode;
    var stampLocation = 'assets/images/Click Pics/' + parkName + '.jpg';
    var stampImage = '<img class="stamp", src="' + stampLocation + '" alt="' + parkName + ' Image">';
    $('#loading').remove();
    var appendRow = $("#parks-table > tbody").append("<tr><td>" + parkName + "</td><td>" + stampImage + "</td><td id='" + parkCode + "'>" + bougieLabel + "</td></tr>");

    // function campgroundsAJAX() {
    //   return $.ajax({
    //   url: campgroundsQueryURL,
    //   method: "GET",
    //   dataType:"json",
    //   success: function(campgroundsData) {
    //     campgroundsResults = (campgroundsData.data);
    //   } // close function, success
    // }); // close ajax call
    // } //close function, campgroundsAJAX

    // Foursquare API call
    var parkll = (getNumbers(parksResults[i].latLong));
    console.log(parkll);
    var foursquareURL = "https://api.foursquare.com/v2/venues/search?limit=5&categoryId=4d4b7105d754a06374d81259&ll="+parkll[0]+",-"+parkll[1]+"&radius=16094&client_id=X3USWU4Z2XO3SG41Q3WKGHOKSLOJQMD2J3MC44CKGOG0TVMI&client_secret=RUFZMWJCR1NEAP2T1WJSGQXNM5Q3PMWCWCFYEYW4X12SQEPU&v=20171231";

      $.ajax({
      url: foursquareURL,
      method: "GET"
    }).done(function(foursquareData) {
        var foursquareResults = (foursquareData.response)
        console.log(foursquareResults);
        var restaurantsNearby = foursquareResults.venues.length;
        if (restaurantsNearby > 0) {
            console.log('food is close');
            restaurantScore++
        }; //close if; nearbyRestaurants
        restaurantScoreArray.push(restaurantScore);
        console.log('Food Score ' + restaurantScore);

    // NPS/campgrounds API call
    var campgroundsQueryURL = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&api_key=ebkHAQqxYcIP2uGebz8ASYNVFfvte7BsrBhfhAvC";

      $.ajax({
      url: campgroundsQueryURL,
      method: "GET"
    }).done(function(campgroundsData) {
        var campgroundsResults = (campgroundsData.data);
        console.log(campgroundsResults);

            // check each campground for bougie amenities
            for (var j = 0; j < campgroundsResults.length; j++) {
              var campCode = campgroundsResults[j].parkCode;
              var flushToilets = 0;
              var rvAllowed = 0;
              var hasInternet = 0;
              var toiletArray = campgroundsResults[j].amenities.toilets;
              var toiletType = toiletArray[0];
              // console.log(toiletType);
              if (toiletType.includes('Flush')) {
                flushToilets++
              };
              console.log('flushToilets', flushToilets);
              var rvOK = campgroundsResults[j].accessibility.rvAllowed;
              if (rvOK === 1) {
                rvAllowed++
              };
              console.log('rvAllowed', rvAllowed);
              var internet = campgroundsResults[j].amenities.internetConnectivity;
              if (internet) {
                hasInternet++
              }
              console.log('hasInternet', hasInternet);

            // update campgroundScore based on campground amenities
                    if (flushToilets + rvAllowed + hasInternet >= 2) {
                        bougieLabel = 'Bougie'
                    } //close if
                    else {
                      bougieLabel = 'Bad'
                    }

                    // if (flushToilets > 0) {
                    //     campgroundScore ++
                    // }; //close if; flush toilets
                    //
                    // if (rvAllowed > 0) {
                    //   campgroundScore++
                    // }; //close if; rvAllowed
                    //
                    // if (hasInternet > 0) {
                    //   campgroundScore++
                    // }; //close if; internet
                    campgroundScoreArray.push(campgroundScoreArray);
                  console.log('campgroundScore', campgroundScore);

                  // flushToilets = 0;
                  // rvAllowed = 0;
                  // hasInternet = 0;

                //   function setBougieLabel() {
                // if (restaurantScore + campgroundScore >= 3) {
                //   bougieLabel = 'Bougie'
                // }
                // else {
                //   bougieLabel = 'Bad'
                // }
                // }
                var codeSelector = '#' + campCode ;
                console.log(codeSelector + bougieLabel);
                $(codeSelector).text(bougieLabel);

                flushToilets = 0;
                rvAllowed = 0;
                hasInternet = 0;
            } // close loop, check each campground



    }); // close function campground response

  }); //End of function foursquare response


  //   $.when(campgroundsAJAX(), foursquareAJAX()).done(function(campgroundsData, foursquareData) {
  //     console.log(campgroundsResults);
  //     console.log(foursquareResults);
  //     console.log(parkName);
  //
  //
  //
  //
  //

  //

  //       // function bougieScoreUser() {
  //       // if (userRating > .5) {
  //       //   bougieScore += 4
  //       // } //close if; userRating
  //       // else if (userRating < .5 && userRating >= 0) {
  //       //   bougieScore -= 4
  //       // } //close else if; userRating
  //       // }//close function; bougieScoreUser
  //
  //           bougieScoreToilets();
  //           bougieScoreRV();
  //           bougieScoreInternet();
  //           // bougieScoreUser()
  //
  //           // setBougieLabel();
  //
  //
  // }); // close function, campgroundsData,foursquareData

  }//End of if, designation
    else {
      $('#loading').text('No results found. Search for another state.')
    } // end of else, designation
} //End of loop, parse parksData
  }); //End of function parksData
}; // close else, input validation
}); //End of onclick function

}); //Close function, document.ready

function getNumbers(inputString){
    var regex=/\d+\.\d+|\.\d+|\d+/g,
        results = [],
        n;
    while(n = regex.exec(inputString)) {
        results.push(parseFloat(n[0]));
    }
    return results;
}
