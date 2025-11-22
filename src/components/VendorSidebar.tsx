import { LayoutDashboard, Package, ShoppingCart, Settings, Store } from "lucide-react";
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
  { title: "لوحة التحكم", url: "/vendor-dashboard", icon: LayoutDashboard, tab: null },
  { title: "المنتجات", url: "/vendor-dashboard", icon: Package, tab: "products" },
  { title: "الطلبات", url: "/vendor-dashboard", icon: ShoppingCart, tab: "orders" },
  { title: "إعدادات المتجر", url: "/store-settings", icon: Settings, tab: null },
];

export function VendorSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
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
                    <a 
                      href={item.tab ? `${item.url}?tab=${item.tab}` : item.url}
                      className="hover:bg-muted/50 flex items-center gap-3 cursor-pointer" 
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </a>
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
