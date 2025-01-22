import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasUppercaseLetter(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const uppercaseLetter = regexp.test(control.value);
    return !uppercaseLetter ? { uppercaseLetterError: 'At least one uppercase English letter' } : null;
  };
}

export function hasLowercaseLetter(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const lowercaseLetter = regexp.test(control.value);
    return !lowercaseLetter ? { lowercaseLetterError: 'At least one lowercase English letter' } : null;
  };
}

export function hasDigit(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const digit = regexp.test(control.value);
    return !digit ? { digitError: 'At least one digit' } : null;
  };
}

export function hasSpecialCharacter(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const specialCharacter = regexp.test(control.value);
    return !specialCharacter ? { specialCharacterError: 'At least one special character' } : null;
  };
}
