<?php
session_start();
$pageTitle = 'الشروط والأحكام';
$pageDescription = 'اطلع على الشروط والأحكام الخاصة باستخدام منصة جينورا للتسوق الإلكتروني';
$activePage = 'terms';
include 'includes/header.php';
?>

  <!-- Terms Content -->
  <main class="terms-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">الشروط والأحكام</h1>
        <p class="page-subtitle">يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة جينورا</p>
        <p class="last-updated">آخر تحديث: <?php echo date('d F Y'); ?></p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <div class="terms-wrapper">
          <!-- Table of Contents -->
          <aside class="terms-sidebar">
            <div class="terms-toc card">
              <h3>المحتويات</h3>
              <ul>
                <li><a href="#introduction">المقدمة</a></li>
                <li><a href="#definitions">التعريفات</a></li>
                <li><a href="#account">حساب المستخدم</a></li>
                <li><a href="#orders">الطلبات والمدفوعات</a></li>
                <li><a href="#shipping">الشحن والتوصيل</a></li>
                <li><a href="#returns">الإرجاع والاسترداد</a></li>
                <li><a href="#vendors">شروط البائعين</a></li>
                <li><a href="#intellectual">الملكية الفكرية</a></li>
                <li><a href="#privacy">الخصوصية والبيانات</a></li>
                <li><a href="#liability">المسؤولية</a></li>
                <li><a href="#disputes">حل النزاعات</a></li>
                <li><a href="#changes">التعديلات</a></li>
                <li><a href="#contact">التواصل معنا</a></li>
              </ul>
            </div>
          </aside>

          <!-- Main Content -->
          <div class="terms-main">
            <!-- Introduction -->
            <article id="introduction" class="terms-section card">
              <h2 class="section-title">1. المقدمة</h2>
              <div class="section-content">
                <p>مرحباً بكم في منصة جينورا للتسوق الإلكتروني. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.</p>
                <p>تقدم جينورا سوقاً إلكترونياً يجمع البائعين والمشترين في بيئة آمنة وموثوقة، مع الالتزام بتوفير أفضل تجربة تسوق للعملاء.</p>
              </div>
            </article>

            <!-- Definitions -->
            <article id="definitions" class="terms-section card">
              <h2 class="section-title">2. التعريفات</h2>
              <div class="section-content">
                <ul class="definitions-list">
                  <li><strong>"المنصة":</strong> يقصد بها موقع جينورا الإلكتروني وتطبيقات الهاتف المحمول المرتبطة به.</li>
                  <li><strong>"المستخدم":</strong> أي شخص يستخدم المنصة سواء كان مشترياً أو بائعاً أو زائراً.</li>
                  <li><strong>"البائع":</strong> أي فرد أو شركة مسجلة على المنصة لبيع المنتجات أو الخدمات.</li>
                  <li><strong>"المشتري":</strong> أي مستخدم يقوم بشراء منتجات أو خدمات من خلال المنصة.</li>
                </ul>
              </div>
            </article>

            <!-- User Account -->
            <article id="account" class="terms-section card">
              <h2 class="section-title">3. حساب المستخدم</h2>
              <div class="section-content">
                <h3>3.1 التسجيل</h3>
                <p>يجب على المستخدمين إنشاء حساب لإتمام عمليات الشراء. يجب تقديم معلومات دقيقة وكاملة عند التسجيل.</p>
                
                <h3>3.2 أمان الحساب</h3>
                <p>أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.</p>
                
                <h3>3.3 شروط الأهلية</h3>
                <ul>
                  <li>يجب أن يكون عمرك 18 عاماً على الأقل لإنشاء حساب</li>
                  <li>يجب تقديم معلومات صحيحة ودقيقة</li>
                  <li>لا يجوز استخدام حساب شخص آخر دون إذن</li>
                  <li>يحق لنا إيقاف أو إلغاء أي حساب يخالف الشروط</li>
                </ul>
              </div>
            </article>

            <!-- Orders and Payments -->
            <article id="orders" class="terms-section card">
              <h2 class="section-title">4. الطلبات والمدفوعات</h2>
              <div class="section-content">
                <h3>4.1 تقديم الطلبات</h3>
                <p>عند تقديم طلب، فإنك تقدم عرضاً لشراء المنتج. جميع الطلبات تخضع للقبول والتوافر.</p>
                
                <h3>4.2 الأسعار</h3>
                <ul>
                  <li>جميع الأسعار معروضة بالريال السعودي</li>
                  <li>نحتفظ بالحق في تعديل الأسعار في أي وقت</li>
                  <li>قد تطبق رسوم شحن إضافية حسب الموقع</li>
                  <li>الأسعار شاملة لضريبة القيمة المضافة حيثما ينطبق</li>
                </ul>

                <h3>4.3 طرق الدفع</h3>
                <p>نقبل الطرق التالية للدفع:</p>
                <ul>
                  <li>البطاقات الائتمانية (فيزا، ماستركارد)</li>
                  <li>الدفع عند الاستلام (حسب التوافر)</li>
                  <li>التحويل البنكي</li>
                  <li>محافظ إلكترونية معتمدة</li>
                </ul>
              </div>
            </article>

            <!-- Shipping and Delivery -->
            <article id="shipping" class="terms-section card">
              <h2 class="section-title">5. الشحن والتوصيل</h2>
              <div class="section-content">
                <h3>5.1 مناطق التوصيل</h3>
                <p>نقدم خدمة التوصيل لجميع مناطق المملكة العربية السعودية. قد تختلف تكلفة ومدة التوصيل حسب الموقع.</p>
                
                <h3>5.2 مدة التوصيل</h3>
                <ul>
                  <li>الرياض وجدة: 2-3 أيام عمل</li>
                  <li>المدن الرئيسية الأخرى: 3-5 أيام عمل</li>
                  <li>المناطق النائية: 5-7 أيام عمل</li>
                </ul>
              </div>
            </article>

            <!-- Returns and Refunds -->
            <article id="returns" class="terms-section card">
              <h2 class="section-title">6. الإرجاع والاسترداد</h2>
              <div class="section-content">
                <h3>6.1 سياسة الإرجاع</h3>
                <p>يمكنك إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون المنتج:</p>
                <ul>
                  <li>في حالته الأصلية وغير مستخدم</li>
                  <li>في العبوة الأصلية مع جميع الملحقات</li>
                  <li>مع فاتورة الشراء الأصلية</li>
                </ul>

                <h3>6.2 المنتجات غير القابلة للإرجاع</h3>
                <ul>
                  <li>المنتجات الغذائية والمشروبات</li>
                  <li>منتجات العناية الشخصية والتجميل المفتوحة</li>
                  <li>المنتجات المخصصة حسب الطلب</li>
                  <li>البطاقات الرقمية والاشتراكات</li>
                </ul>
              </div>
            </article>

            <!-- Vendor Terms -->
            <article id="vendors" class="terms-section card">
              <h2 class="section-title">7. شروط البائعين</h2>
              <div class="section-content">
                <h3>7.1 التسجيل كبائع</h3>
                <p>يجب على البائعين تقديم معلومات تجارية صحيحة ومستندات رسمية (سجل تجاري، هوية وطنية).</p>
                
                <h3>7.2 مسؤوليات البائع</h3>
                <ul>
                  <li>تقديم منتجات أصلية وعالية الجودة</li>
                  <li>وصف دقيق للمنتجات مع صور واضحة</li>
                  <li>معالجة الطلبات في الوقت المحدد</li>
                  <li>الالتزام بسياسات الشحن والإرجاع</li>
                </ul>
              </div>
            </article>

            <!-- Intellectual Property -->
            <article id="intellectual" class="terms-section card">
              <h2 class="section-title">8. الملكية الفكرية</h2>
              <div class="section-content">
                <p>جميع المحتويات على المنصة (نصوص، صور، شعارات، تصاميم) محمية بموجب قوانين الملكية الفكرية وحقوق النشر.</p>
              </div>
            </article>

            <!-- Privacy and Data -->
            <article id="privacy" class="terms-section card">
              <h2 class="section-title">9. الخصوصية والبيانات</h2>
              <div class="section-content">
                <p>نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. لمزيد من التفاصيل، يرجى مراجعة سياسة الخصوصية الخاصة بنا.</p>
              </div>
            </article>

            <!-- Liability -->
            <article id="liability" class="terms-section card">
              <h2 class="section-title">10. المسؤولية</h2>
              <div class="section-content">
                <p>المنصة توفر سوقاً للربط بين البائعين والمشترين. نحن غير مسؤولين عن جودة المنتجات أو دقة أوصافها.</p>
              </div>
            </article>

            <!-- Disputes -->
            <article id="disputes" class="terms-section card">
              <h2 class="section-title">11. حل النزاعات</h2>
              <div class="section-content">
                <p>في حالة أي نزاع، نشجع على التواصل أولاً مع فريق دعم العملاء لمحاولة الوصول إلى حل ودي.</p>
              </div>
            </article>

            <!-- Changes to Terms -->
            <article id="changes" class="terms-section card">
              <h2 class="section-title">12. التعديلات على الشروط</h2>
              <div class="section-content">
                <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية.</p>
              </div>
            </article>

            <!-- Contact -->
            <article id="contact" class="terms-section card">
              <h2 class="section-title">13. التواصل معنا</h2>
              <div class="section-content">
                <p>إذا كان لديك أي أسئلة أو استفسارات حول هذه الشروط والأحكام، يمكنك التواصل معنا عبر:</p>
                <div class="contact-info">
                  <p><strong>البريد الإلكتروني:</strong> support@geenora.com</p>
                  <p><strong>الهاتف:</strong> 920000000</p>
                  <p><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
            </article>

            <!-- Acceptance -->
            <div class="terms-acceptance card">
              <p>باستخدامك لمنصة جينورا، فإنك تقر بأنك قرأت وفهمت هذه الشروط والأحكام وتوافق على الالتزام بها.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

<?php include 'includes/footer.php'; ?>
