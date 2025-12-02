<?php
session_start();
$pageTitle = 'الأصناف';
$pageDescription = 'تصفح جميع المنتجات والأصناف في منصة جينورا';
$activePage = 'categories';
include 'includes/header.php';
?>

  <!-- Page Header -->
  <div class="page-header">
    <div class="container">
      <h1 class="page-title">الأصناف</h1>
      <p class="page-description">اكتشف آلاف المنتجات من أفضل المتاجر</p>
      <nav class="breadcrumb">
        <a href="index.php">الرئيسية</a>
        <span class="separator">/</span>
        <span>الأصناف</span>
      </nav>
    </div>
  </div>

  <!-- Main Content -->
  <main class="products-page">
    <div class="container">
      <div class="products-container">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar">
          <div class="filters-card">
            <div class="filters-header">
              <h3>الفلاتر</h3>
              <button onclick="resetFilters()">مسح الكل</button>
            </div>
            
            <!-- Category Filter -->
            <div class="filter-group">
              <h4 class="filter-title">التصنيف</h4>
              <div class="filter-options">
                <label>
                  <input type="checkbox" checked>
                  <span>الكل</span>
                  <span class="count">(486)</span>
                </label>
                <label>
                  <input type="checkbox">
                  <span>إلكترونيات</span>
                  <span class="count">(124)</span>
                </label>
                <label>
                  <input type="checkbox">
                  <span>أزياء وموضة</span>
                  <span class="count">(98)</span>
                </label>
                <label>
                  <input type="checkbox">
                  <span>منزل ومطبخ</span>
                  <span class="count">(76)</span>
                </label>
                <label>
                  <input type="checkbox">
                  <span>رياضة ولياقة</span>
                  <span class="count">(54)</span>
                </label>
                <label>
                  <input type="checkbox">
                  <span>صحة وجمال</span>
                  <span class="count">(67)</span>
                </label>
              </div>
            </div>
            
            <!-- Price Range Filter -->
            <div class="filter-group">
              <h4 class="filter-title">السعر</h4>
              <div class="price-range">
                <input type="number" placeholder="من" class="form-control">
                <span>-</span>
                <input type="number" placeholder="إلى" class="form-control">
              </div>
              <button class="btn btn-outline btn-block">تطبيق</button>
            </div>
            
            <!-- Rating Filter -->
            <div class="filter-group">
              <h4 class="filter-title">التقييم</h4>
              <div class="filter-options">
                <label>
                  <input type="checkbox">
                  <div class="rating-stars small">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span>فأكثر</span>
                </label>
                <label>
                  <input type="checkbox">
                  <div class="rating-stars small">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                  </div>
                  <span>فأكثر</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Products Area -->
        <div class="products-area">
          <!-- Toolbar -->
          <div class="products-toolbar">
            <button class="btn btn-outline filters-toggle-mobile">
              <i class="fas fa-filter"></i>
              الفلاتر
            </button>
            
            <span class="products-count">عرض 1-12 من 486 منتج</span>
            
            <div class="toolbar-actions">
              <div class="view-toggle">
                <button class="active" aria-label="عرض شبكي">
                  <i class="fas fa-th"></i>
                </button>
                <button aria-label="عرض قائمة">
                  <i class="fas fa-list"></i>
                </button>
              </div>
              
              <select class="form-control">
                <option>الأحدث</option>
                <option>الأكثر مبيعاً</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
                <option>التقييم الأعلى</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="products-grid">
            <?php
            // Sample products data - replace with database query
            $products = [
              ['id' => 1, 'name' => 'سماعات بلوتوث لاسلكية عالية الجودة', 'category' => 'إلكترونيات', 'price' => 595, 'original_price' => 850, 'rating' => 4.5, 'reviews' => 128, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
              ['id' => 2, 'name' => 'ساعة ذكية متطورة مع شاشة AMOLED', 'category' => 'إكسسوارات', 'price' => 1299, 'original_price' => null, 'rating' => 5, 'reviews' => 96, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
              ['id' => 3, 'name' => 'حقيبة ظهر جلدية فاخرة للأعمال', 'category' => 'حقائب', 'price' => 520, 'original_price' => 650, 'rating' => 4, 'reviews' => 74, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'],
              ['id' => 4, 'name' => 'حذاء رياضي مريح للمشي والجري', 'category' => 'رياضة', 'price' => 380, 'original_price' => null, 'rating' => 4.5, 'reviews' => 89, 'badge' => null, 'image' => 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400'],
              ['id' => 5, 'name' => 'كتاب فن التسويق الرقمي', 'category' => 'كتب', 'price' => 80, 'original_price' => null, 'rating' => 5, 'reviews' => 52, 'badge' => null, 'image' => 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400'],
              ['id' => 6, 'name' => 'عطر فاخر للرجال', 'category' => 'عطور', 'price' => 450, 'original_price' => 600, 'rating' => 4.5, 'reviews' => 67, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
            ];
            
            foreach($products as $product):
              $badgeClass = '';
              $badgeText = '';
              if($product['badge'] == 'sale') { $badgeClass = 'sale'; $badgeText = 'خصم 30%'; }
              elseif($product['badge'] == 'new') { $badgeClass = 'new'; $badgeText = 'جديد'; }
              elseif($product['badge'] == 'hot') { $badgeClass = 'hot'; $badgeText = 'الأكثر مبيعاً'; }
            ?>
            <div class="product-card">
              <div class="product-image">
                <img src="<?php echo $product['image']; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                <?php if($product['badge']): ?>
                <span class="product-badge <?php echo $badgeClass; ?>"><?php echo $badgeText; ?></span>
                <?php endif; ?>
                <button class="wishlist-btn" aria-label="إضافة للمفضلة">
                  <i class="far fa-heart"></i>
                </button>
              </div>
              
              <div class="product-info">
                <div class="product-category"><?php echo htmlspecialchars($product['category']); ?></div>
                <h3 class="product-title">
                  <a href="product-detail.php?id=<?php echo $product['id']; ?>"><?php echo htmlspecialchars($product['name']); ?></a>
                </h3>
                
                <div class="product-rating">
                  <div class="rating-stars">
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
                  <span class="rating-count">(<?php echo $product['reviews']; ?>)</span>
                </div>
                
                <div class="product-price">
                  <?php if($product['original_price']): ?>
                  <span class="price-original"><?php echo number_format($product['original_price']); ?> ر.س</span>
                  <?php endif; ?>
                  <span class="price-current"><?php echo number_format($product['price']); ?> ر.س</span>
                </div>
                
                <div class="product-actions">
                  <button class="btn btn-primary btn-block" onclick="addToCart(<?php echo $product['id']; ?>)">
                    <i class="fas fa-shopping-cart"></i>
                    إضافة للسلة
                  </button>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <button class="pagination-btn" disabled>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="pagination-btn active">1</button>
            <button class="pagination-btn">2</button>
            <button class="pagination-btn">3</button>
            <span class="pagination-dots">...</span>
            <button class="pagination-btn">41</button>
            <button class="pagination-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

<?php include 'includes/footer.php'; ?>
