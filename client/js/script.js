$(document).ready(function(){

  $('html, body').animate({ scrollTop: 0 }, 'fast');
  sessionStorage.clear();
  let url;

  // Get server config data
  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(config) {
      url = config.SERVER_URL + ":" + config.SERVER_PORT;
      generateLandingPageCards();
    },
    error: function() {
      console.log('Cannnot retrieve server url');
    }
  });


  // Display spinner on ajax requests
  let loadingTimer;

  $(document).ajaxStart(function(){
    $(".loader").css("display", "block");
    clearTimeout(loadingTimer);
  });

  $(document).ajaxComplete(function(){
    loadingTimer = setTimeout(function () {
      $(".loader").css("display", "none");
  }, 1500);
  });

  // Show and hide pages ===============================================================

  //check if there is any session sessionStorage
  if (sessionStorage.username) {
    // buttons
    $('#logoutBtn').show();
    $('.home-btn').show();
    $('#myPortfolioBtn').show();
    $('#loginBtn').hide();
    $('#signUpBtn').hide();
    showMemberName(sessionStorage.username);
    // pages
    $('#landingPage').show();
    $('#viewMorePage').hide();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadProductPage').hide();
    $('#updateProductPage').hide();
  } else {
    $('#logoutBtn').hide();
    $('#myPortfolioBtn').hide();
    $('.home-btn').show();
    $('#loginBtn').show();
    $('#signUpBtn').show();
    // pages
    $('#landingPage').show();
    $('#viewMorePage').hide();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadProductPage').hide();
    $('#updateProductPage').hide();
  }

  //Home button to show landing page
  $('.home-btn').click(function(){
    // pages
    $('#landingPage').show();
    $('#viewMorePage').hide();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadProductPage').hide();
    $('#updateProductPage').hide();
  });

  //Login button to show login page
  $('#loginBtn').click(function(){
    // pages
    $('#loginPage').show();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadProductPage').hide();
    $('#updateProductPage').hide();

  });

  //signup button to shoe register page
  $('#signUpBtn').click(function(){
    // pages
    $('#signUpPage').show();
    $('#projectPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#uploadProductPage').hide();
    $('#updateProductPage').hide();
  });

  // my portfolio button to show my portfolio page
  $('#myPortfolioBtn').click(function(){
    getMyAccountInfo();
    generatePersonalList('watchProducts');
    // pages
    $('#projectPage').show();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#uploadProductPage').hide();
    $('#updateProductPage').hide();
  });

  //upload projects button to show upload project page
  $('#addPortfolio').click(function(){
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    // pages
    $('#uploadProductPage').show();
    $('#projectPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updateProductPage').hide();

  });

  // back button to my portfolio page
  $('.back-portfolio').click(function(){
    // pages
    $('#projectPage').show();
    $('#uploadProductPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updateProductPage').hide();
  });

  //update projects button to show update project page
  $('#updateProject').click(function(){

    // pages
    $('#uploadProductPage').hide();
    $('#projectPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updateProductPage').show();
  });

  // delete projects button to show delete project page
  $('#deleteProject').click(function(){
    // pages
    $('#uploadProductPage').hide();
    $('#projectPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updateProductPage').hide();
  });

// edit button to scroll up on update page

