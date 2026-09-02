/**
 * Client-Side Interaction and Form State Simulator for E2E Validation
 * Models both Default Individual Flow and Inline Expandable Lawyer Verification Flow
 */

export const INDIAN_STATE_BAR_COUNCILS = [
  "Bar Council of Delhi",
  "Bar Council of Maharashtra & Goa",
  "Bar Council of Karnataka",
  "Bar Council of Tamil Nadu & Puducherry",
  "Bar Council of West Bengal",
  "Bar Council of Uttar Pradesh",
  "Bar Council of Punjab & Haryana",
  "Bar Council of Gujarat",
  "Bar Council of Rajasthan",
  "Bar Council of Kerala",
  "Bar Council of Andhra Pradesh",
  "Bar Council of Telangana",
  "Bar Council of Bihar",
  "Bar Council of Madhya Pradesh",
  "Bar Council of Odisha",
  "Bar Council of Assam Nagaland Mizoram Arunachal Pradesh & Sikkim",
  "Bar Council of Jharkhand",
  "Bar Council of Chhattisgarh",
  "Bar Council of Himachal Pradesh",
  "Bar Council of Uttarakhand",
  "Bar Council of Jammu & Kashmir",
  "Bar Council of Tripura",
  "Bar Council of Meghalaya",
  "Bar Council of Manipur"
];

export class WaitlistFormSimulator {
  constructor(initialRole = 'individual') {
    this.email = '';
    this.mobile = '';
    this.userType = (initialRole === 'lawyer') ? 'lawyer' : 'individual';
    this.isExpanded = (initialRole === 'lawyer');
    this.barCouncilState = null;
    this.enrollmentNumber = null;
    this.submitted = false;
    this.alreadyRegistered = false;
    this.error = null;
    this.fieldErrors = {};
    this.isSubmitting = false;
    this.submissionCount = 0;
  }

  setEmail(email) {
    this.email = email;
  }

  setMobile(mobile) {
    this.mobile = mobile;
  }

  setUserType(userType) {
    if (userType === 'lawyer') {
      this.userType = 'lawyer';
      this.isExpanded = true;
    } else {
      this.userType = 'individual';
      this.isExpanded = false;
    }
  }

  setBarCouncilState(state) {
    this.barCouncilState = state;
  }

  setEnrollmentNumber(num) {
    this.enrollmentNumber = num;
  }

  expandLawyerFlow() {
    this.userType = 'lawyer';
    this.isExpanded = true;
    return {
      isExpanded: true,
      userType: 'lawyer',
      ctaText: 'Join as a Lawyer →',
      secondaryLinkText: '← Back to regular waitlist'
    };
  }

  collapseToIndividualFlow() {
    this.userType = 'individual';
    this.isExpanded = false;
    return {
      isExpanded: false,
      userType: 'individual',
      ctaText: 'Join the Waitlist →',
      secondaryLinkText: 'Are you a lawyer? →'
    };
  }

  validateEmail(email = this.email) {
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return { valid: false, reason: 'Please provide a valid email address.' };
    }

