<?php
session_start();

// محاكاة بيانات المتجر (في التطبيق الحقيقي، استخدم قاعدة البيانات)
$store_id = $_GET['id'] ?? '1';

// بيانات المتجر التجريبية
$store = [
  'id' => $store_id,
  'name' => 'متجر الإلكترونيات الذكية',
  'description' => 'متخصصون في بيع أحدث الأجهزة الإلكترونية والتقنية بأفضل الأسعار وأعلى جودة. نوفر لكم مجموعة واسعة من المنتجات من أشهر العلامات التجارية العالمية.',
  'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
  'logo' => 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop',
  'category' => 'إلكترونيات',
  'rating' => 4.8,
  'reviews_count' => 156,
  'verified' => true,
  'city' => 'الرياض',
  'phone' => '0501234567',
  'email' => 'info@electronics-store.com',
  'website' => 'https://electronics-store.com',
  'social_media' => [
    'facebook' => 'https://facebook.com/store',
    'instagram' => 'https://instagram.com/store',
    'twitter' => 'https://twitter.com/store'
  ]
];

// منتجات المتجر التجريبية
$products = [
  [
    'id' => 1,
    'name' => 'هاتف ذكي X Pro',
    'price' => 2999,
    'discount_price' => 2499,
    'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'rating' => 4.5,
    'in_stock' => true
  ],
  [
    'id' => 2,
    'name' => 'سماعات لاسلكية Pro',
    'price' => 599,
    'discount_price' => null,
    'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'rating' => 4.7,
    'in_stock' => true
  ],
  [
    'id' => 3,
    'name' => 'ساعة ذكية Series 8',
    'price' => 1299,
    'discount_price' => 1099,
    'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'rating' => 4.6,
    'in_stock' => true
  ],
  [
    'id' => 4,
    'name' => 'لابتوب Gaming Pro',
    'price' => 4999,
    'discount_price' => null,
    'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    'rating' => 4.8,
    'in_stock' => false
  ]
];

// تقييمات المتجر التجريبية
$reviews = [
  [
    'id' => 1,
    'user_name' => 'أحمد محمد',
    'user_avatar' => 'https://i.pravatar.cc/150?img=1',
    'rating' => 5,
    'comment' => 'متجر ممتاز، منتجات أصلية وخدمة رائعة. أنصح بالشراء منهم!',
    'date' => '2024-01-15'
  ],
  [
    'id' => 2,
    'user_name' => 'فاطمة علي',
    'user_avatar' => 'https://i.pravatar.cc/150?img=5',
    'rating' => 4,
    'comment' => 'تجربة جيدة، الشحن سريع والمنتجات مطابقة للوصف',
    'date' => '2024-01-10'
  ],
  [
    'id' => 3,
    'user_name' => 'خالد سعيد',
    'user_avatar' => 'https://i.pravatar.cc/150?img=3',
    'rating' => 5,
    'comment' => 'أفضل متجر إلكترونيات تعاملت معه، احترافية عالية',
    'date' => '2024-01-05'
  ]
];

