  import { useState, useEffect } from "react";
  import { useNavigate, Link } from "react-router";
  import { Button } from "./ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
  import { Input } from "./ui/input";
  import { Label } from "./ui/label";
  import { GraduationCap, Moon, Sun, Eye, EyeOff } from "lucide-react";
  import { authUtils, UserRole, createMockJWT } from "../utils/auth";
  import { toast } from "sonner";

  export default function LoginPage() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      // Check system preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
      
      // Check if user is already authenticated and redirect
      const currentUser = authUtils.getCurrentUser();
      if (currentUser) {
        navigate(authUtils.getRoleRedirectPath(currentUser.role), { replace: true });
      }
    }, [navigate]);

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle("dark");
    };

    // Demo phone numbers mapped to roles
    const demoCredentials: Record<string, UserRole> = {
      "+998901234567": UserRole.PLATFORM_ADMIN,
      "+998901234568": UserRole.MANAGER,
      "+998901234569": UserRole.ADMIN,
      "+998901234570": UserRole.TEACHER,
      "+998901234571": UserRole.STUDENT,
    };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!phone || !password) {
        toast.error("Iltimos, telefon va parolni kiriting");
        return;
      }

      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        // In a real app, backend would verify credentials and return JWT with role
        // For demo, we check phone number and accept any password
        const role = demoCredentials[phone];
        
        if (role && password === "demo123") {
          // Generate mock JWT token with role from backend response
          const userId = Math.floor(Math.random() * 1000);
          const tenantId = role === UserRole.PLATFORM_ADMIN ? undefined : 1;
          const token = createMockJWT(userId, role, tenantId);
          
          // Store token
          authUtils.setToken(token);
          
          // Show success message
          toast.success("Tizimga muvaffaqiyatli kirdingiz!");
          
          // Redirect to appropriate dashboard based on role from token
          const decodedUser = authUtils.getCurrentUser();
          if (decodedUser) {
            navigate(authUtils.getRoleRedirectPath(decodedUser.role));
          }
        } else {
          toast.error("Telefon yoki parol noto'g'ri");
        }
        
        setIsLoading(false);
      }, 1000);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center p-4 transition-colors duration-300">
        {/* Dark Mode Toggle */}
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
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 size-40 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-40 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl" />

          {/* Logo and Title */}
          <div className="text-center mb-8 relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
                  <GraduationCap className="size-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text">
              Language LMS
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              O'quv Markazlari Boshqaruv Tizimi
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl relative z-10">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">
                Xush kelibsiz
              </CardTitle>
              <CardDescription className="text-center">
                Tizimga kirish uchun ma'lumotlaringizni kiriting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
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
                    required
                    className="h-12 text-base bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-base">
                      Parol
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      Parolni unutdingizmi?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 text-base pr-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-gray-400" />
                      ) : (
                        <Eye className="size-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Kirish...
                    </div>
                  ) : (
                    "Kirish"
                  )}
                </Button>
              </form>

              {/* Demo credentials info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  📝 Demo Ma'lumotlari:
                </p>
                <div className="space-y-2 text-sm bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900/50 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-indigo-700 dark:text-indigo-400">
                        Platform Admin:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        +998901234567
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-700 dark:text-purple-400">
                        Manager:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        +998901234568
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 dark:text-blue-400">
                        Admin:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        +998901234569
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 dark:text-green-400">
                        Teacher:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        +998901234570
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-pink-700 dark:text-pink-400">
                        Student:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        +998901234571
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800 mt-3">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">
                      Parol:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono">
                      demo123
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 relative z-10">
            <p className="flex items-center justify-center gap-2">
              <span className="size-2 bg-green-500 rounded-full animate-pulse" />
              Demo Tizim - Barcha ma'lumotlar test uchun
            </p>
          </div>
        </div>
      </div>
    );
  }