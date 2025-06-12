'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import './sign-in.css';
import {validateEmailDomain, validatePassword, getPasswordRequirementText} from "@/utils/validation";
import PasswordRequirements from "@/components/PasswordRequirements";
import StepIndicator from "@/components/StepIndicator";

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [authStep, setAuthStep] = useState<'credentials' | 'phone_verify'>('credentials');
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");

  const router = useRouter();

  // Step 1: Email/Password Authentication
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!validateEmailDomain(email)) {
      setError("Only @globalalternativefunds.com email addresses are allowed.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError("Password does not meet security requirements.");
      return;
    }

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        const userHasPhone = result?.supportedSecondFactors?.some(
          factor => factor.strategy === "phone_code"
        );

        if (userHasPhone) {
          setError("2FA expected but skipped. Please contact support.");
        } else {
          await setActive({ session: result.createdSessionId });
          router.push("/");
        }
      } else if (result.status === "needs_first_factor") {
        const phoneCodeFactor = result.supportedFirstFactors?.find(
          factor => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor && 'phoneNumberId' in phoneCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });

          const maskedPhone = phoneCodeFactor.safeIdentifier || "your phone";
          setUserPhoneNumber(maskedPhone);
          setAuthStep('phone_verify');
          setError(null);
        } else {
          setError("Phone verification not available. Please contact support.");
        }
      } else if (result.status === "needs_second_factor") {
        const phoneCodeFactor = result.supportedSecondFactors?.find(
          factor => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor && 'phoneNumberId' in phoneCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });

          const maskedPhone = phoneCodeFactor.safeIdentifier || "your phone";
          setUserPhoneNumber(maskedPhone);
          setAuthStep('phone_verify');
          setError(null);
        } else {
          setError("Phone verification not available. Please contact support.");
        }
      } else {
        console.log("Unexpected sign-in result:", result);
        setError("Authentication incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign in failed.");
    }
  };

  // Step 2: SMS Code Verification
  const handleSMSVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    try {
      let signInAttempt;

      if (signIn.status === "needs_second_factor") {
        signInAttempt = await signIn.attemptSecondFactor({ strategy: 'phone_code', code });
      } else if (signIn.status === "needs_first_factor") {
        signInAttempt = await signIn.attemptFirstFactor({ strategy: 'phone_code', code });
      } else {
        setError("Invalid authentication state. Please restart the process.");
        return;
      }

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/');
      } else {
        console.error("SMS verification incomplete:", signInAttempt);
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (error && error.includes("@globalalternativefunds.com") && validateEmailDomain(newEmail)) {
      setError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (error && error.includes("Password does not meet security requirements")) {
      setError(null);
    }
  };

  const handleBackToCredentials = () => {
    setAuthStep('credentials');
    setCode("");
    setError(null);
    setUserPhoneNumber("");
  };

  const resendCode = async () => {
    if (!isLoaded || !signIn) return;

    try {
      let phoneCodeFactor;

      if (signIn.status === "needs_second_factor") {
        phoneCodeFactor = signIn.supportedSecondFactors?.find(
          factor => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor && 'phoneNumberId' in phoneCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });
        }
      } else if (signIn.status === "needs_first_factor") {
        phoneCodeFactor = signIn.supportedFirstFactors?.find(
          factor => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor && 'phoneNumberId' in phoneCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });
        }
      }

      setError(null);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code.");
    }
  };

  const hoverEffect = (enabled: boolean, el: HTMLElement) => {
    el.style.transform = enabled ? 'translateY(-2px)' : '';
    el.style.boxShadow = enabled ? '0 8px 25px rgba(16, 41, 72, 0.6)' : '';
  };

  const unhoverEffect = (enabled: boolean, el: HTMLElement) => {
    el.style.transform = enabled ? 'translateY(0)' : '';
    el.style.boxShadow = enabled ? '0 4px 15px rgba(16, 41, 72, 0.4)' : '';
  };

  const isFormValid = validateEmailDomain(email) && validatePassword(password).isValid;

  return (
    <>
      <div className="background-style">
        <form onSubmit={authStep === 'credentials' ? handleCredentialsSubmit : handleSMSVerification} className="form-modal">
          <h2 className="form-heading">Fund Lens</h2>
          <StepIndicator currentStep={authStep} />
          {error && (
            <div className="error">{error}</div>
          )}

          {authStep === 'credentials' ? (
            <>
              <p className="credentials-text">Enter your credentials to sign in</p>
              <label className="input-label-cont">
                <span className="input-label">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="x@globalalternativefunds.com"
                  className={`input-field ${!validateEmailDomain(email) && email ? 'input-field-invalid' : 'input-field-valid'}`} 
                  onFocus={(e) => {
                    if (validateEmailDomain(email) || !email) {
                      (e.target as HTMLInputElement).style.borderColor = '#102948';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 41, 72, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = !validateEmailDomain(email) && email ? '#ef4444' : '#cb8548';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                  required
                />
              </label>

              <label className="input-label-cont">
                <span className="input-label">Password</span>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`input-field ${!validateEmailDomain(email) && email ? 'input-field-invalid' : 'input-field-valid'}`}
                    onFocus={(e) => {
                      if (!password || validatePassword(password).isValid) {
                        (e.target as HTMLInputElement).style.borderColor = '#102948';
                        (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 41, 72, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = password && !validatePassword(password).isValid ? '#ef4444' : '#cb8548';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-password"
                    onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = '#102948'}
                    onMouseOut={(e) => (e.target as HTMLButtonElement).style.color = '#cb8548'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {/* Password Requirements */}
              {password && (
                <PasswordRequirements requirements={getPasswordRequirementText(password)} />
              )}

              <button
                type="submit"
                disabled={!isFormValid}
                className={`submit-button ${isFormValid ? 'submit-button-valid' : 'submit-button-invalid'}`}
                onMouseOver={(e) => hoverEffect(isFormValid, e.target as HTMLButtonElement)}
                onMouseOut={(e) => unhoverEffect(isFormValid, e.target as HTMLButtonElement)}
              >Continue</button>
            </>
          ) : (
            <>
              <p className="credentials-text">Enter the verification code sent to {userPhoneNumber}</p>

              <label className="input-label-cont">
                <span className="input-label">Verification Code</span>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="input-field"
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#102948';
                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 41, 72, 0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#cb8548';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                  maxLength={6}
                  required
                />
              </label>

              <div className="back-group">
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="flex-button"
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#cb8548';
                    (e.target as HTMLButtonElement).style.color = '#fdf1d8';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLButtonElement).style.color = '#102948';
                  }}
                >Back</button>
                
                <button
                  type="button"
                  onClick={resendCode}
                  className="flex-button"
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#cb8548';
                    (e.target as HTMLButtonElement).style.color = '#fdf1d8';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLButtonElement).style.color = '#102948';
                  }}
                >Resend</button>
              </div>

              <button
                type="submit"
                disabled={!code.trim()}
                className={`code-button ${code.trim() ? 'enabled' : 'disabled'}`}
                onMouseOver={(e) => hoverEffect(isFormValid, e.target as HTMLButtonElement)}
                onMouseOut={(e) => unhoverEffect(isFormValid, e.target as HTMLButtonElement)}
              >Verify & Sign In</button>
            </>
          )}
        </form>
      </div>
    </>
  );
}