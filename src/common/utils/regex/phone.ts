export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
}

export const phoneRegex = /^$$\d{2}$$ \d{4,5}-\d{4}$/;
