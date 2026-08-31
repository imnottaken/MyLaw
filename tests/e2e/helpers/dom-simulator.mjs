/**
 * Client-Side Interaction and Form State Simulator for E2E Validation
 */

export class WaitlistFormSimulator {
  constructor(initialRole = null) {
    this.email = '';
    this.role = initialRole;
    this.submitted = false;
    this.error = null;
    this.isSubmitting = false;
    this.submissionCount = 0;
  }

  setEmail(email) {
    this.email = email;
  }

  setRole(role) {
    if (role === 'individual' || role === 'lawyer' || role === 'help' || role === null) {
      this.role = role;
    }
  }

  validateEmail(email = this.email) {
    if (!email || email.trim() === '') {
      return { valid: false, reason: 'Email is required' };
    }

    const trimmed = email.trim();
    // HTML5 Standard email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(trimmed)) {
      return { valid: false, reason: 'Invalid email format' };
    }

    return { valid: true, sanitized: trimmed };
  }

  async submit() {
    this.submissionCount++;
    const validation = this.validateEmail(this.email);

    if (!validation.valid) {
      this.error = validation.reason;
      return {
        success: false,
        error: this.error,
        submitted: false
      };
    }

    this.isSubmitting = true;
    this.email = validation.sanitized;

    // Simulate micro-delay transition
    await new Promise(r => setTimeout(r, 50));

    this.submitted = true;
    this.isSubmitting = false;
    this.error = null;

    return {
      success: true,
      email: this.email,
      role: this.role,
      submitted: true,
      successMessage: "You're on the list. Thanks for joining MyLaw. We'll let you know when we're ready."
    };
  }
}
