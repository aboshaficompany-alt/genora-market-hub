<?php
/**
 * Geenora Platform - Header Include
 * ملف الهيدر المشترك لجميع الصفحات
 * 
 * Variables that can be set before including:
 * - $pageTitle: عنوان الصفحة
 * - $pageDescription: وصف الصفحة
 * - $activePage: الصفحة النشطة (home, categories, stores, terms, wishlist, checkout, orders)
 * - $additionalCSS: أي CSS إضافي
 */

// Default values
$pageTitle = isset($pageTitle) ? $pageTitle . ' - جينورا' : 'جينورا - المتاجر المتعددة';
$pageDescription = isset($pageDescription) ? $pageDescription : 'منصة جينورا للتسوق - اكتشف مجموعة واسعة من المنتجات من متاجر متعددة في مكان واحد';
$activePage = isset($activePage) ? $activePage : '';
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($pageTitle); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($pageDescription); ?>">
  
  <!-- Google Fonts - Cairo -->
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Main CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
  <?php if(isset($additionalCSS)) echo $additionalCSS; ?>
</head>
<body>

  <!-- Enhanced Header -->
  <header class="header">
    <div class="container">
      <div class="header-container">
        <a href="index.php" class="logo">
          <i class="fas fa-store logo-icon"></i>
          <div class="logo-text">
            <span>جينورا</span>
            <span class="logo-subtitle">المتاجر المتعددة</span>
          </div>
        </a>

        <nav class="nav">
          <a href="index.php" class="nav-link <?php echo ($activePage == 'home') ? 'active' : ''; ?>">
            الرئيسية
          </a>
          <a href="categories.php" class="nav-link <?php echo ($activePage == 'categories') ? 'active' : ''; ?>">
            الأصناف
          </a>
          <a href="stores.php" class="nav-link <?php echo ($activePage == 'stores') ? 'active' : ''; ?>">
            المتاجر
          </a>
          <a href="terms.php" class="nav-link <?php echo ($activePage == 'terms') ? 'active' : ''; ?>">
            الشروط
          </a>
        </nav>

        <div class="header-actions">
          <a href="wishlist.php" class="header-action" title="قائمة المفضلة">
            <i class="far fa-heart"></i>
            <span class="badge-count"><?php echo isset($_SESSION['wishlist_count']) ? $_SESSION['wishlist_count'] : '0'; ?></span>
          </a>
          <a href="checkout.php" class="header-action" title="سلة التسوق">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge-count cart-count"><?php echo isset($_SESSION['cart_count']) ? $_SESSION['cart_count'] : '0'; ?></span>
          </a>
          <?php if(isset($_SESSION['user_id'])): ?>
            <a href="account.php" class="btn btn-primary btn-sm">حسابي</a>
          <?php else: ?>
            <a href="login.php" class="btn btn-primary btn-sm">تسجيل الدخول</a>
          <?php endif; ?>
        </div>

        <button class="mobile-menu-toggle" id="mobileMenuToggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Enhanced Mobile Menu -->
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-header">
      <div class="logo">جينورا</div>
      <button class="close-btn" id="mobileMenuClose">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <nav class="mobile-nav">
      <a href="index.php" class="mobile-nav-link <?php echo ($activePage == 'home') ? 'active' : ''; ?>">
        <i class="fas fa-home"></i>
        <span>الرئيسية</span>
      </a>
      <a href="categories.php" class="mobile-nav-link <?php echo ($activePage == 'categories') ? 'active' : ''; ?>">
        <i class="fas fa-th-large"></i>
        <span>الأصناف</span>
      </a>
      <a href="stores.php" class="mobile-nav-link <?php echo ($activePage == 'stores') ? 'active' : ''; ?>">
        <i class="fas fa-store"></i>
        <span>المتاجر</span>
      </a>
      <a href="wishlist.php" class="mobile-nav-link <?php echo ($activePage == 'wishlist') ? 'active' : ''; ?>">
        <i class="fas fa-heart"></i>
        <span>المفضلة</span>
      </a>
      <a href="checkout.php" class="mobile-nav-link <?php echo ($activePage == 'checkout') ? 'active' : ''; ?>">
        <i class="fas fa-shopping-cart"></i>
        <span>السلة</span>
      </a>
      <div class="nav-divider"></div>
      <a href="terms.php" class="mobile-nav-link <?php echo ($activePage == 'terms') ? 'active' : ''; ?>">
        <i class="fas fa-file-contract"></i>
        <span>الشروط والأحكام</span>
      </a>
    </nav>
    
    <?php if(isset($_SESSION['user_id']) && isset($_SESSION['is_vendor']) && $_SESSION['is_vendor']): ?>
    <!-- Vendor Dashboard Link (for logged-in vendors) -->
    <a href="vendor-dashboard.php" class="vendor-dashboard-link">
      <i class="fas fa-tachometer-alt"></i>
      <span>لوحة التاجر</span>
    </a>
    <?php endif; ?>
    
    <div class="mobile-user-section">
      <?php if(isset($_SESSION['user_id'])): ?>
      <!-- For logged-in users -->
      <div class="user-info">
        <div class="user-avatar"><?php echo isset($_SESSION['user_name']) ? mb_substr($_SESSION['user_name'], 0, 1) : 'م'; ?></div>
        <div class="user-details">
          <h4><?php echo isset($_SESSION['user_name']) ? htmlspecialchars($_SESSION['user_name']) : 'المستخدم'; ?></h4>
          <span>عميل مميز</span>
        </div>
      </div>
      <a href="logout.php" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span>تسجيل الخروج</span>
      </a>
      <?php else: ?>
      <!-- For logged-out users -->
      <div class="mobile-actions">
        <a href="login.php" class="btn btn-primary btn-block">تسجيل الدخول</a>
        <a href="register.php" class="btn btn-outline btn-block">إنشاء حساب</a>
      </div>
      <?php endif; ?>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
