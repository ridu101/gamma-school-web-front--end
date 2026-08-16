const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(value) {
  return String(value).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

export function toEn(value) {
  return String(value).replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
}
