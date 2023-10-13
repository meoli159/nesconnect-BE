let resetPasswordTemplate = (email, userId, forgotPasswordToken,gmail) => {
  const emailTemplate = {
    from: `"Nes-Connect" < ${gmail} >`,
    to: email,
    subject: "Password reset for " + email,
    text:
      "Password Reset Link: " +
      "https://nesconnect.xyz" +
      `/resetpassword` +
      `/${userId}/${forgotPasswordToken}`,
  };
  return emailTemplate;
};

module.exports = { resetPasswordTemplate };
