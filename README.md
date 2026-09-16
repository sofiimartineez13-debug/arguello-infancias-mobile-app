# Argüello Infancias Mobile

Aplicación móvil para el **acompañamiento diario de niños, niñas y adolescentes (NNA)** en
residencias bajo protección judicial. Es el complemento móvil del sistema de gestión
institucional "Argüello Infancias", pensada para que el personal que realiza el acompañamiento
diario acceda y registre información durante su turno.

## Integrantes

- Lozano Melani
- Galvan Camila
- Martinez Sofia
- Huansi Jordy

## Materia

Laboratorio 2 (61N) — Instituto Cervantes.
Proyecto desarrollado mediante Aprendizaje Basado en Proyectos (ABP).


## Temática

Sistema móvil de acompañamiento diario de NNA en residencias de protección judicial. El MVP
contempla seis funcionalidades: consultar residentes asignados, registrar novedades, consultar
historial de seguimiento, registrar actividades diarias, consultar turno y tareas del día, y
reportar situaciones críticas.

## Estado actual

Las 6 funcionalidades del MVP están completas y conectadas a datos reales (Supabase):

- ✅ Aplicación navegable: login → pestañas (Inicio · Residentes · Mi turno · Crítica · Perfil)
- ✅ Componentes reutilizables y tipados que reciben datos por props
  (`ResidentCard`, `ActivityCard`, `AlertCard`, botones, campos de formulario, estados de carga/vacío/error)
- ✅ Sistema de diseño centralizado: `design-tokens.json` → Tailwind (`className`) + una capa en
  TypeScript (`src/theme/`) para los casos donde hace falta un color como string plano
- ✅ Layouts con `View`, `Text`, `Image`, `ScrollView` y `FlatList`
  (p. ej. `src/app/(tabs)/residentes.tsx`, `src/app/(tabs)/inicio.tsx`, `src/components/ResidentCard.tsx`)
- ✅ Estado global con Zustand y capa de datos con React Query
- ✅ TypeScript en modo estricto; tipos del dominio en `src/types/`
- ✅ **Autenticación real** contra el backend: sesión persistida en el dispositivo, con control
  de acceso por rol
- ✅ **Las 6 funcionalidades conectadas a datos reales** — ninguna pantalla depende ya de datos
  estáticos, salvo el horario del turno (ver nota en F5)

| Funcionalidad | Estado |
|---|---|
| F1 — Consultar residentes | ✅ conectado a datos reales (listado + detalle) |
| F2 — Registrar novedades | ✅ conectado a datos reales |
| F3 — Consultar historial | ✅ timeline unificado (novedades + actividades + situaciones críticas), conectado a datos reales |
| F4 — Registrar actividades | ✅ conectado a datos reales |
| F5 — Consultar turno | ✅ novedades recientes y actividades de hoy conectadas a datos reales; el horario del turno sigue como dato de ejemplo porque la tabla de turnos de personal todavía no tiene datos cargados |
| F6 — Situación crítica | ✅ conectado a datos reales, con registro de auditoría |

## Próximas mejoras

1. Tests automatizados contra los criterios de aceptación de cada funcionalidad.
2. Revisión de UI/UX de F2–F6 contra el sistema de diseño.
3. Conectar el horario real del turno una vez que existan datos cargados.
4. Resiliencia básica sin conexión (mostrar el último dato en caché) y paginación en listas largas.

## Instalación y ejecución

Requisitos: Node.js 20+, npm y la app **Expo Go** en el dispositivo (o un emulador Android / simulador iOS).

```bash
npm install
cp .env.example .env   # completar con la URL y anon key del proyecto (pedirlas al equipo)
npx expo start
```

Luego escaneá el QR con Expo Go, o presioná `a` (Android), `i` (iOS) o `w` (web) en la terminal.

### Acceso

El login ya es real (no un usuario de prueba fijo): requiere una cuenta provista por el equipo en
el backend del proyecto. Pedir credenciales de prueba a Jordy.

### Verificaciones

```bash
npm run typecheck    # tipos (tsc --noEmit)
npm run lint         # linting (expo lint)
npx expo-doctor      # salud del proyecto
```

## Estructura de carpetas

```
src/
  app/                     rutas (Expo Router, file-based)
    (auth)/login.tsx       pantalla de login
    (tabs)/                Inicio · Residentes · Mi turno · Crítica · Perfil
    residentes/[id].tsx    detalle del residente (Info / Novedades / Historial / Actividades)
    nueva-novedad.tsx      alta de novedad (F2)
    nueva-actividad.tsx    alta de actividad (F4)
    situacion-critica.tsx  reporte de situación crítica (F6)
    historial-detalle.tsx  detalle de una entrada del historial (F3)
  components/              UI reutilizable
    ui/                    PrimaryButton, SecondaryButton, CriticalButton, StatusBadge, FormField, ScreenHeader
    common/                LoadingState, EmptyState, ErrorState
    ResidentCard.tsx  ActivityCard.tsx  AlertCard.tsx
  hooks/                   una query/mutación de React Query por entidad real (useResidents,
                           useObservations, useActivities, useCriticalIncidents, useShiftInfo, useAuth)
  lib/                     validation (Zod), storage (AsyncStorage + SecureStore), supabase (cliente real), query-client
  store/                   Zustand: authStore (sesión real), residentStore, uiStore
  types/                   modelos del dominio, alineados a las tablas reales de Supabase
  data/                    quedan solo los mocks que no tienen tabla real que consultar todavía
                           (horario del turno) o que nunca la necesitaron (usuario demo del login)
  utils/                   constants (enums y labels), formatters (fecha/hora es-AR, edad)
  theme/                   wrapper en TypeScript de design-tokens.json (colores, tipografía, espaciado)
  global.css               directivas de Tailwind
design-tokens.json         paleta y tipografía (consumido por tailwind.config.js y src/theme/)
```

## Stack tecnológico

- **Expo SDK 57** + **React Native 0.86** + **TypeScript** (modo estricto)
- **Expo Router** — navegación basada en archivos, typed routes
- **NativeWind v4** + **Tailwind CSS 3** — estilos con `className`
- **Zustand** — estado global
- **React Query** (`@tanstack/react-query`) — capa de data fetching
- **Zod** — validación de formularios
- **AsyncStorage** / **expo-secure-store** — persistencia local
- **Supabase** (`@supabase/supabase-js`) — backend real: autenticación y las 6 funcionalidades
  (F1–F6) ya conectadas; sesión persistida en `expo-secure-store`.
- Tipografía **Poppins**

## Diseño

- Paleta institucional: azul `#007AFF` (primario) y púrpura `#7C3AED` (secundario); rojo `#FF3B30`
  para acciones críticas.
- Escala tipográfica y espaciado definidos en `design-tokens.json`.
- Objetivo de accesibilidad: contraste WCAG AA.
