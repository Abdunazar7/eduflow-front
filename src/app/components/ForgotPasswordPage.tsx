import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  GraduationCap,
  Moon,
  Sun,
  ArrowLeft,
  Send,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(""); // SMS kod uchun state
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); // Kod yuborilganini tekshirish
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Iltimos, telefon raqamingizni kiriting");
      return;
    }

    setIsLoading(true);
    // SMS yuborish simulyatsiyasi
    setTimeout(() => {
      setIsCodeSent(true);
      setIsLoading(false);
      toast.success("Tasdiqlash kodi yuborildi!");
    }, 1500);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      toast.error("Kodni to'liq kiriting");
      return;
    }

    setIsLoading(true);
    // Kodni tekshirish simulyatsiyasi
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Kod tasdiqlandi! Yangi parolni o'rnating.");
      // Bu yerda yangi parol o'rnatish sahifasiga o'tkazish mumkin
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center p-4 transition-colors duration-300">
      <Button
        onClick={toggleDarkMode}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
      >
        {isDarkMode ? (
          <Sun className="size-5 text-amber-500" />
        ) : (
          <Moon className="size-5 text-indigo-600" />
        )}
      </Button>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-20 -left-20 size-40 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 size-40 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl" />

        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <GraduationCap className="size-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-bold">
            Language LMS
          </h1>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl relative z-10">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">
              {isCodeSent ? "Kodni tasdiqlash" : "Parolni tiklash"}
            </CardTitle>
            <CardDescription className="text-center">
              {isCodeSent
                ? `${phone} raqamiga yuborilgan kodni kiriting`
                : "Telefon raqamingizni kiriting, biz sizga tiklash kodini yuboramiz"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCodeSent ? (
              // 1-QADAM: Telefon raqam kiritish
              <form onSubmit={handleSendCode} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Telefon Raqami
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 text-base bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Yuborilmoqda..." : "Kodni yuborish"}
                </Button>
              </form>
            ) : (
              // 2-QADAM: SMS kodni kiritish
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-base">
                    Tasdiqlash kodi
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-12 text-center text-2xl tracking-[10px] font-bold bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsCodeSent(false)}
                  className="w-full text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Raqamni xato kiritdingizmi? Qaytish
                </button>
              </form>
            )}

            <div className="pt-6 text-center border-t border-gray-100 dark:border-gray-700 mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
              >
                <ArrowLeft className="size-4" /> Login sahifasiga qaytish
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
