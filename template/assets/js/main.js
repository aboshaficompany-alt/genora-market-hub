// ========================================
// Geenora Platform - Enhanced JavaScript
// ========================================

(function($) {
  'use strict';

  // ===================================
  // Header Effects
  // ===================================
  
  // Enhanced Header Scroll Effect with smooth transitions
  let lastScroll = 0;
  $(window).on('scroll', function() {
    const currentScroll = $(window).scrollTop();
    
    // Add scrolled class
    if (currentScroll > 100) {
      $('.header').addClass('scrolled');
    } else {
      $('.header').removeClass('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
      $('.header').css('transform', 'translateY(-100%)');
    } else {
      $('.header').css('transform', 'translateY(0)');
    }
    
    lastScroll = currentScroll;
  });

  // ===================================
  // Mobile Menu Enhanced
  // ===================================
  
  function toggleMobileMenu(show) {
    if (show) {
      $('#mobileMenuToggle').addClass('active');
      $('#mobileMenu').addClass('active');
      $('#mobileMenuOverlay').addClass('active');
      $('body').css('overflow', 'hidden');
    } else {
      $('#mobileMenuToggle').removeClass('active');
      $('#mobileMenu').removeClass('active');
      $('#mobileMenuOverlay').removeClass('active');
      $('body').css('overflow', '');
    }
  }

  $('#mobileMenuToggle').on('click', function() {
    const isActive = $(this).hasClass('active');
    toggleMobileMenu(!isActive);
  });

  $('#mobileMenuClose, #mobileMenuOverlay').on('click', function() {
    toggleMobileMenu(false);
  });
  
  // Close mobile menu on link click
  $('.mobile-nav-link').on('click', function() {
    setTimeout(() => toggleMobileMenu(false), 300);
  });

  // Close mobile menu on ESC key
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      toggleMobileMenu(false);
    }
  });

  // ===================================
  // Product Gallery
  // ===================================
  
  $('.gallery-thumbs .thumb').on('click', function() {
    $('.gallery-thumbs .thumb').removeClass('active');
    $(this).addClass('active');
    
    const newSrc = $(this).find('img').attr('src');
    const mainImg = $('.gallery-main img');
    
    // Smooth fade transition
    mainImg.css('opacity', '0');
    setTimeout(() => {
      mainImg.attr('src', newSrc);
      mainImg.css('opacity', '1');
    }, 200);
  });

  // ===================================
  // Product Quantity with validation
  // ===================================
  
  $('.quantity-selector button').on('click', function() {
    const input = $(this).siblings('input');
    let currentVal = parseInt(input.val()) || 1;
    const maxVal = parseInt(input.attr('max')) || 999;
    const minVal = parseInt(input.attr('min')) || 1;
    
    if ($(this).hasClass('btn-increase') && currentVal < maxVal) {
      input.val(currentVal + 1).trigger('change');
    } else if ($(this).hasClass('btn-decrease') && currentVal > minVal) {
      input.val(currentVal - 1).trigger('change');
    }
  });
  
  // Quantity input validation
  $('.quantity-selector input').on('change', function() {
    let val = parseInt($(this).val()) || 1;
    const maxVal = parseInt($(this).attr('max')) || 999;
    const minVal = parseInt($(this).attr('min')) || 1;
    
    if (val < minVal) val = minVal;
    if (val > maxVal) val = maxVal;
    
    $(this).val(val);
  });

  // ===================================
  // Product Tabs with smooth transitions
  // ===================================
  
  $('.tabs-nav button').on('click', function() {
    const target = $(this).data('tab');
    
    $('.tabs-nav button').removeClass('active');
    $(this).addClass('active');
    
    $('.tab-content').removeClass('active').fadeOut(200);
    
    setTimeout(() => {
      $(`#${target}`).addClass('active').fadeIn(300);
    }, 200);
  });

  // ===================================
  // Modal System
  // ===================================
  
  $('[data-modal-toggle]').on('click', function(e) {
    e.preventDefault();
    const target = $(this).data('modal-toggle');
    $(target).toggleClass('active');
    $('body').toggleClass('modal-open');
  });

  $('.modal-backdrop, .modal-close').on('click', function(e) {
    if ($(e.target).is('.modal-backdrop') || $(e.target).is('.modal-close')) {
      $('.modal').removeClass('active');
      $('body').removeClass('modal-open');
    }
  });

  // ===================================
  // Add to Cart with Animation
  // ===================================
  
  $('.btn-add-cart').on('click', function(e) {
    e.preventDefault();
    const $btn = $(this);
    const originalText = $btn.html();
    
    // Disable button
    $btn.addClass('loading').prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
      $btn.removeClass('loading').addClass('success');
      $btn.html('<i class="fas fa-check"></i> تمت الإضافة');
      
      // Update cart badge with animation
      const $badge = $('.header-action .badge-count').eq(1);
      const currentCount = parseInt($badge.text()) || 0;
      $badge.text(currentCount + 1).addClass('pulse-animation');
      
      setTimeout(() => {
        $badge.removeClass('pulse-animation');
      }, 600);
      
      // Reset button
      setTimeout(() => {
        $btn.removeClass('success').prop('disabled', false);
        $btn.html(originalText);
      }, 2000);
    }, 800);
  });

  // ===================================
  // Wishlist Toggle with Animation
  // ===================================
  
  $('.btn-wishlist').on('click', function(e) {
    e.preventDefault();
    const $btn = $(this);
    const isActive = $btn.hasClass('active');
    
    $btn.toggleClass('active');
    
    // Add bounce animation
    $btn.addClass('bounce-animation');
    setTimeout(() => {
      $btn.removeClass('bounce-animation');
    }, 600);
    
    // Update wishlist badge
    const $badge = $('.header-action .badge-count').eq(0);
    let currentCount = parseInt($badge.text()) || 0;
    currentCount = isActive ? Math.max(0, currentCount - 1) : currentCount + 1;
    $badge.text(currentCount).addClass('pulse-animation');
    
    setTimeout(() => {
      $badge.removeClass('pulse-animation');
    }, 600);
  });

  // ===================================
  // Smooth Scroll with offset
  // ===================================
  
  $('a[href^="#"]').on('click', function(e) {
    const hash = this.hash;
    if (hash && $(hash).length) {
      e.preventDefault();
      
      const offset = $('.header').outerHeight() + 20;
      
      $('html, body').animate({
        scrollTop: $(hash).offset().top - offset
      }, 800, 'swing');
      
      // Update URL without jumping
      if (history.pushState) {
        history.pushState(null, null, hash);
      }
    }
  });

  // ===================================
  // Lazy Loading for Images
  // ===================================
  
  function lazyLoadImages() {
    const images = $('img[data-src]');
    
    images.each(function() {
      const $img = $(this);
      const imageTop = $img.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();
      
      if (imageTop < windowBottom + 200) {
        const src = $img.data('src');
        $img.attr('src', src).removeAttr('data-src');
        $img.addClass('loaded');
      }
    });
  }

  // ===================================
  // Scroll Animations (Intersection Observer alternative)
  // ===================================
  
  function animateOnScroll() {
    const $elements = $('.animate-fade-in, .animate-slide-up, .animate-slide-in');
    
    $elements.each(function() {
      const $el = $(this);
      const elementTop = $el.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();
      
      if (elementTop < windowBottom - 80) {
        $el.addClass('animated');
      }
    });
  }

  // ===================================
  // Form Validation
  // ===================================
  
  $('form').on('submit', function(e) {
    const $form = $(this);
    let isValid = true;
    
    // Clear previous errors
    $form.find('.error').removeClass('error');
    $form.find('.error-message').remove();
    
    // Validate required fields
    $form.find('[required]').each(function() {
      const $field = $(this);
      if (!$field.val().trim()) {
        isValid = false;
        $field.addClass('error');
        $field.after('<span class="error-message">هذا الحقل مطلوب</span>');
      }
    });
    
    // Validate email
    $form.find('input[type="email"]').each(function() {
      const $email = $(this);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if ($email.val() && !emailRegex.test($email.val())) {
        isValid = false;
        $email.addClass('error');
        $email.after('<span class="error-message">البريد الإلكتروني غير صحيح</span>');
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      
      // Scroll to first error
      const firstError = $form.find('.error').first();
      if (firstError.length) {
        $('html, body').animate({
          scrollTop: firstError.offset().top - 100
        }, 500);
      }
    }
  });

  // ===================================
  // Search Enhancement
  // ===================================
  
  let searchTimeout;
  $('.search-input').on('input', function() {
    const $input = $(this);
    const query = $input.val();
    
    clearTimeout(searchTimeout);
    
    if (query.length >= 2) {
      searchTimeout = setTimeout(() => {
        // Simulate search - replace with actual API call
        console.log('Searching for:', query);
        // Show search results dropdown
        $('.search-results').addClass('active');
      }, 300);
    } else {
      $('.search-results').removeClass('active');
    }
  });

  // ===================================
  // Price Range Slider (if using range inputs)
  // ===================================
  
  $('input[type="range"]').on('input', function() {
    const $range = $(this);
    const value = $range.val();
    const $output = $range.siblings('.range-value');
    
    if ($output.length) {
      $output.text(value + ' ريال');
    }
  });

  // ===================================
  // Parallax Effect for Hero Section
  // ===================================
  
  function parallaxEffect() {
    const scrolled = $(window).scrollTop();
    $('.hero-bg-effects').css('transform', `translateY(${scrolled * 0.5}px)`);
  }

  // ===================================
  // Back to Top Button
  // ===================================
  
  const $backToTop = $('<button class="back-to-top" title="العودة للأعلى"><i class="fas fa-arrow-up"></i></button>');
  $('body').append($backToTop);
  
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 500) {
      $backToTop.addClass('visible');
    } else {
      $backToTop.removeClass('visible');
    }
  });
  
  $backToTop.on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  // ===================================
  // Initialize on Window Events
  // ===================================
  
  $(window).on('scroll', function() {
    animateOnScroll();
    lazyLoadImages();
    parallaxEffect();
  });

  $(window).on('resize', function() {
    // Close mobile menu on resize to desktop
    if ($(window).width() > 768) {
      toggleMobileMenu(false);
    }
  });

  // ===================================
  // Document Ready
  // ===================================
  
  $(document).ready(function() {
    console.log('✨ Geenora Platform Loaded Successfully');
    
    // Initial animations
    animateOnScroll();
    lazyLoadImages();
    
    // Add loaded class to body for CSS animations
    setTimeout(() => {
      $('body').addClass('loaded');
    }, 100);
    
    // Tooltip initialization (if using tooltips)
    $('[data-tooltip]').each(function() {
      $(this).attr('title', $(this).data('tooltip'));
    });
  });

  // ===================================
  // Helper Functions
  // ===================================
  
  // Format currency
  window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };
  
  // Show notification toast
  window.showToast = function(message, type = 'info') {
    const $toast = $(`
      <div class="toast toast-${type}">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `);
    
    $('body').append($toast);
    
    setTimeout(() => {
      $toast.addClass('show');
    }, 100);
    
    setTimeout(() => {
      $toast.removeClass('show');
      setTimeout(() => {
        $toast.remove();
      }, 300);
    }, 3000);
  };

})(jQuery);
