export const changePasswordConfig = {
  fields: [
    {
      type: "header",
      label: "Change Your Password",
      style: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111111",
        marginBottom: "10px",
      },
    },
    {
      type: "subheader",
      text: "Change your password to keep your account secure. Make sure it's strong and unique.",
      style: {
        fontSize: "14px",
        color: "#E4E4E6",
        marginBottom: "15px",
        lineHeight: "1.5",
      },
    },
    {
      type: "divider",
      style: { borderColor: "#E4E4E6", margin: "15px 0" },
    },
    {
      type: "input",
      inputType: "password",
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter your current password",
      style: {
        fontSize: "14px",
        padding: "10px",
        marginBottom: "12px",
        borderColor: "#ccc",
      },
    },
    {
      type: "input",
      inputType: "password",
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter your new password",
      style: {
        fontSize: "14px",
        padding: "10px",
        marginBottom: "12px",
        borderColor: "#ccc",
      },
    },
    {
      type: "input",
      inputType: "password",
      name: "confirmPassword",
      label: "Confirm New Password",
      placeholder: "Confirm your new password",
      style: {
        fontSize: "14px",
        padding: "10px",
        marginBottom: "12px",
        borderColor: "#ccc",
      },
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      style: {
        backgroundColor: "#f3f3f3",
        color: "#555555",
        padding: "10px",
        borderRadius: "6px",
      },
    },
    apply: {
      label: "Update Password",
      color: "primary1",
      style: {
        backgroundColor: "#02C8DE",
        color: "#fff",
        padding: "10px",
        borderRadius: "6px",
      },
    },
  },
};
