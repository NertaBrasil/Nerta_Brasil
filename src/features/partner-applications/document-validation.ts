function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function hasAllDigitsEqual(digits: string): boolean {
  return digits.split("").every((digit) => digit === digits[0]);
}

function calculateCheckDigit(digits: string, weights: number[]): number {
  const sum = digits
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11 || hasAllDigitsEqual(digits)) return false;

  const firstCheckDigit = calculateCheckDigit(
    digits.slice(0, 9),
    [10, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const secondCheckDigit = calculateCheckDigit(
    digits.slice(0, 9) + firstCheckDigit,
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return digits === digits.slice(0, 9) + String(firstCheckDigit) + String(secondCheckDigit);
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14 || hasAllDigitsEqual(digits)) return false;

  const firstCheckDigit = calculateCheckDigit(
    digits.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const secondCheckDigit = calculateCheckDigit(
    digits.slice(0, 12) + firstCheckDigit,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return digits === digits.slice(0, 12) + String(firstCheckDigit) + String(secondCheckDigit);
}
