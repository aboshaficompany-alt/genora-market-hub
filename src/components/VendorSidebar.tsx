import { LayoutDashboard, Package, ShoppingCart, Settings, Store, DollarSign, CreditCard } from "lucide-react";
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
  { title: "لوحة التحكم", url: "/vendor-dashboard", icon: LayoutDashboard },
  { title: "المنتجات", url: "/vendor-products", icon: Package },
  { title: "الفروع", url: "/branches", icon: Store },
  { title: "الطلبات", url: "/vendor-orders", icon: ShoppingCart },
  { title: "طلبات السحب", url: "/withdrawal-requests", icon: DollarSign },
  { title: "المديونيات", url: "/debts", icon: CreditCard },
  { title: "إعدادات المتجر", url: "/store-settings", icon: Settings },
];

export function VendorSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar side="right" className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold flex items-center gap-2">
            <Store className="h-5 w-5" />
            {open && <span>متجري</span>}
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
