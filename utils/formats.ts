export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-") // substitui qualquer caractere não alfanumérico por hífen
    .replace(/--+/g, "-") // evita hífens duplos
    .replace(/^-+|-+$/g, ""); // remove hífens no início/fim
}

export function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "Data não informada";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatCnpjToInput(value: string | null) {
  if (!value) return "";
  return value.replace(/\D/g, "").slice(0, 14);
}

export function formatCnpjDisplay(value: string | null) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  const formatted = digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
  return formatted || value;
}

export function formatCepToInput(value: string | null) {
  if (!value) return "";
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatCepDisplay(value: string | null) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length < 8) return digits;
  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}
