"use client";

const ResetSuccessForm = ({ onBack, onResend }) => {
  return (
    <>
      <h3 className="font-semibold text-[#000000] mb-2 text-left text-xl sm:text-2xl md:text-3xl">
        Heads Up! Reset Link Sent
      </h3>
      <p className="text-[#7B7B7B] text-sm sm:text-base mb-4">
        We have emailed you a secure link to reset your password. Can’t find it?  
        Don’t forget to check spam or promotions.
      </p>
      <p className="text-[#7B7B7B] text-xs sm:text-sm md:text-base leading-relaxed mt-2">
        Didn’t receive the email?{" "}
        <button
          className="text-primary1 underline hover:text-teal-600"
          onClick={onResend}
        >
          Resend
        </button>
      </p>

      <div className="mt-6 w-full">
        <p className="text-center text-gray-500 text-xs leading-tight">
          Remember your password?{" "}
          <button
            className="text-primary1 cursor-pointer hover:text-teal-600 transition-colors"
            onClick={onBack}
          >
            Log in
          </button>
        </p>
      </div>
    </>
  );
};

export default ResetSuccessForm;
