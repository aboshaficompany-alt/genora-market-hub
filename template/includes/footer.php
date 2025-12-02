  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- About Section -->
        <div class="footer-section">
          <h3>جينورا</h3>
          <p class="footer-description">
            منصة رقمية تمكينية تجمع أفضل المتاجر والمنتجات في مكان واحد، نؤمن بقوة التجارة الإلكترونية في تحسين حياة الناس.
          </p>
          <div class="footer-social">
            <a href="#" aria-label="فيسبوك"><i class="fab fa-facebook"></i></a>
            <a href="#" aria-label="تويتر"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="إنستغرام"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="لينكد إن"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4>روابط سريعة</h4>
          <ul class="footer-links">
            <li><a href="index.php">الرئيسية</a></li>
            <li><a href="categories.php">الأصناف</a></li>
            <li><a href="stores.php">المتاجر</a></li>
            <li><a href="terms.php">الشروط والأحكام</a></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div class="footer-section">
          <h4>خدمة العملاء</h4>
          <ul class="footer-links">
            <li><a href="#">الأسئلة الشائعة</a></li>
            <li><a href="#">سياسة الاسترجاع</a></li>
            <li><a href="#">الشحن والتوصيل</a></li>
            <li><a href="#">طرق الدفع</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4>تواصل معنا</h4>
          <ul class="footer-contact">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
            <li>
              <i class="fas fa-phone"></i>
              <span dir="ltr">+966 50 123 4567</span>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <span>info@geenora.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <?php echo date('Y'); ?> جينورا. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="assets/js/main.js"></script>
  <script src="assets/js/gallery.js"></script>
  <?php if(isset($additionalJS)) echo $additionalJS; ?>
</body>
</html>
