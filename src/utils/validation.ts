// utils/validation.ts
export const validateEmailDomain = (email: string): boolean => {
  return email.toLowerCase().endsWith('@globalalternativefunds.com');
};

export const validatePassword = (password: string) => {
  const requirements = {
    minLength: password.length >= 12,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValid = Object.values(requirements).every(Boolean);

  return { isValid, requirements };
};

export const getPasswordRequirementText = (password: string) => {
  const { requirements } = validatePassword(password);

  return [
    { key: 'minLength', text: 'At least 12 characters', met: requirements.minLength },
    { key: 'hasUpperCase', text: 'One uppercase letter', met: requirements.hasUpperCase },
    { key: 'hasLowerCase', text: 'One lowercase letter', met: requirements.hasLowerCase },
    { key: 'hasNumber', text: 'One number', met: requirements.hasNumber },
    { key: 'hasSpecialChar', text: 'One special character', met: requirements.hasSpecialChar }
  ];
};