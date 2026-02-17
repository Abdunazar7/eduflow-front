import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Info,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

export interface Notification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

interface NotificationsPageProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: number) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: number) => void;
  onClearAll?: () => void;
}

// Default mock notifications
const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: "info",
    title: "Yangi xabar",
    message: "Tizimda yangi funksiyalar qo'shildi. Batafsil ko'rish uchun sozlamalarni tekshiring.",
    date: "2 soat oldin",
    isRead: false,
  },
  {
    id: 2,
    type: "success",
    title: "To'lov muvaffaqiyatli",
    message: "Sizning to'lovingiz muvaffaqiyatli qabul qilindi.",
    date: "5 soat oldin",
    isRead: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Obuna muddati tugayapti",
    message: "Sizning obunangiz 7 kundan keyin tugaydi. Iltimos, o'z vaqtida yangilang.",
    date: "1 kun oldin",
    isRead: true,
  },
  {
    id: 4,
    type: "info",
    title: "Yangi dars jadvali",
    message: "Yangi haftalik dars jadvali e'lon qilindi.",
    date: "2 kun oldin",
    isRead: true,
  },
  {
    id: 5,
    type: "success",
    title: "Profil yangilandi",
    message: "Sizning profil ma'lumotlaringiz muvaffaqiyatli yangilandi.",
    date: "3 kun oldin",
    isRead: true,
  },
];

export default function NotificationsPage({
  notifications: initialNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications || defaultNotifications
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | "all" | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    onMarkAsRead?.(id);
    toast.success("Bildirishnoma o'qilgan deb belgilandi");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    onMarkAllAsRead?.();
    toast.success("Barcha bildirishnomalar o'qilgan deb belgilandi");
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteDialog(true);
  };

  const handleClearAllClick = () => {
    setDeleteTarget("all");
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === "all") {
      setNotifications([]);
      onClearAll?.();
      toast.success("Barcha bildirishnomalar o'chirildi");
    } else if (typeof deleteTarget === "number") {
      setNotifications(notifications.filter((n) => n.id !== deleteTarget));
      onDelete?.(deleteTarget);
      toast.success("Bildirishnoma o'chirildi");
    }
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="size-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="size-5 text-red-500" />;
      default:
        return <Info className="size-5 text-blue-500" />;
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const NotificationsList = ({ items }: { items: Notification[] }) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="size-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Bildirishnomalar yo'q</p>
        </div>
      ) : (
        items.map((notification) => (
          <Card
            key={notification.id}
            className={`${!notification.isRead ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">
                      {notification.title}
                      {!notification.isRead && (
                        <Badge className="ml-2 bg-blue-500 text-white text-xs">Yangi</Badge>
                      )}
                    </h4>
                    <div className="flex gap-1 flex-shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="O'qilgan deb belgilash"
                        >
                          <Check className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(notification.id)}
                        title="O'chirish"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="size-3" />
                    <span>{notification.date}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Bildirishnomalar</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {unreadCount > 0
              ? `Sizda ${unreadCount} ta o'qilmagan bildirishnoma bor`
              : "Barcha bildirishnomalar o'qilgan"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCheck className="size-4 mr-2" />
              Hammasini o'qilgan deb belgilash
            </Button>
          )}
          {notifications.length > 0 && (
            <Button onClick={handleClearAllClick} variant="outline" className="text-red-600">
              <Trash2 className="size-4 mr-2" />
              Hammasini tozalash
            </Button>
          )}
        </div>
      </div>

      {/* Notifications Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Barcha Bildirishnomalar</span>
            <Badge variant="outline">
              {notifications.length} ta bildirishnoma
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Hammasi ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                O'qilmagan ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read">
                O'qilgan ({readNotifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <NotificationsList items={notifications} />
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <NotificationsList items={unreadNotifications} />
            </TabsContent>

            <TabsContent value="read" className="mt-4">
              <NotificationsList items={readNotifications} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget === "all"
                ? "Barcha bildirishnomalarni o'chirmoqchimisiz?"
                : "Bu bildirishnomani o'chirmoqchimisiz?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "all"
                ? "Bu amal barcha bildirishnomalarni butunlay o'chiradi va bu amalni bekor qilib bo'lmaydi."
                : "Bu amal bildirishnomani butunlay o'chiradi va bu amalni bekor qilib bo'lmaydi."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yo'q</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Ha, o'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
