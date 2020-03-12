var modulus = ""; //HTML file that will show card module
var card_number = 0; //Card number that is used to identify what card has been clicked
var index_of_card = 0; //index of card in list_of_visible_cards
var list_of_visible_cards = []; //list_of_visible_cards
// default_profile that would be shown when someone will click on profile
var default_profile = {
    cell: "ERROR_DIDN't_LOAD0",
    dob: {
    date: "ERROR_DIDN't_LOAD1",
  },
  email: "ERROR_DIDN't_LOAD2",
  location: {
    street: "ERROR_DIDN't_LOAD3",
    city: "ERROR_DIDN't_LOAD4",
    state: "ERROR_DIDN't_LOAD5",
    postcode: 404
  },
  name: {
    title: "ERROR_DIDN't_LOAD6",
    first: "ERROR_DIDN't_LOAD7",
    last: "ERROR_DIDN't_LOAD8"
  },
  picture: {
    large: ""
  }
};
//Ajax the API
$.ajax({
  url:
  "https://randomuser.me/api/?results=12&?nat=AU"
}).done(function(information) {
  cast_preview_list(information.results); //creating list of 12th card for preview
  create_modulus_html(default_profile) //Creating personolized card for each of humans
    .insertAfter("#gallery") //inserting cards in right place
    .hide(); //hiding them to escape error
    $("#modal-close-btn").on("click", function() {//Adding closing button for card
      $(".modal-container").hide();
    }); 
    $(".modal-btn-container").on("click", ".btn", function() { //adds ability to cycle throught list
      if ($(this).attr("id") === "modal-next") {
        if (index_of_card < list_of_visible_cards.length - 1) {
          index_of_card += 1;
        } else {
          index_of_card = 0;
        }
      } else {
        if (index_of_card > 0) {
          index_of_card -= 1;
        } else {
          index_of_card = list_of_visible_cards.length - 1;
        }
      }
      upateModulus(card_number = list_of_visible_cards[index_of_card]);
    }); //adding ability to move move_through_list
  default_profile = information.results;
  Search();
})
/**
 * This function adds preview cards to the list and shows them to the users
 *
 * @param {*} default_profile - creating preview cards and adding them to main screen
 */
function cast_preview_list(default_profile) {
  var preview_list = ""; //Creating string that will be added as html to index
  $.each(default_profile, function(index, card) { //Casting html for each profile
    preview_list += `<div class="card">
          <div class="card-img-container">
          <img class="card-img" src="${card.picture.large}" alt="profile picture">
          </div>
          <div class="card-info-container">
          <h3 id="name" class="card-name cap">${card.name.first} ${card.name.last}</h3>
          <p class="card-text">${card.email}</p>
          <p class="card-text cap">${card.location.street.number} ${card.location.street.name},${card.location.city}, ${card.location.state}</p>
          </div>
          </div>`;
          list_of_visible_cards.push(index);  //pushing string to showing strings list
  });

  $("#gallery").html(preview_list); //adding html to gallery list
}
/**
 * This function will return modulus card for card 
 * @param {*} card 
 */
function create_modulus_html(card) {
  modulus = `<div class="modal-container"> <div class="modal">
  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
  <div class="modal-info-container">
  <img class="modal-img" src="${card.picture.large}" alt="profile picture">
  <h3 id="name" class="modal-name cap">${card.name.title} ${card.name.first} ${card.name.last}</h3>
  <p class="modal-text">${card.email}</p>
  <p class="modal-text cap">${card.location.city}</p>
  <hr>
  <p class="modal-text">${card.cell}</p>
  <p class="modal-text">${card.location.street}, ${card.location.city}, ${card.location.state} ${card.location.postcode}</p>
  <p class="modal-text">Birthday: ${card.dob.date}</p>
  </div>
  </div>
  <div class="modal-btn-container">
  <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
  <button type="button" id="modal-next" class="modal-next btn">Next</button>
  </div>
  </div>`;
  return $(modulus);
}

/**
 *
 *This function creates search bar and searches directory by name
 */
function Search() {
  $(".search-container").html(`
  <form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
</form>`);
//^I have deleted submit button, because I use dynamic search
  $('#search-input').keyup(() => { //when user unpresses the key, search is made
    var finding = $("#search-input").val().toLowerCase();//Getting search value from input field in to lower case
    list_of_visible_cards = [];//Reseting list of visible cards
    if (finding === "") {//if search value is null, show all cards
      $(".card").show();
    } else {
      $(".card").hide();
      $.each(default_profile, function(index, value) { //if there are search value, that we are searching for the show this card
        if (
          value.name.last.toLowerCase().indexOf(finding) != -1 || value.name.first.toLowerCase().indexOf(finding) != -1
        ) {
          $(".card") //showing card by index
            .eq(index)
            .show();
        }
      });
    }
  });
}
/**
 *
 *Update modulus after each search + adding some buttons
 * @param {*} card
 */
function upateModulus(modulus) {
  var modulus = default_profile[modulus];
  $(".modal-img").attr("src", `${modulus.picture.large}`); //adding image
  $(".modal-name").html(
    `${modulus.name.title} ${modulus.name.first} ${modulus.name.last}` //adding title+name
  );
  $(".modal-text")
    .eq(0)
    .html(`${modulus.email}`); //adding email
  $(".modal-text")
    .eq(1)
    .html(`${modulus.location.city}`); //adding city
  $(".modal-text")
    .eq(2)
    .html(`${modulus.cell}`); //adding phone number
  $(".modal-text")
    .eq(3)
    .html(
      `${modulus.location.street.number} ${modulus.location.street.name}, ${modulus.location.city}, ${modulus.location.state} ${modulus.location.postcode}` //adding full adress
    );
  $(".modal-text")
    .eq(4)
    .html(`Birthday: ${modulus.dob.date.substring(0,10)}`);  //adding DoB without additional data
}
//When somebody clicks card the modulus is shown
$("#gallery").on("click", ".card", function() {
  card_number = $(this).index();
  index_of_card = list_of_visible_cards.indexOf($(this).index());
  upateModulus($(this).index()); //update data of this index
  $(".modal-btn-container").show();
  if (list_of_visible_cards.length < 12) {
    $(".modal-btn-container").hide(); //if only one card is shown then there is no need for next or prev button
  }
  $(".modal-container").show(); //showing modulus container
});

