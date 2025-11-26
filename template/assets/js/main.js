// ========================================
// Geenora Platform - Main JavaScript
// ========================================

(function($) {
  'use strict';

  // Header Scroll Effect
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 100) {
      $('.header').addClass('scrolled');
    } else {
      $('.header').removeClass('scrolled');
    }
  });

  // Mobile Menu Toggle
  $('.mobile-menu-toggle').on('click', function() {
    $(this).toggleClass('active');
    $('.mobile-menu').toggleClass('active');
    $('.mobile-menu-overlay').toggleClass('active');
  });

  $('.mobile-menu-overlay').on('click', function() {
    $('.mobile-menu-toggle').removeClass('active');
    $('.mobile-menu').removeClass('active');
    $(this).removeClass('active');
  });

  // Product Gallery
  $('.gallery-thumbs .thumb').on('click', function() {
    $('.gallery-thumbs .thumb').removeClass('active');
    $(this).addClass('active');
    const newSrc = $(this).find('img').attr('src');
    $('.gallery-main img').attr('src', newSrc);
  });

  // Product Quantity
  $('.quantity-selector button').on('click', function() {
    const input = $(this).siblings('input');
    const currentVal = parseInt(input.val());
    
    if ($(this).hasClass('btn-increase')) {
      input.val(currentVal + 1);
    } else if ($(this).hasClass('btn-decrease') && currentVal > 1) {
      input.val(currentVal - 1);
    }
  });

  // Product Tabs
  $('.tabs-nav button').on('click', function() {
    const target = $(this).data('tab');
    $('.tabs-nav button').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').removeClass('active');
    $(`#${target}`).addClass('active');
  });

  // Filters Toggle (Mobile)
  $('.filters-toggle-mobile').on('click', function() {
    $('.filters-sidebar .filters-card').addClass('active');
  });

  // Modal
  $('[data-modal-toggle]').on('click', function() {
    const target = $(this).data('modal-toggle');
    $(target).toggleClass('active');
  });

  $('.modal-backdrop').on('click', function(e) {
    if ($(e.target).is('.modal-backdrop')) {
      $(this).removeClass('active');
    }
  });

  // Add to Cart Animation
  $('.btn-add-cart').on('click', function(e) {
    e.preventDefault();
    $(this).addClass('added');
    setTimeout(() => {
      $(this).removeClass('added');
    }, 2000);
  });

  // Wishlist Toggle
  $('.btn-wishlist').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });

  // Smooth Scroll
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.hash);
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 80
      }, 800);
    }
  });

  // Animate on Scroll
  $(window).on('scroll', function() {
    $('.fade-in, .slide-up').each(function() {
      const elementTop = $(this).offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();
      
      if (elementTop < windowBottom - 100) {
        $(this).addClass('visible');
      }
    });
  });

  // Initialize
  $(document).ready(function() {
    console.log('Geenora Platform Loaded');
  });

})(jQuery);
