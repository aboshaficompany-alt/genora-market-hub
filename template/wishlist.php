<?php
session_start();
$pageTitle = 'قائمة الأمنيات';
$pageDescription = 'قائمة المنتجات المفضلة لديك في منصة جينورا';
$activePage = 'wishlist';
include 'includes/header.php';

// Sample wishlist items - replace with database query
$wishlistItems = [
  ['id' => 1, 'name' => 'سماعات بلوتوث لاسلكية عالية الجودة', 'category' => 'إلكترونيات', 'price' => 595, 'original_price' => 850, 'rating' => 4.5, 'reviews' => 128, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
  ['id' => 2, 'name' => 'ساعة ذكية متطورة مع شاشة AMOLED', 'category' => 'إكسسوارات', 'price' => 1299, 'original_price' => null, 'rating' => 5, 'reviews' => 96, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
  ['id' => 3, 'name' => 'حقيبة ظهر جلدية فاخرة للأعمال', 'category' => 'حقائب', 'price' => 520, 'original_price' => 650, 'rating' => 4, 'reviews' => 74, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'],
];
?>

  <!-- Main Content -->
  <main class="wishlist-page">
    <div class="container">
      <!-- Page Header -->
      <div class="wishlist-header">
        <div>
          <h1>قائمة الأمنيات</h1>
          <p class="text-muted">لديك <?php echo count($wishlistItems); ?> منتجات في قائمتك</p>
        </div>
        <div class="wishlist-actions">
          <button class="btn btn-outline">مشاركة القائمة</button>
          <button class="btn btn-outline-danger">حذف الكل</button>
        </div>
      </div>

      <?php if(count($wishlistItems) > 0): ?>
      <!-- Wishlist Grid -->
      <div class="wishlist-grid">
        <?php foreach($wishlistItems as $item): ?>
        <div class="wishlist-item">
          <button class="remove-btn" aria-label="إزالة من المفضلة" onclick="removeFromWishlist(<?php echo $item['id']; ?>)">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="product-card">
            <div class="product-image">
              <img src="<?php echo $item['image']; ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
              <?php if($item['badge']): ?>
              <span class="product-badge <?php echo $item['badge']; ?>">
                <?php 
                  if($item['badge'] == 'sale') echo 'خصم 30%';
                  elseif($item['badge'] == 'new') echo 'جديد';
                  elseif($item['badge'] == 'hot') echo 'الأكثر مبيعاً';
                ?>
              </span>
              <?php endif; ?>
            </div>
            
            <div class="product-info">
              <div class="product-category"><?php echo htmlspecialchars($item['category']); ?></div>
              <h3 class="product-title"><?php echo htmlspecialchars($item['name']); ?></h3>
              
              <div class="product-rating">
                <div class="rating-stars">
                  <?php for($i = 1; $i <= 5; $i++): ?>
                    <?php if($i <= floor($item['rating'])): ?>
                      <i class="fas fa-star"></i>
                    <?php elseif($i - 0.5 <= $item['rating']): ?>
                      <i class="fas fa-star-half-alt"></i>
                    <?php else: ?>
                      <i class="far fa-star"></i>
                    <?php endif; ?>
                  <?php endfor; ?>
                </div>
                <span class="rating-count">(<?php echo $item['reviews']; ?>)</span>
              </div>
              
              <div class="product-price">
                <?php if($item['original_price']): ?>
                <span class="price-original"><?php echo number_format($item['original_price']); ?> ر.س</span>
                <?php endif; ?>
                <span class="price-current"><?php echo number_format($item['price']); ?> ر.س</span>
              </div>
              
              <div class="product-actions">
                <button class="btn btn-primary btn-block" onclick="addToCart(<?php echo $item['id']; ?>)">
                  <i class="fas fa-shopping-cart"></i>
                  إضافة للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
      <?php else: ?>
      <!-- Empty State -->
      <div class="wishlist-empty">
        <div class="empty-icon">
          <i class="fas fa-heart-broken"></i>
        </div>
        <h2>قائمة الأمنيات فارغة</h2>
        <p>لم تقم بإضافة أي منتجات إلى قائمة الأمنيات بعد</p>
        <a href="categories.php" class="btn btn-primary">تصفح المنتجات</a>
      </div>
      <?php endif; ?>
    </div>
  </main>

<?php include 'includes/footer.php'; ?>
