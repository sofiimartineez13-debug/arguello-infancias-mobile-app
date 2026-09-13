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

Punto de partida (Unidad I): estructura del proyecto, componentes y navegación funcionando
sobre datos estáticos (mock). Desde entonces se sumó un sistema de diseño centralizado y se
conectó la autenticación y el listado de residentes (F1) a datos reales.

- ✅ Aplicación navegable: login → pestañas (Inicio · Residentes · Mi turno · Crítica · Perfil)
- ✅ Componentes reutilizables y tipados que reciben datos por props
  (`ResidentCard`, `ActivityCard`, `AlertCard`, botones, campos de formulario, estados de carga/vacío/error)
- ✅ Sistema de diseño centralizado: `design-tokens.json` → Tailwind (`className`) + una capa en
  TypeScript (`src/theme/`) para los casos donde hace falta un color como string plano
- ✅ Layouts con `View`, `Text`, `Image`, `ScrollView` y `FlatList`
  (p. ej. `src/app/(tabs)/residentes.tsx`, `src/app/(tabs)/inicio.tsx`, `src/components/ResidentCard.tsx`)
- ✅ Estado global con Zustand y capa de datos con React Query
- ✅ TypeScript en modo estricto; tipos del dominio en `src/types/`
- ✅ **Autenticación real** contra el backend (antes era un login simulado): sesión persistida en
  el dispositivo, con control de acceso por rol
- ✅ **F1 (Residentes) conectado a datos reales** del backend — el listado y el detalle ya no usan
  datos estáticos

| Funcionalidad | Estado |
|---|---|
| F1 — Consultar residentes | ✅ conectado a datos reales (listado + detalle) |
| F2 — Registrar novedades | ⬜ tipos y validación listos; vista de solo lectura sobre datos mock |
| F3 — Consultar historial | 🟡 timeline de solo lectura visible (datos mock) |
| F4 — Registrar actividades | ⬜ tipos y validación listos; tarjetas y lista visibles (datos mock) |
| F5 — Consultar turno | 🟡 pantalla "Mi turno" con resumen mock |
| F6 — Situación crítica | 🟡 pantalla de advertencia diferenciada; formulario pendiente |

## Features previstas (próximas unidades)

1. **F1** — búsqueda, filtrado y paginación de residentes.
2. **F2** — formulario de novedades (categoría + descripción) con persistencia real, y filtro por categoría en la vista de solo lectura.
3. **F3** — historial de seguimiento filtrable por fecha y tipo.
4. **F4** — alta de actividades y marcado de realizadas, conectado a datos reales.
5. **F5** — resumen consolidado del turno (residentes, novedades 24 h, tareas pendientes), conectado a datos reales.
6. **F6** — reporte de situación crítica con registro de auditoría.

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
  app/                   rutas (Expo Router, file-based)
    (auth)/login.tsx     pantalla de login
    (tabs)/              Inicio · Residentes · Mi turno · Crítica · Perfil
    residentes/[id].tsx  detalle del residente (Info / Novedades / Historial / Actividades)
  components/            UI reutilizable
    ui/                  PrimaryButton, SecondaryButton, CriticalButton, StatusBadge, FormField, ScreenHeader
    common/              LoadingState, EmptyState, ErrorState
    ResidentCard.tsx  ActivityCard.tsx  AlertCard.tsx
  hooks/                 useResidents (real), useObservations, useActivities, useShiftInfo (mock), useAuth
  lib/                   validation (Zod), storage (AsyncStorage + SecureStore), supabase (cliente real), query-client
  store/                 Zustand: authStore (sesión real), residentStore, uiStore
  types/                 modelos del dominio (residente, novedad, actividad, turno, ...)
  data/                  datos estáticos mock — F2/F4/F5, todavía sin conectar (residentes/usuarios quedan
                         solo como fuente de esos mocks; F1 ya no los usa)
  utils/                 constants (enums y labels), formatters (fecha/hora es-AR, edad)
  theme/                 wrapper en TypeScript de design-tokens.json (colores, tipografía, espaciado)
  global.css             directivas de Tailwind
design-tokens.json       paleta y tipografía (consumido por tailwind.config.js y src/theme/)
```

## Stack tecnológico

- **Expo SDK 57** + **React Native 0.86** + **TypeScript** (modo estricto)
- **Expo Router** — navegación basada en archivos, typed routes
- **NativeWind v4** + **Tailwind CSS 3** — estilos con `className`
- **Zustand** — estado global
- **React Query** (`@tanstack/react-query`) — capa de data fetching
- **Zod** — validación de formularios
- **AsyncStorage** / **expo-secure-store** — persistencia local
- **Supabase** (`@supabase/supabase-js`) — backend real: autenticación y F1 (residentes) ya conectados;
  sesión persistida en `expo-secure-store`. F2–F6 siguen sobre datos mock mientras se conectan.
- Tipografía **Poppins**

## Diseño

- Paleta institucional: azul `#007AFF` (primario) y púrpura `#7C3AED` (secundario); rojo `#FF3B30`
  para acciones críticas.
- Escala tipográfica y espaciado definidos en `design-tokens.json`.
- Objetivo de accesibilidad: contraste WCAG AA.
