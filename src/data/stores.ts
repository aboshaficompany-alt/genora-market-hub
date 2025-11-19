export interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  products: number;
  image: string;
  verified: boolean;
}

export const stores: Store[] = [
  {
    id: 1,
    name: "متجر الأناقة",
    description: "أفضل الأزياء والموضة العصرية",
    category: "أزياء",
    rating: 4.8,
    products: 250,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    verified: true,
  },
  {
    id: 2,
    name: "عالم التقنية",
    description: "أحدث الأجهزة الإلكترونية والتقنية",
    category: "إلكترونيات",
    rating: 4.9,
    products: 180,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
    verified: true,
  },
  {
    id: 3,
    name: "منزلي المميز",
    description: "مستلزمات منزلية وديكورات راقية",
    category: "منزل وديكور",
    rating: 4.7,
    products: 320,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800",
    verified: true,
  },
  {
    id: 4,
    name: "رياضتي",
    description: "معدات رياضية ومكملات غذائية",
    category: "رياضة",
    rating: 4.6,
    products: 150,
    image: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800",
    verified: true,
  },
  {
    id: 5,
    name: "جمالك الطبيعي",
    description: "منتجات تجميل وعناية بالبشرة",
    category: "تجميل",
    rating: 4.9,
    products: 200,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    verified: true,
  },
  {
    id: 6,
    name: "مكتبة المعرفة",
    description: "كتب ومجلات وقرطاسية",
    category: "كتب",
    rating: 4.5,
    products: 400,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    verified: false,
  },
  {
    id: 7,
    name: "ألعاب الأطفال",
    description: "ألعاب آمنة ومسلية للأطفال",
    category: "أطفال",
    rating: 4.8,
    products: 280,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800",
    verified: true,
  },
  {
    id: 8,
    name: "مطبخ الذواقة",
    description: "أدوات مطبخ ومستلزمات الطهي",
    category: "مطبخ",
    rating: 4.7,
    products: 190,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
    verified: true,
  },
];
