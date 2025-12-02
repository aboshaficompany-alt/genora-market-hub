<?php
session_start();

// Get product ID from URL
$productId = isset($_GET['id']) ? intval($_GET['id']) : 1;

// Sample product data - replace with database query
$product = [
  'id' => $productId,
  'name' => 'سماعات بلوتوث لاسلكية عالية الجودة مع إلغاء الضوضاء النشط',
  'category' => 'إلكترونيات',
  'price' => 595,
  'original_price' => 850,
  'rating' => 4.5,
  'reviews_count' => 128,
  'in_stock' => true,
  'description' => 'استمتع بتجربة صوتية استثنائية مع سماعات البلوتوث اللاسلكية عالية الجودة. تتميز هذه السماعات بتقنية إلغاء الضوضاء النشط التي توفر لك تجربة استماع غامرة دون أي تشويش خارجي.',
  'images' => [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600',
    'https://images.unsplash.com/photo-1577174881658-0f30157e0e53?w=600',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
  ],
  'store' => [
    'name' => 'متجر التقنية الذكية',
    'rating' => 4.8,
    'reviews' => 542,
    'logo' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60'
  ]
];

$pageTitle = $product['name'];
$pageDescription = 'عرض تفاصيل المنتج مع الصور والمواصفات والتقييمات';
$activePage = 'categories';
include 'includes/header.php';
?>

  <!-- Main Content -->
  <main class="product-detail-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a href="index.php">الرئيسية</a>
        <span class="separator">/</span>
        <a href="categories.php"><?php echo htmlspecialchars($product['category']); ?></a>
        <span class="separator">/</span>
        <span><?php echo htmlspecialchars(mb_substr($product['name'], 0, 30)); ?>...</span>
      </nav>

      <!-- Product Details -->
      <div class="product-detail">
        <!-- Product Gallery with Zoom -->
        <div class="product-gallery">
          <div class="gallery-main">
            <img src="<?php echo $product['images'][0]; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" id="mainImage">
            <span class="product-badge sale">خصم 30%</span>
            <button class="btn-wishlist" aria-label="إضافة للمفضلة">
              <i class="far fa-heart"></i>
            </button>
            
            <!-- Gallery Navigation -->
            <button class="gallery-nav prev" aria-label="السابق">
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="gallery-nav next" aria-label="التالي">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <!-- Zoom Hint -->
            <div class="zoom-hint">
              <i class="fas fa-search-plus"></i>
              <span>اضغط للتكبير</span>
            </div>
          </div>
          
          <div class="gallery-thumbs">
            <?php foreach($product['images'] as $index => $image): ?>
            <div class="thumb <?php echo $index === 0 ? 'active' : ''; ?>">
              <img src="<?php echo str_replace('w=600', 'w=150', $image); ?>" alt="صورة <?php echo $index + 1; ?>">
            </div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <div class="product-category"><?php echo htmlspecialchars($product['category']); ?></div>
          <h1 class="product-title"><?php echo htmlspecialchars($product['name']); ?></h1>
          
          <div class="product-rating">
            <div class="stars">
              <?php for($i = 1; $i <= 5; $i++): ?>
                <?php if($i <= floor($product['rating'])): ?>
                  <i class="fas fa-star"></i>
                <?php elseif($i - 0.5 <= $product['rating']): ?>
                  <i class="fas fa-star-half-alt"></i>
                <?php else: ?>
                  <i class="far fa-star"></i>
                <?php endif; ?>
              <?php endfor; ?>
            </div>
            <span class="rating-number"><?php echo $product['rating']; ?></span>
            <span class="rating-count">(<?php echo $product['reviews_count']; ?> تقييم)</span>
            <a href="#reviews" class="reviews-link">مشاهدة التقييمات</a>
          </div>
          
          <div class="product-price">
            <div class="price-main">
              <?php if($product['original_price']): ?>
              <span class="price-original"><?php echo number_format($product['original_price']); ?> ر.س</span>
              <?php endif; ?>
              <span class="price-current"><?php echo number_format($product['price']); ?> ر.س</span>
            </div>
            <?php if($product['original_price']): ?>
            <div class="price-save">وفر <?php echo number_format($product['original_price'] - $product['price']); ?> ر.س (<?php echo round(100 - ($product['price'] / $product['original_price'] * 100)); ?>%)</div>
            <?php endif; ?>
            <div class="price-note">شامل ضريبة القيمة المضافة</div>
          </div>
          
          <!-- Color Variants -->
          <div class="product-variants">
            <div class="variant-group">
              <label class="variant-label">اللون:</label>
              <div class="color-options">
                <button class="color-option active" data-color="black" style="background: #000" title="أسود"></button>
                <button class="color-option" data-color="blue" style="background: #4A6FA5" title="أزرق"></button>
                <button class="color-option" data-color="red" style="background: #E07856" title="أحمر"></button>
                <button class="color-option" data-color="white" style="background: #fff; border: 2px solid #ddd" title="أبيض"></button>
              </div>
              <span class="selected-variant">أسود</span>
            </div>
          </div>
          
          <!-- Quantity -->
          <div class="product-quantity">
            <label class="variant-label">الكمية:</label>
            <div class="quantity-selector">
              <button class="qty-btn minus" aria-label="تقليل">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="qty-input" value="1" min="1" max="10" readonly>
              <button class="qty-btn plus" aria-label="زيادة">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <span class="stock-status <?php echo $product['in_stock'] ? 'available' : 'unavailable'; ?>">
              <i class="fas fa-<?php echo $product['in_stock'] ? 'check-circle' : 'times-circle'; ?>"></i>
              <?php echo $product['in_stock'] ? 'متوفر في المخزون' : 'غير متوفر'; ?>
            </span>
          </div>
          
          <!-- Action Buttons -->
          <div class="product-actions">
            <button class="btn btn-primary btn-large add-to-cart" onclick="addToCart(<?php echo $product['id']; ?>)">
              <i class="fas fa-shopping-cart"></i>
              إضافة إلى السلة
            </button>
            <button class="btn btn-outline btn-large">
              <i class="fas fa-bolt"></i>
              شراء سريع
            </button>
            <button class="btn btn-icon-only wishlist-toggle" title="إضافة للمفضلة">
              <i class="far fa-heart"></i>
            </button>
            <button class="btn btn-icon-only share-btn" title="مشاركة">
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
          
          <!-- Features -->
          <div class="product-features">
            <div class="feature-item">
              <i class="fas fa-shipping-fast"></i>
              <div class="feature-text">
                <strong>شحن مجاني</strong>
                <p>للطلبات فوق 200 ر.س</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fas fa-undo-alt"></i>
              <div class="feature-text">
                <strong>إرجاع مجاني</strong>
                <p>خلال 14 يوم</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fas fa-shield-alt"></i>
              <div class="feature-text">
                <strong>ضمان سنة</strong>
                <p>ضمان الوكيل المعتمد</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fas fa-headset"></i>
              <div class="feature-text">
                <strong>دعم 24/7</strong>
                <p>فريق الدعم جاهز للمساعدة</p>
              </div>
            </div>
          </div>
          
          <!-- Store Info -->
          <div class="store-info">
            <div class="store-header">
              <img src="<?php echo $product['store']['logo']; ?>" alt="<?php echo htmlspecialchars($product['store']['name']); ?>" class="store-logo">
              <div class="store-details">
                <h4 class="store-name"><?php echo htmlspecialchars($product['store']['name']); ?></h4>
                <div class="store-rating">
                  <i class="fas fa-star"></i>
                  <span><?php echo $product['store']['rating']; ?></span>
                  <span class="text-muted">(<?php echo $product['store']['reviews']; ?> تقييم)</span>
                </div>
              </div>
            </div>
            <a href="store-detail.php?id=1" class="btn btn-outline btn-sm">زيارة المتجر</a>
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <div class="product-tabs">
        <div class="tabs-nav">
          <button class="tab-btn active" data-tab="description">
            <i class="fas fa-align-right"></i>
            الوصف
          </button>
          <button class="tab-btn" data-tab="specifications">
            <i class="fas fa-list"></i>
            المواصفات
          </button>
          <button class="tab-btn" data-tab="reviews">
            <i class="fas fa-star"></i>
            التقييمات (<?php echo $product['reviews_count']; ?>)
          </button>
        </div>
        
        <div class="tabs-content">
          <!-- Description Tab -->
          <div class="tab-pane active" id="description">
            <h3>وصف المنتج</h3>
            <p><?php echo htmlspecialchars($product['description']); ?></p>
            
            <h4>المميزات الرئيسية:</h4>
            <ul class="features-list">
              <li><i class="fas fa-check-circle"></i> تقنية إلغاء الضوضاء النشط (ANC) المتطورة</li>
              <li><i class="fas fa-check-circle"></i> بطارية تدوم حتى 30 ساعة من الاستماع المتواصل</li>
              <li><i class="fas fa-check-circle"></i> شحن سريع - 5 دقائق شحن = 3 ساعات تشغيل</li>
              <li><i class="fas fa-check-circle"></i> صوت عالي الدقة بتقنية Hi-Res Audio</li>
              <li><i class="fas fa-check-circle"></i> وسائد أذن مريحة مصنوعة من الجلد الصناعي الفاخر</li>
            </ul>
          </div>
          
          <!-- Specifications Tab -->
          <div class="tab-pane" id="specifications">
            <h3>المواصفات التقنية</h3>
            <table class="specs-table">
              <tbody>
                <tr>
                  <td><strong>نوع السماعة</strong></td>
                  <td>Over-Ear</td>
                </tr>
                <tr>
                  <td><strong>الاتصال</strong></td>
                  <td>Bluetooth 5.3</td>
                </tr>
                <tr>
                  <td><strong>مدى الاتصال</strong></td>
                  <td>حتى 10 أمتار</td>
                </tr>
                <tr>
                  <td><strong>عمر البطارية</strong></td>
                  <td>30 ساعة (مع ANC) / 40 ساعة (بدون ANC)</td>
                </tr>
                <tr>
                  <td><strong>وقت الشحن</strong></td>
                  <td>2.5 ساعة</td>
                </tr>
                <tr>
                  <td><strong>الوزن</strong></td>
                  <td>250 جرام</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Reviews Tab -->
          <div class="tab-pane" id="reviews">
            <div class="reviews-summary">
              <div class="summary-rating">
                <div class="rating-number"><?php echo $product['rating']; ?></div>
                <div class="rating-stars large">
                  <?php for($i = 1; $i <= 5; $i++): ?>
                    <?php if($i <= floor($product['rating'])): ?>
                      <i class="fas fa-star"></i>
                    <?php elseif($i - 0.5 <= $product['rating']): ?>
                      <i class="fas fa-star-half-alt"></i>
                    <?php else: ?>
                      <i class="far fa-star"></i>
                    <?php endif; ?>
                  <?php endfor; ?>
                </div>
                <div class="rating-text">بناءً على <?php echo $product['reviews_count']; ?> تقييم</div>
              </div>
            </div>
            
            <!-- Sample Reviews -->
            <div class="reviews-list">
              <div class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">أ</div>
                    <div class="reviewer-details">
                      <span class="reviewer-name">أحمد محمد</span>
                      <span class="review-date">منذ 3 أيام</span>
                    </div>
                  </div>
                  <div class="review-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                </div>
                <p class="review-comment">منتج ممتاز جداً، جودة الصوت رائعة وإلغاء الضوضاء يعمل بشكل مثالي. أنصح به بشدة!</p>
              </div>
              
              <div class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">س</div>
                    <div class="reviewer-details">
                      <span class="reviewer-name">سارة أحمد</span>
                      <span class="review-date">منذ أسبوع</span>
                    </div>
                  </div>
                  <div class="review-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                  </div>
                </div>
                <p class="review-comment">سماعات مريحة جداً وجودة التصنيع ممتازة. البطارية تدوم طويلاً كما هو موصوف.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

<?php include 'includes/footer.php'; ?>
