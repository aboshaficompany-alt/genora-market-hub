import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { Users as UsersIcon } from "lucide-react";

export default function Users() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (authLoading) return;
      if (!user) {
        navigate("/auth");
        return;
      }
      const isAdmin = await hasRole("admin");
      if (!isAdmin) {
        navigate("/");
        return;
      }
      loadData();
    };
    checkAdmin();
  }, [user, authLoading]);

  const loadData = async () => {
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("*");
    
    setUsers(usersData || []);
    setUserRoles(rolesData || []);
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || "customer";
  };

  if (authLoading) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                إدارة المستخدمين
              </h1>
              <p className="text-muted-foreground">عرض وإدارة جميع المستخدمين</p>
            </div>

            <div className="grid gap-4">
              {users.map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{u.full_name || "بدون اسم"}</h3>
                          <p className="text-sm text-muted-foreground">{u.phone}</p>
                        </div>
                      </div>
                      <Badge>{getUserRole(u.id) === "admin" ? "مدير" : getUserRole(u.id) === "vendor" ? "تاجر" : "عميل"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
