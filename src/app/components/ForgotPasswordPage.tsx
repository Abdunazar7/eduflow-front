import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GraduationCap, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, backend would send SMS with reset code
      setIsSuccess(true);
      toast.success("Reset code sent to your phone!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <GraduationCap className="size-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl mb-2">Language LMS</h1>
          <p className="text-slate-600">
            Reset your password
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              Enter your phone number and we'll send you a reset code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+998901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="size-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="size-12 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Check Your Phone</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    We've sent a verification code to <strong>{phone}</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Please enter the code in the SMS to reset your password
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Demo info */}
            {!isSuccess && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-center text-slate-500">
                  This is a demo. In production, an SMS with reset code will be sent.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>Demo System - All data is simulated</p>
        </div>
      </div>
    </div>
  );
}
