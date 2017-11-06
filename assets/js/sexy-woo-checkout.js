$=jQuery;

$(document).ready(function() {initialize_sexy_woo_checkout();});

function initialize_sexy_woo_checkout() {

	console.log('sexy woo initialized');



  if ($('.woocommerce .cart-empty').length === 1) {
    $('.plus_btn').hide();
  } else {
    $('.plus_btn').fadeIn();
  }

  if ($('.shipping_address').length === 0) {
    $('.woocommerce-shipping-fields').fadeOut();
	} else {
    $('.woocommerce-shipping-fields').fadeIn();
	}


  $('#slider .fa-shopping-cart').unbind().click(function(e) {

    e.preventDefault();

    // if ($(window).width() < 768) {
    $(this).addClass('fa-times-circle shopping_cart_clicked_before');
    $(this).removeClass('fa-shopping-cart');
    initialize();
    view_slider($(window).width(), 'cart', $(this));
    // }

  });

  // $('#slider .checkout-button').unbind().click(function(e) {
  //
  //   e.preventDefault();
  //
  //   var closeBtn = $('.fa-times-circle')
  //   closeBtn.addClass('fa-shopping-cart');
  //   closeBtn.removeClass('fa-times-circle');
  //   initialize_sexy_woo_checkout();
  //
  //   view_slider($(window).width(), 'checkout', $(this));
  //
  // });
  //
  // $('#slider a.button.checkout.wc-forward').unbind().click(function(e) {
  //
  //   e.preventDefault();
  //
  //   view_slider($(window).width(), 'checkout', $(this));
  //
  // });

  /* Add class .checkout-active to slide when checkout is initiated.
	   Makes styling checkout fields a little bit easy */

  // $('#slider .wc-proceed-to-checkout').unbind().click(function(e){
  //   e.preventDefault();
  //   $('#slider').addClass("checkout-active");
  // });

  $('#slider #close_slider').unbind().click(function(e){
    e.preventDefault();
    if($('#slider').hasClass("checkout-active")){
      $('#slider').removeClass("checkout-active");
    }
  });

	$('#slider .product-remove a').unbind().click( function(e) {

		e.preventDefault();

		woo_remove_from_cart($(this).data('product_id'));

		$(this).parent().parent().fadeOut();

	});

	$('.single_add_to_cart_button').unbind().click(function(e) {

			console.log('single_add_to_cart_button');

      e.preventDefault();

      if ($(this).val()) {
      	productID = $(this).val();
			} else {
      	productID = $('input[name="product_id"]').val();
			}

      woo_add_to_cart(productID);

      view_slider($(window).width(), 'cart', $(this));

  });


	$('.add_to_cart_button').unbind().click(function(e) {

    console.log('add_to_cart_button');
		
		e.preventDefault();

    woo_add_to_cart($(this).data('product_id'));

		view_slider($(window).width(), 'cart', $(this));

	});
	
	$('#slider input[name="woocommerce_checkout_place_order"]').unbind().click(function(e) {
		 
		 e.preventDefault();
		 sexy_woo_ajax_checkout();
		 
	});
	
	$('#slider input[name="apply_coupon"]').unbind().click(function(e){
		e.preventDefault();
		apply_coupon($(this));
	});
	
	$('#slider .woocommerce-remove-coupon').unbind().click(function(e){
		e.preventDefault();
		remove_coupon($(this));
	});
	
	$('#slider .qty').change( function() {

		var qty = $( this ).val();
		var currentVal  = parseFloat( qty);
		var item_hash = $( this ).attr( 'name' ).replace(/cart\[([\w]+)\]\[qty\]/g, "$1");

		woo_update_qty(qty, currentVal, item_hash);

	});
    
 		
		
	// SAME AS SHIPPING
	if ($('.shipping_address').length > 0) {
		
		$('.shipping_address').slideUp();
	
		if ($('#ship-to-different-address-checkbox:checked').length === 0) {
			populate_shipping_fields();
		}
		
		$('#slider #ship-to-different-address-checkbox').unbind().click(function() {
	    if(this.checked) {
	        clear_shipping_fields();
	        $('.shipping_address').slideDown();
	    } else {
		    populate_shipping_fields();
        $('.shipping_address').slideUp();
	    }
	  });
	}

	// CART PLUS
  $('#slider .cart_totals .shop_table tr:not(:last-child)').wrap('<div class="totals_wrap"></div>');
  // $('.cart_totals').append('<a href="#" class="cart_plus plus_btn"><span>+</span></a>');
  // $('.cart_plus').text($('.cart_plus').text() == '-' ? '+' : '+');
    
	$('#slider .cart_plus').unbind().click(function() {
	    $('#slider .cart_totals .totals_wrap').slideToggle();
	    $('.cart_plus').text($('.cart_plus').text() == '+' ? '-' : '+');
	    $('#slider .order-total').toggleClass('border_top');
	});
  
  // CHECKOUT PLUS
  $('#slider .woocommerce-checkout-review-order-table tr:not(:last-child)').wrap('<div class="totals_wrap"></div>');
  // $('#slider .shop_table tfoot').append('<a href="#" class="checkout_plus plus_btn"><span>+</span></a>');
  // $('.checkout_plus').text($('.checkout_plus').text() == '-' ? '+' : '+');
  
  $('#slider .checkout_plus').unbind().click(function() {
    $('#slider .woocommerce-checkout-review-order-table .totals_wrap').slideToggle();
    $('.checkout_plus').text($('.checkout_plus').text() == '+' ? '-' : '+');
    $('#slider .order-total').toggleClass('border_top');
  });

		
	$("#slider").keyup(function(e){ 
	  var code = e.which; // recommended to use e.which, it's normalized across browsers
	  if(code==32||code==13||code==188||code==186){
		  e.preventDefault();
	    ajax_refresh_cart_and_checkout();
	  } 
	});
	
	
	
	$('#place_order').unbind().click(function(e) {
		e.preventDefault();
		ajax_place_order();
	});
	
	
	
	
}