$('.edit-button').click(function(){
      $('html, body').animate({ scrollTop: 0 }, 'fast');
});


  // Logout member 
  $('#logoutBtn').click(function(){
    sessionStorage.clear();
    $('#landingPage').show();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadProductPage').hide();
    $('#updatePortfolio').hide();
    location.reload("#loginForm");
  });

  // Register user
  $('#registerForm').submit(function(){
    event.preventDefault();
    let username = $('#registerUsername').val();
    let email = $('#registerEmail').val();
    let password = $('#registerPassword').val();
    $.ajax({
      url :`${url}/members/add`,
      type :'POST',
      data:{
        username : username,
        email : email,
        password : password
      },
      success : function(member){
        if (member !== 'Members name is already taken. Please choose another name') {
          Swal.fire({
            title: 'Account Created!',
            text: 'Your account has been created, please login to activate your account',
            icon: 'success',
            confirmButtonText: 'OK'
        });
          $('#loginBtn').show();
          $('#registerBtn').hide();
          $('#loginPage').show();
          $('#signUpPage').hide();
        } else {
          Swal.fire({
          title: 'Error!',
          text: 'Username already taken. Please try another one',
          icon: 'error',
          confirmButtonText: 'OK'
        });
          $('#registerUsername').val('');
          $('#registerEmail').val('');
          $('#registerPassword').val('');
        }
      },//success
      error:function(err){
        console.log(err);
      }//error
    });
  });


  // login member 
  $('#loginForm').submit(function(){
    event.preventDefault();
    let username = $('#inputUsernameLogin').val();
    let password = $('#inputPasswordLogin').val();

    $.ajax({
      url :`${url}/members/login`,
      type :'POST',
      data:{
        username : username,
        password : password
      },
      success : function(response){
        if (response === ' ') {
          Swal.fire({
            title: 'Empty Input Field',
            text: 'Please fill in all input fields',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        } else if (response === 'Member not found. Please register') {
          Swal.fire({
            title: 'Not Registered',
            text: 'Member not found. Please register',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        } else if (response === 'Not Authorized') {
          Swal.fire({
            title: 'Opps',
            text: 'Incorrect username or password',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(response));
          $('#logoutBtn').show();
          $('#myPortfolioBtn').show();
          $('#authBtnGroup-question').hide();
          $('#loginBtn').hide();
          $('#signUpBtn').hide();
          $('#landingPage').show();
          $('#loginPage').hide();
          $('html, body').animate({ scrollTop: 0 }, 'fast');
        }
      },//success
      error: function() {
        console.log('error: cannot call api');
      }//error
    });
  });

  // Add a product for sell
  $('#addProductForm').submit(function(){
    event.preventDefault();

    //at least 1 delivery option must be chosen
    let deliveryOpt1Checked = $('#addProductForm__delivery--pickup').prop('checked');
    let deliveryOpt2Checked= $('#addProductForm__delivery--courier').prop('checked');

    if (!deliveryOpt1Checked) {
      if (!deliveryOpt2Checked) {
        $('#addProductForm__missingDelivery').css('display', 'block');
        return;
      }
    }

    //at least 1 delivery option must be chosen
    let photoInput1 = $('#addProductForm__file').val();
    let photoInput2 = $('#addProductForm__photoUrl').val();

    if (photoInput1 === '') {
      if (photoInput2 === '') {
        $('#addProductForm__missingPhoto').css('display', 'block');
        return;
      }
    }
    
    let currentUserId = JSON.parse(sessionStorage.getItem('currentUser'))._id;

    // construct formdata object
    let form = $('#addProductForm')[0];
    let formdata = new FormData(form);
    formdata.append('seller', currentUserId);

      $.ajax({
        enctype: 'multipart/form-data',
        url :`${url}/products/add`,
        type : 'POST',
        data : formdata,
        processData: false,
        contentType: false,
        success : function(result){
          $('#addProductForm').trigger('reset');
          $('#uploadProductPage').hide();
          generatePersonalList('sellingProducts');
          $('#projectPage').show();
          $('html, body').animate({ scrollTop: 50}, 'fast');
        }, 
        error:function(){
          console.log('error: cannot call api');
        }
      });

  });

  document.getElementById('canceladdProductForm').addEventListener('click', function() {
    $('#addProductForm').trigger('reset');
    $('#uploadProductPage').hide();
    $('#projectPage').show();
  });

  // ===================================================================================
  // =============================== LANDING PAGE ======================================


  // Get all portfolios from all artists from backend
  function generateLandingPageCards() {

    $.ajax({
      url: `${url}/products`,
      type: 'GET',
      dataType: 'json',
      success: function(products) {
            makeProductCards(products);
      },
      error: function(error) {
            console.log('Error: ' + error);
      }
    });
  }

  // Map portfolios result from backend into product cards and attach to #artsDeck div
  function makeProductCards(arr) {
    document.getElementById('productsDeck').innerHTML = arr.map(product =>
                                                                  `<div class="card mb-4 col-sm-12 col-md-3">
                                                                      <img src="${product.photoUrl}" alt="Avatar" class="viewMoreButton mb-5">
                                                                      <div class="mx-1 my-1">
                                                                          <h5 class="productCard-title text-center">${product.title}</h5>
                                                                          <div class="productCard-columnWrap">
                                                                              <small class="mb-1">${product.format}</small>
                                                                              <small>${product.condition}</small>
                                                                          </div>
                                                                          <div id="toggleSection${product._id}" class="productCard-toggleSection" class="productCard-toggleSection">
                                                                              <div id="${product._id}" class="productCard-viewMoreLink buttonLink text-center">View more</div>
                                                                              <p id="productCard-price${product._id}" class="productCard-price mb-2">&dollar;${product.price}</p>
                                                                          </div>
                                                                      </div>
                                                                    </div>`
                                                                  ).join(' ');

    handleProductCardViewMoreButton();
  }

  function handleProductCardViewMoreButton() {
    // Show viewMoreLink when price section is hovered
    let toggleSections = document.getElementsByClassName('productCard-toggleSection');

    for (let i = 0; i < toggleSections.length; i++) {
        toggleSections[i].addEventListener('mouseover', showViewMoreLink.bind(null, toggleSections[i].id));
        toggleSections[i].addEventListener('mouseleave', showPrice.bind(null, toggleSections[i].id));
    }

    function showViewMoreLink(rawId) {
        let id = rawId.slice(13);

        $('#productCard-price' + id).css('opacity', '0');
        $('#toggleSection' + id).css('transform', 'translateX(33%)');
        $('#' + id).css('opacity', '1');
    }

    function showPrice(rawId) {
        let id = rawId.slice(13);

        $('#productCard-price' + id).css('opacity', '1');
        $('#' + id).css('opacity', '0');
        $('#toggleSection' + id).css('transform', 'translateX(-45%)');

    }

    // If viewMore button is clicked, show viewMorePage
    let viewMoreButtons = document.getElementsByClassName('productCard-viewMoreLink');

    for (let i = 0; i < viewMoreButtons.length; i++) {
        viewMoreButtons[i].addEventListener('click', getArtworkInfo);
    }
  }

  document.getElementById("filterButton").addEventListener('click', getFilteredArtworks);

  // If filter button is clicked, send query info to filter route in backend and re-generate #artDecks
  function getFilteredArtworks() {
    let minPrice = (JSON.parse($("#filterDropdown-byPrice").val())).min;
    let maxPrice = (JSON.parse($("#filterDropdown-byPrice").val())).max;
    let category = $("#filterDropdown-byCategory").val();

    $.ajax({
      url: `${url}/filterPortfolios/${minPrice}/${maxPrice}/${category}`,
      type: 'GET',
      success: function(response) {
            if (response === 'Sorry, there is no artwork that matches your search!') {
              document.getElementById('artsDeck').innerHTML = `
                                                                <div class="row mx-auto">
                                                                    <h5 class="text-center mt-5 mb-5">
                                                                        Sorry, there is no artwork that matches your search!
                                                                    </h5>
                                                                </div>`;
            } else {
              makeProductCards(response);
            }
      },
      error: function(error) {
            console.log('Error: ' + error);
      }
    });
  }


  // ===================================================================================
  // ============================= VIEW MORE PAGE ======================================


  // Get info of the artwork being clicked on from backend
  function getArtworkInfo(e) {
    console.log(e);
    let id = e.target.id;
    console.log(id);

    $.ajax({
      url: `${url}/products/${id}`,
      type: 'GET',
      dataType: 'json',
      success: function(product) {
            generateViewMoreHTML(product[0]);
            sessionStorage.setItem('currentProduct', JSON.stringify(product[0]));
            $("#viewMorePage").show();
            $("#projectPage").hide();
            $("#landingPage").hide();

            if (product[0].comments.length === 0) {
                document.getElementById('viewMorePage-comments').innerHTML =
                                                                            `<div id="noCommentNote"
                                                                                  class="text-center mt-5">
                                                                                  There has not been any question about this artwork.</div>`;
                return;
            }
      },
      error: function(error) {
            console.log('Error: ' + error);
      }
    });
  }

  // Generate viewMorePage HTML and attach to #viewMorePage div
  function generateViewMoreHTML(product) {
    let shippingOptions;
    let commentsHTML;
    let addCommentHTML;
    let currentUser = (JSON.parse(sessionStorage.getItem('currentUser')));

    // Map product's shipping options into HTML
    shippingOptions = product.shipping.map(item => `<li>${item}</li>`).join(' ');

    // Map all product's comments into HTML
    commentsHTML = product.comments.map(function(item) {
                                              // Map comment's replies to HTML                               
                                              let replies = item.replies.map(reply => `
                                                                                    <div class="flexContainer--row col-sm-12 col-md-12 my-3">
                                                                                        <div class="col-sm-3 col-md-2 mb-2">
                                                                                            <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${reply.replier.memberPhotoUrl ? reply.replier.memberPhotoUrl : `../images/noavatar.png`})"></div>
                                                                                        </div>
                                                                                        <div class="col-12 flexContainer--col">
                                                                                            <small class="comment-info flexContainer--row">
                                                                                                <span class="font-italic mr-1">${reply.replier.memberUsername}</span>
                                                                                                <span class="font-italic">${formatDate(reply.postedOn)}</span>
                                                                                            </small>
                                                                                            <div class="col-11 pl-0">${reply.content}</div>
                                                                                        </div>
                                                                                    </div>`)
                                                                          .join(' ');

                                              // Conditionally display comment input box based on member auth status
                                              let replyInputBox = currentUser ? `<div class="flexContainer--row">
                                                                                    <div class="col-sm-3 col-md-2 mb-2">
                                                                                        <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl ? (JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl : `../images/noavatar.png`})"></div>
                                                                                    </div>
                                                                                    <div class="flexContainer--col col-10 flexContainer--col--right viewMorePage-postComment">
                                                                                        <textarea id="viewMorePage-postReplyInput${item._id}" class="col-12" rows="2" cols="100"></textarea>
                                                                                        <div id="viewMorePage-postReplyButton${item._id}" class="viewMorePage-postReplyButton button button--small button--noCap mt-2">Reply</div>
                                                                                    </div>
                                                                                </div>` : `<small class="col-10  ml-auto">Please log in to post a reply</small>`;
                                              
                                              // Conditionally display reply input box based on member auth status
                                              let replyInputWrapper = (item.replies.length === 0) ? 
                                                                      `
                                                                      <div class="buttonLink buttonLink--noCap buttonLink--small buttonLink--grey" data-toggle="collapse" href="#showCommentReply${item._id}">Reply</div>
                                                                      <div class="collapse" id="showCommentReply${item._id}">
                                                                          <div class="card card-body flexContainer--col bg__grey--light">
                                                                              <div id="viewMorePage__commentReplies${item._id}" class="flexContainer--col"></div>
                                                                              <div class="flexContainer--col">
                                                                                  ${replyInputBox}
                                                                              </div>
                                                                          </div>       
                                                                        </div>
                                                                      ` : 
                                                                      `<div class="buttonLink buttonLink--noCap buttonLink--small buttonLink--grey" data-toggle="collapse" href="#showCommentReply${item._id}">${item.replies.length} replies</div>
                                                                      <div class="collapse" id="showCommentReply${item._id}">
                                                                          <div class="card card-body flexContainer--col bg__grey--light">
                                                                              <div id="viewMorePage__commentReplies${item._id}" class="flexContainer--col">${replies}</div>
                                                                              <div class="flexContainer--col">
                                                                                  ${replyInputBox}
                                                                              </div>
                                                                          </div>
                                                                      </div>`;


                                                return `<div class="flexContainer--col col-sm-12 col-lg-12 col-md-10 my-3">
                                                            <div class="flexContainer--row">
                                                                <div class="col-sm-3 col-md-2 mb-2">
                                                                    <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${item.commenter.memberPhotoUrl ? item.commenter.memberPhotoUrl : `../images/noavatar.png`})"></div>
                                                                </div>
                                                                <div class="col-sm-9 col-md-10">
                                                                    <small class="comment-info flexContainer--row">
                                                                        <span class="font-italic mr-1">${item.commenter.memberUsername}</span>
                                                                        <span class="font-italic">${formatDate(item.postedOn)}</span>
                                                                    </small>
                                                                    <div>${item.content}</div>
                                                                </div>
                                                            </div>
                                                            <div class="replyInputWrapper flexContainer--col col-sm-12 col-md-10 ml-auto">${replyInputWrapper}</div>
                                                        </div>`;})
                                      .join(' ');

    // Conditionally render addComment HTML base on user's login status
    addCommentHTML = currentUser ? `<div class="col-sm-3 col-md-2 mb-2">
                                        <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl ? (JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl : `../images/noavatar.png`})"></div>
                                    </div>
                                    <div class="flexContainer--col flexContainer--col--right viewMorePage-postComment">
                                        <textarea id="viewMorePage-postComment" class="col-12" rows="3" cols="100"></textarea>
                                        <div id="viewMorePage-postCommentButton" class="button button--small button--noCap mt-2">
                                            Submit
                                        </div>
                                    </div>` : `
                                    <small class="text-center mb-5 mt-5">Please log in to add comment</small>`;

    // Conditionally render add/ remove watchlist buttons
    let watchListHTML;
    
    if (currentUser) {
      if ((currentUser.watchlist.length > 0) && currentUser.watchlist.includes(product._id)) {
        watchListHTML = `<a id="removeFromWatchButton${product._id}" class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small">Remove from watchlist</a>`;
      } else {
        watchListHTML = `<a id="addToWatchButton${product._id}" tabindex="0" class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small addToWatchButton popOver" role="button" data-toggle="popover" data-trigger="focus" data-content="Please sign up or log in to add this book to your watchlist">Add to Watchlist</a>`;
      }
    } else {
        watchListHTML = `<a id="addToWatchButton${product._id}" tabindex="0" class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small addToWatchButton popOver" role="button" data-toggle="popover" data-trigger="focus" data-content="Please sign up or log in to add this book to your watchlist">Add to Watchlist</a>`;
    }

    // Set product's seller's joinedDate fallback
    let joinedDate = (product.sellerInfo.joinedDate.length === 29) ? (formatDate(product.sellerInfo.joinedDate)).slice(3, 16) : formatDate(product.sellerInfo.joinedDate);

    // Generate viewMorePgae HTML and attach to #viewMorePage
    document.getElementById('viewMorePage').innerHTML = `
                                                      <!-- General description section -->
                                                      <div class="flexContainer--row flexContainer--row--top my-5">
                                                          <div class="flexContainer--col col-sm-12 col-md-5">
                                                              <div class="col-sm-12 col-md-6 flexContainer--row mb-5">
                                                                  <svg class="backIcon mr-2">
                                                                      <use xlink:href="images/icons.svg#icon-arrow-left2"></use>
                                                                  </svg>
                                                                  <p id="backToLanding" class="buttonLink buttonLink--noCap buttonLink--grey mt-3">
                                                                      Back to Home
                                                                  </p>
                                                              </div>
                                                              <img src="${product.photoUrl}" alt="Book image" class="viewMorePage__mainPhoto">
                                                          </div>
                                                          <div class="flexContainer--col col-sm-12 col-md-7">
                                                              <div class="flexContainer--row">
                                                                  <h2 class="mr-3">${product.title}</h2>
                                                                  <a id="inWatchlist" tabindex="0" class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small inWatchListIcon" role="button" data-toggle="popover" data-trigger="hover" data-content="This book is currently in your watchlist">
                                                                      <svg class="inWatchlist__icon">
                                                                          <use xlink:href="images/icons.svg#icon-binoculars"></use>
                                                                      </svg>
                                                                  </a>
                                                              </div>
                                                              <h3 class="color-grey mb-5">&dollar;${product.price}</h3>
                                                              <p class="mb-5">
                                                                  ${product.description}
                                                              </p>
                                                              <div class="flexContainer--row float-right mb-5">
                                                                  <div class="button button--bordered mr-3">Buy Now</div>
                                                                  <div id="watchListWrapper">
                                                                    ${watchListHTML}
                                                                  </div>
                                                              </div>
                                                              <div class="flexContainer--row mb-2">
                                                                  <small class="capitalised color-black mr-1">Condition:</small>
                                                                  <small>${product.condition}</small>
                                                              </div>
                                                              <div class="flexContainer--row">
                                                                  <small class="capitalised color-black mr-1">Listed city:</small>
                                                                  <small>${product.listedCity}</small>
                                                              </div>        
                                                          </div>
                                                      </div>
                                                      <br/>

                                                      <!-- Detail section -->
                                                      <div class="flexContainer--row flexContainer--row--top mt-5">

                                                          <!-- Accordion section -->
                                                          <div id="accordion" class="col-sm-12 col-md-5 pt-5">
                                                            <!-- Accordion - Product details -->
                                                            <div class="mb-3"> 
                                                              <button class="button button--bordered button--accordion" data-toggle="collapse" data-target="#viewMorePage__productDetails" aria-expanded="true" aria-controls="viewMorePage__productDetails">
                                                                Details
                                                              </button>
                                                              <div id="viewMorePage__productDetails" class="collapse viewMorePage__accordion--content" aria-labelledby="headingOne" data-parent="#accordion">
                                                                <div class="card-body">
                                                                  <div class="flexContainer--row">
                                                                      <small class="capitalised color-black mr-1">Author:</small>
                                                                      <small>${product.author}</small>
                                                                  </div>
                                                                  <div class="flexContainer--row">
                                                                      <small class="capitalised color-black mr-1">Category:</small>
                                                                      <small>${product.category}</small>
                                                                  </div>
                                                                  <div class="flexContainer--row">
                                                                      <small class="capitalised color-black mr-1">Format:</small>
                                                                      <small>${product.format}</small>
                                                                  </div>    
                                                                </div>
                                                              </div>
                                                            </div>
                                                            <!-- Accordion - Shipping info -->
                                                            <div class="mb-3"> 
                                                              <button class="button button--bordered button--accordion" data-toggle="collapse" data-target="#viewMorePage__shippingInfo" aria-expanded="true" aria-controls="viewMorePage__shippingInfo">
                                                                Shipping Information
                                                              </button>
                                                              <div id="viewMorePage__shippingInfo" class="collapse viewMorePage__accordion--content" aria-labelledby="headingOne" data-parent="#accordion">
                                                                <div class="card-body">
                                                                  <ul>
                                                                    ${shippingOptions}
                                                                  </ul>    
                                                                </div>
                                                              </div>
                                                            </div>
                                                            <!-- Accordion - Seller info -->
                                                            <div class="mb-3"> 
                                                              <button class="button button--bordered button--accordion" data-toggle="collapse" data-target="#viewMorePage__sellerInfo" aria-expanded="true" aria-controls="viewMorePage__sellerInfo">
                                                                About Seller
                                                              </button>
                                                              <div id="viewMorePage__sellerInfo" class="collapse viewMorePage__accordion--content" aria-labelledby="headingOne" data-parent="#accordion">
                                                                <div class="card-body btBorder btBorder--medium">
                                                                  <div class="flexContainer--col flexContainer--col--centered">
                                                                      <div class="viewMorePage__thumbnail viewMorePage__thumbnail--seller mb-2" style="background-image:url(${product.sellerInfo.photoUrl})"></div>
                                                                      <span class="mb-3">${product.sellerInfo.username}</span>
                                                                      <div class="flexContainer--row">
                                                                          <small class="color-black mr-1">Location:</small>
                                                                          <small>${product.sellerInfo.address.city}</small>
                                                                      </div>
                                                                      <div class="flexContainer--row">
                                                                          <small class="color-black mr-1">Member Since:</small>
                                                                          <small>${joinedDate}</small>
                                                                      </div>
                                                                  </div>
                                                                </div>
                                                                
                                                              </div>
                                                            </div>
                                                          </div>

                                                          <!-- Q&A section -->
                                                          <div class="flexContainer--col col-sm-12 col-md-6">
                                                              <h3 class="mb-3">Chat about this book</h3>

                                                              <!-- Add comment section -->
                                                              <div id="viewMorePage-addCommentWrapper" class="flexContainer--row mx-auto">
                                                                    ${addCommentHTML}
                                                              </div>

                                                              <!-- Comments section -->
                                                              <div class="col-12">
                                                                <div id="viewMorePage-comments">
                                                                    ${commentsHTML}
                                                                </div>
                                                            </div>
                                                          </div>
                                                      </div>`;

    $('html, body').animate({ scrollTop: 0 }, 'fast');


    // If product is in current user watchlist, display inWatchlist icon
    if(currentUser && currentUser.watchlist.includes(product._id)) {
      $('#inWatchlist').css('display', 'inline-block');
    }

    // Initialise inWatchlist tooltip
    $('.inWatchListIcon').popover();
    
    // Initialise login required tool tip
    $('.addToWatchButton').popover();

    // Add a product to watchlist, only if user is already logged in
    $('#addToWatchButton' + product._id).on('click', addToWatchlist);
    
    function addToWatchlist() {
        if (!currentUser) {
            $('.addToWatchButton').popover('show');
        }
        else {
          $('.addToWatchButton').popover('hide');
          $.ajax({
            url: `${url}/members/${currentUser._id}/watchlist/add`,
            type: 'PATCH',
            data: {
                  productId: product._id
            },
            success: function(updatedUser) {
                  sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                  $('#inWatchlist').show();
                  $('#watchListWrapper').html(`<a id="removeFromWatchButton${product._id}" class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small">Remove from watchlist</a>`);
                  $('#removeFromWatchButton' + product._id).on('click', removeFromWatchlist);
                  Swal.fire({
                    title: 'Watchlist updated!',
                    text: 'This product has been added to your watchlist',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function(err) {
              console.log(err);
            }
          });
        }
    }

    // Remove a product to watchlist
    $('#removeFromWatchButton' + product._id).on('click', removeFromWatchlist);

    function removeFromWatchlist() {
      $.ajax({
        url: `${url}/members/${currentUser._id}/watchlist/remove/`,
        type: 'PATCH',
        data: {
              productId: product._id
        },
        success: function(updatedUser) {
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
          $('#inWatchlist').hide();
          $('#watchListWrapper').html(`<a id="addToWatchButton${product._id}" tabindex="0" class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small addToWatchButton popOver" role="button" data-toggle="popover" data-trigger="focus" data-content="Please sign up or log in to add this book to your watchlist">Add to Watchlist</a>`);  
          $('#addToWatchButton' + product._id).on('click', addToWatchlist);
        }
      });
    }

    // If Back button is clicked, go back to landingPage
    document.getElementById('backToLanding').addEventListener('click', function() {
                                                                          $("#viewMorePage").hide();
                                                                          $("#landingPage").show();
                                                                          sessionStorage.removeItem('currentProduct');
    });

    let viewMorePageNode = document.getElementById('viewMorePage');

    if (viewMorePageNode.contains(document.getElementById('viewMorePage-postCommentButton'))) {
        document.getElementById('viewMorePage-postCommentButton').addEventListener('click', postComment);
    }

    let replyInputWrappers = document.getElementsByClassName('replyInputWrapper');

    for (let i = 0; i < replyInputWrappers.length; i++) {
      replyInputWrappers[i].addEventListener('click', checkIfReplyClicked);
    }

    // Check if viewMorePage-postReplyButton is clicked, execute postReply function
    function checkIfReplyClicked(e) {
      let regex = /^viewMorePage-postReplyButton/g;
        if (regex.test(e.target.id)) {
            let commentId = e.target.id.slice(28);
            postReply(commentId);
        }
    }
  }

  // Submit comment to backend and add new comment to comment list
  function postComment() {
    let _content = $('textarea#viewMorePage-postComment').val();
    let _productId = (JSON.parse(sessionStorage.getItem('currentProduct')))._id;
    let _userID = (JSON.parse(sessionStorage.getItem('currentUser')))._id;
    let _username = (JSON.parse(sessionStorage.getItem('currentUser'))).username;
    let _photoUrl = (JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl;

    $.ajax({
      url: `${url}/comments/add`,
      type: 'POST',
      data: {
            productId: _productId,
            content: _content,
            memberId: _userID,
            memberUsername: _username,
            memberPhotoUrl: _photoUrl
      },
      success: function(comment) {
        console.log(comment);
            $('textarea#viewMorePage-postComment').val('');
            addComment(comment);
      },
      error: function(err) {
            console.log(err);
      }
    });
  }

  // Add newly-added comment to comment list without calling backend
  function addComment(comment) {
    let commentHtml = `
                        <div class="flexContainer--col col-sm-12 col-lg-12 col-md-10 my-3">
                            <div class="flexContainer--row">
                                <div class="col-sm-3 col-md-2 mb-2">
                                    <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl})"></div>
                                </div>
                                <div class="col-sm-9 col-md-10">
                                    <small class="comment-info flexContainer--row">
                                        <span class="font-italic mr-1">${(JSON.parse(sessionStorage.getItem('currentUser'))).username}</span>
                                        <span class="font-italic">${formatDate(comment.postedOn)}</span>
                                    </small>
                                    <div>${comment.content}</div>
                                </div>
                            </div>
                            <div class="replyInputWrapper flexContainer--col col-sm-12 col-md-10 ml-auto">
                                <div class="buttonLink buttonLink--noCap buttonLink--small buttonLink--grey" data-toggle="collapse" href="#showCommentReply${comment._id}">Reply</div>
                                <div class="collapse" id="showCommentReply${comment._id}">
                                    <div class="card card-body flexContainer--col bg__grey--light">
                                        <div id="viewMorePage__commentReplies${comment._id}" class="flexContainer--col"></div>
                                        <div class="flexContainer--col">
                                              <div class="flexContainer--row">
                                                  <div class="col-sm-3 col-md-2 mb-2">
                                                      <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl})"></div>
                                                      </div>
                                                      <div class="flexContainer--col col-10 flexContainer--col--right viewMorePage-postComment">
                                                          <textarea id="viewMorePage-postReplyInput${comment._id}" class="col-12" rows="2" cols="100"></textarea>
                                                          <div id="viewMorePage-postReplyButton${comment._id}" class="viewMorePage-postReplyButton button button--small button--noCap mt-2">Reply</div>
                                                      </div>
                                                  </div>
                                              </div>
                                        </div>       
                                  </div>
                            </div>
                        </div>`;

    let commentsContainer = document.getElementById('viewMorePage-comments');
    let noCommentNote = document.getElementById('noCommentNote');

    if (commentsContainer.contains(noCommentNote)) {
      noCommentNote.remove();
    }

    document.getElementById('viewMorePage-comments').innerHTML += commentHtml;

    let replyInputWrappers = document.getElementsByClassName('replyInputWrapper');

    for (let i = 0; i < replyInputWrappers.length; i++) {
      replyInputWrappers[i].addEventListener('click', checkIfReplyClicked);
    }

    // Check if viewMorePage-postReplyButton is clicked, execute postReply function
    function checkIfReplyClicked(e) {
      let regex = /^viewMorePage-postReplyButton/g;
        if (regex.test(e.target.id)) {
            let commentId = e.target.id.slice(28);
            postReply(commentId);
        }
    }
  }

  function postReply(commentId) {
    let _content = $('textarea#viewMorePage-postReplyInput' + commentId).val();
    let _memberId = (JSON.parse(sessionStorage.getItem('currentUser')))._id;
    let _memberUsername = (JSON.parse(sessionStorage.getItem('currentUser'))).username;
    let _memberPhotoUrl = (JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl;
    let _postedOn = new Date(); 

    $.ajax({
      url: `${url}/comments/${commentId}/reply`,
      type: 'PATCH',
      data: {
        content: _content,
        memberId: _memberId,
        memberUsername: _memberUsername,
        memberPhotoUrl: _memberPhotoUrl
      },
      success: function() {
        $('textarea#viewMorePage-postReplyInput' + commentId).val('');
        
        let replyHTML = `
                        <div class="flexContainer--row col-sm-12 col-md-12 my-3">
                            <div class="col-sm-3 col-md-2 mb-2">
                                <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${_memberPhotoUrl})"></div>
                            </div>
                            <div class="col-12 flexContainer--col">
                                <small class="comment-info flexContainer--row">
                                    <span class="font-italic mr-1">${_memberUsername}</span>
                                    <span class="font-italic">${formatDate(_postedOn)}</span>
                                </small>
                                <div class="col-11 pl-0">${_content}</div>
                            </div>
                        </div>`;

        document.getElementById(`viewMorePage__commentReplies${commentId}`).innerHTML += replyHTML;
      },
      error: function(err) {
        console.log(err);
      }
    });
  }

  // Helper to return readable date
  function formatDate(datestring) {
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const DAY_IN_MS = 86400000;

    // date values generated from datestring
    let date = new Date(Date.parse(datestring));
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let AMPM = (hour < 12) ? 'AM' : 'PM'; 

    // compare with default values
    const today = new Date();
		const yesterday = new Date(today - DAY_IN_MS);
		const seconds = Math.round((today - date) / 1000);
		const minutes = Math.round(seconds / 60);
		const isToday = today.toDateString() === date.toDateString();
		const isYesterday = yesterday.toDateString() === date.toDateString();

		if (seconds < 10) { return 'just now';}
		else if (seconds < 60) { return `${seconds} seconds ago`; }
		else if (seconds < 100) { return 'about a minute ago'; }
		else if (minutes < 60) { return `${minutes} minutes ago`; }
		else if (isToday) { return `on today at ${hour}:${minute} ${AMPM}`; }
		else if (isYesterday) { return `on yesterday at ${hour}:${minute}`; }
		else { return `on ${month} ${day} ${year} at ${hour}:${minute}${AMPM}`; }
  }


  // ===================================================================================
  // ============================= MANAGE ACCOUNT PAGE ====================================



  // USER ACCOUNT SUMMARY SECTION/ MANAGE ACCOUNT PAGE


  // Get user account summary from backend
  function getMyAccountInfo() {
    let currentUserId = JSON.parse(sessionStorage.getItem('currentUser'))._id;

    if (!currentUserId) { return; }

    $.ajax({
      url: `${url}/members/${currentUserId}`,
      type: 'GET',
      dataType: 'json',
      success: function(result) {
            sessionStorage.setItem('currentUser', JSON.stringify(result[0]));
            generateAccountSummaryHTML(result[0]);
            generatePersonalList('watchProducts');
            document.getElementById('accountPage__watchlistButton').classList.add('accountPage__activityBtn--focused');
      },
      error: function(error) {
            console.log(error);
      }
    });
  }

  // Generate HTML template from account summary and add to #memberAccount div
  function generateAccountSummaryHTML(account) {

    //address display fallback if address is not provided
    let street = account.address ? account.address.street : 'N/A';
    let suburb = account.address ? account.address.suburb : 'N/A';
    let city = account.address ? account.address.city : 'N/A';
    let zip = account.address ? account.address.zip : 'N/A';

    // joined date display fallback
    let joinedDate = (account.joinedDate.length === 29) ? (formatDate(account.joinedDate)).slice(3, 16) : formatDate(account.joinedDate);

    // profilePhoto fallback
    let photoUrl = account.photoUrl ? account.photoUrl : '../images/noavatar.png';

    document.getElementById('accountPage__memberPhoto').style.backgroundImage = `url(${photoUrl})`;
    document.getElementById('memberAccount').innerHTML =
                                                          `<div class="flexContainer--col btBorder pb-3">
                                                            <div class="flexContainer--row flexContainer--row--space-between col-sm-12 mx-auto mt-5">
                                                              <div class="flexContainer--col col-7">
                                                                <div class="flexContainer--row mb-3">
                                                                  <div class="col-4 text-left">Username:</div>
                                                                  <div class="col-8 text-left">${account.username}</div>
                                                                </div>
                                                                <div class="flexContainer--row mb-3">
                                                                  <div class="col-4 text-left">Email:</div>
                                                                  <div class="col-8 text-left">${account.email}</div>
                                                                </div>
                                                                <div class="flexContainer--row mb-3">
                                                                  <div class="col-4 text-left">Member since:</div>
                                                                  <div class="col-8 text-left">${joinedDate}</div>
                                                                </div>
                                                              </div>
                                                              <div class="flexContainer--col col-5">
                                                                <div class="flexContainer--row flexContainer--row--top mb-3">
                                                                  <div class="mr-3">Shipping address:</div>
                                                                  <div class="flexContainer--col">
                                                                    <p>${street}</p>
                                                                    <p>${suburb}</p>
                                                                    <p>${city} ${zip}</p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div> 
                                                            <div>
                                                              <button id="updateMemberBtn" name="updateMemberBtn" class="button float-right">Edit</button>
                                                            </div> 
                                                          </div>`;
    
    // Show edit user form if Edit user button is clicked
    document.getElementById('updateMemberBtn').addEventListener('click', showEditUserForm);

    document.getElementById('accountPage__memberPhotoUpdateBtn').addEventListener('click', showEditProfilePhotoForm);

    function showEditProfilePhotoForm() {
      document.getElementById('editProfilePhotoFormWrapper').style.display = "block";
    }

    document.getElementById('cancelEditProfilePhotoForm').addEventListener('click', hideEditProfilePhotoForm);

    function hideEditProfilePhotoForm() {
      document.getElementById('editProfilePhotoFormWrapper').style.display = "none";
    }

    document.getElementById('editProfilePhotoForm').addEventListener('submit', updateProfilePhoto);

    function updateProfilePhoto(e) {
      e.preventDefault();
      let currentUserId = JSON.parse(sessionStorage.getItem('currentUser'))._id;

      // build FormData object
      // remember name attribute in inputs to avoid empty obj
      let form = $('#editProfilePhotoForm')[0];
      let formdata = new FormData(form);

      $.ajax({
        type: 'PATCH',
        enctype: 'multipart/form-data',
        url: `${url}/members/${currentUserId}/photo/update/`,
        data: formdata,
        processData: false,
        contentType: false,
        success: function(result) {
          // clear form inputs
          document.getElementById("editProfilePhotoForm__file").value = "";
          document.getElementById("editProfilePhotoForm__photoUrl").value = "";

          // render new profile photo
          document.getElementById('accountPage__memberPhoto').style.backgroundImage = `url(${result.photoUrl})`;
          sessionStorage.setItem('currentUser', JSON.stringify(result));
          hideEditProfilePhotoForm();
        },
        error: function(err) {
          console.log(err);
        }
      });
    } 
  }

  function showEditUserForm() {
    $('#updateMemberBtn').hide();
    makeEditUserForm();
    populateEditUserForm();
  }

  // Generate edit user form HTML and replace account summary with this in #memberAccount div
  function makeEditUserForm() {
    document.getElementById('memberAccount').innerHTML =
                                                        `<form id="editUserForm">
                                                            <div class="flexContainer--row flexContainer--row--space-between col-sm-12 mx-auto mt-5">
                                                                <div class="flexContainer--col col-5">
                                                                  <div class="flexContainer--row mb-3">
                                                                      <div class="col-4 text-left">Username:</div>
                                                                      <div class="col-8 text-left">${JSON.parse(sessionStorage.getItem('currentUser')).username}</div>
                                                                  </div>
                                                                  <div class="form-group row pl-15">
                                                                      <label for="editUserForm__email" class="col-4 text-left">
                                                                          Email:
                                                                      </label>
                                                                      <input type="email" class="form-control col-8 text-left" id="editUserForm__email">
                                                                  </div>
                                                                  <div class="flexContainer--row mb-3">
                                                                    <div class="col-4 text-left">Member since:</div>
                                                                    <div class="col-8 text-left">${(formatDate(JSON.parse(sessionStorage.getItem('currentUser')).joinedDate)).slice(3, 16)}</div>
                                                                  </div>
                                                                </div>
                                                                <div class="flexContainer--col col-6 ml-auto">
                                                                    <div class="flexContainer--row flexContainer--row--top mb-3">
                                                                        <div class="mr-3">Shipping address:</div>
                                                                        <div class="flexContainer--col col-8">
                                                                            <input type="text" class="form-control mb-18" id="editUserForm__street" placeholder="street address">
                                                                            <input type="text" class="form-control mb-18" id="editUserForm__suburb" placeholder="suburb">
                                                                            <div class="row flexContainer--row pl-15">
                                                                                <input type="text" class="form-control col-6 mb-18" id="editUserForm__city" placeholder="city">
                                                                                <input type="text" class="form-control col-5 mb-18 ml-3" id="editUserForm__postcode" placeholder="postcode">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="flexContainer--row float-right">
                                                                <span id="cancelEditUserForm" class="buttonLink buttonLink--noCap mb-5 mr-3">
                                                                    Cancel
                                                                </span>
                                                                <button id="saveUserInfo" type="submit" class="button float-right mb-5">
                                                                    Save
                                                                </button>
                                                            </div>
                                                            
                                                        </form>`;

    document.getElementById('editUserForm').addEventListener('submit', updateUser);
    document.getElementById('cancelEditUserForm').addEventListener('click', generateAccountSummaryHTMLFromStorage);
  }

  // Prefill edit user form's value with current user info from backend
  function populateEditUserForm() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    $('#editUserForm__email').val(currentUser.email);
    $('#editUserForm__street').val(currentUser.address.street);
    $('#editUserForm__suburb').val(currentUser.address.suburb);
    $('#editUserForm__city').val(currentUser.address.city);
    $('#editUserForm__postcode').val(currentUser.address.zip);
  }

  // Submit updated user info to backend on edit user form submit
  function updateUser(e) {
    e.preventDefault();
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    let _id = currentUser._id;
    let _email = $('#editUserForm__email').val();
    let _street = $('#editUserForm__street').val();
    let _suburb = $('#editUserForm__suburb').val();
    let _city = $('#editUserForm__city').val();
    let _zip = $('#editUserForm__postcode').val();

    $.ajax({
      url: `${url}/members/${_id}/update`,
      type: 'PATCH',
      data: {
            email: _email,
            street: _street,
            suburb: _suburb,
            city: _city,
            zip: _zip
      },
      success: function(updatedMember) {
            generateAccountSummaryHTML(updatedMember);
            sessionStorage.setItem('currentUser', JSON.stringify(updatedMember));
            $('#updateMemberBtn').show();
      },
      error: function(err) {
            console.log(err);
      }
    });
  }

  // If edit user form is cancelled, replace form with account summary in #memberAccount div
  function generateAccountSummaryHTMLFromStorage() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    generateAccountSummaryHTML(currentUser);
    $('#updateMemberBtn').show();
  }

  // MY PROJECTS SECTION/ MANAGE ACCOUNT PAGE


  // DISPLAY CURRENT USER'S ALL PROJECTS

  // Get all portfolios of the currently logged in user from backend
  function generatePersonalList(listType) {
    let currentUserId = JSON.parse(sessionStorage.getItem('currentUser'))._id;
    if (!currentUserId) { return; }

    $.ajax({
      url: `${url}/members/${currentUserId}`,
      type: 'GET',
      success: function(results) {
                                  if (results[0][listType].length === 0) {
                                    document.getElementById('myProductsDeck').innerHTML =
                                        `<div class="noPortfolio text-center">There is currently no item in your ${getListName(listType)}</div>`;
                                    return;
                                  }
                                  makeProductsCards(results[0][listType], listType);
      },
      error: function(error) { console.log(error); }
    });
  }

  // helper function to get user-friendly list name
  function getListName(listType) {

    let displayedListType; 

    switch (listType) {
      case 'purchasedProducts':
        displayedListType = 'purchased list';
        break;
      case 'soldProducts':
        displayedListType = 'sold list';
        break;
      case 'sellingProducts':
        displayedListType = "selling list";
        break;
      case 'watchProducts':
        displayedListType = 'watchlist';
        break;
    }

    return displayedListType;

  }

  // Map portfolios result into portfolio cards and attach to #myProductsDeck div
  function makeProductsCards(arr, arrType) {

    if (arrType === 'watchProducts') {
      document.getElementById('myProductsDeck').innerHTML = arr.map(product => 
                                                                    `<div class="card mb-4 col-sm-12 col-md-4">
                                                                        <img src="${product.photoUrl}" alt="Avatar" class="mb-3">
                                                                        <div class="mx-1 my-1">
                                                                            <h5 class="productCard-title text-center">${product.title}</h5>
                                                                            <div id="${product._id}" class="viewMoreButton button text-center mx-auto">View</div>
                                                                        </div>
                                                                      </div>`)
                                                                .join(' ');
    } else if (arrType === 'sellingProducts') {
      document.getElementById('myProductsDeck').innerHTML = arr.map(product => 
                                                                    `<div class="card mb-4 col-sm-12 col-md-4">
                                                                        <img src="${product.photoUrl}" alt="Avatar" class="mb-3">
                                                                        <div class="mx-1 my-1">
                                                                            <h5 class="productCard-title text-center">${product.title}</h5>
                                                                            <div id="productCard__buttonWrapper${product._id}" class="flexContainer--row">
                                                                              <div class="deleteButton button button--iconButton text-center mx-auto">
                                                                                <svg class="icon">
                                                                                    <use id="deleteButton${product._id}" xlink:href="images/icons.svg#icon-delete"></use>
                                                                                </svg>
                                                                              </div>
                                                                              <div class="editButton button button--iconButton text-center mx-auto">
                                                                                <svg class="icon">
                                                                                    <use id="editButton${product._id}" xlink:href="images/icons.svg#icon-edit"></use>
                                                                                </svg>
                                                                              </div>
                                                                              <div class="viewMoreButton button button--iconButton text-center mx-auto">
                                                                                <svg class="icon">
                                                                                    <use id="${product._id}" xlink:href="images/icons.svg#icon-view"></use>
                                                                                </svg>
                                                                              </div>
                                                                            </div>  
                                                                        </div>
                                                                      </div>`)
                                                                .join(' ');
    }
    
    
    addListenersToCardButtons();
  }

  // Add event listeners to viewMoreButtons, Edit, Delete buttons of project cards
  function addListenersToCardButtons() {
    let viewMoreButtons = document.getElementsByClassName('viewMoreButton');

    // If View button is clicked, call getArtworkInfo to display ViewMorePage
    for (let i = 0; i < viewMoreButtons.length; i++) {
        viewMoreButtons[i].addEventListener('click', getArtworkInfo);
    }

    let editButtons = document.getElementsByClassName('editButton');

    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', prefillUpdateProjectForm);
    }

    let deleteButtons = document.getElementsByClassName('deleteButton');

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', displayDeletePopup);
    }
  }


  // EDIT A PROJECT IN CURRENT USER'S PORTFOLIO

  // If editProject buttons clicked, prefill UpdateProjectForm in index.html with projectOnEdit's info from backend
  function prefillUpdateProjectForm(e) {
    const _id = (e.target.id).slice(10);
    sessionStorage.setItem('projectOnEdit', _id);
    let currentUser = (JSON.parse(sessionStorage.getItem('currentUser')));
    
    let projectOnEdit = currentUser.sellingProducts.find(product => product._id === _id);

    //pre-fill editProjectForm with project details
    $('#updateProductForm__title').val(projectOnEdit.title);
    $('#updateProductForm__author').val(projectOnEdit.author);
    $('#updateProductForm__category').val(projectOnEdit.category);
    $('#updateProductForm__description').val(projectOnEdit.description);
    $('#updateProductForm__format').val(projectOnEdit.format);
    $('#updateProductForm__condition').val(projectOnEdit.condition);
    $('#updateProductForm__listedCity').val(projectOnEdit.listedCity);
    $('#updateProductForm__price').val(projectOnEdit.price);

    // pre-select shipping checkbox
    if (projectOnEdit.shipping.includes('Allowed pickup')) {
      $('#updateProductForm__delivery--pickup').attr('checked', true);
    }

    if (projectOnEdit.shipping.includes('Post Courier')) {
      $('#updateProductForm__delivery--courier').attr('checked', true);
    }

    //at least 1 delivery option must be chosen
    let deliveryOpt1Checked = $('#updateProductForm__delivery--pickup').prop('checked');
    let deliveryOpt2Checked = $('#updateProductForm__delivery--courier').prop('checked');

    if (!deliveryOpt1Checked) {
      if (!deliveryOpt2Checked) {
        $('#updateProductForm__missingDelivery').css('display', 'block');
        return;
      }
    }

    // display reminder that user have uploaded a photo
    if (projectOnEdit.photoUrl.slice(0, 7) !== 'uploads') {
      $('#updateProductForm__photoUrl').val(projectOnEdit.photoUrl);
    } else {
      $('#updateProductForm__uploadedPhoto').css('display', 'block');
    }

    $('#projectPage').hide();
    $('#updateProductPage').show();

  }

  // Submit edited porfolio to backend and re-generate My portfolio section
  $('#updatePortfolioForm').submit(function() {
    event.preventDefault();

    let portfolioId = sessionStorage.getItem('projectOnEdit');
    let _title = $('#updatePortfolioTitle').val();
    let _description = $('#updatePortfolioDescription').val();
    let _image = $('#updatePortfolioImage').val();
    let _category = $('#updatePortfolioCategory').val();
    let _price = $('#updatePortfolioPrice').val();

    $.ajax({
      url: `${url}/updatePortfolio/${portfolioId}`,
      type: 'PATCH',
      data: {
            title : _title,
            description : _description,
            image : _image,
            category : _category,
            price: _price
      },
      success: function(data) {
            sessionStorage.removeItem('projectOnEdit');
            $('#updatePortfolioForm').trigger('reset');
            $('#updateProductPage').hide();
            generatePersonalList();
            $('#projectPage').show();
            $('html, body').animate({ scrollTop: 0 }, 'fast');
      },
      error: function() {
            console.log('error: cannot call api');
      }
    });
  });

  document.getElementById('cancelUpdateProductForm').addEventListener('click', function() {
    $('#updateProductForm').trigger('reset');
    $('#updateProductPage').hide();
    $('#projectPage').show();
  });


  // DELETE A PROJECT IN CURRENT USER'S PORTFOLIO

  // If deleteProject buttons clicked, show pop up to reconfirm delete
  function displayDeletePopup(e) {
    console.log(e);
    let projectId = (e.target.id).slice(12);
    console.log(projectId);
    sessionStorage.setItem('projectOnDelete', projectId);
    console.log(sessionStorage);

    let idName = `productCard__buttonWrapper${projectId}`;
    let buttonWrapper = document.getElementById(idName);

    buttonWrapper.innerHTML =
                              `<div class="mx-auto">
                                    <div class="text-center mb-3">
                                        <small>Are you sure to delete?</small>
                                    </div>
                                    <div id="abortDeleteProject"
                                            class="buttonLink buttonLink--small buttonLink--noCap buttonLink--grey back-portfolio float-left">
                                            Cancel</div>
                                    <div id="confirmDeleteProject"
                                            class="button button--small button--noCap float-right">
                                            Delete</div>
                              </div>`;

    document.getElementById('confirmDeleteProject').addEventListener('click', deleteProject);
    document.getElementById('abortDeleteProject').addEventListener('click', abortDeleteProject);
  }

  // Delete a project from backend and re-generate My portfolio section
  function deleteProject() {
    let projectId = sessionStorage.getItem('projectOnDelete');

    $.ajax({
      url: `${url}/products/${projectId}/delete`,
      type: 'DELETE',
      success: function(message) {
            sessionStorage.removeItem('projectOnDelete');
            generatePersonalList('sellingProducts');
      },
      error: function(err) {
            console.log(err);
      }
    });
  }

  // If user aborts delete project, remove delete popup and re-show view, edit, delete button group
  function abortDeleteProject(e) {
    let projectId = sessionStorage.getItem('projectOnDelete');
    let idName = `productCard__buttonWrapper${projectId}`;
    let buttonWrapper = document.getElementById(idName);

    buttonWrapper.innerHTML =
                              `<div class="deleteButton button button--iconButton text-center mx-auto">
                                <svg class="icon">
                                    <use id="deleteButton${projectId}" xlink:href="images/icons.svg#icon-delete"></use>
                                </svg>
                              </div>
                              <div class="editButton button button--iconButton text-center mx-auto">
                                <svg class="icon">
                                    <use id="editButton${projectId}" xlink:href="images/icons.svg#icon-edit"></use>
                                </svg>
                              </div>
                              <div class="viewMoreButton button button--iconButton text-center mx-auto">
                                <svg class="icon">
                                    <use id="${projectId}" xlink:href="images/icons.svg#icon-view"></use>
                                </svg>
                              </div>`;

    addListenersToCardButtons();
  }

  // Change accountPage__activityBtn background color after the button is click
  let activitiyButtons = document.getElementsByClassName('accountPage__activityBtn');

  for (let i = 0; i < activitiyButtons.length; i++) {
    activitiyButtons[i].addEventListener('click', changeBgColor.bind(activitiyButtons[i]));
  }

  function changeBgColor() {

    // Remove bgColor of previously clicked button
    let activitiyButtons = document.getElementsByClassName('accountPage__activityBtn');
    for (let i = 0; i < activitiyButtons.length; i++) {
      activitiyButtons[i].classList.remove('accountPage__activityBtn--focused');
    }

    // Add bgColor to recently clicked button
    $(this).addClass('accountPage__activityBtn--focused');

    console.log($(this).attr('data-value'));
    generatePersonalList($(this).attr('data-value'));
  }



}); // Document ready ends
