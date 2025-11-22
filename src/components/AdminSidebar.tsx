import { LayoutDashboard, Store, Users, ShoppingCart, Shield } from "lucide-react";
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
  { title: "لوحة التحكم", url: "/admin-dashboard", icon: LayoutDashboard, tab: null },
  { title: "المتاجر", url: "/admin-dashboard", icon: Store, tab: "stores" },
  { title: "المستخدمين", url: "/admin-dashboard", icon: Users, tab: "users" },
  { title: "الطلبات", url: "/admin-dashboard", icon: ShoppingCart, tab: "orders" },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
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
