<?php
session_start();

// إذا كان المستخدم مسجل دخول مسبقاً، قم بإعادة توجيهه
if (isset($_SESSION['user_id'])) {
  header('Location: index.html');
  exit;
}

$error = '';
$success = '';

// معالجة التسجيل
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
  $name = trim($_POST['name']);
  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $phone = trim($_POST['phone']);
  $password = $_POST['password'];
  $confirm_password = $_POST['confirm_password'];
  
  // التحقق من صحة البيانات
  if (empty($name) || empty($email) || empty($password)) {
    $error = 'الرجاء إدخال جميع الحقول المطلوبة';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'البريد الإلكتروني غير صحيح';
  } elseif (strlen($password) < 6) {
    $error = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  } elseif ($password !== $confirm_password) {
    $error = 'كلمة المرور وتأكيد كلمة المرور غير متطابقين';
  } elseif (!empty($phone) && !preg_match('/^[0-9]{10}$/', $phone)) {
    $error = 'رقم الهاتف يجب أن يكون 10 أرقام';
  } else {
    // هنا يجب إضافة المستخدم إلى قاعدة البيانات
    // هذا مثال توضيحي فقط
    
    // في التطبيق الحقيقي، استخدم password_hash() لتشفير كلمة المرور
    // $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    // $user_id = createUser($name, $email, $phone, $hashed_password);
    
    // مثال توضيحي
    $_SESSION['user_id'] = rand(1000, 9999);
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    $success = 'تم إنشاء الحساب بنجاح! جاري تحويلك...';
    
    // إعادة توجيه بعد ثانيتين
    header('Refresh: 2; URL=index.html');
  }
}

$pageTitle = 'إنشاء حساب جديد';
$pageDescription = 'انضم إلينا وابدأ رحلتك في التسوق';
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
          <a href="login.php" class="btn btn-primary btn-sm">تسجيل الدخول</a>
        </div>
      </div>
    </div>
  </header>

  <!-- Register Section -->
  <section class="auth-section">
    <div class="container">
      <div class="auth-container">
        
        <!-- Register Card -->
        <div class="auth-card animate-fade-in">
          <div class="auth-header">
            <div class="auth-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <h1 class="auth-title">إنشاء حساب جديد</h1>
            <p class="auth-subtitle">انضم إلينا وابدأ رحلتك في التسوق</p>
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

          <form method="POST" class="auth-form" id="registerForm">
            <input type="hidden" name="register" value="1">
            
            <div class="form-group">
              <label for="name" class="form-label">
                <i class="fas fa-user"></i>
                الاسم الكامل
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-input" 
                placeholder="محمد أحمد"
                required
                value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>"
              >
            </div>

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
              <label for="phone" class="form-label">
                <i class="fas fa-phone"></i>
                رقم الهاتف (اختياري)
              </label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                class="form-input" 
                placeholder="05xxxxxxxx"
                pattern="[0-9]{10}"
                value="<?php echo isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : ''; ?>"
              >
              <small class="form-hint">أدخل 10 أرقام فقط</small>
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
                  minlength="6"
                >
                <button type="button" class="btn-toggle-password" onclick="togglePassword('password', 'toggleIcon1')">
                  <i class="fas fa-eye" id="toggleIcon1"></i>
                </button>
              </div>
              <small class="form-hint">يجب أن تكون 6 أحرف على الأقل</small>
            </div>

            <div class="form-group">
              <label for="confirm_password" class="form-label">
                <i class="fas fa-lock"></i>
                تأكيد كلمة المرور
              </label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  id="confirm_password" 
                  name="confirm_password" 
                  class="form-input" 
                  placeholder="••••••••"
                  required
                  minlength="6"
                >
                <button type="button" class="btn-toggle-password" onclick="togglePassword('confirm_password', 'toggleIcon2')">
                  <i class="fas fa-eye" id="toggleIcon2"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="terms" class="form-checkbox" required>
                <span>أوافق على <a href="terms.html" class="link-primary">الشروط والأحكام</a></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block">
              <i class="fas fa-user-plus"></i>
              إنشاء حساب
            </button>
          </form>

          <div class="auth-divider">
            <span>أو</span>
          </div>

          <div class="social-login">
            <button class="btn btn-social btn-google">
              <i class="fab fa-google"></i>
              التسجيل بواسطة Google
            </button>
            <button class="btn btn-social btn-facebook">
              <i class="fab fa-facebook"></i>
              التسجيل بواسطة Facebook
            </button>
          </div>

          <div class="auth-footer">
            <p>لديك حساب بالفعل؟ <a href="login.php" class="link-primary">تسجيل الدخول</a></p>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="auth-features animate-fade-in" style="animation-delay: 0.2s;">
          <h2 class="features-title">مزايا الانضمام لجينورا</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-gift"></i>
              </div>
              <h3>عروض حصرية</h3>
              <p>احصل على خصومات خاصة للأعضاء</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-history"></i>
              </div>
              <h3>تتبع الطلبات</h3>
              <p>راقب طلباتك بسهولة</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-heart"></i>
              </div>
              <h3>قائمة المفضلة</h3>
              <p>احفظ منتجاتك المفضلة</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-bolt"></i>
              </div>
              <h3>إتمام سريع</h3>
              <p>اختصر وقت الشراء</p>
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
    function togglePassword(inputId, iconId) {
      const passwordInput = document.getElementById(inputId);
      const toggleIcon = document.getElementById(iconId);
      
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
    document.getElementById('registerForm').addEventListener('submit', function(e) {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm_password').value;
      const terms = document.querySelector('input[name="terms"]').checked;
      
      if (password !== confirmPassword) {
        e.preventDefault();
        alert('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
        return false;
      }
      
      if (!terms) {
        e.preventDefault();
        alert('يجب الموافقة على الشروط والأحكام');
        return false;
      }
    });

    // Password strength indicator
    document.getElementById('password').addEventListener('input', function(e) {
      const password = e.target.value;
      const strength = calculatePasswordStrength(password);
      // يمكن إضافة مؤشر قوة كلمة المرور هنا
    });

    function calculatePasswordStrength(password) {
      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 10) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^a-zA-Z\d]/.test(password)) strength++;
      return strength;
    }
  </script>
</body>
</html>
