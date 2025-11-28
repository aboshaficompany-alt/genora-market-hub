<?php
session_start();

// إذا كان المستخدم مسجل دخول مسبقاً، قم بإعادة توجيهه
if (isset($_SESSION['user_id'])) {
  header('Location: index.html');
  exit;
}

$error = '';
$success = '';

// معالجة تسجيل الدخول
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $password = $_POST['password'];
  
  // التحقق من صحة البيانات
  if (empty($email) || empty($password)) {
    $error = 'الرجاء إدخال البريد الإلكتروني وكلمة المرور';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'البريد الإلكتروني غير صحيح';
  } else {
    // هنا يجب الاتصال بقاعدة البيانات للتحقق من بيانات المستخدم
    // هذا مثال توضيحي فقط
    
    // في التطبيق الحقيقي، استخدم password_verify() مع كلمة المرور المشفرة
    // $user = getUserByEmail($email);
    // if ($user && password_verify($password, $user['password'])) {
    
    // مثال توضيحي - استبدل بالكود الحقيقي
    if ($email === 'test@example.com' && $password === 'password') {
      $_SESSION['user_id'] = 1;
      $_SESSION['user_name'] = 'مستخدم تجريبي';
      $_SESSION['user_email'] = $email;
      
      header('Location: index.html');
      exit;
    } else {
      $error = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  }
}

$pageTitle = 'تسجيل الدخول';
$pageDescription = 'سجل دخولك للوصول إلى حسابك';
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
          <a href="register.php" class="btn btn-primary btn-sm">إنشاء حساب</a>
        </div>
      </div>
    </div>
  </header>

  <!-- Login Section -->
  <section class="auth-section">
    <div class="container">
      <div class="auth-container">
        
        <!-- Login Card -->
        <div class="auth-card animate-fade-in">
          <div class="auth-header">
            <div class="auth-icon">
              <i class="fas fa-user-circle"></i>
            </div>
            <h1 class="auth-title">تسجيل الدخول</h1>
            <p class="auth-subtitle">مرحباً بعودتك! سجل دخولك للمتابعة</p>
          </div>

          <?php if ($error): ?>
          <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <span><?php echo htmlspecialchars($error); ?></span>
          </div>
          <?php endif; ?>

          <?php if ($success): ?>
          <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <span><?php echo htmlspecialchars($success); ?></span>
          </div>
          <?php endif; ?>

          <form method="POST" class="auth-form" id="loginForm">
            <input type="hidden" name="login" value="1">
            
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="fas fa-envelope"></i>
                البريد الإلكتروني
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                placeholder="example@email.com"
                required
                value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
              >
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="fas fa-lock"></i>
                كلمة المرور
              </label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="form-input" 
                  placeholder="••••••••"
                  required
                >
                <button type="button" class="btn-toggle-password" onclick="togglePassword()">
                  <i class="fas fa-eye" id="toggleIcon"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" name="remember" class="form-checkbox">
                <span>تذكرني</span>
              </label>
              <a href="#" class="link-primary">نسيت كلمة المرور؟</a>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block">
              <i class="fas fa-sign-in-alt"></i>
              تسجيل الدخول
            </button>
          </form>

          <div class="auth-divider">
            <span>أو</span>
          </div>

          <div class="social-login">
            <button class="btn btn-social btn-google">
              <i class="fab fa-google"></i>
              تسجيل الدخول بواسطة Google
            </button>
            <button class="btn btn-social btn-facebook">
              <i class="fab fa-facebook"></i>
              تسجيل الدخول بواسطة Facebook
            </button>
          </div>

          <div class="auth-footer">
            <p>ليس لديك حساب؟ <a href="register.php" class="link-primary">إنشاء حساب جديد</a></p>
          </div>
        </div>

        <!-- Features Section -->
        <div class="auth-features animate-fade-in" style="animation-delay: 0.2s;">
          <h2 class="features-title">لماذا جينورا؟</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h3>تسوق آمن</h3>
              <p>بيانات محمية وطرق دفع آمنة</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-truck"></i>
              </div>
              <h3>شحن سريع</h3>
              <p>توصيل إلى جميع المدن</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h3>دعم 24/7</h3>
              <p>فريق دعم متواجد دائماً</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-tags"></i>
              </div>
              <h3>عروض حصرية</h3>
              <p>خصومات وعروض مميزة</p>
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
    function togglePassword() {
      const passwordInput = document.getElementById('password');
      const toggleIcon = document.getElementById('toggleIcon');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
      }
    }

    // Form validation
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        e.preventDefault();
        alert('الرجاء إدخال جميع الحقول المطلوبة');
        return false;
      }
      
      if (password.length < 6) {
        e.preventDefault();
        alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return false;
      }
    });
  </script>
</body>
</html>
