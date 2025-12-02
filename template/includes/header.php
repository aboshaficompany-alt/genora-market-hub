<?php
/**
 * Geenora Platform - Header Include
 * ملف الهيدر المشترك لجميع الصفحات - مطابق للمنصة الحالية
 */

$pageTitle = isset($pageTitle) ? $pageTitle . ' - جينورا' : 'جينورا - المتاجر المتعددة';
$pageDescription = isset($pageDescription) ? $pageDescription : 'منصة جينورا للتسوق - اكتشف مجموعة واسعة من المنتجات من متاجر متعددة في مكان واحد';
$activePage = isset($activePage) ? $activePage : '';
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title><?php echo htmlspecialchars($pageTitle); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($pageDescription); ?>">
  <meta name="theme-color" content="#f97316">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  
  <!-- Google Fonts - Cairo -->
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Main CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
  <?php if(isset($additionalCSS)) echo $additionalCSS; ?>
</head>
<body>

  <!-- Desktop Header -->
  <header class="header desktop-header">
    <div class="container">
      <div class="header-inner">
        <!-- Logo -->
        <a href="index.php" class="logo">
          <i class="fas fa-store logo-icon"></i>
          <span class="logo-text">Geenora</span>
        </a>

        <!-- Desktop Navigation - Horizontal -->
        <nav class="desktop-nav">
          <a href="index.php" class="nav-link <?php echo ($activePage == 'home') ? 'active' : ''; ?>">
            <i class="fas fa-home"></i>
            الرئيسية
          </a>
          <a href="stores.php" class="nav-link <?php echo ($activePage == 'stores') ? 'active' : ''; ?>">
            <i class="fas fa-store"></i>
            المتاجر
          </a>
          <a href="categories.php" class="nav-link <?php echo ($activePage == 'categories') ? 'active' : ''; ?>">
            <i class="fas fa-shopping-bag"></i>
            المنتجات
          </a>
        </nav>

        <!-- Desktop Actions -->
        <div class="header-actions">
          <a href="wishlist.php" class="action-btn" title="قائمة المفضلة">
            <i class="far fa-heart"></i>
            <span class="badge"><?php echo isset($_SESSION['wishlist_count']) ? $_SESSION['wishlist_count'] : '0'; ?></span>
          </a>
          <a href="checkout.php" class="action-btn" title="سلة التسوق">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge primary"><?php echo isset($_SESSION['cart_count']) ? $_SESSION['cart_count'] : '0'; ?></span>
          </a>
          <?php if(isset($_SESSION['user_id'])): ?>
            <a href="orders.php" class="btn btn-ghost">طلباتي</a>
            <?php if(isset($_SESSION['is_vendor']) && $_SESSION['is_vendor']): ?>
              <a href="vendor-dashboard.php" class="btn btn-ghost">لوحة التاجر</a>
            <?php endif; ?>
            <a href="logout.php" class="btn btn-ghost btn-danger">
              <i class="fas fa-sign-out-alt"></i>
              تسجيل الخروج
            </a>
          <?php else: ?>
            <a href="login.php" class="btn btn-primary btn-rounded">
              <i class="fas fa-user"></i>
              تسجيل الدخول
            </a>
            <a href="register.php" class="btn btn-outline btn-rounded">تسجيل كتاجر</a>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Header -->
  <header class="header mobile-header">
    <div class="mobile-header-inner">
      <!-- Menu Button -->
      <button class="mobile-menu-btn" id="mobileMenuToggle">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Logo -->
      <a href="index.php" class="mobile-logo">
        <span>Geenora</span>
        <i class="fas fa-store"></i>
      </a>

      <!-- Cart & Wishlist -->
      <div class="mobile-actions">
        <a href="wishlist.php" class="action-btn">
          <i class="far fa-heart"></i>
          <?php if(isset($_SESSION['wishlist_count']) && $_SESSION['wishlist_count'] > 0): ?>
            <span class="badge danger"><?php echo $_SESSION['wishlist_count']; ?></span>
          <?php endif; ?>
        </a>
        <a href="checkout.php" class="action-btn">
          <i class="fas fa-shopping-cart"></i>
          <?php if(isset($_SESSION['cart_count']) && $_SESSION['cart_count'] > 0): ?>
            <span class="badge primary"><?php echo $_SESSION['cart_count']; ?></span>
          <?php endif; ?>
        </a>
      </div>
    </div>
  </header>

  <!-- Mobile Side Menu Overlay -->
  <div class="mobile-overlay" id="mobileOverlay"></div>

  <!-- Mobile Side Menu -->
  <div class="mobile-side-menu" id="mobileSideMenu">
    <!-- Menu Header -->
    <div class="side-menu-header">
      <div class="side-menu-logo">
        <i class="fas fa-store"></i>
        <span>Geenora</span>
      </div>
      <button class="close-menu-btn" id="closeMobileMenu">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Menu Navigation -->
    <nav class="side-menu-nav">
      <a href="index.php" class="side-nav-link <?php echo ($activePage == 'home') ? 'active' : ''; ?>">
        الرئيسية
      </a>
      <a href="stores.php" class="side-nav-link <?php echo ($activePage == 'stores') ? 'active' : ''; ?>">
        المتاجر
      </a>
      <a href="categories.php" class="side-nav-link <?php echo ($activePage == 'categories') ? 'active' : ''; ?>">
        المنتجات
      </a>
      <a href="orders.php" class="side-nav-link <?php echo ($activePage == 'orders') ? 'active' : ''; ?>">
        طلباتي
      </a>
    </nav>

    <!-- Menu Footer -->
    <div class="side-menu-footer">
      <?php if(isset($_SESSION['user_id'])): ?>
        <?php if(isset($_SESSION['is_vendor']) && $_SESSION['is_vendor']): ?>
          <a href="vendor-dashboard.php" class="btn btn-outline btn-block">
            <i class="fas fa-tachometer-alt"></i>
            لوحة التاجر
          </a>
        <?php endif; ?>
        <a href="logout.php" class="btn btn-danger btn-block">
          <i class="fas fa-sign-out-alt"></i>
          تسجيل الخروج
        </a>
      <?php else: ?>
        <a href="login.php" class="btn btn-primary btn-block">تسجيل الدخول</a>
        <a href="register.php" class="btn btn-outline btn-block">تسجيل كتاجر</a>
      <?php endif; ?>
    </div>
  </div>

  <!-- Main Content Wrapper -->
  <main class="main-content">
