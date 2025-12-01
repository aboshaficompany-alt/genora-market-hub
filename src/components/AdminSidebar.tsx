import { 
  LayoutDashboard, 
  Store, 
  Users, 
  ShoppingCart, 
  Shield, 
  Truck, 
  DollarSign, 
  Image, 
  CreditCard,
  MessageSquare,
  Gift,
  Percent,
  MapPin,
  Settings,
  Calculator,
  GitBranch,
  Megaphone,
  Package,
  TrendingUp,
  Layers,
  BarChart3
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const systemItems = [
  { title: "المستخدمون", url: "/users", icon: Users },
  { title: "الفئات الرئيسية", url: "/categories", icon: Layers },
  { title: "أصناف المتاجر", url: "/store-categories", icon: Package },
  { title: "الرسائل/الاستفسارات", url: "/messages", icon: MessageSquare },
  { title: "العروض", url: "/offers", icon: Gift },
  { title: "برومو كود", url: "/promo-codes", icon: Percent },
  { title: "المدن", url: "/cities", icon: MapPin },
  { title: "خدماتنا للتجار", url: "/merchant-services", icon: Settings },
];

const merchantItems = [
  { title: "العمليات الحسابية", url: "/accounting-operations", icon: Calculator },
  { title: "عمليات السحب المالية", url: "/withdrawal-requests", icon: DollarSign },
  { title: "طلبات سحب الأرصدة", url: "/withdrawal-requests", icon: CreditCard },
  { title: "التجار", url: "/admin-dashboard?tab=stores", icon: Store },
  { title: "الفروع", url: "/branches", icon: GitBranch },
  { title: "سلايدر", url: "/banners", icon: Image },
  { title: "اشتراكات الخدمات", url: "/service-subscriptions", icon: CreditCard },
  { title: "الاعلانات", url: "/advertisements", icon: Megaphone },
  { title: "المنتجات", url: "/all-products", icon: Package },
  { title: "الطلبات", url: "/all-orders", icon: ShoppingCart },
  { title: "تقارير الدفعات", url: "/payment-reports", icon: BarChart3 },
  { title: "ترويج", url: "/promotions", icon: TrendingUp },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar side="right" className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarContent>
        {/* خيارات النظام */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-bold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {open && <span>خيارات النظام</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="hover:bg-muted/50 flex items-center gap-3" 
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* قسم التجار */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-bold flex items-center gap-2">
            <Store className="h-4 w-4" />
            {open && <span>قسم التجار</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {merchantItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="hover:bg-muted/50 flex items-center gap-3" 
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