    const trimmed = email.trim();
    // Standard RFC 5322 compatible email pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(trimmed)) {
      return { valid: false, reason: 'Please enter a valid email address format.' };
    }

    return { valid: true, sanitized: trimmed.toLowerCase() };
  }

  validateMobile(mobile = this.mobile) {
    if (!mobile || typeof mobile !== 'string' || mobile.trim() === '') {
      return { valid: false, reason: 'Please provide your mobile number.' };
    }

    const trimmed = mobile.trim();
    // Strip common formatting: spaces, dashes, parentheses
    const digitsOnly = trimmed.replace(/[\s\-()]/g, '');

    // Allow +91 prefix or 0 prefix or plain 10-digit number
    let coreDigits = digitsOnly;
    if (coreDigits.startsWith('+91')) {
      coreDigits = coreDigits.slice(3);
    } else if (coreDigits.startsWith('91') && coreDigits.length === 12) {
      coreDigits = coreDigits.slice(2);
    } else if (coreDigits.startsWith('0') && coreDigits.length === 11) {
      coreDigits = coreDigits.slice(1);
    }

    // Check if remaining string is exactly 10 digits starting with valid Indian mobile prefix (6-9) or standard 10 digits
    const indianMobileRegex = /^[6-9]\d{9}$/;
    const general10DigitRegex = /^\d{10}$/;

    if (!general10DigitRegex.test(coreDigits)) {
      return { valid: false, reason: 'Please enter a valid 10-digit mobile number.' };
    }

    return { valid: true, sanitized: coreDigits, formatted: `+91 ${coreDigits.slice(0, 5)} ${coreDigits.slice(5)}` };
  }

  validateLawyerFields(barCouncilState = this.barCouncilState, enrollmentNumber = this.enrollmentNumber) {
    if (this.userType !== 'lawyer') {
      return { valid: true, barCouncilState: null, enrollmentNumber: null };
    }

    if (!barCouncilState || typeof barCouncilState !== 'string' || barCouncilState.trim() === '') {
      return { valid: false, reason: 'Please select your State Bar Council.' };
    }

    const trimmedState = barCouncilState.trim();
    if (!INDIAN_STATE_BAR_COUNCILS.includes(trimmedState)) {
      return { valid: false, reason: 'Please select a valid Indian State Bar Council.' };
    }

    if (!enrollmentNumber || typeof enrollmentNumber !== 'string' || enrollmentNumber.trim() === '') {
      return { valid: false, reason: 'Please provide your Bar Council Enrollment Number.' };
    }

    const trimmedEnrollment = enrollmentNumber.trim().toUpperCase();

    return {
      valid: true,
      barCouncilState: trimmedState,
      enrollmentNumber: trimmedEnrollment
    };
  }

  validate() {
    this.fieldErrors = {};
    const emailResult = this.validateEmail(this.email);
    if (!emailResult.valid) {
      this.fieldErrors.email = emailResult.reason;
    }

    const mobileResult = this.validateMobile(this.mobile);
    if (!mobileResult.valid) {
      this.fieldErrors.mobile = mobileResult.reason;
    }

    let lawyerResult = { valid: true, barCouncilState: null, enrollmentNumber: null };
    if (this.userType === 'lawyer') {
      lawyerResult = this.validateLawyerFields(this.barCouncilState, this.enrollmentNumber);
      if (!lawyerResult.valid) {
        this.fieldErrors.lawyer = lawyerResult.reason;
      }
    }

    const isValid = emailResult.valid && mobileResult.valid && lawyerResult.valid;
    return {
      valid: isValid,
      errors: this.fieldErrors,
      payload: isValid ? {
        email: emailResult.sanitized,
        mobile: mobileResult.sanitized,
        user_type: this.userType,
        bar_council_state: lawyerResult.barCouncilState,
        enrollment_number: lawyerResult.enrollmentNumber,
        source: 'waitlist_page'
      } : null
    };
  }

  async submit(mockApiHandler = null) {
    if (this.isSubmitting) {
      return { success: false, reason: 'Already submitting' };
    }

    this.submissionCount++;
    const validation = this.validate();

    if (!validation.valid) {
      const firstError = Object.values(this.fieldErrors)[0];
      this.error = firstError;
      return {
        success: false,
        error: this.error,
        fieldErrors: this.fieldErrors,
        submitted: false
      };
    }

    this.isSubmitting = true;
    this.error = null;

    // Simulate network delay
    await new Promise(r => setTimeout(r, 20));

    if (mockApiHandler) {
      try {
        const response = await mockApiHandler(validation.payload);
        this.isSubmitting = false;
        if (response.alreadyRegistered) {
          this.alreadyRegistered = true;
          this.submitted = true;
          return {
            success: true,
            alreadyRegistered: true,
            payload: validation.payload,
            message: "You're already on the waitlist! We'll keep you updated."
          };
        }
        if (!response.success) {
          this.error = response.error || 'Submission failed';
          return { success: false, error: this.error, submitted: false };
        }
      } catch (err) {
        this.isSubmitting = false;
        this.error = err.message;
        return { success: false, error: this.error, submitted: false };
      }
    }

    this.submitted = true;
    this.isSubmitting = false;

    return {
      success: true,
      email: validation.payload.email,
      mobile: validation.payload.mobile,
      user_type: validation.payload.user_type,
      bar_council_state: validation.payload.bar_council_state,
      enrollment_number: validation.payload.enrollment_number,
      verification_status: validation.payload.user_type === 'lawyer' ? 'pending' : null,
      submitted: true,
      successMessage: "You're on the list. Thanks for joining MyLaw. We'll let you know when we're ready."
    };
  }

  reset() {
    this.email = '';
    this.mobile = '';
    this.userType = 'individual';
    this.isExpanded = false;
    this.barCouncilState = null;
    this.enrollmentNumber = null;
    this.submitted = false;
    this.alreadyRegistered = false;
    this.error = null;
    this.fieldErrors = {};
    this.isSubmitting = false;
  }
}
