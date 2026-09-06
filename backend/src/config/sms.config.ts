/** Enable SMS OTP phone verification (Arkesel). Off until the API key is set. */
export function isPhoneSmsVerificationEnabled(): boolean {
  return process.env.SMS_PHONE_VERIFICATION_ENABLED === 'true';
}
