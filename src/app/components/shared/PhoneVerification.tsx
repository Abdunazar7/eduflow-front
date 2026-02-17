import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Check, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PhoneVerificationProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  onVerified?: (isVerified: boolean) => void;
}

export default function PhoneVerification({
  value,
  onChange,
  label = "Telefon Raqami",
  required = false,
  onVerified,
}: PhoneVerificationProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSendCode = async () => {
    if (!value || value.length < 9) {
      toast.error("Iltimos, to'g'ri telefon raqamini kiriting");
      return;
    }

    setIsSending(true);

    // Simulate sending code via Telegram bot
    setTimeout(() => {
      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setCodeSent(true);
      setIsSending(false);
      
      // In production, this would send to Telegram bot
      toast.success(`Telegram botga tasdiqlash kodi yuborildi: ${code}`, {
        description: "Demo: Kodni yuqorida ko'rishingiz mumkin",
        duration: 10000,
      });
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("Tasdiqlash kodini kiriting");
      return;
    }

    setIsVerifying(true);

    // Simulate verification
    setTimeout(() => {
      if (verificationCode === generatedCode) {
        setIsVerified(true);
        setIsVerifying(false);
        toast.success("Telefon raqami tasdiqlandi!");
        if (onVerified) {
          onVerified(true);
        }
      } else {
        setIsVerifying(false);
        toast.error("Noto'g'ri kod. Qaytadan urinib ko'ring.");
      }
    }, 800);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="phone">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="phone"
              type="tel"
              placeholder="+998901234567"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={isVerified}
              required={required}
              className={isVerified ? "pr-10" : ""}
            />
            {isVerified && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-green-600" />
            )}
          </div>
          {!isVerified && !codeSent && (
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={isSending || !value}
              variant="outline"
              className="shrink-0"
            >
              {isSending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Yuborish
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {codeSent && !isVerified && (
        <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Label htmlFor="verification-code">Tasdiqlash Kodi</Label>
          <div className="flex gap-2">
            <Input
              id="verification-code"
              type="text"
              placeholder="6 raqamli kod"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifying || verificationCode.length !== 6}
              className="shrink-0"
            >
              {isVerifying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Tasdiqlash"
              )}
            </Button>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Telegram botdan kelgan 6 raqamli kodni kiriting
          </p>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleSendCode}
            disabled={isSending}
            className="p-0 h-auto text-xs"
          >
            Kodni qayta yuborish
          </Button>
        </div>
      )}
    </div>
  );
}
