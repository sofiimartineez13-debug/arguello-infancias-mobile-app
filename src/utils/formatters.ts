/** Utilidades de formato (fechas, edad) en español rioplatense. */

export function calcularEdad(birthdate: string, now: Date = new Date()): number {
  const birth = new Date(birthdate);
  let edad = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    edad--;
  }
  return edad;
}

export function edadLabel(birthdate: string): string {
  const edad = calcularEdad(birthdate);
  return `${edad} ${edad === 1 ? 'año' : 'años'}`;
}

const dateFmt = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

export function formatFecha(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatHora(iso: string): string {
  return timeFmt.format(new Date(iso));
}

export function formatFechaHora(iso: string): string {
  return `${formatFecha(iso)} · ${formatHora(iso)}`;
}

/** Etiqueta de día para separadores del historial (F3, CA-21). */
export function formatDiaSeparador(iso: string): string {
  const label = dayFmt.format(new Date(iso));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Clave de día (YYYY-MM-DD) para agrupar registros. */
export function claveDia(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function iniciales(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Agrupa una lista ya ordenada por fecha descendente en secciones por día. */
export function agruparPorDia<T>(
  items: T[],
  getIso: (item: T) => string,
): { dia: string; label: string; items: T[] }[] {
  const grupos: { dia: string; label: string; items: T[] }[] = [];
  for (const item of items) {
    const iso = getIso(item);
    const dia = claveDia(iso);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.dia === dia) {
      ultimo.items.push(item);
    } else {
      grupos.push({ dia, label: formatDiaSeparador(iso), items: [item] });
    }
  }
  return grupos;
}
