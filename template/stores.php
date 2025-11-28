<?php
session_start();

// Page Configuration
$pageTitle = 'المتاجر';
$pageDescription = 'تصفح جميع المتاجر المعتمدة على منصة جنورا واختر من بين أفضل البائعين';
$activePage = 'stores';

// Include Header
include 'includes/header.php';

// Database connection example (uncomment and configure for production)
// require_once 'config/database.php';
// $stores = getAllStores(); // Fetch stores from database
?>

  <!-- Stores Page -->
  <main class="stores-page">
    <!-- Page Hero -->
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">تصفح المتاجر</h1>
        <p class="page-subtitle">اكتشف أفضل المتاجر والبائعين الموثوقين على منصتنا</p>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="stores-filters">
      <div class="container">
        <div class="filters-wrapper card">
          <div class="filters-header">
            <h3>تصفية النتائج</h3>
            <button class="btn-reset" onclick="resetFilters()">إعادة تعيين</button>
          </div>
          
          <div class="filters-grid">
            <!-- Search -->
            <div class="filter-group">
              <label class="filter-label">البحث عن متجر</label>
              <input type="text" class="filter-input" id="searchStore" placeholder="اسم المتجر..." onkeyup="filterStores()">
            </div>

            <!-- Category Filter -->
            <div class="filter-group">
              <label class="filter-label">التصنيف</label>
              <select class="filter-select" id="categoryFilter" onchange="filterStores()">
                <option value="">جميع التصنيفات</option>
                <option value="electronics">إلكترونيات</option>
                <option value="fashion">أزياء وموضة</option>
                <option value="home">منزل ومفروشات</option>
                <option value="sports">رياضة ولياقة</option>
                <option value="beauty">جمال وعناية</option>
                <option value="books">كتب وقرطاسية</option>
                <option value="food">أطعمة ومشروبات</option>
                <option value="toys">ألعاب وأطفال</option>
              </select>
            </div>

            <!-- Rating Filter -->
            <div class="filter-group">
              <label class="filter-label">التقييم</label>
              <select class="filter-select" id="ratingFilter" onchange="filterStores()">
                <option value="">جميع التقييمات</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐ وأعلى</option>
                <option value="3">⭐⭐⭐ وأعلى</option>
              </select>
            </div>

            <!-- City Filter -->
            <div class="filter-group">
              <label class="filter-label">المدينة</label>
              <select class="filter-select" id="cityFilter" onchange="filterStores()">
                <option value="">جميع المدن</option>
                <option value="riyadh">الرياض</option>
                <option value="jeddah">جدة</option>
                <option value="dammam">الدمام</option>
                <option value="makkah">مكة المكرمة</option>
                <option value="madinah">المدينة المنورة</option>
              </select>
            </div>

            <!-- Sort -->
            <div class="filter-group">
              <label class="filter-label">ترتيب حسب</label>
              <select class="filter-select" id="sortFilter" onchange="sortStores()">
                <option value="featured">الأكثر شهرة</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="products">الأكثر منتجات</option>
                <option value="newest">الأحدث</option>
              </select>
            </div>

            <!-- Verified Only -->
            <div class="filter-group filter-checkbox">
              <label class="checkbox-label">
                <input type="checkbox" id="verifiedFilter" onchange="filterStores()">
                <span>متاجر موثقة فقط ✓</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stores Grid -->
    <section class="stores-section">
      <div class="container">
        <div class="stores-header">
          <h2 class="section-title">جميع المتاجر</h2>
          <p class="stores-count" id="storesCount">عرض <strong>12</strong> متجر</p>
        </div>

        <div class="stores-grid" id="storesGrid">
          <?php
          // In production, replace this with database query results
          // Example: foreach($stores as $store):
          $sampleStores = [
            ['name' => 'متجر التقنية الحديثة', 'category' => 'electronics', 'rating' => '5', 'city' => 'riyadh', 'verified' => true, 'products' => '250+', 'customers' => '1.2k'],
            ['name' => 'أزياء العصر', 'category' => 'fashion', 'rating' => '4.8', 'city' => 'jeddah', 'verified' => true, 'products' => '180+', 'customers' => '850'],
            ['name' => 'ديكور المنزل', 'category' => 'home', 'rating' => '4.6', 'city' => 'dammam', 'verified' => false, 'products' => '320+', 'customers' => '650'],
          ];

          foreach($sampleStores as $store):
          ?>
          <!-- Store Card -->
          <article class="store-card" data-category="<?php echo $store['category']; ?>" data-rating="<?php echo $store['rating']; ?>" data-city="<?php echo $store['city']; ?>" data-verified="<?php echo $store['verified'] ? 'true' : 'false'; ?>">
            <?php if($store['verified']): ?>
            <div class="store-badge verified">✓ موثق</div>
            <?php endif; ?>
            <div class="store-logo">
              <img src="https://via.placeholder.com/100" alt="<?php echo htmlspecialchars($store['name']); ?>">
            </div>
            <h3 class="store-name"><?php echo htmlspecialchars($store['name']); ?></h3>
            <p class="store-category"><?php echo getCategoryName($store['category']); ?></p>
            <div class="store-rating">
              <span class="stars"><?php echo str_repeat('⭐', floor($store['rating'])); ?></span>
              <span class="rating-value">(<?php echo $store['rating']; ?>)</span>
            </div>
            <p class="store-description">وصف المتجر هنا...</p>
            <div class="store-stats">
              <div class="stat">
                <span class="stat-value"><?php echo $store['products']; ?></span>
                <span class="stat-label">منتج</span>
              </div>
              <div class="stat">
                <span class="stat-value"><?php echo $store['customers']; ?></span>
                <span class="stat-label">عميل</span>
              </div>
              <div class="stat">
                <span class="stat-value"><?php echo getCityName($store['city']); ?></span>
                <span class="stat-label">الموقع</span>
              </div>
            </div>
            <a href="store-detail.php?id=<?php echo $store['id'] ?? '#'; ?>" class="btn btn-primary btn-block">زيارة المتجر</a>
          </article>
          <?php endforeach; ?>
        </div>

        <!-- Load More -->
        <div class="load-more">
          <button class="btn btn-secondary btn-lg">تحميل المزيد من المتاجر</button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">هل أنت بائع؟</h2>
          <p class="cta-text">انضم إلى منصة جنورا وابدأ في بيع منتجاتك لآلاف العملاء</p>
          <a href="vendor-register.php" class="btn btn-gold btn-lg">سجل متجرك الآن</a>
        </div>
      </div>
    </section>
  </main>

