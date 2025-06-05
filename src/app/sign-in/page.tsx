'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication flow states
  const [authStep, setAuthStep] = useState<'credentials' | 'phone_verify'>('credentials');
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  
  const router = useRouter();

  const validateEmailDomain = (email: string): boolean => {
    return email.toLowerCase().endsWith('@globalalternativefunds.com');
  };

  // Step 1: Email/Password Authentication
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!validateEmailDomain(email)) {
      setError("Only @globalalternativefunds.com email addresses are allowed.");
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Check if the user has verified their phone (optional logic)
        const userHasPhone = result?.supportedSecondFactors?.some(
          factor => factor.strategy === "phone_code"
        );

        if (userHasPhone) {
          // If a phone factor is available, prompt for it even if sign-in is 'complete'
          setError("2FA expected but skipped. Please contact support.");
        } else {
          await setActive({ session: result.createdSessionId });
          router.push("/");
        }
      } else if (result.status === "needs_first_factor") {
        // Check if phone verification is available as a first factor
        const phoneCodeFactor = result.supportedFirstFactors?.find(
          factor => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor && 'phoneNumberId' in phoneCodeFactor) {
          // Prepare phone code verification
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });
          
          // Get the masked phone number for display
          const maskedPhone = phoneCodeFactor.safeIdentifier || "your phone";
          setUserPhoneNumber(maskedPhone);
          setAuthStep('phone_verify');
          setError(null);
        } else {
          setError("Phone verification not available. Please contact support.");
        }
      } else if (result.status === "needs_second_factor") {
        // Check if phone verification is available as a second factor
        const phoneCodeFactor = result.supportedSecondFactors?.find(
          factor => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor && 'phoneNumberId' in phoneCodeFactor) {
          // Prepare phone code verification
          await signIn.prepareSecondFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });
          
          // Get the masked phone number for display
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
      
      // Try second factor first (more common for 2FA), then first factor
      if (signIn.status === "needs_second_factor") {
        signInAttempt = await signIn.attemptSecondFactor({
          strategy: 'phone_code',
          code,
        });
      } else if (signIn.status === "needs_first_factor") {
        signInAttempt = await signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code,
        });
      } else {
        setError("Invalid authentication state. Please restart the process.");
        return;
      }

      if (signInAttempt.status === 'complete') {
        // Both email/password and SMS verification successful
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

  const handleBackToCredentials = () => {
    setAuthStep('credentials');
    setCode("");
    setError(null);
    setUserPhoneNumber("");
  };

  const resendCode = async () => {
    if (!isLoaded || !signIn) return;

    try {
      // Find the phone code factor again and resend
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
      // You could show a success message here
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code.");
    }
  };

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '0.5rem'
    }}>
      {['credentials', 'phone_verify'].map((step, index) => (
        <div
          key={step}
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600',
            backgroundColor: authStep === step 
              ? '#102948' 
              : ['credentials', 'phone_verify'].indexOf(authStep) > index 
                ? '#cb8548' 
                : '#e5e7eb',
            color: authStep === step || ['credentials', 'phone_verify'].indexOf(authStep) > index 
              ? '#fdf1d8' 
              : '#6b7280'
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #102948, #1a3a5c, #cb8548, #102948)',
        backgroundSize: '400% 400%',
        animation: 'shimmer 8s ease-in-out infinite',
        padding: '1rem'
      }}>
        <form
          onSubmit={authStep === 'credentials' ? handleCredentialsSubmit : handleSMSVerification}
          style={{
            backgroundColor: '#fdf1d8',
            boxShadow: '0 25px 50px -12px rgba(16, 41, 72, 0.4)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '24rem',
            border: '1px solid rgba(203, 133, 72, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textAlign: 'center',
            backgroundImage: 'linear-gradient(135deg, #102948, #cb8548)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Fund Lens
          </h2>

          {renderStepIndicator()}

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              padding: '0.75rem',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {authStep === 'credentials' ? (
            <>
              <p style={{
                color: '#102948',
                fontSize: '0.875rem',
                textAlign: 'center',
                marginBottom: '2rem',
                opacity: 0.8
              }}>
                Enter your credentials to sign in
              </p>

              <label style={{ display: 'block', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#102948', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="x@globalalternativefunds.com"
                  style={{
                    padding: '0.75rem',
                    width: '100%',
                    border: `2px solid ${!validateEmailDomain(email) && email ? '#ef4444' : '#cb8548'}`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: 'white'
                  }}
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

              <label style={{ display: 'block', marginBottom: '2rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#102948', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Password</span>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      padding: '0.75rem 3rem 0.75rem 0.75rem',
                      width: '100%',
                      border: '2px solid #cb8548',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = '#102948';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16, 41, 72, 0.1)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = '#cb8548';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      color: '#cb8548',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
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

              <button
                type="submit"
                disabled={!validateEmailDomain(email) || !password}
                style={{
                  width: '100%',
                  background: (validateEmailDomain(email) && password)
                    ? 'linear-gradient(135deg, #102948 0%, #cb8548 100%)'
                    : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  color: '#fdf1d8',
                  fontWeight: '600',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: (validateEmailDomain(email) && password) ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: (validateEmailDomain(email) && password)
                    ? '0 4px 15px rgba(16, 41, 72, 0.4)'
                    : '0 4px 15px rgba(107, 114, 128, 0.4)',
                  opacity: (validateEmailDomain(email) && password) ? 1 : 0.6
                }}
                onMouseOver={(e) => {
                  if (validateEmailDomain(email) && password) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(16, 41, 72, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (validateEmailDomain(email) && password) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(16, 41, 72, 0.4)';
                  }
                }}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <p style={{
                color: '#102948',
                fontSize: '0.875rem',
                textAlign: 'center',
                marginBottom: '2rem',
                opacity: 0.8
              }}>
                Enter the verification code sent to {userPhoneNumber}
              </p>

              <label style={{ display: 'block', marginBottom: '2rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#102948', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                  Verification Code
                </span>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  style={{
                    padding: '0.75rem',
                    width: '100%',
                    border: '2px solid #cb8548',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: 'white',
                    textAlign: 'center',
                    letterSpacing: '0.2em'
                  }}
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

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: '#102948',
                    fontWeight: '500',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #cb8548',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#cb8548';
                    (e.target as HTMLButtonElement).style.color = '#fdf1d8';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLButtonElement).style.color = '#102948';
                  }}
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={resendCode}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: '#102948',
                    fontWeight: '500',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #cb8548',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#cb8548';
                    (e.target as HTMLButtonElement).style.color = '#fdf1d8';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLButtonElement).style.color = '#102948';
                  }}
                >
                  Resend
                </button>
              </div>

              <button
                type="submit"
                disabled={!code.trim()}
                style={{
                  width: '100%',
                  background: code.trim()
                    ? 'linear-gradient(135deg, #102948 0%, #cb8548 100%)'
                    : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  color: '#fdf1d8',
                  fontWeight: '600',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: code.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: code.trim()
                    ? '0 4px 15px rgba(16, 41, 72, 0.4)'
                    : '0 4px 15px rgba(107, 114, 128, 0.4)',
                  opacity: code.trim() ? 1 : 0.6
                }}
                onMouseOver={(e) => {
                  if (code.trim()) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(16, 41, 72, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (code.trim()) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(16, 41, 72, 0.4)';
                  }
                }}
              >
                Verify & Sign In
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
}