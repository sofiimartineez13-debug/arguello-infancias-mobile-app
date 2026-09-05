import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertCard } from '@/components/AlertCard';
import { FormField } from '@/components/ui/FormField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { fieldErrors, LoginSchema } from '@/lib/validation';
import { MOCK_LOGIN_HINT } from '@/utils/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setFormError(null);
    const parsed = LoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await login(parsed.data.email, parsed.data.password);
    setSubmitting(false);
    if (!result.ok) setFormError(result.error);
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName="grow justify-center gap-6 px-6 py-10"
          keyboardShouldPersistTaps="handled">
          <View className="items-center gap-2">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-arguello-blue">
              <Text className="font-bold text-h2 text-white">A</Text>
            </View>
            <Text className="font-bold text-h1 text-ink">Argüello Infancias</Text>
            <Text className="text-center text-body-sm text-ink-secondary">
              Acompañamiento diario en la residencia
            </Text>
          </View>

          {formError ? <AlertCard variant="error" title="No se pudo ingresar" message={formError} /> : null}

          <View className="gap-4">
            <FormField
              label="Correo"
              required
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="tu@correo.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              inputMode="email"
              returnKeyType="next"
            />
            <FormField
              label="Contraseña"
              required
              secure
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder="••••••••"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
          </View>

          <PrimaryButton label="Ingresar" loading={submitting} onPress={onSubmit} />

          <Text className="text-center text-caption text-ink-secondary">
            Demo — usá {MOCK_LOGIN_HINT}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
