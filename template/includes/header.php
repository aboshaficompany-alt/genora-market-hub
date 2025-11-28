<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo isset($pageTitle) ? $pageTitle . ' - جنورا' : 'جنورا - منصة التسوق الإلكتروني'; ?></title>
  <meta name="description" content="<?php echo isset($pageDescription) ? $pageDescription : 'منصة جنورا للتسوق الإلكتروني - أفضل المنتجات والمتاجر في المملكة العربية السعودية'; ?>">
  <link rel="stylesheet" href="<?php echo isset($cssPath) ? $cssPath : '../'; ?>assets/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <?php if(isset($additionalCSS)) echo $additionalCSS; ?>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>index.php" class="logo">جنورا</a>
        </div>
        <ul class="navbar-menu">
          <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>index.php" <?php echo (isset($activePage) && $activePage === 'home') ? 'class="active"' : ''; ?>>الرئيسية</a></li>
          <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>categories.php" <?php echo (isset($activePage) && $activePage === 'categories') ? 'class="active"' : ''; ?>>المنتجات</a></li>
          <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>stores.php" <?php echo (isset($activePage) && $activePage === 'stores') ? 'class="active"' : ''; ?>>المتاجر</a></li>
          <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>terms.php" <?php echo (isset($activePage) && $activePage === 'terms') ? 'class="active"' : ''; ?>>الشروط والأحكام</a></li>
        </ul>
        <div class="navbar-actions">
          <a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>wishlist.php" class="nav-icon">
            <span class="icon">♥</span>
            <span class="badge"><?php echo isset($_SESSION['wishlist_count']) ? $_SESSION['wishlist_count'] : '0'; ?></span>
          </a>
          <a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>checkout.php" class="nav-icon">
            <span class="icon">🛒</span>
            <span class="badge"><?php echo isset($_SESSION['cart_count']) ? $_SESSION['cart_count'] : '0'; ?></span>
          </a>
          <?php if(isset($_SESSION['user_id'])): ?>
            <a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>account.php" class="btn btn-primary">حسابي</a>
          <?php else: ?>
            <a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>login.php" class="btn btn-primary">تسجيل الدخول</a>
          <?php endif; ?>
        </div>
      </nav>
    </div>
  </header>
