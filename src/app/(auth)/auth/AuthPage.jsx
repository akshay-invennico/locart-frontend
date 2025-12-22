"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  sendForgotPassword,
  verifyResetToken,
  performResetPassword,
} from "../../../state/auth/authSlice";
import Spinner from "../../../components/common/Spinner";

// Import sub views
import LoginForm from "../../../modules/auth/LoginForm";
import ForgetPasswordForm from "../../../modules/auth/ForgetPasswordForm";
import ResetPasswordForm from "../../../modules/auth/ResetPasswordForm";
import ResetSuccessForm from "../../../modules/auth/ResetSuccessForm";
import { useUserContext } from "@/hooks/useUserContext";

const AuthPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { status } = useSelector((state) => state.auth);
  const [currentView, setCurrentView] = searchParams.get("token")
    ? useState("reset-password")
    : useState("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [token, setToken] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useUserContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setCurrentView("login");
      setLoading(false);
      return;
    }

    setToken(tokenFromUrl);
    dispatch(verifyResetToken(tokenFromUrl))
      .unwrap()
      .then(() => {
        toast.success("User verified");
        setCurrentView("reset-password");
      })
      .catch((err) => {
        setCurrentView("login");
      })
      .finally(() => setLoading(false));
  }, [dispatch, searchParams]);

  // Handlers
  const handleLogin = async (data) => {
    try {
      const res = await dispatch(loginUser(data)).unwrap();
      setUser(res.user);
      const redirectTo = "/" || res?.redirect;
      router.push(redirectTo);
      toast.success(res?.message || "Login successful");
    } catch (err) {
      const msg = err?.message || "Login failed";
      toast.error(msg);
    }
  };

  const handleForgotPassword = async (data) => {
    try {
      const email = data?.email || "";
      setForgotEmail(email);
      const res = await dispatch(sendForgotPassword(email)).unwrap();
      toast.success(res?.message || "Reset link sent");
      setCurrentView("reset-success");
    } catch (err) {
      const msg = err?.message || "Failed to send reset link";
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (!forgotEmail) {
      toast.error("No email to resend");
      return;
    }
    try {
      const res = await dispatch(sendForgotPassword(forgotEmail)).unwrap();
      toast.success(res?.message || "Reset link resent");
    } catch (err) {
      const msg = err?.message || "Failed to resend link";
      toast.error(msg);
    }
  };

  const handleResetPassword = async (data) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await dispatch(
        performResetPassword({ token, password: data.password })
      ).unwrap();
      toast.success(res?.message || "Password reset successfully");
      router.push("/auth");
      setCurrentView("login");
    } catch (err) {
      toast.error(err?.message || "Failed to reset password");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const renderForm = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            register={register}
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            emailFocused={emailFocused}
            setEmailFocused={setEmailFocused}
            passwordFocused={passwordFocused}
            setPasswordFocused={setPasswordFocused}
            handleSubmit={handleSubmit}
            handleLogin={handleLogin}
            setCurrentView={setCurrentView}
          />
        );
      case "forgot-password":
        return (
          <ForgetPasswordForm
            register={register}
            errors={errors}
            emailFocused={emailFocused}
            setEmailFocused={setEmailFocused}
            // handleSubmit={handleSubmit}
            onSubmit={handleForgotPassword}
            onBack={() => setCurrentView("login")}
            handleForgotPassword={handleForgotPassword}
            setCurrentView={setCurrentView}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordForm
            register={register}
            errors={errors}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            passwordFocused={passwordFocused}
            setPasswordFocused={setPasswordFocused}
            confirmPasswordFocused={confirmPasswordFocused}
            setConfirmPasswordFocused={setConfirmPasswordFocused}
            // handleSubmit={handleSubmit}

            onSubmit={handleResetPassword}
            onBack={() => setCurrentView("login")}
            handleResetPassword={handleResetPassword}
            setCurrentView={setCurrentView}
          />
        );
      case "reset-success":
        return (
          <ResetSuccessForm
            onBack={() => setCurrentView("login")}
            onResend={handleResend}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4">
      {/* Spacer for logo height */}
      <div className="mt-12 sm:mt-16 h-12 sm:h-14"></div>

      {/* Form container */}
      <div className="w-full max-w-[420px] mt-8 sm:mt-12">{renderForm()}</div>
    </div>
  );
};

export default AuthPage;
