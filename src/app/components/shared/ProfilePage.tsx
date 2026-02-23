"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Phone,
  Calendar,
  Edit2,
  Lock,
  ShieldCheck,
  MapPin,
  CreditCard,
  LogOut,
  CheckCircle2,
  Send,
  ShieldCheck as OTPShield,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  address?: string;
  balance?: string | number;
}

interface ProfilePageProps {
  profileData: ProfileData;
  onUpdateProfile: (data: Partial<ProfileData>) => void;
  onChangePassword: (oldPassword: string, newPassword: string) => void;
  onLogout: () => void;
}

export default function ProfilePage({
  profileData,
  onUpdateProfile,
  onChangePassword,
  onLogout,
}: ProfilePageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(profileData);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });



  useEffect(() => {
    if (profileData) setEditFormData(profileData);
  }, [profileData]);



  const handleSendOtp = () => {
    if (newPhone.length < 9) {
      toast.error("Raqamni to'liq kiriting");
      return;
    }
    setIsOtpSent(true);
    toast.success(`${newPhone} raqamiga kod yuborildi`);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length >= 4) {
      setEditFormData({ ...editFormData, phone: newPhone });
      setIsOtpSent(false);
      setNewPhone("");
      setOtpCode("");
      toast.success("Raqam tasdiqlandi!");
    } else {
      toast.error("Kod noto'g'ri");
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile(editFormData);
    setIsEditModalOpen(false);
    toast.success("Muvaffaqiyatli yangilandi");
  };

  // const handleLogout = () => {
  //   toast.info("Tizimdan chiqilmoqda...");

  //   localStorage.removeItem("accessToken");

  //   if (typeof onLogout === "function") {
  //     onLogout();
  //   } else {

  //     router.push("/login");
  //   }
  // };

  return (
    <div className="min-h-screen bg-background p-4 md:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER SECTION - NT WORK STYLE */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-1 shadow-2xl">
          <div className="relative bg-card rounded-[2.9rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <Avatar className="size-36 md:size-44 border-[6px] border-border shadow-2xl">
                <AvatarImage src={profileData.photoUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-5xl font-black">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left space-y-4">
                <Badge className="px-5 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-black text-xs uppercase tracking-widest">
                  {profileData.role}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight italic">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-500 font-bold">
                  <Phone className="size-5" /> {profileData.phone}
                  <CheckCircle2 className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN DATA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-slate-900 to-blue-950 border-none text-white shadow-2xl rounded-[2.5rem]">
              <CardContent className="p-10">
                <CreditCard className="size-12 text-blue-400 mb-12" />
                <p className="text-xs font-bold text-blue-300/60 uppercase tracking-[0.2em] mb-2">
                  Balans
                </p>
                <h2 className="text-5xl font-black tracking-tighter italic">
                  {profileData.balance || "0"}{" "}
                  <span className="text-lg font-medium opacity-50 italic uppercase">
                    uzs
                  </span>
                </h2>
              </CardContent>
            </Card>

            <div className="bg-card p-8 rounded-[2.5rem] border border-border space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <Calendar className="text-orange-500 size-6" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Qo'shilgan sana
                  </p>
                  <p className="font-bold text-foreground">
                    {new Date(profileData.createdAt).toLocaleDateString(
                      "uz-UZ",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 bg-card rounded-3xl border border-border">
                <ShieldCheck className="size-6 text-blue-500 mb-4" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Status
                </p>
                <p className="text-lg font-black text-foreground">
                  {profileData.isActive ? "Faol" : "Nofaol"}
                </p>
              </div>
              <div className="p-6 bg-card rounded-3xl border border-border">
                <MapPin className="size-6 text-rose-500 mb-4" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Manzil
                </p>
                <p className="text-lg font-black text-foreground truncate">
                  {profileData.address || "Kiritilmagan"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-xl shadow-blue-500/20"
              >
                <Edit2 className="size-5 mr-3" /> Profilni tahrirlash
              </Button>
              <Button
                onClick={() => setIsPassModalOpen(true)}
                variant="outline"
                className="flex-1 h-16 rounded-[1.5rem] border-2 font-black text-lg text-foreground bg-transparent"
              >
                <Lock className="size-5 mr-3" /> Xavfsizlik
              </Button>
              {/* <Button
                onClick={handleLogoutClick}
                variant="destructive"
                className="h-16 px-8 rounded-[1.5rem] font-black text-lg flex items-center gap-2"
              > */}
                <Button
                  // onClick={handleLogout}
                  variant="destructive"
                  className="h-16 px-10 rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-500/10 active:scale-95"
                >
                  <LogOut className="size-5 mr-3" /> Chiqish
                </Button>
              {/* </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-110 rounded-[2.5rem] p-8 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">
              Profilni tahrirlash
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase ml-1">
                  Ism
                </Label>
                <Input
                  value={editFormData.firstName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      firstName: e.target.value,
                    })
                  }
                  className="rounded-xl h-12 bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase ml-1">
                  Familiya
                </Label>
                <Input
                  value={editFormData.lastName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      lastName: e.target.value,
                    })
                  }
                  className="rounded-xl h-12 bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <Label className="text-[10px] font-bold uppercase text-blue-500 ml-1">
                Telefon o'zgartirish
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Yangi raqam"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="h-12 rounded-xl bg-background border-border"
                />
                <Button
                  onClick={handleSendOtp}
                  variant="secondary"
                  className="h-12 rounded-xl"
                >
                  <Send className="size-4" />
                </Button>
              </div>

              {isOtpSent && (
                <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                  <Input
                    placeholder="Kod"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="h-12 rounded-xl border-emerald-500 focus:ring-emerald-500 bg-background"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                  >
                    OK
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveProfile}
              className="w-full h-14 rounded-2xl bg-blue-600 font-bold hover:bg-blue-700 transition-all"
            >
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PASSWORD MODAL */}
      <Dialog open={isPassModalOpen} onOpenChange={setIsPassModalOpen}>
        <DialogContent className="sm:max-w-96 rounded-[2.5rem] p-8 bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center italic">
              Xavfsizlik
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-foreground">
            <Input
              type="password"
              placeholder="Eski parol"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
              className="h-12 rounded-xl bg-background border-border text-foreground"
            />
            <Input
              type="password"
              placeholder="Yangi parol"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="h-12 rounded-xl bg-background border-border text-foreground"
            />
            <Input
              type="password"
              placeholder="Tasdiqlang"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="h-12 rounded-xl bg-background border-border text-foreground"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                onChangePassword(
                  passwordData.oldPassword,
                  passwordData.newPassword,
                );
                setIsPassModalOpen(false);
                toast.success("Parol muvaffaqiyatli o'zgartirildi");
              }}
              className="w-full h-14 rounded-2xl bg-blue-600 font-bold hover:bg-blue-700"
            >
              Yangilash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
