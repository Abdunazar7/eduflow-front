import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, Mail, Phone, Calendar, Edit2, Save, X, Lock } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  role: string;
  createdAt: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

interface ProfilePageProps {
  profileData: ProfileData;
  onUpdateProfile: (data: Partial<ProfileData>) => void;
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}

export default function ProfilePage({
  profileData,
  onUpdateProfile,
  onChangePassword,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleSaveProfile = () => {
    if (!editFormData.firstName || !editFormData.lastName || !editFormData.phone) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    onUpdateProfile({
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      phone: editFormData.phone,
      email: editFormData.email,
    });

    setIsEditing(false);
    toast.success("Profil muvaffaqiyatli yangilandi");
  };

  const handleCancelEdit = () => {
    setEditFormData(profileData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Yangi parollar mos kelmayapti");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setShowPasswordDialog(true);
  };

  const confirmPasswordChange = () => {
    onChangePassword(passwordData.oldPassword, passwordData.newPassword);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordDialog(false);
    toast.success("Parol muvaffaqiyatli o'zgartirildi");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="mb-6">
        <h2 className="text-3xl mb-2">Mening Profilim</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Shaxsiy ma'lumotlarni boshqarish va parolni o'zgartirish
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profil Ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="size-32 mb-4">
              <AvatarImage src={profileData.photoUrl} />
              <AvatarFallback className="text-4xl bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                {profileData.firstName.charAt(0).toUpperCase()}
                {profileData.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">
              {profileData.firstName} {profileData.lastName}
            </h3>
            <Badge className="mb-4">{profileData.role}</Badge>
            
            <Separator className="my-4 w-full" />
            
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-slate-400" />
                <span>{profileData.phone}</span>
              </div>
              {profileData.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-slate-400" />
                  <span>{profileData.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-slate-400" />
                <span>Qo'shilgan: {profileData.createdAt}</span>
              </div>
            </div>

            {/* Stats */}
            {profileData.stats && profileData.stats.length > 0 && (
              <>
                <Separator className="my-4 w-full" />
                <div className="w-full space-y-2">
                  {profileData.stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</span>
                      <span className="text-sm font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Profile and Change Password */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sozlamalar</CardTitle>
            <CardDescription>
              Profil ma'lumotlarini tahrirlash va parolni o'zgartirish
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">
                  <User className="size-4 mr-2" />
                  Profilni Tahrirlash
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Lock className="size-4 mr-2" />
                  Parolni O'zgartirish
                </TabsTrigger>
              </TabsList>

              {/* Edit Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Ism *</Label>
                    <Input
                      id="firstName"
                      value={editFormData.firstName}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, firstName: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Familiya *</Label>
                    <Input
                      id="lastName"
                      value={editFormData.lastName}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, lastName: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefon Raqam *</Label>
                  <Input
                    id="phone"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="w-full">
                      <Edit2 className="size-4 mr-2" />
                      Tahrirlash
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile} className="flex-1">
                        <Save className="size-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                        <X className="size-4 mr-2" />
                        Bekor qilish
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Change Password Tab */}
              <TabsContent value="password" className="space-y-4">
                <div>
                  <Label htmlFor="oldPassword">Eski Parol *</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, oldPassword: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">Yangi Parol *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Yangi Parolni Tasdiqlang *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>

                <Button onClick={handleChangePassword} className="w-full">
                  <Lock className="size-4 mr-2" />
                  Parolni O'zgartirish
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Confirmation Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Parolni o'zgartirmoqchimisiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Parolingizni o'zgartirgandan so'ng, yangi parol bilan tizimga kirishi kerak bo'ladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yo'q</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPasswordChange}>
              Ha, o'zgartirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
