# قالب منصة جينورا - Geenora Platform Template

## نظرة عامة
قالب HTML/CSS/SCSS/jQuery احترافي مخصص لمنصة جينورا - منصة رقمية ذات فلسفة تمكينية وإنسانية

## الهيكل
```
template/
├── assets/
│   ├── css/
│   │   ├── _variables.scss      # متغيرات التصميم
│   │   ├── _mixins.scss         # Mixins قابلة لإعادة الاستخدام
│   │   ├── _animations.scss     # التحريكات
│   │   ├── _base.scss           # الأنماط الأساسية
│   │   ├── _components.scss     # المكونات
│   │   ├── _header.scss         # الهيدر
│   │   ├── _footer.scss         # الفوتر
│   │   ├── pages/               # صفحات
│   │   │   ├── _home.scss
│   │   │   ├── _categories.scss
│   │   │   ├── _product-detail.scss
│   │   │   ├── _checkout.scss
│   │   │   ├── _wishlist.scss
│   │   │   └── _orders.scss
│   │   └── style.scss           # الملف الرئيسي
│   └── js/
│       └── main.js              # JavaScript الرئيسي
└── index.html                   # الصفحة الرئيسية
```

## الألوان
- **الأزرق الرمادي**: #4a6fa5
- **البنفسجي الراقي**: #7c6ba5
- **الذهبي الرمزي**: #d4af37
- **الوردي الناعم**: #e8b4b8

## الخطوط
- Cairo (الخط الأساسي)
- Lato (الخط الثانوي)
- Open Sans (خط مساعد)

## التقنيات
- HTML5
- SCSS/CSS3
- jQuery
- Bootstrap 5
- Font Awesome 6

## التثبيت والاستخدام

### 1. تثبيت SASS
```bash
npm install -g sass
```

### 2. تحويل SCSS إلى CSS
```bash
sass assets/css/style.scss assets/css/style.css --watch
```

### 3. فتح الملف
افتح `index.html` في المتصفح

## الميزات
✅ تصميم متجاوب بالكامل (Responsive)
✅ دعم RTL للغة العربية
✅ تحريكات هادئة وراقية
✅ نظام ألوان متناسق
✅ مكونات قابلة لإعادة الاستخدام
✅ كود نظيف ومنظم

## الصفحات المتوفرة
1. الصفحة الرئيسية
2. صفحة الأصناف
3. صفحة تفاصيل الصنف
4. صفحة الدفع
5. صفحة المفضلة
6. صفحة العمليات السابقة
7. صفحة الشروط والأحكام

## التخصيص
يمكنك تعديل الألوان والخطوط من ملف `_variables.scss`

---
© 2024 Geenora Platform
