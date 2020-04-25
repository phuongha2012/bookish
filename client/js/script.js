$(document).ready(function(){

  console.log('hello');
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
      console.log(url);
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
  // Yanas code

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
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolioPage').hide();
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
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolioPage').hide();
  }

  //Home button to show landing page
  $('.home-btn').click(function(){
    // pages
    $('#landingPage').show();
    $('#viewMorePage').hide();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolioPage').hide();
  });

  //Login button to show login page
  $('#loginBtn').click(function(){
    // pages
    $('#loginPage').show();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolioPage').hide();

  });

  //signup button to shoe register page
  $('#signUpBtn').click(function(){
    // pages
    $('#signUpPage').show();
    $('#projectPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolioPage').hide();
  });

  // my portfolio button to show my portfolio page
  $('#myPortfolioBtn').click(function(){
    generateMyPortfolios();
    getMyAccountInfo();
    // pages
    $('#projectPage').show();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolioPage').hide();
  });

  //upload projects button to show upload project page
  $('#addPortfolio').click(function(){
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    // pages
    $('#uploadPortfolioPage').show();
    $('#projectPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updatePortfolioPage').hide();

  });

  // back button to my portfolio page
  $('.back-portfolio').click(function(){
    // pages
    $('#projectPage').show();
    $('#uploadPortfolioPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updatePortfolioPage').hide();
  });

  //update projects button to show update project page
  $('#updateProject').click(function(){

    // pages
    $('#uploadPortfolioPage').hide();
    $('#projectPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updatePortfolioPage').show();
  });

  // delete projects button to show delete project page
  $('#deleteProject').click(function(){
    // pages
    $('#uploadPortfolioPage').hide();
    $('#projectPage').hide();
    $('#signUpPage').hide();
    $('#loginPage').hide();
    $('#landingPage').hide();
    $('#viewMorePage').hide();
    $('#updatePortfolioPage').hide();
  });

// edit button to scroll up on update page

$('.edit-button').click(function(){
      $('html, body').animate({ scrollTop: 0 }, 'fast');
});


  // Logout member ===============================================================
  // Yanas code

  $('#logoutBtn').click(function(){
    sessionStorage.clear();
    $('#landingPage').show();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#uploadPortfolioPage').hide();
    $('#updatePortfolio').hide();
    location.reload("#loginForm");
  });

  // register member ===============================================================
  // Yanas code

  // register user
  $('#registerForm').submit(function(){
    event.preventDefault();
    let username = $('#registerUsername').val();
    let email = $('#registerEmail').val();
    let password = $('#registerPassword').val();
    $.ajax({
      url :`${url}/registerMember`,
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

    });//ajax
  });//submit function for register form

  // login member ===============================================================
  // Yanas code

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
        }  else {
          sessionStorage.setItem('currentUser', JSON.stringify(response));
          showMemberName(username);
          $('#logoutBtn').show();
          $('#myPortfolioBtn').show();
          $('#authBtnGroup-question').hide();
          $('#loginBtn').hide();
          $('#signUpBtn').hide();
          $('#landingPage').show();
          $('#loginPage').hide();
          $('html, body').animate({ scrollTop: 0 }, 'fast');
          console.log(sessionStorage);
        }
      },//success
      error: function() {
        console.log('error: cannot call api');
      }//error
    });
  });

  // show members name ===========================================================
  // Yanas code
  function showMemberName(name){
    document.getElementById('memberName').innerHTML =  '<h1 class="d-block text-center mt-4 mb-5">' + name + '\'s Account </h1>';
  }

  // add portfolio form ===============================================================
  // Yanas code

  $('#addPortfolioForm').submit(function(){
    event.preventDefault();
    if( ! sessionStorage.memberId){
      alert('401, permission denied');
      return;
    }
    let title = $('#addPortfolioTitle').val();
    let description = $('#addPortfolioDescription').val();
    let image = $('#addPortfolioImage').val();
    let category = $('#addPortfolioCategory').val();
    let price = $('#addPortfolioPrice').val();
    let _memberId = sessionStorage.getItem('memberId');

    if (title == '' || description == '' || image == '' || category == '' || price == ''){
      Swal.fire({
        title: 'Empty Input Field',
        text: 'Please fill in all input fields',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    } else {
      $.ajax({
        url :`${url}/addPortfolio`,
        type : 'POST',
        data : {
          title : title,
          description : description,
          image : image,
          category : category,
          price: price,
          memberId : _memberId
        },
        success : function(portfolio){
          if (portfolio !== 'Artwork already added') {
            Swal.fire({
              title: 'Artwork Uploaded',
              text: 'You project has been added to your portfolio',
              icon: 'success',
              confirmButtonText: 'OK'
          });
          $('#addPortfolioTitle').val();
          $('#addPortfolioDescription').val();
          $('#addPortfolioImage').val();
          $('#addPortfolioCategory').val();
          $('#addPortfolioPrice').val();
          $('#addPortfolioMemberId').val();

          $('#addPortfolioForm').trigger('reset');
          $('#uploadPortfolioPage').hide();
          generateMyPortfolios();
          $('#projectPage').show();
          $('html, body').animate({ scrollTop: 50}, 'fast');
          } else {
            Swal.fire({
              title: 'Title Taken',
              text: 'Title has been taken already, please try another one',
              icon: 'warning',
              confirmButtonText: 'OK'
          });

          }

        },   // success
        error:function(){
          // console.log('error: cannot call api');
        }  //error
      }); //ajax
    } //else
  }); // submit add portfolio


  // Yanas code ENDS




  // ===================================================================================
  // =========================== Hayley's code starts ==================================
  // ===================================================================================





  // ===================================================================================
  // =============================== LANDING PAGE ======================================


  // Get all portfolios from all artists from backend
  function generateLandingPageCards() {

    $.ajax({
      url: `${url}/products`,
      type: 'GET',
      dataType: 'json',
      success: function(products) {
        console.log(products);
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
                                                                          <h5 class="text-center mb-2">${product.title}</h5>
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
    let id = e.target.id;

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

            console.log(product[0].comments);
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
    let currentUsername = currentUser.username;


    // Map product's shipping options into HTML
    shippingOptions = product.shipping.map(item => `<li>${item}</li>`).join(' ');

    // Map all comments into HTML
    commentsHTML = product.comments.map(function(item) {
                                              // Map comment's replies to HTML                               
                                              let replies = item.replies.map(reply => `
                                                                                    <div class="flexContainer--row col-sm-12 col-md-12 my-3">
                                                                                        <div class="col-sm-3 col-md-2 mb-2">
                                                                                            <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${reply.replier.memberPhotoUrl})"></div>
                                                                                        </div>
                                                                                        <div class="col-12">
                                                                                        <small class="comment-info flexContainer--row">
                                                                                            <span class="font-italic mr-1">${reply.replier.memberUsername}</span>
                                                                                            <span class="font-italic">${formatDate(reply.postedOn)}</span>
                                                                                        </small>
                                                                                        <div class="col-11 pl-0">${reply.content}</div>
                                                                                    </div>`)
                                                                          .join(' ');


                                                       
                                              let replyInputWrapper = (item.replies.length === 0) ? 
                                                                      `
                                                                      <div class="buttonLink buttonLink--noCap buttonLink--small buttonLink--grey" data-toggle="collapse" href="#showCommentReply${item._id}">Reply</div>
                                                                      <div class="collapse" id="showCommentReply${item._id}">
                                                                          <div class="card card-body flexContainer--row bg__grey--light">
                                                                              <div class="col-sm-3 col-md-2 mb-2">
                                                                                  <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl})"></div>
                                                                                  </div>
                                                                                  <div class="flexContainer--col col-10 flexContainer--col--right viewMorePage-postComment">
                                                                                      <textarea id="viewMorePage-postReplyInput${item._id}" class="col-12" rows="2" cols="100"></textarea>
                                                                                      <div id="viewMorePage-postReplyButton${item._id}" class="button button--small button--noCap mt-2">Reply</div>
                                                                                  </div>
                                                                              </div>
                                                                        </div>
                                                                      ` : 
                                                                      `<div class="buttonLink buttonLink--noCap buttonLink--small buttonLink--grey" data-toggle="collapse" href="#showCommentReply${item._id}">${item.replies.length} replies</div>
                                                                      <div class="collapse" id="showCommentReply${item._id}">
                                                                          <div class="card card-body flexContainer--col bg__grey--light">
                                                                              <div>${replies}</div>
                                                                              <div class="flexContainer--row">
                                                                                  <div class="col-sm-3 col-md-2 mb-2">
                                                                                  <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl})"></div>
                                                                              </div>
                                                                              <div class="flexContainer--col col-10 flexContainer--col--right viewMorePage-postComment">
                                                                                  <textarea id="viewMorePage-postReplyInput${item._id}" class="col-12" rows="2" cols="100"></textarea>
                                                                                  <div id="viewMorePage-postReplyButton${item._id}" class="button button--small button--noCap mt-2">
                                                                                      Reply
                                                                                  </div>
                                                                              </div>
                                                                              </div>  
                                                                          </div>
                                                                      </div>`;


                                              if (currentUser && (item.commenter.memberUsername === currentUsername)) {
                                                return `<div class="flexContainer--col col-sm-12 col-lg-12 col-md-10 my-3">
                                                            <div class="flexContainer--row">
                                                                <div class="col-sm-3 col-md-2 mb-2">
                                                                    <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl})"></div>
                                                                </div>
                                                                <div class="col-sm-9 col-md-10">
                                                                    <small class="comment-info flexContainer--row">
                                                                        <span class="font-italic mr-1">You</span>
                                                                        <span class="font-italic">${formatDate(item.postedOn)}</span>
                                                                    </small>
                                                                    <div>${item.content}</div>
                                                                </div>
                                                            </div>
                                                            <div class="flexContainer--col col-sm-12 col-md-10 ml-auto">${replyInputWrapper}</div>
                                                        </div>`;
                                              } else if (item.commenter.memberUsername !== currentUsername) {
                                                return `<div class="flexContainer--col col-sm-12 col-lg-12 col-md-10 my-3">
                                                            <div class="flexContainer--row">
                                                                <div class="col-sm-3 col-md-2 mb-2">
                                                                    <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${item.commenter.memberPhotoUrl})"></div>
                                                                </div>
                                                                <div class="col-sm-9 col-md-10">
                                                                    <small class="comment-info flexContainer--row">
                                                                        <span class="font-italic mr-1">${item.commenter.memberUsername}</span>
                                                                        <span class="font-italic">${formatDate(item.postedOn)}</span>
                                                                    </small>
                                                                    <div>${item.content}</div>
                                                                </div>
                                                            </div>
                                                            
                                                            
                                                            <div class="flexContainer--col col-sm-12 col-md-10 ml-auto">${replyInputWrapper}</div>
                                                        </div>`;
                                              }})
                                      .join(' ');

    // Conditionally render addComment HTML base on user's login status
    // addCommentHTML = currentUser ? `<div class="col-12 col-sm-12 col-lg-10 col-md-10 mx-auto">
    //                                     <label for="viewMorePage-postComment">
    //                                           Comment:
    //                                     </label>
    //                                     <textarea id="viewMorePage-postComment"
    //                                               class="col-12 col-sm-12 col-lg-10 col-md-10"
    //                                               rows="4"
    //                                               cols="100">
    //                                     </textarea>
    //                                     <div class="col-12 col-sm-12 col-lg-11 col-md-11">
    //                                         <div id="viewMorePage-postCommentButton"
    //                                             class="button  bg-dark float-right mt-2 mb-5">
    //                                             Submit
    //                                         </div>
    //                                     </div>
    //                                 </div>` : `
    //                                 <div class="text-center mb-5">Please log in to add comment</div>`;

    // Generate viewMorePgae HTML and attach to #viewMorePage
    document.getElementById('viewMorePage').innerHTML = `
                                                      <!-- General description section -->
                                                      <div class="flexContainer--row mb-5">
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
                                                              <h2>${product.title}</h2>
                                                              <h3 class="color-grey mb-5">&dollar;${product.price}</h3>
                                                              <p class="mb-5">
                                                                  ${product.description}
                                                              </p>
                                                              <div class="flexContainer--row float-right mb-5">
                                                                  <div class="button button--bordered mr-3">Buy Now</div>
                                                                  <div class="buttonLink buttonLink--noCap buttonLink--grey buttonLink--small">Add to Watchlist</div>
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
                                                      <div class="flexContainer--row mt-5">

                                                          <!-- Accordion section -->
                                                          <div id="accordion" class="col-sm-12 col-md-5">
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
                                                                          <small>17th June 2015</small>
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
                                                                  <div class="col-sm-3 col-md-2 mb-2">
                                                                      <div class="viewMorePage__thumbnail viewMorePage__thumbnail--commenter mx-auto" style="background-image:url(${(JSON.parse(sessionStorage.getItem('currentUser'))).photoUrl})"></div>
                                                                  </div>
                                                                  <div class="flexContainer--col flexContainer--col--right viewMorePage-postComment">
                                                                      <textarea id="viewMorePage-postComment" class="col-12" rows="3" cols="100"></textarea>
                                                                      <div id="viewMorePage-postCommentButton" class="button button--small button--noCap mt-2">
                                                                          Submit
                                                                      </div>
                                                                  </div>
                                                              </div>

                                                              <!-- Comments section -->
                                                              <div class="col-12">
                                                                <div id="viewMorePage-comments" class="mb-5">
                                                                    ${commentsHTML}
                                                                </div>
                                                            </div>
                                                          </div>
                                                      </div>`;

    $('html, body').animate({ scrollTop: 0 }, 'fast');

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
                                        <span class="font-italic mr-1">You</span>
                                        <span class="font-italic">${formatDate(comment.postedOn)}</span>
                                    </small>
                                    <div>${comment.content}</div>
                                </div>
                            </div>
                        </div>`;

    let commentsContainer = document.getElementById('viewMorePage-comments');
    let noCommentNote = document.getElementById('noCommentNote');

    if (commentsContainer.contains(noCommentNote)) {
      noCommentNote.remove();
    }

    document.getElementById('viewMorePage-comments').innerHTML += commentHtml;
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
  // ============================= MY PORFOLIO PAGE ====================================



  // USER ACCOUNT SUMMARY SECTION/ MY PORFOLIO PAGE


  // Get user account summary from backend
  function getMyAccountInfo() {
    let currentUserId = sessionStorage.getItem('memberId');

    if (!currentUserId) { return; }

    $.ajax({
      url: `${url}/myAccountInfo/${currentUserId}`,
      type: 'GET',
      dataType: 'json',
      success: function(result) {
            generateAccountSummaryHTML(result);
      },
      error: function(error) {
            console.log(error);
      }
    });
  }

  // Generate HTML template from account summary and add to #memberAccount div
  function generateAccountSummaryHTML(account) {
    let _description = account.about ? account.about : "";
    let _website = account.website ? account.website : "";
    let _location = account.location ? account.location : "";

    document.getElementById('memberAccount').innerHTML =
            `<div class="flexContainer-flexStart mb-1">
                <strong class="userInfoField">Username:</strong>
                <div>${account.username}</div>
            </div>
            <div class="flexContainer-flexStart mb-1">
                <strong class="userInfoField">Email:</strong>
                <div>${account.email}</div>
            </div>
            <div class="flexContainer-flexStart mb-1">
                <strong class="userInfoField">About:</strong>
                <div>${_description}</div>
            </div>
            <div class="flexContainer-flexStart mb-1">
                <strong class="userInfoField">Location:</strong>
                <div>${_location}</div>
            </div>
            <div class="flexContainer-flexStart mb-1">
                <strong class="userInfoField">Website:</strong>
                <a>${_website}</a>
            </div>`;
  }

  // Show edit user form if Edit user button is clicked
  document.getElementById('updateMemberBtn').addEventListener('click', showEditUserForm);

  function showEditUserForm() {
    $('#updateMemberBtn').hide();
    makeEditUserForm();
    populateEditUserForm();
  }

  // Generate edit user form HTML and replace account summary with this in #memberAccount div
  function makeEditUserForm() {
    document.getElementById('memberAccount').innerHTML =
                                                        `<form id="editUserForm">
                                                            <div class="form-group row">
                                                                <label for="editUserForm__username" class="col-md-3">
                                                                    Username:
                                                                </label>
                                                                <input type="text" class="form-control col-md-9" id="editUserForm__username">
                                                            </div>
                                                            <div class="form-group row">
                                                                <label for="editUserForm__email" class="col-md-3">
                                                                    Email:
                                                                </label>
                                                                <input type="email" class="form-control col-md-9" id="editUserForm__email">
                                                            </div>
                                                            <div class="form-group row">
                                                                <label for="editUserForm__description" class="col-md-3">
                                                                    Description:
                                                                </label>
                                                                <textarea type="text" class="form-control col-md-9" id="editUserForm__description" rows="4"></textarea>
                                                            </div>
                                                            <div class="form-group row">
                                                                <label for="editUserForm__location" class="col-md-3">
                                                                    Location:
                                                                </label>
                                                                <input type="text" class="form-control col-md-9" id="editUserForm__location">
                                                            </div>
                                                            <div class="form-group row">
                                                                <label for="editUserForm__website" class="col-md-3">
                                                                    Website:
                                                                </label>
                                                                <input id="editUserForm__website" type="text" class="form-control col-md-9">
                                                            </div>
                                                            <button id="cancelEditUserForm" class="btn btn-danger   float-left mb-5">
                                                                Cancel
                                                            </button>
                                                            <button id="saveUserInfo" type="submit" class="float-right mb-5 btn btn-dark  ">
                                                                Save
                                                            </button>
                                                        </form>`;

    document.getElementById('editUserForm').addEventListener('submit', updateUser);
    document.getElementById('cancelEditUserForm').addEventListener('click', generateAccountSummaryHTMLFromStorage);
  }

  // Prefill edit user form's value with current user info from backend
  function populateEditUserForm() {
    let currentUserId = sessionStorage.getItem('memberId');

    $.ajax({
      url: `${url}/myAccountInfo/${currentUserId}`,
      type: 'GET',
      dataType: 'json',
      success: function(result) {
            $('#editUserForm__username').val(result.username);
            $('#editUserForm__email').val(result.email);
            $('#editUserForm__description').val(result.about);
            $('#editUserForm__website').val(result.website);
            $('#editUserForm__location').val(result.location);
      },
      error: function(error) {
            console.log(error);
      }
    });
  }

  // Submit updated user info to backend on edit user form submit
  function updateUser(e) {
    e.preventDefault();

    let _id = sessionStorage.getItem('memberId');
    let _username = $('#editUserForm__username').val();
    let _email = $('#editUserForm__email').val();
    let _about = $('#editUserForm__description').val();
    let _location = $('#editUserForm__location').val();
    let _website = $('#editUserForm__website').val();

    $.ajax({
      url: `${url}/updateMember/${_id}`,
      type: 'PATCH',
      data: {
            username: _username,
            email: _email,
            about: _about,
            location: _location,
            website: _website
      },
      success: function(updatedMember) {
            generateAccountSummaryHTML(updatedMember);
            $('#updateMemberBtn').show();
      },
      error: function(err) {
            console.log(err);
      }
    });
  }

  // If edit user form is cancelled, replace form with account summary in #memberAccount div
  function generateAccountSummaryHTMLFromStorage() {
    let description = (sessionStorage.getItem('about') !== "undefined") ? sessionStorage.getItem('about') : "";
    let website = (sessionStorage.getItem('website') !== "undefined") ? sessionStorage.getItem('website') : "";
    let location = (sessionStorage.getItem('location') !== "undefined") ? sessionStorage.getItem('location') : "";
    let username = sessionStorage.getItem('username');
    let email = sessionStorage.getItem('email');

    let account = {
                about: description,
                website: website,
                location: location,
                username: username,
                email: email
    };

    generateAccountSummaryHTML(account);
    $('#updateMemberBtn').show();
  }



  // MY PROJECTS SECTION/ MY PORFOLIO PAGE


  // DISPLAY CURRENT USER'S ALL PROJECTS

  // Get all portfolios of the currently logged in user from backend
  function generateMyPortfolios() {
    let currentUserId = sessionStorage.getItem('memberId');
    if (!currentUserId) { return; }

    $.ajax({
      url: `${url}/myPortfolios/${currentUserId}`,
      type: 'GET',
      success: function(results) {
            if (results === "No portfolio by this user found") {
              document.getElementById('myProjectCards').innerHTML =
                  `<div class="noPortfolio text-center">You have not uploaded a project yet</div>`;
              return;
            }

            makePortfolioCards(results);
      },
      error: function(error) {
            console.log(error);
      }
    });
  }

  // Map portfolios result into portfolio cards and attach to #myProjectCards div
  function makePortfolioCards(arr) {
    document.getElementById('myProjectCards').innerHTML = arr.map(item =>
                                                                        `<div class="card
                                                                                    portfolioCard
                                                                                    border-bottom">
                                                                            <div style="background-image:url(${item.image})"
                                                                                class="portfolioPage-image"></div>
                                                                            <h5 class="portfolioPage-cardTitle
                                                                                      card-text mb-3">
                                                                                      ${item.title}</h5>
                                                                            <div id="portfolioCard__buttonWrapper${item._id}"
                                                                                class="row mb-2">
                                                                                <div class="col-sm-12
                                                                                            col-md-4
                                                                                            col-lg-4">
                                                                                    <div id="${item._id}"
                                                                                        class="button
                                                                                                viewMoreButton
                                                                                                
                                                                                                mb-3">
                                                                                                View</div>
                                                                                </div>
                                                                                <div class="col-sm-12
                                                                                            col-md-4
                                                                                            col-lg-4">
                                                                                    <div id="edit${item._id}"
                                                                                        class="editButton
                                                                                                btn-dark
                                                                                                
                                                                                                
                                                                                                py-2
                                                                                                px-2
                                                                                                mb-3">
                                                                                                Edit</div>
                                                                                </div>
                                                                                <div class="col-sm-12
                                                                                            col-md-4
                                                                                            col-lg-4">
                                                                                    <div id="delete${item._id}"
                                                                                        class="deleteButton
                                                                                                btn-red 
                                                                                                px-3 py-2
                                                                                                mb-3
                                                                                                
                                                                                                float-lg-right">
                                                                                                Delete</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>`)
                                                              .join(' ');

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
    const _id = (e.target.id).slice(4);
    sessionStorage.setItem('projectOnEdit', _id);

    $.ajax({
      url: `${url}/findProject/${_id}`,
      type: 'GET',
      dataType: 'json',
      success: function(project) {

            //pre-fill editProjectForm with project details
            $('#updatePortfolioTitle').val(project.title);
            $('#updatePortfolioDescription').val(project.description);
            $('#updatePortfolioImage').val(project.image);
            $('#updatePortfolioCategory').val(project.category);
            $('#updatePortfolioPrice').val(project.price);

            $('#projectPage').hide();
            $('#updatePortfolioPage').show();
      },
      error: function(error) {
            console.log(error);
      }
    });
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
            $('#updatePortfolioPage').hide();
            generateMyPortfolios();
            $('#projectPage').show();
            $('html, body').animate({ scrollTop: 0 }, 'fast');
      },
      error: function() {
            console.log('error: cannot call api');
      }
    });
  });


  // DELETE A PROJECT IN CURRENT USER'S PORTFOLIO

  // If deleteProject buttons clicked, show pop up to reconfirm delete
  function displayDeletePopup(e) {
    let projectId = (e.target.id).slice(6);
    sessionStorage.setItem('projectOnDelete', projectId);

    let idName = `portfolioCard__buttonWrapper${projectId}`;
    let buttonWrapper = document.getElementById(idName);

    buttonWrapper.innerHTML =
                              `<div class="mx-auto">
                                    <p class="text-center">
                                        Are you sure you want to delete this project?</p>
                                    <button id="abortDeleteProject"
                                            class="btn btn-danger  back-portfolio  float-left">
                                            Cancel</button>
                                    <button id="confirmDeleteProject"
                                            type="button"
                                            class="btn btn-dark  float-right ">
                                            Delete</button>
                              </div>`;

    document.getElementById('confirmDeleteProject').addEventListener('click', deleteProject);
    document.getElementById('abortDeleteProject').addEventListener('click', abortDeleteProject);
  }

  // Delete a project from backend and re-generate My portfolio section
  function deleteProject() {
    let projectId = sessionStorage.getItem('projectOnDelete');

    $.ajax({
      url: `${url}/deletePortfolio/${projectId}`,
      type: 'DELETE',
      success: function(message) {
            sessionStorage.removeItem('projectOnDelete');
            generateMyPortfolios();
      },
      error: function(err) {
            console.log(err);
      }
    });
  }

  // If user aborts delete project, remove delete popup and re-show view, edit, delete button group
  function abortDeleteProject(e) {
    let projectId = sessionStorage.getItem('projectOnDelete');
    let idName = `portfolioCard__buttonWrapper${projectId}`;
    let buttonWrapper = document.getElementById(idName);

    buttonWrapper.innerHTML =
                              `<div class="col-sm-12 col-md-4 col-lg-4">
                                    <div id="${projectId}"
                                        class="button viewMoreButton  mb-3">
                                        View
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4 col-lg-4">
                                    <div id="edit${projectId}"
                                        class="editButton btn-dark   py-2 px-2 mb-3">
                                        Edit
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4 col-lg-4">
                                    <div id="delete${projectId}"
                                        class="deleteButton btn-red  px-3 py-2 mb-3  float-lg-right">
                                        Delete
                                    </div>
                              </div>`;

    addListenersToCardButtons();
  }

  // ============================== Hayley's code ends =================================
  // ===================================================================================

}); // Document ready ends
