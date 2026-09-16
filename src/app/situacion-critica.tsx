import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { CriticalButton } from '@/components/ui/CriticalButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { TextAreaField } from '@/components/ui/TextAreaField';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCriticalIncident } from '@/hooks/useCriticalIncidents';
import { useResidents } from '@/hooks/useResidents';
import { CriticalIncidentSchema, fieldErrors } from '@/lib/validation';
import { formatFechaHora } from '@/utils/formatters';
import { CRITICAL_INCIDENT_TYPE_LABELS, type CriticalIncidentType } from '@/utils/constants';

const TYPE_OPTIONS: SelectOption[] = Object.entries(CRITICAL_INCIDENT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

type Step = 'form' | 'confirm' | 'success';

export default function SituacionCriticaScreen() {
  const { user } = useAuth();
  const { data: residents, isLoading, isError, refetch } = useResidents();
  const createIncident = useCreateCriticalIncident();

  const [step, setStep] = useState<Step>('form');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tipo, setTipo] = useState<CriticalIncidentType | undefined>(undefined);
  const [descripcion, setDescripcion] = useState('');
  const [accionesTomadas, setAccionesTomadas] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function toggleResident(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function onContinuar() {
    const parsed = CriticalIncidentSchema.safeParse({
      nnya_ids: selectedIds,
      tipo,
      descripcion,
      acciones_tomadas: accionesTomadas.trim() || undefined,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStep('confirm');
  }

  function onConfirmar() {
    setFormError(null);
    const parsed = CriticalIncidentSchema.safeParse({
      nnya_ids: selectedIds,
      tipo,
      descripcion,
      acciones_tomadas: accionesTomadas.trim() || undefined,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setStep('form');
      return;
    }
    createIncident.mutate(parsed.data, {
      onSuccess: () => setStep('success'),
      onError: (error) => setFormError(error.message),
    });
  }

  const selectedResidents = (residents ?? []).filter((r) => selectedIds.includes(r.id));
  const nowLabel = formatFechaHora(new Date().toISOString());
  const usuarioLabel = user ? `${user.nombre} ${user.apellido}` : '—';

  if (step === 'success') {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <Ionicons name="checkmark-circle" size={40} color="#28A745" />
          </View>
          <Text className="text-center font-bold text-h2 text-ink">Situación reportada</Text>
          <Text className="text-center text-body-md text-ink-secondary">
            El reporte se guardó correctamente y ya está disponible en el historial de cada NNA.
          </Text>
          <SecondaryButton
            label="Volver a Inicio"
            onPress={() => router.replace('/(tabs)/inicio')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScreenHeader
        title={step === 'form' ? 'Reportar situación crítica' : 'Confirmar reporte crítico'}
        tone="critical"
      />

      {step === 'form' ? (
        <ScrollView contentContainerClassName="gap-5 px-5 pb-8 pt-4" keyboardShouldPersistTaps="handled">
          <View className="gap-1.5">
            <Text className="font-medium text-body-sm text-ink">
              NNA involucrado(s) <Text className="text-critical">*</Text>
            </Text>

            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : (residents ?? []).length === 0 ? (
              <EmptyState icon="people-outline" title="No hay residentes para seleccionar" />
            ) : (
              <View className="gap-1 rounded-md border border-line bg-surface p-2">
                {residents!.map((resident) => {
                  const checked = selectedIds.includes(resident.id);
                  return (
                    <Pressable
                      key={resident.id}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}
                      accessibilityLabel={`${resident.nombre} ${resident.apellido}`}
                      onPress={() => toggleResident(resident.id)}
                      className="flex-row items-center gap-3 rounded-md px-2 py-2.5 active:bg-canvas">
                      <Ionicons
                        name={checked ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={checked ? '#007AFF' : '#9CA3AF'}
                      />
                      <Text className="text-body-md text-ink">
                        {resident.nombre} {resident.apellido}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
            {errors.nnya_ids ? <Text className="text-caption text-critical">{errors.nnya_ids}</Text> : null}
          </View>

          <SelectField
            label="Tipo de situación"
            required
            options={TYPE_OPTIONS}
            value={tipo}
            onChange={(value) => setTipo(value as CriticalIncidentType)}
            error={errors.tipo}
            placeholder="Elegí el tipo de situación"
          />

          <TextAreaField
            label="Descripción"
            required
            value={descripcion}
            onChangeText={setDescripcion}
            error={errors.descripcion}
            placeholder="Describe la situación detalladamente"
            numberOfLines={5}
          />

          <TextAreaField
            label="Acciones tomadas"
            value={accionesTomadas}
            onChangeText={setAccionesTomadas}
            error={errors.acciones_tomadas}
            placeholder="Opcional"
            numberOfLines={3}
          />

          <CriticalButton label="Continuar" onPress={onContinuar} />
        </ScrollView>
      ) : (
        <ScrollView contentContainerClassName="gap-5 px-5 pb-8 pt-4">
          {formError ? (
            <AlertCard variant="error" title="No se pudo guardar el reporte" message={formError} />
          ) : null}

          <View className="gap-3 rounded-lg border border-line bg-surface p-5">
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">NNA involucrado(s)</Text>
              <Text className="text-body-md text-ink">
                {selectedResidents.map((r) => `${r.nombre} ${r.apellido}`).join(', ')}
              </Text>
            </View>
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">Tipo</Text>
              <Text className="text-body-md text-ink">
                {tipo ? CRITICAL_INCIDENT_TYPE_LABELS[tipo] : '—'}
              </Text>
            </View>
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">Descripción</Text>
              <Text className="text-body-md text-ink">{descripcion}</Text>
            </View>
            {accionesTomadas.trim() ? (
              <View className="gap-1">
                <Text className="text-caption text-ink-secondary">Acciones tomadas</Text>
                <Text className="text-body-md text-ink">{accionesTomadas}</Text>
              </View>
            ) : null}
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">Fecha/hora</Text>
              <Text className="text-body-md text-ink">{nowLabel}</Text>
            </View>
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">Usuario</Text>
              <Text className="text-body-md text-ink">{usuarioLabel}</Text>
            </View>
          </View>

          <View className="gap-3">
            <CriticalButton
              label="Confirmar reporte"
              onPress={onConfirmar}
              disabled={createIncident.isPending}
            />
            <SecondaryButton
              label="Volver a editar"
              onPress={() => setStep('form')}
              disabled={createIncident.isPending}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
