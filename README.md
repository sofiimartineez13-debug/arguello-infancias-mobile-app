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

## Estado — Unidad I

Entrega del avance correspondiente a la Unidad I: estructura del proyecto, componentes y
navegación funcionando sobre **datos estáticos (mock)**.

- ✅ Aplicación navegable: login → pestañas (Inicio · Residentes · Mi turno · Crítica · Perfil)
- ✅ Componentes reutilizables y tipados que reciben datos por props
  (`ResidentCard`, `ActivityCard`, `AlertCard`, botones, estados de carga/vacío/error)
- ✅ Datos estáticos organizados por entidad en `src/data/`
- ✅ Layouts con `View`, `Text`, `Image`, `ScrollView` y `FlatList`
  (p. ej. `src/app/(tabs)/residentes.tsx`, `src/app/(tabs)/inicio.tsx`, `src/components/ResidentCard.tsx`)
- ✅ Estado global con Zustand y capa de datos con React Query
- ✅ TypeScript en modo estricto; tipos del dominio en `src/types/`
- ✅ Control de acceso por rol (RBAC) en el listado de residentes (educador vs. coordinador)

| Funcionalidad | Estado en Unidad I |
|---|---|
| F1 — Consultar residentes | ✅ navegable (listado con RBAC + detalle con pestañas) |
| F2 — Registrar novedades | ⬜ tipos y validación listos; vista de solo lectura |
| F3 — Consultar historial | 🟡 timeline de solo lectura visible |
| F4 — Registrar actividades | ⬜ tipos y validación listos; tarjetas y lista visibles |
| F5 — Consultar turno | 🟡 pantalla "Mi turno" con resumen mock |
| F6 — Situación crítica | 🟡 pantalla de advertencia diferenciada; formulario pendiente |

## Features previstas (próximas unidades)

1. **F1** — búsqueda y filtrado de residentes.
2. **F2** — formulario de novedades (categoría + descripción) con persistencia.
3. **F3** — historial de seguimiento filtrable por fecha y tipo.
4. **F4** — alta de actividades y marcado de realizadas.
5. **F5** — resumen consolidado del turno (residentes, novedades 24 h, tareas pendientes).
6. **F6** — reporte de situación crítica con registro de auditoría.
7. Integración con backend (Supabase / API REST) y autenticación real.

## Instalación y ejecución

Requisitos: Node.js 20+, npm y la app **Expo Go** en el dispositivo (o un emulador Android / simulador iOS).

```bash
npm install
npx expo start
```

Luego escaneá el QR con Expo Go, o presioná `a` (Android), `i` (iOS) o `w` (web) en la terminal.

### Credenciales de demostración

```
usuario@test.com
password123
```

Usuario: **Lucía Fernández**, rol educador (`src/data/usuarios.ts`).

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
  hooks/                 useResidents, useObservations, useActivities, useShiftInfo, useAuth
  lib/                   validation (Zod), storage, supabase (stub), query-client
  store/                 Zustand: authStore, residentStore, uiStore
  types/                 modelos del dominio (residente, novedad, actividad, turno, ...)
  data/                  datos estáticos mock (residentes, novedades, actividades, turno, usuarios)
  utils/                 constants (enums y labels), formatters (fecha/hora es-AR, edad)
  global.css             directivas de Tailwind
design-tokens.json       paleta y tipografía (consumido por tailwind.config.js)
```

## Stack tecnológico

- **Expo SDK 57** + **React Native 0.86** + **TypeScript** (modo estricto)
- **Expo Router** — navegación basada en archivos, typed routes
- **NativeWind v4** + **Tailwind CSS 3** — estilos con `className`
- **Zustand** — estado global
- **React Query** (`@tanstack/react-query`) — capa de data fetching
- **Zod** — validación de formularios
- **AsyncStorage** / **expo-secure-store** — persistencia local
- **Supabase** (`@supabase/supabase-js`) — cliente configurado, aún sin usar (datos mock)
- Tipografía **Poppins**

## Diseño

- Paleta institucional: azul `#007AFF` (primario) y púrpura `#7C3AED` (secundario); rojo `#FF3B30`
  para acciones críticas.
- Escala tipográfica y espaciado definidos en `design-tokens.json`.
- Objetivo de accesibilidad: contraste WCAG AA.
