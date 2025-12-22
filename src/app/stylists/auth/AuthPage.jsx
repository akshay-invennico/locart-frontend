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
import LoginForm from "./LoginForm";
import ForgetPasswordForm from "./ForgetPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetSuccessForm from "./ResetSuccessForm";

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
      toast.error("Invalid or expired link");
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
        toast.error(err?.message || "Invalid or expired link");
        setCurrentView("login");
      })
      .finally(() => setLoading(false));
  }, [dispatch, searchParams]);

  if (loading) {
    return <Spinner />;
  }

  // Handlers
  const handleLogin = async (data) => {
    try {
      const res = await dispatch(loginUser(data)).unwrap();
      toast.success(res?.message || "Login successful");
      const redirectTo = "/" || res?.redirect;
      router.push(redirectTo);
    } catch (err) {
      const msg = err?.message || "Login failed";
      toast.error(msg);
    }
  };

  const handleForgotPassword = async (data) => {
    console.log(data, "handle forgot password");
  };

  const handleResend = async () => {
    console.log("handle resend");
  };

  const handleResetPassword = async (data) => {
    console.log(data, "handle reset password");
  };

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
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50 px-4">
      {/* Spacer for logo height */}
      <div className="mt-12 sm:mt-16 h-12 sm:h-14"></div>

      {/* Form container */}
      <div className="w-full max-w-[420px] mt-8 sm:mt-12">{renderForm()}</div>
    </div>
  );
};

export default AuthPage;
