import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  Phone, Calendar, Edit2, Lock, 
  MapPin, LogOut, CheckCircle2, 
  Briefcase, Send, UserCircle, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
}

export default function ProfilePage({ user, onLogout }: ProfilePageProps) {
  const navigate = useNavigate();
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  // OTP mantiqi uchun
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "+998 90 123 45 67",
    address: "Toshkent, O'zbekiston",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleSendOtp = () => {
    if (editForm.phone.length < 9) {
      toast.error("Telefon raqamni kiriting");
      return;
    }
    setIsOtpSent(true);
    toast.info("Tasdiqlash kodi yuborildi");
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 6) {
      toast.success("Raqam tasdiqlandi");
      setIsOtpSent(false);
    } else {
      toast.error("Kod noto'g'ri");
    }
  };

  const handleEditProfile = () => {
    toast.success("Profil muvaffaqiyatli yangilandi");
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Parollar mos kelmaydi");
      return;
    }
    toast.success("Parol muvaffaqiyatli o'zgartirildi");
    setIsChangePasswordOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const registrationDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("uz-UZ")
    : "09.06.2025";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f111a] p-4 md:p-10 font-sans transition-all">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-1 shadow-2xl">
          <div className="relative bg-white dark:bg-[#11141d] rounded-[2.9rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <Avatar className="size-36 md:size-44 border-[6px] border-indigo-50 dark:border-gray-800 shadow-2xl">
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-5xl font-black">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-3 right-3 bg-green-500 size-8 rounded-full border-4 border-white dark:border-[#11141d] flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <Badge className="px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border-none font-black text-xs uppercase tracking-widest">
                   {user?.role?.name === "Teacher" ? "O'qituvchi" : "Profil"}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                  {user?.firstName} {user?.lastName}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400 font-medium text-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="size-5 text-indigo-500" /> {editForm.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- INFO SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-[#11141d] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
              <Briefcase className="size-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mutaxassislik</p>
              <p className="font-bold text-lg dark:text-white">{user?.teacherProfile?.specialization || "O'qituvchi"}</p>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-[#11141d] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
              <Calendar className="size-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ro'yxatdan o'tgan sana</p>
              <p className="font-bold text-lg dark:text-white">{registrationDate}</p>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-[#11141d] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
              <MapPin className="size-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manzil</p>
              <p className="font-bold text-lg dark:text-white">{editForm.address}</p>
            </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={() => setIsEditProfileOpen(true)} className="flex-1 h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
            <Edit2 className="size-5 mr-3" /> Profilni Tahrirlash
          </Button>
          <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline" className="flex-1 h-16 rounded-[1.5rem] border-2 font-black text-lg dark:text-white dark:border-gray-800 hover:bg-gray-50 transition-all active:scale-95">
            <Lock className="size-5 mr-3" /> Xavfsizlik
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="h-16 px-10 rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-500/10 active:scale-95">
            <LogOut className="size-5 mr-3" /> Chiqish
          </Button>
        </div>
      </div>

      {/* --- EDIT MODAL WITH OTP VERIFY BUTTON --- */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 dark:bg-[#11141d] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ml-1 opacity-60">Ism</Label>
                <Input value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ml-1 opacity-60">Familiya</Label>
                <Input value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} className="rounded-xl h-12" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase ml-1 opacity-60">Telefon raqam</Label>
              <div className="flex gap-2">
                <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="rounded-xl h-12 flex-1" />
                <Button onClick={handleSendOtp} variant="secondary" className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600">
                  <Send className="size-4" />
                </Button>
              </div>

              {isOtpSent && (
                <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2 duration-300">
                  <Input 
                    placeholder="Kodni kiriting" 
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value)} 
                    className="h-12 rounded-xl flex-1 border-indigo-200" 
                  />
                  <Button onClick={handleVerifyOtp} className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                    Tasdiqlash
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase ml-1 opacity-60">Manzil</Label>
                <Input value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="rounded-xl h-12" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditProfile} className="w-full h-14 rounded-2xl bg-indigo-600 font-bold text-lg">O'zgarishlarni saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- PASSWORD MODAL --- */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-8 dark:bg-[#11141d] border-none shadow-2xl">
          <DialogHeader><DialogTitle className="text-2xl font-black text-center">Xavfsizlik</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="password" placeholder="Joriy parol" className="h-12 rounded-xl" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
            <Input type="password" placeholder="Yangi parol" className="h-12 rounded-xl" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
            <Input type="password" placeholder="Tasdiqlash" className="h-12 rounded-xl" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword} className="w-full h-14 rounded-2xl bg-indigo-600 font-bold text-lg">Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}