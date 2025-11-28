<?php
session_start();

// تحقق من وجود بيانات الطلب
if (!isset($_SESSION['order_id'])) {
  header('Location: index.html');
  exit;
}

$order_id = $_SESSION['order_id'];
$order_number = strtoupper(substr(md5($order_id), 0, 8));
$order_date = date('Y-m-d H:i');
$order_total = $_SESSION['order_total'] ?? 0;
$shipping_info = $_SESSION['shipping_info'] ?? [];

// مسح بيانات الطلب من الجلسة
unset($_SESSION['order_id']);
unset($_SESSION['order_total']);
unset($_SESSION['shipping_info']);

$pageTitle = 'تم إتمام الطلب بنجاح';
$pageDescription = 'تم استلام طلبك بنجاح وسيتم معالجته قريباً';
$currentPage = 'order-complete';
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
          <a href="stores.html" class="nav-link">المتاجر</a>
          <a href="terms.html" class="nav-link">الشروط</a>
        </nav>

        <div class="header-actions">
          <a href="wishlist.html" class="header-action">
            <i class="far fa-heart"></i>
          </a>
          <a href="cart.html" class="header-action">
            <i class="fas fa-shopping-cart"></i>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Order Complete Section -->
  <section class="order-complete-section">
    <div class="container">
      <div class="order-complete-container">
        
        <!-- Success Icon -->
        <div class="success-icon-wrapper animate-fade-in">
          <div class="success-circle">
            <i class="fas fa-check"></i>
          </div>
        </div>

        <!-- Success Message -->
        <div class="success-message animate-fade-in" style="animation-delay: 0.2s;">
          <h1 class="success-title">تم إتمام طلبك بنجاح! 🎉</h1>
          <p class="success-description">
            شكراً لك على الطلب. سيتم معالجة طلبك في أقرب وقت ممكن
          </p>
        </div>

        <!-- Order Details Card -->
        <div class="order-details-card animate-fade-in" style="animation-delay: 0.4s;">
          <div class="order-details-header">
            <h2>تفاصيل الطلب</h2>
            <div class="order-number-badge">
              <i class="fas fa-hashtag"></i>
              <span><?php echo $order_number; ?></span>
            </div>
          </div>

          <div class="order-details-body">
            <div class="order-info-grid">
              <div class="order-info-item">
                <div class="info-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">تاريخ الطلب</span>
                  <span class="info-value"><?php echo $order_date; ?></span>
                </div>
              </div>

              <div class="order-info-item">
                <div class="info-icon">
                  <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">المبلغ الإجمالي</span>
                  <span class="info-value"><?php echo number_format($order_total, 2); ?> ريال</span>
                </div>
              </div>

              <div class="order-info-item">
                <div class="info-icon">
                  <i class="fas fa-truck"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">حالة الطلب</span>
                  <span class="info-value status-pending">قيد المعالجة</span>
                </div>
              </div>

              <div class="order-info-item">
                <div class="info-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="info-content">
                  <span class="info-label">الوقت المتوقع للتوصيل</span>
                  <span class="info-value">3-5 أيام عمل</span>
                </div>
              </div>
            </div>

            <?php if (!empty($shipping_info)): ?>
            <div class="shipping-info-section">
              <h3 class="section-title">
                <i class="fas fa-map-marker-alt"></i>
                معلومات الشحن
              </h3>
              <div class="shipping-details">
                <p><strong>الاسم:</strong> <?php echo htmlspecialchars($shipping_info['name'] ?? ''); ?></p>
                <p><strong>الهاتف:</strong> <?php echo htmlspecialchars($shipping_info['phone'] ?? ''); ?></p>
                <p><strong>البريد:</strong> <?php echo htmlspecialchars($shipping_info['email'] ?? ''); ?></p>
                <p><strong>العنوان:</strong> <?php echo htmlspecialchars($shipping_info['address'] ?? ''); ?></p>
                <p><strong>المدينة:</strong> <?php echo htmlspecialchars($shipping_info['city'] ?? ''); ?></p>
              </div>
            </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Tracking Section -->
        <div class="tracking-section animate-fade-in" style="animation-delay: 0.6s;">
          <div class="tracking-card">
            <div class="tracking-header">
              <i class="fas fa-route"></i>
              <h3>تتبع طلبك</h3>
            </div>
            <p class="tracking-description">
              يمكنك متابعة حالة طلبك من خلال رقم الطلب أعلاه
            </p>
            <div class="tracking-code">
              <input type="text" readonly value="<?php echo $order_number; ?>" id="trackingCode">
              <button class="btn-copy" onclick="copyTrackingCode()">
                <i class="fas fa-copy"></i>
                نسخ
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons animate-fade-in" style="animation-delay: 0.8s;">
          <a href="orders.html" class="btn btn-primary btn-lg">
            <i class="fas fa-list"></i>
            عرض طلباتي
          </a>
          <a href="index.html" class="btn btn-secondary btn-lg">
            <i class="fas fa-shopping-bag"></i>
            متابعة التسوق
          </a>
        </div>

        <!-- Support Section -->
        <div class="support-section animate-fade-in" style="animation-delay: 1s;">
          <div class="support-card">
            <i class="fas fa-headset"></i>
            <h3>هل تحتاج إلى مساعدة؟</h3>
            <p>فريق الدعم متواجد لمساعدتك في أي استفسار</p>
            <div class="support-contacts">
              <a href="tel:920000000" class="support-link">
                <i class="fas fa-phone"></i>
                920000000
              </a>
              <a href="mailto:support@geenora.com" class="support-link">
                <i class="fas fa-envelope"></i>
                support@geenora.com
              </a>
            </div>
          </div>
        </div>

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
  <script>
    function copyTrackingCode() {
      const input = document.getElementById('trackingCode');
      input.select();
      document.execCommand('copy');
      
      // Show feedback
      const btn = event.currentTarget;
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
      btn.classList.add('copied');
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
      }, 2000);
    }
  </script>
</body>
</html>
