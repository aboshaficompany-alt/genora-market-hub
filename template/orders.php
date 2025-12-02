<?php
session_start();
$pageTitle = 'الطلبات السابقة';
$pageDescription = 'عرض وإدارة طلباتك السابقة في منصة جينورا';
$activePage = 'orders';
include 'includes/header.php';

// Sample orders data - replace with database query
$orders = [
  [
    'id' => '45892',
    'date' => '15 مارس 2024',
    'status' => 'delivered',
    'status_text' => 'تم التوصيل',
    'total' => 1894,
    'items' => [
      ['name' => 'سماعات بلوتوث لاسلكية عالية الجودة', 'quantity' => 1, 'price' => 595, 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'],
      ['name' => 'ساعة ذكية متطورة مع شاشة AMOLED', 'quantity' => 1, 'price' => 1299, 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150'],
    ]
  ],
  [
    'id' => '45891',
    'date' => '18 مارس 2024',
    'status' => 'shipped',
    'status_text' => 'جاري الشحن',
    'total' => 520,
    'items' => [
      ['name' => 'حقيبة ظهر جلدية فاخرة للأعمال', 'quantity' => 1, 'price' => 520, 'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150'],
    ]
  ],
  [
    'id' => '45890',
    'date' => '20 مارس 2024',
    'status' => 'confirmed',
    'status_text' => 'مؤكد',
    'total' => 760,
    'items' => [
      ['name' => 'حذاء رياضي مريح للمشي والجري', 'quantity' => 2, 'price' => 760, 'image' => 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=150'],
    ]
  ],
  [
    'id' => '45889',
    'date' => '22 مارس 2024',
    'status' => 'pending',
    'status_text' => 'قيد المعالجة',
    'total' => 240,
    'items' => [
      ['name' => 'كتاب فن التسويق الرقمي', 'quantity' => 3, 'price' => 240, 'image' => 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=150'],
    ]
  ],
];
?>

  <!-- Main Content -->
  <main class="orders-page">
    <div class="container">
      <!-- Page Header -->
      <div class="orders-header">
        <h1>الطلبات السابقة</h1>
        
        <!-- Filters -->
        <div class="orders-filters">
          <button class="filter-btn active" onclick="filterOrders('all')">الكل</button>
          <button class="filter-btn" onclick="filterOrders('pending')">قيد المعالجة</button>
          <button class="filter-btn" onclick="filterOrders('confirmed')">مؤكد</button>
          <button class="filter-btn" onclick="filterOrders('shipped')">جاري الشحن</button>
          <button class="filter-btn" onclick="filterOrders('delivered')">تم التوصيل</button>
          <button class="filter-btn" onclick="filterOrders('cancelled')">ملغي</button>
        </div>
      </div>

      <?php if(count($orders) > 0): ?>
      <!-- Orders List -->
      <div class="orders-list">
        <?php foreach($orders as $order): ?>
        <div class="order-card" data-status="<?php echo $order['status']; ?>">
          <div class="order-header">
            <div class="order-number">
              طلب رقم <span>#<?php echo $order['id']; ?></span>
            </div>
            <div class="order-date">
              <i class="far fa-calendar"></i>
              <?php echo $order['date']; ?>
            </div>
            <span class="order-status <?php echo $order['status']; ?>"><?php echo $order['status_text']; ?></span>
          </div>
          
          <div class="order-body">
            <div class="order-items">
              <?php foreach($order['items'] as $item): ?>
              <div class="order-item">
                <div class="item-image">
                  <img src="<?php echo $item['image']; ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
                </div>
                <div class="item-details">
                  <div class="item-name"><?php echo htmlspecialchars($item['name']); ?></div>
                  <div class="item-quantity">الكمية: <?php echo $item['quantity']; ?></div>
                  <div class="item-price"><?php echo number_format($item['price']); ?> ر.س</div>
                </div>
              </div>
              <?php endforeach; ?>
            </div>
            
            <div class="order-total">
              <span class="total-label">الإجمالي:</span>
              <span class="total-value"><?php echo number_format($order['total']); ?> ر.س</span>
            </div>
          </div>
          
          <div class="order-footer">
            <?php if($order['status'] == 'shipped' || $order['status'] == 'delivered'): ?>
            <button class="btn btn-<?php echo $order['status'] == 'shipped' ? 'primary' : 'outline'; ?>">تتبع الطلب</button>
            <?php endif; ?>
            <button class="btn btn-outline">تفاصيل الفاتورة</button>
            <?php if($order['status'] == 'delivered'): ?>
            <button class="btn btn-primary">إعادة الطلب</button>
            <?php elseif($order['status'] == 'pending' || $order['status'] == 'confirmed'): ?>
            <button class="btn btn-outline-danger">إلغاء الطلب</button>
            <?php endif; ?>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
      <?php else: ?>
      <!-- Empty State -->
      <div class="orders-empty">
        <div class="empty-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <h2>لا توجد طلبات</h2>
        <p>لم تقم بإجراء أي طلبات بعد</p>
        <a href="categories.php" class="btn btn-primary">ابدأ التسوق الآن</a>
      </div>
      <?php endif; ?>
    </div>
  </main>

<script>
function filterOrders(status) {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.order-card');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  cards.forEach(card => {
    if(status === 'all' || card.dataset.status === status) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
</script>

<?php include 'includes/footer.php'; ?>
