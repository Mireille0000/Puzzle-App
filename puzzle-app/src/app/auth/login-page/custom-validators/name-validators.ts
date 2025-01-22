import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isCapitalized(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const capitalized = regexp.test(control.value);
    return !capitalized ? { capitalizedError: 'First letter must be in uppercase' } : null;
  };
}

export function isEnglishAlphabet(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const engAlphabet = regexp.test(control.value);
    return !engAlphabet ? { alphabetError: 'Only English alphabet letters and the hyphen (\'-\') symbol' } : null;
  };
}
