(function($) {


  function wishlist_remove_modal(){
    $('body').find('.wishlist-modal-dialog-box').remove();
  }

  function wishlist_show_modal(data) {

    //console.log(data);
    let message = '';
    const wishListTable = document.querySelector('.wishlist_table');
    const noticeWrapper = document.querySelector('.woocommerce-notices-wrapper');

    if (data.added_to_wishlist) {
      message = data.product_title + " added to Wishlist";
    } else if (data.added_to_cart){
      message = data.product_title + " added to Cart";
    } else if ( data.wishlist_removed ){
      message = data.product_title + " removed from Wishlist";
    } else {
      message = "All product added to Cart";
    }

    if (data.wishlist_removed) {
      let template = `<div class="woocommerce-notices-wrapper">
                       <div class="woocommerce-message" role="alert">
                         ${ message }
                         <a href="http://localhost/wishlist/cart/?undo_item=6364d3f0f495b6ab9dcf8d3b5c6e0b01&amp;_wpnonce=31e6fd78ee" class="restore-wishlist-item">Undo?</a>
                       </div>
                      </div>`;
      if( noticeWrapper ){
        noticeWrapper.remove();
      }
      wishListTable.insertAdjacentHTML("beforebegin", template);
    } else {
      let template = `<div class="wishlist-modal-dialog-box">
                      <span class="helper"></span>
                      <div>
                          <div class="popupCloseButton">&times;</div>
                          <p>${ message }</p>
                      </div>
                    </div>`;
      document.body.insertAdjacentHTML("beforeend", template);
      setTimeout(() => {
        document.querySelector(".wishlist-modal-dialog-box").remove();
      }, 2000);
    }


  }

  $(document).ready(function() {

    $(document).on('click', '.add_to_wishlist_button', function(e) {
        
        var $this = $(this),
            product_id = $this.attr( 'data-product-id' ),
            product_wrap = $('.add-to-wishlist-' + product_id),
            data = {
                _ajax_nonce: BETTER_WISHLIST_SCRIPTS.nonce,
                action: BETTER_WISHLIST_SCRIPTS.actions.add_to_wishlist_action,
                context: 'frontend',
                add_to_wishlist: product_id,
                product_type: $this.data('product-type'),
                wishlist_id: $this.data('wishlist-id' ),
                fragments: product_wrap.data('fragment-options')
            };

            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: BETTER_WISHLIST_SCRIPTS.ajax_url,
                data: data,
                success: function( response ) {
                    console.log(response);
                    if(response.success) {

                        $this.replaceWith(data.fragments.already_in_wishlist_text + ' <a href="'+data.fragments.wishlist_url+'">'+data.fragments.browse_wishlist_text+'</a>');
                        if (response.data.redirects) {
                          window.location.replace(data.fragments.wishlist_url);
                        } else {
                          //show_wishlist_modal();
                          wishlist_show_modal(response.data);
                        }
                        
                    }
                },
                error: function( response ) {
                    console.log(response);
                }
            });
    });

    $(document).on('click', '.bw-multiple-products-add-to-carts', function(e) {
        e.preventDefault();
        
        var $product_ids = $(this).data('product-ids'),
            $product_ids = $product_ids.split(":");

            $.ajax({
                type: 'POST',
                url: BETTER_WISHLIST_SCRIPTS.ajax_url,
                data: {
                    _ajax_nonce: BETTER_WISHLIST_SCRIPTS.nonce,
                    action: BETTER_WISHLIST_SCRIPTS.actions.multiple_product_add_to_cart_action,
                    product_ids: $product_ids
                },
                success: function( response ) {

                  if (response.success) {
                    if ( response.data.removed ) {
                      $('.wishlist_table').remove();
                      $('.multiple-products-add-to-cart').remove();
                    }

                    if ( (response.data.redirects) != null ) {
                      window.location.replace(response.data.redirects);
                    } else {
                      wishlist_show_modal(response.data);
                    }
                    
                  }
                  //console.log(response);
                  // $('.wishlist_table').remove();
                  // $('.multiple-products-add-to-cart').remove();
                  // all_product_add_cart_modal();
                },
                error: function( response ) {
                    console.log(response);
                }
            });

    });


    $(document).on('click', '.remove_from_wishlist', function(e) {
        e.preventDefault();

        var $this = $(this),
            $product_id = $this.data('product_id'),
            product_row = "#wishlist-row-" + $product_id,
            wishlist_table = $('.wishlist_table');

            $.ajax({
                type: 'POST',
                url: BETTER_WISHLIST_SCRIPTS.ajax_url,
                data: {
                    _ajax_nonce: BETTER_WISHLIST_SCRIPTS.nonce,
                    action: BETTER_WISHLIST_SCRIPTS.actions.remove_from_wishlist_action,
                    product_id: $product_id
                },
                success: function( response ) {

                    if (response.success) {
                      $(product_row).remove();
                      wishlist_show_modal(response.data);
                    }
                    if ( $('.wishlist_table tr.wishlist-row').length < 1 ) {
                      $('.multiple-products-add-to-cart').remove();
                      $('.wishlist_table').remove();
                    }
                },
                error: function( response ) {
                    console.log(response);
                }
          });

    });

    $(document).on('click', '.single-product-add-to-cart', function(e) {
      e.preventDefault();

      var $this = $(this),
          $product_id = $this.data('product_id');
          product_row = "#wishlist-row-" + $product_id,
          wishlist_table = $('.wishlist_table');

          $.ajax({
              type: 'POST',
              url: BETTER_WISHLIST_SCRIPTS.ajax_url,
              data: {
                  _ajax_nonce: BETTER_WISHLIST_SCRIPTS.nonce,
                  action: BETTER_WISHLIST_SCRIPTS.actions.single_product_add_to_cart_action,
                  product_id: $product_id
              },
              success: function( response ) {

                console.log(response);

                  if (response.success) {
                    if ( response.data.removed ) {
                      $(product_row).remove();
                    }
                    if ( $('.wishlist_table tr.wishlist-row').length < 1 ) {
                      $('.multiple-products-add-to-cart').remove();
                      $('.wishlist_table').remove();
                    }

                    if ( (response.data.redirects) != null ) {
                      window.location.replace(response.data.redirects);
                    } else {
                      wishlist_show_modal(response.data);
                    }
                    
                  }
              },
              error: function( response ) {
                  console.log(response);
              }
          });

     });

  });
    
})(jQuery);