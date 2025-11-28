  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">جنورا</h3>
          <p class="footer-text">منصتك المثالية للتسوق الإلكتروني في المملكة العربية السعودية</p>
          <div class="footer-social">
            <a href="#" aria-label="فيسبوك">📘</a>
            <a href="#" aria-label="تويتر">🐦</a>
            <a href="#" aria-label="إنستغرام">📷</a>
          </div>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">روابط سريعة</h4>
          <ul class="footer-links">
            <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>index.php">الرئيسية</a></li>
            <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>categories.php">المنتجات</a></li>
            <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>stores.php">المتاجر</a></li>
            <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>terms.php">الشروط والأحكام</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">خدمة العملاء</h4>
          <ul class="footer-links">
            <li><a href="#">مركز المساعدة</a></li>
            <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>track-order.php">تتبع الطلب</a></li>
            <li><a href="#">الإرجاع والاسترداد</a></li>
            <li><a href="<?php echo isset($cssPath) ? $cssPath : ''; ?>contact.php">اتصل بنا</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">تواصل معنا</h4>
          <ul class="footer-contact">
            <li>📧 support@geenora.com</li>
            <li>📞 920000000</li>
            <li>📍 الرياض، السعودية</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <?php echo date('Y'); ?> جنورا. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>

  <script src="<?php echo isset($cssPath) ? $cssPath : ''; ?>assets/js/main.js"></script>
  <?php if(isset($additionalJS)) echo $additionalJS; ?>
</body>
</html>
