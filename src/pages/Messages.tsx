import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

export default function Messages() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

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
      loadMessages();
    };
    checkAdmin();
  }, [user, authLoading]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({
          admin_reply: replyText,
          status: "replied",
        })
        .eq("id", selectedMessage.id);

      if (error) throw error;
      
      toast({ title: "تم إرسال الرد بنجاح" });
      setSelectedMessage(null);
      setReplyText("");
      loadMessages();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "تم تحديث حالة الرسالة" });
      loadMessages();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "قيد الانتظار" },
      replied: { variant: "default", label: "تم الرد" },
      closed: { variant: "outline", label: "مغلق" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authLoading || loading) return null;

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
                الرسائل والاستفسارات
              </h1>
              <p className="text-muted-foreground">إدارة رسائل واستفسارات العملاء</p>
            </div>

            {messages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد رسائل حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {messages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{message.subject}</CardTitle>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {message.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {message.email}
                            </span>
                            {message.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {message.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(message.status)}
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(message.created_at), "yyyy-MM-dd HH:mm")}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-foreground">{message.message}</p>
                      
                      {message.admin_reply && (
                        <div className="bg-muted p-4 rounded-lg mb-4">
                          <p className="text-sm font-medium mb-2">الرد من الإدارة:</p>
                          <p className="text-sm">{message.admin_reply}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setReplyText(message.admin_reply || "");
                          }}
                        >
                          {message.admin_reply ? "تعديل الرد" : "الرد"}
                        </Button>
                        {message.status !== "closed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(message.id, "closed")}
                          >
                            إغلاق
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>الرد على الرسالة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedMessage && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">الرسالة الأصلية:</p>
                      <p className="text-sm">{selectedMessage.message}</p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="reply">الرد</Label>
                    <Textarea
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={5}
                      placeholder="اكتب ردك هنا..."
                    />
                  </div>
                  <Button onClick={handleReply} className="w-full">
                    إرسال الرد
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
