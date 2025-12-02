// ========================================
// Geenora Platform - Interactive Image Gallery
// ========================================

(function($) {
  'use strict';

  // Gallery State
  let currentImageIndex = 0;
  let images = [];
  let zoomLevel = 1;
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.5;

  // Initialize Gallery
  function initGallery() {
    // Collect all gallery images
    images = [];
    $('.gallery-thumbs .thumb img').each(function() {
      images.push($(this).attr('src'));
    });
    
    // If no thumbs, get main image
    if (images.length === 0) {
      const mainSrc = $('.gallery-main img').attr('src');
      if (mainSrc) {
        images.push(mainSrc);
      }
    }
  }

  // Open Gallery Modal
  function openGalleryModal(index) {
    currentImageIndex = index || 0;
    zoomLevel = 1;
    
    const $modal = $('#galleryModal');
    
    if ($modal.length === 0) {
      createGalleryModal();
    }
    
    updateModalImage();
    $('#galleryModal').addClass('active');
    $('body').css('overflow', 'hidden');
  }

  // Close Gallery Modal
  function closeGalleryModal() {
    $('#galleryModal').removeClass('active');
    $('body').css('overflow', '');
    zoomLevel = 1;
  }

  // Create Gallery Modal
  function createGalleryModal() {
    const modalHTML = `
      <div class="gallery-modal" id="galleryModal">
        <div class="modal-content">
          <button class="close-btn" id="galleryClose">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="image-counter">
            <span id="currentImageNum">1</span> / <span id="totalImages">${images.length}</span>
          </div>
          
          <button class="modal-nav prev" id="galleryPrev">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <img src="" alt="صورة المنتج" class="main-image" id="modalMainImage">
          
          <button class="modal-nav next" id="galleryNext">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="zoom-controls">
            <button id="zoomOut" title="تصغير">
              <i class="fas fa-search-minus"></i>
            </button>
            <span class="zoom-level" id="zoomLevelDisplay">100%</span>
            <button id="zoomIn" title="تكبير">
              <i class="fas fa-search-plus"></i>
            </button>
            <button id="zoomReset" title="إعادة تعيين">
              <i class="fas fa-expand"></i>
            </button>
          </div>
          
          <div class="modal-thumbs" id="modalThumbs"></div>
        </div>
      </div>
    `;
    
    $('body').append(modalHTML);
    bindModalEvents();
    createModalThumbnails();
  }

  // Create Modal Thumbnails
  function createModalThumbnails() {
    const $thumbsContainer = $('#modalThumbs');
    $thumbsContainer.empty();
    
    images.forEach((src, index) => {
      const activeClass = index === currentImageIndex ? 'active' : '';
      $thumbsContainer.append(`
        <div class="thumb ${activeClass}" data-index="${index}">
          <img src="${src}" alt="صورة ${index + 1}">
        </div>
      `);
    });
  }

  // Update Modal Image
  function updateModalImage() {
    const $mainImage = $('#modalMainImage');
    const src = images[currentImageIndex];
    
    // Reset zoom
    zoomLevel = 1;
    updateZoomDisplay();
    $mainImage.css('transform', `scale(${zoomLevel})`);
    $mainImage.removeClass('zoomed');
    
    // Fade transition
    $mainImage.css('opacity', '0');
    setTimeout(() => {
      $mainImage.attr('src', src);
      $mainImage.css('opacity', '1');
    }, 150);
    
    // Update counter
    $('#currentImageNum').text(currentImageIndex + 1);
    
    // Update thumbnails
    $('#modalThumbs .thumb').removeClass('active');
    $(`#modalThumbs .thumb[data-index="${currentImageIndex}"]`).addClass('active');
    
    // Update page thumbnails too
    $('.gallery-thumbs .thumb').removeClass('active');
    $(`.gallery-thumbs .thumb:eq(${currentImageIndex})`).addClass('active');
    
    // Update main page image
    $('.gallery-main img').attr('src', src);
  }

  // Navigate Gallery
  function navigateGallery(direction) {
    if (direction === 'next') {
      currentImageIndex = (currentImageIndex + 1) % images.length;
    } else {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    }
    updateModalImage();
  }

  // Zoom Functions
  function zoomIn() {
    if (zoomLevel < maxZoom) {
      zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
      applyZoom();
    }
  }

  function zoomOut() {
    if (zoomLevel > minZoom) {
      zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
      applyZoom();
    }
  }

  function resetZoom() {
    zoomLevel = 1;
    applyZoom();
  }

  function applyZoom() {
    const $mainImage = $('#modalMainImage');
    $mainImage.css('transform', `scale(${zoomLevel})`);
    
    if (zoomLevel > 1) {
      $mainImage.addClass('zoomed');
    } else {
      $mainImage.removeClass('zoomed');
    }
    
    updateZoomDisplay();
    updateZoomButtons();
  }

  function updateZoomDisplay() {
    $('#zoomLevelDisplay').text(Math.round(zoomLevel * 100) + '%');
  }

  function updateZoomButtons() {
    $('#zoomIn').prop('disabled', zoomLevel >= maxZoom);
    $('#zoomOut').prop('disabled', zoomLevel <= minZoom);
  }

  // Bind Modal Events
  function bindModalEvents() {
    // Close button
    $(document).on('click', '#galleryClose', closeGalleryModal);
    
    // Click outside to close
    $(document).on('click', '#galleryModal', function(e) {
      if ($(e.target).is('#galleryModal') || $(e.target).is('.modal-content')) {
        closeGalleryModal();
      }
    });
    
    // Navigation
    $(document).on('click', '#galleryPrev', function() {
      navigateGallery('prev');
    });
    
    $(document).on('click', '#galleryNext', function() {
      navigateGallery('next');
    });
    
    // Thumbnail click
    $(document).on('click', '#modalThumbs .thumb', function() {
      currentImageIndex = parseInt($(this).data('index'));
      updateModalImage();
    });
    
    // Zoom controls
    $(document).on('click', '#zoomIn', zoomIn);
    $(document).on('click', '#zoomOut', zoomOut);
    $(document).on('click', '#zoomReset', resetZoom);
    
    // Keyboard navigation
    $(document).on('keydown', function(e) {
      if (!$('#galleryModal').hasClass('active')) return;
      
      switch(e.key) {
        case 'Escape':
          closeGalleryModal();
          break;
        case 'ArrowRight':
          navigateGallery('prev'); // RTL
          break;
        case 'ArrowLeft':
          navigateGallery('next'); // RTL
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    });
    
    // Mouse wheel zoom
    $(document).on('wheel', '#modalMainImage', function(e) {
      e.preventDefault();
      if (e.originalEvent.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    });
    
    // Touch gestures for mobile
    let touchStartDistance = 0;
    let initialZoom = 1;
    
    $(document).on('touchstart', '#modalMainImage', function(e) {
      if (e.touches.length === 2) {
        touchStartDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialZoom = zoomLevel;
      }
    });
    
    $(document).on('touchmove', '#modalMainImage', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        
        const scale = currentDistance / touchStartDistance;
        zoomLevel = Math.min(maxZoom, Math.max(minZoom, initialZoom * scale));
        applyZoom();
      }
    });
    
    // Swipe navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    $(document).on('touchstart', '#galleryModal .modal-content', function(e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    });
    
    $(document).on('touchend', '#galleryModal .modal-content', function(e) {
      if (e.changedTouches.length === 1) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
      }
    });
    
    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          navigateGallery('next'); // Swipe left (RTL: next)
        } else {
          navigateGallery('prev'); // Swipe right (RTL: prev)
        }
      }
    }
  }

  // Page Gallery Events
  $(document).ready(function() {
    initGallery();
    
    // Click on main image to open modal
    $('.gallery-main').on('click', function() {
      openGalleryModal(currentImageIndex);
    });
    
    // Click on thumbnails
    $('.gallery-thumbs .thumb').on('click', function() {
      const index = $(this).index();
      currentImageIndex = index;
      
      // Update main image
      const newSrc = $(this).find('img').attr('src');
      const $mainImg = $('.gallery-main img');
      
      $mainImg.css('opacity', '0');
      setTimeout(() => {
        $mainImg.attr('src', newSrc);
        $mainImg.css('opacity', '1');
      }, 150);
      
      // Update active state
      $('.gallery-thumbs .thumb').removeClass('active');
      $(this).addClass('active');
    });
    
    // Page navigation arrows
    $('.gallery-nav.prev').on('click', function(e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updatePageGallery();
    });
    
    $('.gallery-nav.next').on('click', function(e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updatePageGallery();
    });
  });
  
  // Update page gallery (not modal)
  function updatePageGallery() {
    const src = images[currentImageIndex];
    const $mainImg = $('.gallery-main img');
    
    $mainImg.css('opacity', '0');
    setTimeout(() => {
      $mainImg.attr('src', src);
      $mainImg.css('opacity', '1');
    }, 150);
    
    $('.gallery-thumbs .thumb').removeClass('active');
    $(`.gallery-thumbs .thumb:eq(${currentImageIndex})`).addClass('active');
  }

  // Expose functions globally
  window.GeenoraGallery = {
    open: openGalleryModal,
    close: closeGalleryModal,
    next: function() { navigateGallery('next'); },
    prev: function() { navigateGallery('prev'); },
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    resetZoom: resetZoom
  };

})(jQuery);