<?php
// Helper functions (move to separate file in production)
function getCategoryName($category) {
  $categories = [
    'electronics' => 'إلكترونيات',
    'fashion' => 'أزياء وموضة',
    'home' => 'منزل ومفروشات',
    'sports' => 'رياضة ولياقة',
    'beauty' => 'جمال وعناية',
    'books' => 'كتب وقرطاسية',
    'food' => 'أطعمة ومشروبات',
    'toys' => 'ألعاب وأطفال',
  ];
  return $categories[$category] ?? $category;
}

function getCityName($city) {
  $cities = [
    'riyadh' => 'الرياض',
    'jeddah' => 'جدة',
    'dammam' => 'الدمام',
    'makkah' => 'مكة',
    'madinah' => 'المدينة',
  ];
  return $cities[$city] ?? $city;
}

// Include Footer
$additionalJS = '
<script>
  // Filter and Sort Functions
  function filterStores() {
    const searchTerm = document.getElementById("searchStore").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const rating = parseFloat(document.getElementById("ratingFilter").value);
    const city = document.getElementById("cityFilter").value;
    const verifiedOnly = document.getElementById("verifiedFilter").checked;
    
    const stores = document.querySelectorAll(".store-card");
    let visibleCount = 0;
    
    stores.forEach(store => {
      const storeName = store.querySelector(".store-name").textContent.toLowerCase();
      const storeCategory = store.dataset.category;
      const storeRating = parseFloat(store.dataset.rating);
      const storeCity = store.dataset.city;
      const storeVerified = store.dataset.verified === "true";
      
      const matchesSearch = storeName.includes(searchTerm);
      const matchesCategory = !category || storeCategory === category;
      const matchesRating = !rating || storeRating >= rating;
      const matchesCity = !city || storeCity === city;
      const matchesVerified = !verifiedOnly || storeVerified;
      
      if (matchesSearch && matchesCategory && matchesRating && matchesCity && matchesVerified) {
        store.style.display = "block";
        visibleCount++;
      } else {
        store.style.display = "none";
      }
    });
    
    document.getElementById("storesCount").innerHTML = `عرض <strong>${visibleCount}</strong> متجر`;
  }
  
  function sortStores() {
    const sortValue = document.getElementById("sortFilter").value;
    const grid = document.getElementById("storesGrid");
    const stores = Array.from(grid.querySelectorAll(".store-card"));
    
    stores.sort((a, b) => {
      switch(sortValue) {
        case "rating":
          return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        case "products":
          const aProducts = parseInt(a.querySelector(".stat-value").textContent);
          const bProducts = parseInt(b.querySelector(".stat-value").textContent);
          return bProducts - aProducts;
        case "newest":
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });
    
    stores.forEach(store => grid.appendChild(store));
  }
  
  function resetFilters() {
    document.getElementById("searchStore").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("ratingFilter").value = "";
    document.getElementById("cityFilter").value = "";
    document.getElementById("sortFilter").value = "featured";
    document.getElementById("verifiedFilter").checked = false;
    filterStores();
  }
</script>
';

include 'includes/footer.php';
?>
