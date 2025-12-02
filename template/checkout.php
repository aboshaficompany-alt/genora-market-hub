<?php
session_start();
$pageTitle = 'إتمام الطلب';
$pageDescription = 'أكمل طلبك بسهولة وأمان في منصة جينورا';
$activePage = 'checkout';
include 'includes/header.php';
?>

  <!-- Main Content -->
  <main class="checkout-page">
    <div class="container">
      <div class="checkout-container">
        <!-- Checkout Form -->
        <div class="checkout-form">
          <!-- Shipping Information -->
          <div class="form-section">
            <div class="section-header">
              <span class="section-number">1</span>
              <h3>معلومات الشحن</h3>
            </div>
            
            <form id="checkoutForm" method="POST" action="process-order.php">
              <div class="form-row">
                <div class="form-group">
                  <label for="fullName">الاسم الكامل *</label>
                  <input type="text" id="fullName" name="full_name" class="form-control" required>
                </div>
                
                <div class="form-group">
                  <label for="phone">رقم الجوال *</label>
                  <input type="tel" id="phone" name="phone" class="form-control" dir="ltr" required>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="email">البريد الإلكتروني *</label>
                  <input type="email" id="email" name="email" class="form-control" required>
                </div>
                
                <div class="form-group">
                  <label for="city">المدينة *</label>
                  <select id="city" name="city" class="form-control" required>
                    <option value="">اختر المدينة</option>
                    <option value="riyadh">الرياض</option>
                    <option value="jeddah">جدة</option>
                    <option value="dammam">الدمام</option>
                    <option value="mecca">مكة المكرمة</option>
                    <option value="medina">المدينة المنورة</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row full-width">
                <div class="form-group">
                  <label for="address">العنوان التفصيلي *</label>
                  <textarea id="address" name="address" class="form-control" rows="3" required></textarea>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="postalCode">الرمز البريدي</label>
                  <input type="text" id="postalCode" name="postal_code" class="form-control">
                </div>
                
                <div class="form-group">
                  <label for="district">الحي</label>
                  <input type="text" id="district" name="district" class="form-control">
                </div>
              </div>
            </form>
          </div>

          <!-- Payment Method -->
          <div class="form-section">
            <div class="section-header">
              <span class="section-number">2</span>
              <h3>طريقة الدفع</h3>
            </div>
            
            <div class="payment-methods">
              <label class="payment-method active">
                <input type="radio" name="payment" value="cod" checked>
                <div class="payment-icon">
                  <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="payment-info">
                  <div class="payment-title">الدفع عند الاستلام</div>
                  <div class="payment-description">ادفع نقداً عند استلام الطلب</div>
                </div>
              </label>
              
              <label class="payment-method">
                <input type="radio" name="payment" value="card">
                <div class="payment-icon">
                  <i class="fas fa-credit-card"></i>
                </div>
                <div class="payment-info">
                  <div class="payment-title">بطاقة ائتمان</div>
                  <div class="payment-description">فيزا، ماستركارد، أمريكان اكسبريس</div>
                </div>
              </label>
              
              <label class="payment-method">
                <input type="radio" name="payment" value="mada">
                <div class="payment-icon">
                  <i class="fas fa-university"></i>
                </div>
                <div class="payment-info">
                  <div class="payment-title">مدى</div>
                  <div class="payment-description">الدفع عبر بطاقة مدى</div>
                </div>
              </label>
              
              <label class="payment-method">
                <input type="radio" name="payment" value="applepay">
                <div class="payment-icon">
                  <i class="fab fa-apple-pay"></i>
                </div>
                <div class="payment-info">
                  <div class="payment-title">Apple Pay</div>
                  <div class="payment-description">الدفع السريع عبر آبل باي</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="form-section">
            <div class="section-header">
              <span class="section-number">3</span>
              <h3>كود الخصم</h3>
            </div>
            
            <div class="promo-code">
              <input type="text" class="form-control" placeholder="أدخل كود الخصم" id="promoCode">
              <button class="btn btn-primary" onclick="applyPromoCode()">تطبيق</button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-card">
            <h3>ملخص الطلب</h3>
            
            <div class="summary-items">
              <div class="summary-item">
                <div class="item-image">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" alt="سماعات">
                </div>
                <div class="item-details">
                  <div class="item-name">سماعات بلوتوث لاسلكية</div>
                  <div class="item-quantity">الكمية: 1</div>
                </div>
                <div class="item-price">595 ر.س</div>
              </div>
              
              <div class="summary-item">
                <div class="item-image">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" alt="ساعة">
                </div>
                <div class="item-details">
                  <div class="item-name">ساعة ذكية متطورة</div>
                  <div class="item-quantity">الكمية: 1</div>
                </div>
                <div class="item-price">1,299 ر.س</div>
              </div>
              
              <div class="summary-item">
                <div class="item-image">
                  <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100" alt="حقيبة">
                </div>
                <div class="item-details">
                  <div class="item-name">حقيبة ظهر جلدية</div>
                  <div class="item-quantity">الكمية: 1</div>
                </div>
                <div class="item-price">520 ر.س</div>
              </div>
            </div>
            
            <div class="summary-totals">
              <div class="total-row subtotal">
                <span class="total-label">المجموع الفرعي:</span>
                <span class="total-value">2,414 ر.س</span>
              </div>
              
              <div class="total-row shipping">
                <span class="total-label">الشحن:</span>
                <span class="total-value">مجاني</span>
              </div>
              
              <div class="total-row discount">
                <span class="total-label">الخصم:</span>
                <span class="total-value">- 0 ر.س</span>
              </div>
              
              <div class="total-row total">
                <span class="total-label">الإجمالي:</span>
                <span class="total-value">2,414 ر.س</span>
              </div>
            </div>
            
            <button class="btn btn-primary btn-place-order" onclick="placeOrder()">
              <i class="fas fa-lock"></i>
              إتمام الطلب بأمان
            </button>
            
            <div class="security-note">
              <i class="fas fa-shield-alt"></i>
              معلوماتك محمية بتقنية التشفير SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

<script>
function applyPromoCode() {
  const code = document.getElementById('promoCode').value;
  if(code) {
    alert('جاري التحقق من كود الخصم: ' + code);
  }
}

function placeOrder() {
  document.getElementById('checkoutForm').submit();
}
</script>

<?php include 'includes/footer.php'; ?>
