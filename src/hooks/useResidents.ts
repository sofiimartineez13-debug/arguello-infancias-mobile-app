import { useQuery } from '@tanstack/react-query';

import type { ContactoEmergencia, Resident } from '@/types/resident';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const RESIDENT_FIELDS =
  'id, nombre, apellido, fecha_nacimiento, estado_actual, foto_url, obra_social, turno_escolar, alertas_importantes';

/**
 * F1 — Listado de residentes de la institución (no hay asignación individual
 * NNA↔educador — decisión #2 de CORRECCIONES-Y-DUDAS-PARA-MELI-SOFI.md: la
 * guardia atiende a todos). Autorización real vía RLS (Admin/Equipo Tecnico).
 * Solo `estado_actual = 'En residencia'` — es acompañamiento diario, no un
 * histórico de egresados.
 */
export function useResidents() {
  const { user } = useAuth();
  return useQuery<Resident[]>({
    queryKey: ['residents'],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('nnya')
        .select(RESIDENT_FIELDS)
        .eq('estado_actual', 'En residencia')
        .order('apellido');
      if (error) throw error;
      return (data ?? []).map((n) => ({ ...n, contacto_emergencia: null }) as Resident);
    },
  });
}

/** F1 — Detalle de un residente, con el tutor principal como contacto de emergencia. */
export function useResident(id: string | undefined) {
  const { user } = useAuth();
  return useQuery<Resident | null>({
    queryKey: ['resident', id],
    enabled: Boolean(id && user),
    queryFn: () => fetchResident(id!),
  });
}

async function fetchResident(id: string): Promise<Resident | null> {
  const supabase = getSupabase();

  const { data: nnya, error } = await supabase
    .from('nnya')
    .select(RESIDENT_FIELDS)
    .eq('id', id)
    .maybeSingle();
  // RLS puede devolver null si el usuario no tiene autorización, igual que
  // "no existe" — indistinguible a propósito, mismo mensaje en la UI.
  if (error || !nnya) return null;

  const contacto = await fetchContactoEmergencia(id);
  return { ...nnya, contacto_emergencia: contacto } as Resident;
}

/**
 * Tutor marcado `es_principal` en `nnya_tutores`. Query separada (no un
 * embed con `!inner`) para no perder la fila de `nnya` cuando todavía no
 * tiene tutor principal cargado.
 */
async function fetchContactoEmergencia(nnyaId: string): Promise<ContactoEmergencia | null> {
  const { data } = await getSupabase()
    .from('nnya_tutores')
    .select('tutores(nombre, apellido, parentesco, telefono)')
    .eq('nnya_id', nnyaId)
    .eq('es_principal', true)
    .maybeSingle();

  const tutor = data?.tutores as
    | { nombre: string; apellido: string; parentesco: string; telefono: string | null }
    | null
    | undefined;
  if (!tutor) return null;

  return {
    nombre: tutor.nombre,
    apellido: tutor.apellido,
    parentesco: tutor.parentesco,
    telefono: tutor.telefono,
  };
}
