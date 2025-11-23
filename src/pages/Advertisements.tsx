import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Megaphone, Plus } from "lucide-react";

export default function Advertisements() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
    };
    checkAdmin();
  }, [user, authLoading]);

  if (authLoading) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <SidebarTrigger className="mb-4" />
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                  الإعلانات
                </h1>
                <p className="text-muted-foreground">إدارة الإعلانات الترويجية</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                إضافة إعلان
              </Button>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Megaphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لا توجد إعلانات حالياً</p>
              </CardContent>
            </Card>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
