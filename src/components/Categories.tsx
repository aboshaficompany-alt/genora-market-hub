import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name_ar: string;
  icon: string;
  description: string | null;
  display_order: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-4 rounded"></div>
            <div className="h-4 w-96 bg-muted animate-pulse mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            تصفح حسب الفئة
          </h2>
          <p className="text-muted-foreground text-lg">
            اختر الفئة المناسبة لك واستكشف المتاجر والمنتجات
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name_ar)}`}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card border-2 border-border hover:border-primary">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">
                    {category.name_ar}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