function populate_shipping_fields() {
	$('#shipping_first_name').val($('#billing_first_name').val());
  $('#shipping_last_name').val($('#billing_last_name').val());
  $('#shipping_address_1').val($('#billing_address_1').val());
  $('#shipping_address_2').val($('#billing_address_2').val());
  $('#shipping_city').val($('#billing_city').val());
  $('#shipping_state').val($('#billing_state').val());
  $('#shipping_postcode').val($('#billing_postcode').val());
  $('#shipping_country').val($('#billing_country').val());
  $('#shipping_phone').val($('#billing_phone').val());
}


function clear_shipping_fields() {
	$('#shipping_first_name').val('');
  $('#shipping_last_name').val('');
  $('#shipping_address_1').val('');
  $('#shipping_address_2').val('');
  $('#shipping_city').val('');
  $('#shipping_state').val('');
  $('#shipping_postcode').val('');
  $('#shipping_country').val('');
  $('#shipping_phone').val('');
}



// AJAX DISCOUNT CODE
function apply_coupon(element) {

	console.log('apply coupon');

	var coupon = $('.checkout_coupon input[name="coupon_code"]').val();

	if (coupon != '') {
		$.post('?wc-ajax=apply_coupon', {security: localized_config.apply_coupon_nonce,coupon_code : coupon}).done(function(data) {
			ajax_refresh_cart_and_checkout(data);
		});
	}

}

function remove_coupon(element) {

	var coupon = $(element).data('coupon');

	$.post('?wc-ajax=remove_coupon', {security: localized_config.remove_coupon_nonce, coupon : coupon}).done(function(data) {
		ajax_refresh_cart_and_checkout(data);
	});

}

function woo_add_to_cart(productID) {

  $.post('?wc-ajax=add_to_cart', {product_id : productID, quantity: 1}).done(function(data) {
    ajax_refresh_cart_and_checkout(data);
    after_woo_add_to_cart(productID);
  });
}

function woo_update_qty(qty, currentVal, item_hash) {

  var data = {
	        action: 'sexy_update_total_price',
	        security: localized_config.update_total_price_nonce,
	        quantity: currentVal,
	        hash : item_hash
	    };

  $.post( woocommerce_params.ajax_url, data, function( response ) {
			ajax_refresh_cart_and_checkout();
// 	      $( 'div.cart_totals' ).replaceWith( response );
// 	      $( 'body' ).trigger( 'sexy_update_total_price' );

  });

}


function woo_remove_from_cart(productID) {
        
  $.post(woocommerce_params.ajax_url, {'action': 'sexy_product_remove', 'product_id': productID}).done(function(data) {
	  ajax_refresh_cart_and_checkout(data);
  });

}

function sexy_woo_ajax_checkout() {
	$.post('?wc-ajax=checkout', {}).done(function(data) {
    ajax_refresh_cart_and_checkout(data);    
  });
}

function ajax_refresh_cart_and_checkout(data) {

	$( 'div.cart_totals' ).block({ message: null, overlayCSS: { background: '#fff url(' + woocommerce_params.ajax_url + ') no-repeat center', backgroundSize: '16px 16px', opacity: 0.6 } });
	$( 'div.woocommerce-checkout-review-order-table' ).block({ message: null, overlayCSS: { background: '#fff url(' + woocommerce_params.ajax_url + ') no-repeat center', backgroundSize: '16px 16px', opacity: 0.6 } });
	
	update_cart_totals(data); // RUNS THROUGH CHECKOUT AS WELL

}

function display_json_output(previousData, checkoutData) {

    if (typeof previousData != 'undefined') {
      if (typeof previousData.messages == 'undefined') {
        console.log(previousData);
        $('#sexy-woo-messages div').hide().html(previousData).fadeIn();
      } else {
        $('#sexy-woo-messages div').hide().html(previousData.messages).fadeIn();
      }
    }

    if (typeof checkoutData != 'undefined') {
      $('#sexy-woo-messages div').hide().html(checkoutData.messages).fadeIn();
		}

  initialize_sexy_woo_checkout();

}

function update_cart_totals(previousData) {
	$.post(
      woocommerce_params.ajax_url,
      {'action': 'sexy_ajax_refresh_cart'},
      function(result) {
	      $('#sexy-woo-cart-container').hide().html(result).fadeIn();
	      update_checkout_totals(previousData)
      }
  );
}

function update_checkout_totals(previousData) {
	$.post('?wc-ajax=update_order_review', {security: localized_config.update_order_review}).done(function(checkoutData) {

		$('.woocommerce-checkout-review-order-table').html(checkoutData.fragments['.woocommerce-checkout-review-order-table']);

		if (checkoutData.messages != '') {
      display_json_output(previousData, checkoutData.messages);
		} else {
      display_json_output(previousData);
		}


  });
}

function ajax_place_order() {

	$('#slider #loading').fadeIn();

	$.post('?wc-ajax=checkout', $('.checkout').serialize()).done(function(data) {

  	display_json_output(data);

  	if (data.result == 'failure') {
  		var failureMessage = '<ul class="woocommerce-error"><li>Error processing transaction.</li></ul>';
      display_json_output(failureMessage);
		} else {
      if (data.redirect !== '') {
        console.log(data);
        // window.location.replace(data.redirect);
      }
		}

    $('#slider #loading').fadeOut();

  });
}


function after_woo_add_to_cart(data) {

	project_specific(data);

}