$pageTitle = $store['name'];
$pageDescription = $store['description'];
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo $pageTitle; ?> - جينورا</title>
  <meta name="description" content="<?php echo $pageDescription; ?>">
  
  <!-- Google Fonts - Cairo -->
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="container">
      <div class="header-container">
        <a href="index.html" class="logo">
          <i class="fas fa-store logo-icon"></i>
          <div class="logo-text">
            <span>جينورا</span>
            <span class="logo-subtitle">المتاجر المتعددة</span>
          </div>
        </a>

        <nav class="nav">
          <a href="index.html" class="nav-link">الرئيسية</a>
          <a href="categories.html" class="nav-link">الأصناف</a>
          <a href="stores.html" class="nav-link active">المتاجر</a>
          <a href="terms.html" class="nav-link">الشروط</a>
        </nav>

        <div class="header-actions">
          <a href="wishlist.html" class="header-action">
            <i class="far fa-heart"></i>
          </a>
          <a href="cart.html" class="header-action">
            <i class="fas fa-shopping-cart"></i>
          </a>
          <a href="login.php" class="btn btn-primary btn-sm">تسجيل الدخول</a>
        </div>
      </div>
    </div>
  </header>

  <!-- Store Header -->
  <section class="store-header-section">
    <div class="store-header-bg" style="background-image: url('<?php echo $store['image']; ?>')"></div>
    <div class="container">
      <div class="store-header-content">
        <div class="store-header-info">
          <div class="store-logo">
            <img src="<?php echo $store['logo']; ?>" alt="<?php echo $store['name']; ?>">
            <?php if ($store['verified']): ?>
            <div class="verified-badge">
              <i class="fas fa-check-circle"></i>
            </div>
            <?php endif; ?>
          </div>
          <div class="store-info">
            <h1 class="store-name"><?php echo $store['name']; ?></h1>
            <div class="store-meta">
              <div class="store-rating">
                <i class="fas fa-star"></i>
                <span><?php echo $store['rating']; ?></span>
                <span class="reviews-count">(<?php echo $store['reviews_count']; ?> تقييم)</span>
              </div>
              <span class="store-category">
                <i class="fas fa-tag"></i>
                <?php echo $store['category']; ?>
              </span>
              <span class="store-location">
                <i class="fas fa-map-marker-alt"></i>
                <?php echo $store['city']; ?>
              </span>
            </div>
            <p class="store-description"><?php echo $store['description']; ?></p>
            <div class="store-actions">
              <button class="btn btn-primary">
                <i class="fas fa-heart"></i>
                متابعة المتجر
              </button>
              <button class="btn btn-secondary">
                <i class="fas fa-share-alt"></i>
                مشاركة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Store Content -->
  <section class="store-content-section">
    <div class="container">
      <div class="store-layout">
        
        <!-- Sidebar -->
        <aside class="store-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-title">
              <i class="fas fa-info-circle"></i>
              معلومات التواصل
            </h3>
            <div class="contact-list">
              <a href="tel:<?php echo $store['phone']; ?>" class="contact-item">
                <i class="fas fa-phone"></i>
                <span><?php echo $store['phone']; ?></span>
              </a>
              <a href="mailto:<?php echo $store['email']; ?>" class="contact-item">
                <i class="fas fa-envelope"></i>
                <span><?php echo $store['email']; ?></span>
              </a>
              <?php if ($store['website']): ?>
              <a href="<?php echo $store['website']; ?>" target="_blank" class="contact-item">
                <i class="fas fa-globe"></i>
                <span>زيارة الموقع</span>
              </a>
              <?php endif; ?>
            </div>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-title">
              <i class="fas fa-share-alt"></i>
              تابعنا
            </h3>
            <div class="social-links">
              <?php if ($store['social_media']['facebook']): ?>
              <a href="<?php echo $store['social_media']['facebook']; ?>" target="_blank" class="social-link facebook">
                <i class="fab fa-facebook"></i>
              </a>
              <?php endif; ?>
              <?php if ($store['social_media']['instagram']): ?>
              <a href="<?php echo $store['social_media']['instagram']; ?>" target="_blank" class="social-link instagram">
                <i class="fab fa-instagram"></i>
              </a>
              <?php endif; ?>
              <?php if ($store['social_media']['twitter']): ?>
              <a href="<?php echo $store['social_media']['twitter']; ?>" target="_blank" class="social-link twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <?php endif; ?>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="store-main-content">
          
          <!-- Products Section -->
          <div class="store-section">
            <div class="section-header">
              <h2 class="section-title">منتجات المتجر</h2>
              <div class="section-filters">
                <select class="form-select">
                  <option>الأحدث</option>
                  <option>الأكثر مبيعاً</option>
                  <option>الأعلى تقييماً</option>
                  <option>السعر: من الأقل للأعلى</option>
                  <option>السعر: من الأعلى للأقل</option>
                </select>
              </div>
            </div>

            <div class="products-grid">
              <?php foreach ($products as $product): ?>
              <div class="product-card">
                <?php if ($product['discount_price']): ?>
                <div class="product-badge sale-badge">
                  خصم <?php echo round((1 - $product['discount_price'] / $product['price']) * 100); ?>%
                </div>
                <?php endif; ?>
                <?php if (!$product['in_stock']): ?>
                <div class="product-badge sold-out-badge">نفذت الكمية</div>
                <?php endif; ?>
                
                <div class="product-image">
                  <img src="<?php echo $product['image']; ?>" alt="<?php echo $product['name']; ?>">
                  <button class="btn-wishlist">
                    <i class="far fa-heart"></i>
                  </button>
                </div>
                
                <div class="product-info">
                  <h3 class="product-name"><?php echo $product['name']; ?></h3>
                  <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span><?php echo $product['rating']; ?></span>
                  </div>
                  <div class="product-price">
                    <?php if ($product['discount_price']): ?>
                      <span class="original-price"><?php echo number_format($product['price']); ?> ريال</span>
                      <span class="discount-price"><?php echo number_format($product['discount_price']); ?> ريال</span>
                    <?php else: ?>
                      <span class="current-price"><?php echo number_format($product['price']); ?> ريال</span>
                    <?php endif; ?>
                  </div>
                  <?php if ($product['in_stock']): ?>
                  <button class="btn btn-primary btn-block btn-add-cart">
                    <i class="fas fa-shopping-cart"></i>
                    أضف للسلة
                  </button>
                  <?php else: ?>
                  <button class="btn btn-secondary btn-block" disabled>
                    <i class="fas fa-ban"></i>
                    نفذت الكمية
                  </button>
                  <?php endif; ?>
                </div>
              </div>
              <?php endforeach; ?>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="store-section">
            <div class="section-header">
              <h2 class="section-title">تقييمات المتجر</h2>
              <button class="btn btn-primary" data-modal-toggle="#reviewModal">
                <i class="fas fa-star"></i>
                إضافة تقييم
              </button>
            </div>

            <div class="reviews-summary">
              <div class="overall-rating">
                <div class="rating-number"><?php echo $store['rating']; ?></div>
                <div class="rating-stars">
                  <?php for($i = 1; $i <= 5; $i++): ?>
                    <i class="fas fa-star <?php echo $i <= $store['rating'] ? 'active' : ''; ?>"></i>
                  <?php endfor; ?>
                </div>
                <div class="rating-count">بناءً على <?php echo $store['reviews_count']; ?> تقييم</div>
              </div>
            </div>

            <div class="reviews-list">
              <?php foreach ($reviews as $review): ?>
              <div class="review-card">
                <div class="review-header">
                  <div class="reviewer-info">
                    <img src="<?php echo $review['user_avatar']; ?>" alt="<?php echo $review['user_name']; ?>" class="reviewer-avatar">
                    <div>
                      <h4 class="reviewer-name"><?php echo $review['user_name']; ?></h4>
                      <div class="review-date"><?php echo date('d/m/Y', strtotime($review['date'])); ?></div>
                    </div>
                  </div>
                  <div class="review-rating">
                    <?php for($i = 1; $i <= 5; $i++): ?>
                      <i class="fas fa-star <?php echo $i <= $review['rating'] ? 'active' : ''; ?>"></i>
                    <?php endfor; ?>
                  </div>
                </div>
                <p class="review-comment"><?php echo $review['comment']; ?></p>
              </div>
              <?php endforeach; ?>
            </div>
          </div>

        </main>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-col">
          <h3 class="footer-title">عن جينورا</h3>
          <p class="footer-description">منصة رقمية ذات فلسفة تمكينية وإنسانية تجمع عدة متاجر متنوعة في مكان واحد</p>
        </div>
        <div class="footer-col">
          <h3 class="footer-title">روابط سريعة</h3>
          <ul class="footer-links">
            <li><a href="index.html">الرئيسية</a></li>
            <li><a href="categories.html">الأصناف</a></li>
            <li><a href="stores.html">المتاجر</a></li>
            <li><a href="terms.html">الشروط</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-title">تواصل معنا</h3>
          <ul class="footer-contact">
            <li>📧 support@geenora.com</li>
            <li>📞 920000000</li>
            <li>📍 الرياض، السعودية</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="footer-copyright">© 2024 جينورا. جميع الحقوق محفوظة</p>
          <p class="footer-made-with">
            صنع بـ <i class="fas fa-heart"></i> في المملكة العربية السعودية
          </p>
        </div>
      </div>
    </div>
  </footer>

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <!-- Custom JS -->
  <script src="assets/js/main.js"></script>
</body>
</html>
