import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertCard } from '@/components/AlertCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { TextAreaField } from '@/components/ui/TextAreaField';
import { useAuth } from '@/hooks/useAuth';
import { useCreateActivity } from '@/hooks/useActivities';
import { useResident } from '@/hooks/useResidents';
import { ActivitySchema, fieldErrors } from '@/lib/validation';
import { formatFechaHora } from '@/utils/formatters';
import {
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  type ActivityStatus,
  type ActivityType,
} from '@/utils/constants';

const TYPE_OPTIONS: SelectOption[] = Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const STATUS_OPTIONS: SelectOption[] = Object.entries(ACTIVITY_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

type Step = 'form' | 'confirm' | 'success';

export default function NuevaActividadScreen() {
  const { minorId } = useLocalSearchParams<{ minorId: string }>();
  const { user } = useAuth();
  const { data: resident, isLoading, isError, refetch } = useResident(minorId);
  const createActivity = useCreateActivity();

  const [step, setStep] = useState<Step>('form');
  const [tipo, setTipo] = useState<ActivityType | undefined>(undefined);
  const [status, setStatus] = useState<ActivityStatus | undefined>(undefined);
  const [observaciones, setObservaciones] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ScreenHeader title="Nueva actividad" />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (isError || !resident) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ScreenHeader title="Nueva actividad" />
        <ErrorState title="No se encontró el residente" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const residentName = `${resident.nombre} ${resident.apellido}`;
  const nowLabel = formatFechaHora(new Date().toISOString());
  const usuarioLabel = user ? `${user.nombre} ${user.apellido}` : '—';

  function onCancelar() {
    router.back();
  }

  function onContinuar() {
    const parsed = ActivitySchema.safeParse({ nnya_id: minorId, tipo, status, observaciones });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStep('confirm');
  }

  function onGuardar() {
    setFormError(null);
    const parsed = ActivitySchema.safeParse({ nnya_id: minorId, tipo, status, observaciones });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setStep('form');
      return;
    }
    createActivity.mutate(parsed.data, {
      onSuccess: () => setStep('success'),
      onError: (error) => setFormError(error.message),
    });
  }

  if (step === 'success') {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <Ionicons name="checkmark-circle" size={40} color="#28A745" />
          </View>
          <Text className="text-center font-bold text-h2 text-ink">Actividad registrada</Text>
          <Text className="text-center text-body-md text-ink-secondary">
            Ya está disponible en las actividades de {residentName}.
          </Text>
          <SecondaryButton label="Volver" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScreenHeader title={step === 'form' ? 'Nueva actividad' : 'Confirmar actividad'} />

      {step === 'form' ? (
        <ScrollView contentContainerClassName="gap-5 px-5 pb-8 pt-4" keyboardShouldPersistTaps="handled">
          <View className="gap-1">
            <Text className="text-caption text-ink-secondary">NNA</Text>
            <Text className="text-body-md font-semibold text-ink">{residentName}</Text>
          </View>

          <SelectField
            label="Actividad"
            required
            options={TYPE_OPTIONS}
            value={tipo}
            onChange={(value) => setTipo(value as ActivityType)}
            error={errors.tipo}
            placeholder="Elegí el tipo de actividad"
          />

          <SelectField
            label="Estado"
            required
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) => setStatus(value as ActivityStatus)}
            error={errors.status}
            placeholder="Elegí el estado"
          />

          <TextAreaField
            label="Observaciones"
            value={observaciones}
            onChangeText={setObservaciones}
            error={errors.observaciones}
            placeholder="Opcional"
            numberOfLines={4}
          />

          <View className="gap-3">
            <PrimaryButton label="Continuar" onPress={onContinuar} />
            <SecondaryButton label="Cancelar" onPress={onCancelar} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerClassName="gap-5 px-5 pb-8 pt-4">
          {formError ? (
            <AlertCard variant="error" title="No se pudo guardar la actividad" message={formError} />
          ) : null}

          <View className="gap-3 rounded-lg border border-line bg-surface p-5">
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">NNA</Text>
              <Text className="text-body-md text-ink">{residentName}</Text>
            </View>
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">Actividad</Text>
              <Text className="text-body-md text-ink">{tipo ? ACTIVITY_TYPE_LABELS[tipo] : '—'}</Text>
            </View>
            <View className="gap-1">
              <Text className="text-caption text-ink-secondary">Estado</Text>
              <Text className="text-body-md text-ink">
                {status ? ACTIVITY_STATUS_LABELS[status] : '—'}
              </Text>
            </View>
            {observaciones.trim() ? (
              <View className="gap-1">
                <Text className="text-caption text-ink-secondary">Observaciones</Text>
                <Text className="text-body-md text-ink">{observaciones}</Text>
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
            <PrimaryButton label="Guardar" onPress={onGuardar} loading={createActivity.isPending} />
            <SecondaryButton
              label="Volver a editar"
              onPress={() => setStep('form')}
              disabled={createActivity.isPending}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
