$(document).ready(function(){

  var restaurantPrices = [];
  var rvAllowed = false;
  var internet = false;
  var userRating = -1;
  var bougieScore = 0;
  var bougieLabel = 'Bad';
  var stateAbbreviations = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
   'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  function calculateBougieScore() {
  bougieScoreRestaurant();
  bougieScorePrice();
  bougieScoreRV();
  bougieScoreInternet();
  bougieScoreUser()
  };
  function bougieScoreRestaurant() {
  if (restaurantPrices.length > 0) {
    bougieScore++
  }; //close if; nearbyRestaurants
  } //close function; bougieScoreRestaurant
  function bougieScorePrice() {
  var price2 = restaurantPrices.indexOf(2);
  var price3 = restaurantPrices.indexOf(3);
  var price4 = restaurantPrices.indexOf(4);
  if (price4 > -1) {
      bougieScore += 3
  } //close if; price4
  else if (price3 > -1) {
      bougieScore += 2
  } //close if; price3
  else if (price2 > -1) {
      bougieScore++
  } //close if; price2
  } //close function; bougieScorePrice
  function bougieScoreRV() {
  if (rvAllowed) {
    bougieScore++
  } //close if; rvAllowed
  }//close function; bougieScoreRV
  function bougieScoreInternet() {
  if (internet) {
    bougieScore++
  } //close if; internet
  }//close function; bougieScoreInternet
  function bougieScoreUser() {
  if (userRating > .5) {
    bougieScore += 4
  } //close if; userRating
  else if (userRating < .5 && userRating >= 0) {
    bougieScore -= 4
  } //close else if; userRating
  }//close function; bougieScoreUser

  function setBougieLabel() {
    if (bougieScore >= 3) {
      bougieLabel = 'Bougie'
    }
  }

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
  var parksQueryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=ebkHAQqxYcIP2uGebz8ASYNVFfvte7BsrBhfhAvC";
  var campgroundsQueryURL = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&api_key=ebkHAQqxYcIP2uGebz8ASYNVFfvte7BsrBhfhAvC";
  var parksResults;
  var campgroundsResults;

  // ajax calls to NPS API
  function parksAJAX() {
    return $.ajax({
    url: parksQueryURL,
    method: "GET",
    dataType:"json",
    success: function(parksData) {
      parksResults = (parksData.data);
    }
  });
} //close function, parksAJAX

  function campgroundsAJAX() {
    return $.ajax({
    url: campgroundsQueryURL,
    method: "GET",
    dataType:"json",
    success: function(campgroundsData) {
      campgroundsResults = (campgroundsData.data);
    }
  });
} //close function, campgroundsAJAX

  $.when(parksAJAX(), campgroundsAJAX()).done(function(parksData, campgroundsData) {
  $(".card-group").attr('class', 'animated slideOutDown');
  $(".card-group").remove();
  console.log(parksResults);
  console.log(campgroundsResults);
  $("#parksHead").append("<tr><th>Park Name</th><th>Image</th><th>Bad or Bougie</th></tr>");
  $('#nanp-view').attr('class', 'animated slideInLeft');


  function setCampgroundVars() {
    rvAllowed = campgroundsResults[j].accessibility.rvAllowed;
    internet = campgroundsResults[j].amenities.internetConnectivity;
  }

  for(var i = 0;i<parksResults.length;i++){
    var designation = parksResults[i].designation;
    var nationalPark = designation.includes('National Park');
    if(designation === 'National and State Parks' || designation === 'National Park' || designation === 'National Park & Preserve'){
    var parkName = parksResults[i].name;
    console.log('parkName', parkName);
    var description = parksResults[i].description;
    var parkCode = parksResults[i].parkCode;
    var stampLocation = 'assets/images/Click Pics/' + parkName + '.jpg';
    var stampImage = '<img class="stamp", src="' + stampLocation + '" alt="' + parkName + ' Image">';
    var parkll = (getNumbers(parksResults[i].latLong));

    var foursquareURL = "https://api.foursquare.com/v2/venues/search?limit=10&categoryId=4d4b7105d754a06374d81259&ll="+parkll[0]+",-"+parkll[1]+"&radius=16094&client_id=X3USWU4Z2XO3SG41Q3WKGHOKSLOJQMD2J3MC44CKGOG0TVMI&client_secret=RUFZMWJCR1NEAP2T1WJSGQXNM5Q3PMWCWCFYEYW4X12SQEPU&v=20171231";
    $.ajax({
      url: foursquareURL,
      method: "GET"
    }).done(function(foursquareData) {
        var foursquareResults = (foursquareData.response)
        console.log(foursquareResults);
      });//End of function npData

      for (var j = 0; j < campgroundsResults.length; j++) {
        if (campgroundsResults[j].parkCode === parksResults[i].parkCode) {
          setCampgroundVars();
          console.log('rvAllowed', rvAllowed);
          console.log('internet', internet);
        }; //close if, campground within park
      }; //close loop, get campground data
      console.log("bougieScore", bougieScore);

      var appendRow = $("#parks-table > tbody").append("<tr><td>" + parkName + "</td><td>" + stampImage + "</td><td>" + bougieLabel + "</td></tr>");
      appendRow.attr('class', 'animated slideInLeft');
    }//End of if, designation
    }//End of loop, display name, description
  });//End of function parksData, campgroundsData
}; // close else, input validation
});//End of onclick function

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
