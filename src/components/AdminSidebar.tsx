import { LayoutDashboard, Store, Users, ShoppingCart, Shield, Truck, DollarSign, Image, CreditCard } from "lucide-react";
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

const items = [
  { title: "لوحة التحكم", url: "/admin-dashboard", icon: LayoutDashboard },
  { title: "المتاجر", url: "/admin-dashboard?tab=stores", icon: Store },
  { title: "المستخدمين", url: "/admin-dashboard?tab=users", icon: Users },
  { title: "الطلبات", url: "/admin-dashboard?tab=orders", icon: ShoppingCart },
  { title: "شركات الشحن", url: "/shipping-companies", icon: Truck },
  { title: "طلبات السحب", url: "/withdrawal-requests", icon: DollarSign },
  { title: "المديونيات", url: "/debts", icon: CreditCard },
  { title: "البانرات", url: "/banners", icon: Image },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar side="right" className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {open && <span>الإدارة</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
