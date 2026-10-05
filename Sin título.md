# 🔧 CORRECCIONES — Modelo de Datos Argüello Infancias Mobile

**Script SQL con todas las correcciones necesarias**

---

## 📋 RESUMEN

Este archivo contiene las correcciones SQL para implementar en Supabase.

**Prioridad:**
- 🔴 ALTA: Cambiar ON DELETE CASCADE → RESTRICT
- 🔴 ALTA: Agregar tabla audit_log
- 🟡 MEDIA: Agregar soft deletes
- 🟢 BAJA: Agregar checksums

---

## 🔴 CORRECCIÓN 1: ON DELETE CASCADE → RESTRICT (CRÍTICA)

**Problema:** Si un educador se elimina de auth.users, sus registros quedan huérfanos.

**Solución:**

```sql
-- 1. Crear nueva tabla temporal
CREATE TABLE perfiles_usuarios_new (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('educador', 'coordinador')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_auth_users FOREIGN KEY (id) 
    REFERENCES auth.users(id) ON DELETE RESTRICT
);

-- 2. Copiar datos
INSERT INTO perfiles_usuarios_new 
SELECT * FROM perfiles_usuarios;

-- 3. Eliminar constraint antiguo
ALTER TABLE perfiles_usuarios 
  DROP CONSTRAINT IF EXISTS perfiles_usuarios_id_fkey;

-- 4. Agregar nuevo constraint
ALTER TABLE perfiles_usuarios
  ADD CONSTRAINT perfiles_usuarios_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE RESTRICT;

-- Alternativa simple (si no hay datos):
ALTER TABLE perfiles_usuarios
  DROP CONSTRAINT perfiles_usuarios_id_fkey,
  ADD CONSTRAINT perfiles_usuarios_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE RESTRICT;
```

**Verificación:**
```sql
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_name = 'perfiles_usuarios';
```

**Status:** ✅ APLICAR INMEDIATAMENTE

---

## 🔴 CORRECCIÓN 2: Tabla de Auditoría Centralizada (CRÍTICA)

**Problema:** No hay registro centralizado de cambios (requisito legal).

**Solución - Crear tabla:**

```sql
-- Crear tabla audit_log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla_nombre VARCHAR(100) NOT NULL,
  registro_id UUID NOT NULL,
  operacion VARCHAR(20) NOT NULL CHECK (operacion IN ('CREATE', 'UPDATE', 'DELETE')),
  usuario_id UUID NOT NULL REFERENCES perfiles_usuarios(id) ON DELETE RESTRICT,
  datos_antes JSONB NULL,
  datos_despues JSONB NULL,
  fecha_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  direccion_ip INET NULL,
  user_agent TEXT NULL
);

-- Crear índices para performance
CREATE INDEX idx_audit_tabla_fecha ON audit_log(tabla_nombre, fecha_hora DESC);
CREATE INDEX idx_audit_usuario_fecha ON audit_log(usuario_id, fecha_hora DESC);
CREATE INDEX idx_audit_registro ON audit_log(registro_id);

-- Crear índice compuesto para queries frecuentes
CREATE INDEX idx_audit_tabla_residente ON audit_log(tabla_nombre, registro_id, fecha_hora DESC);
```

**Crear función de auditoría automática:**

```sql
-- Función que registra cambios automáticamente
CREATE FUNCTION audit_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_antes)
    VALUES (
      TG_TABLE_NAME,
      OLD.id,
      TG_OP,
      auth.uid(),
      to_jsonb(OLD)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_antes, datos_despues)
    VALUES (
      TG_TABLE_NAME,
      NEW.id,
      TG_OP,
      auth.uid(),
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_despues)
    VALUES (
      TG_TABLE_NAME,
      NEW.id,
      TG_OP,
      auth.uid(),
      to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Crear triggers en tablas críticas:**

```sql
-- Trigger para novedades (crítica para auditoría)
CREATE TRIGGER audit_novedades 
  AFTER INSERT OR UPDATE OR DELETE ON novedades 
  FOR EACH ROW 
  EXECUTE FUNCTION audit_change();

-- Trigger para situaciones críticas (requisito legal)
CREATE TRIGGER audit_situaciones_criticas 
  AFTER INSERT OR UPDATE OR DELETE ON situaciones_criticas 
  FOR EACH ROW 
  EXECUTE FUNCTION audit_change();

-- Trigger para actividades
CREATE TRIGGER audit_actividades_diarias 
  AFTER INSERT OR UPDATE OR DELETE ON actividades_diarias 
  FOR EACH ROW 
  EXECUTE FUNCTION audit_change();

-- Opcional: Trigger para residentes
CREATE TRIGGER audit_residentes 
  AFTER INSERT OR UPDATE OR DELETE ON residentes 
  FOR EACH ROW 
  EXECUTE FUNCTION audit_change();
```

**Verificar triggers:**
```sql
SELECT trigger_name, table_name, event_manipulation
FROM information_schema.triggers
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Status:** ✅ APLICAR EN FASE 2 (2-3 horas)

---

## 🟡 CORRECCIÓN 3: Soft Deletes (MEDIANA PRIORIDAD)

**Problema:** Nunca deberíamos eliminar datos de menores.

**Solución - Agregar columna deleted_at:**

```sql
-- Agregar columna a tabla residentes
ALTER TABLE residentes
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Agregar columna a tabla novedades
ALTER TABLE novedades
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Agregar columna a tabla actividades_diarias
ALTER TABLE actividades_diarias
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Agregar columna a tabla situaciones_criticas
ALTER TABLE situaciones_criticas
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;
```

**Crear función de soft delete:**

```sql
-- Función para marcar como eliminado (no eliminar realmente)
CREATE FUNCTION soft_delete_resident(resident_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE residentes
  SET deleted_at = NOW()
  WHERE id = resident_id;
END;
$$ LANGUAGE plpgsql;
```

**Crear vistas para filtrar borrados:**

```sql
-- Vista: Residentes activos (no eliminados)
CREATE VIEW v_residentes_activos AS
SELECT *
FROM residentes
WHERE deleted_at IS NULL;

-- Vista: Novedades no eliminadas
CREATE VIEW v_novedades_activas AS
SELECT *
FROM novedades
WHERE deleted_at IS NULL;

-- Vista: Actividades no eliminadas
CREATE VIEW v_actividades_activas AS
SELECT *
FROM actividades_diarias
WHERE deleted_at IS NULL;

-- Vista: Situaciones críticas no eliminadas
CREATE VIEW v_criticas_activas AS
SELECT *
FROM situaciones_criticas
WHERE deleted_at IS NULL;
```

**Actualizar RLS policies (si existen):**

```sql
-- Ejemplo (adaptar a tu política actual)
ALTER POLICY "educador_residentes_asignados" ON residentes
  USING (deleted_at IS NULL AND id IN (...));
```

**Status:** ✅ APLICAR EN FASE 2 (1 hora)

---

## 🟢 CORRECCIÓN 4: Checksums para Integridad (BAJA PRIORIDAD)

**Problema:** No verificamos integridad de registros críticos.

**Solución - Agregar checksums:**

```sql
-- Agregar columna data_checksum
ALTER TABLE novedades
ADD COLUMN data_checksum VARCHAR(64);

ALTER TABLE situaciones_criticas
ADD COLUMN data_checksum VARCHAR(64);

-- Crear función para calcular checksum
CREATE FUNCTION calc_checksum()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_checksum := encode(
    digest(
      row_to_json(NEW)::text, 
      'sha256'
    ), 
    'hex'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para checksum
CREATE TRIGGER checksum_novedades 
  BEFORE INSERT OR UPDATE ON novedades 
  FOR EACH ROW 
  EXECUTE FUNCTION calc_checksum();

CREATE TRIGGER checksum_criticas 
  BEFORE INSERT OR UPDATE ON situaciones_criticas 
  FOR EACH ROW 
  EXECUTE FUNCTION calc_checksum();
```

**Función de verificación:**

```sql
-- Verificar integridad de un registro
CREATE FUNCTION verify_checksum(tabla VARCHAR, registro_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  stored_checksum VARCHAR(64);
  calculated_checksum VARCHAR(64);
BEGIN
  -- Obtener checksum almacenado
  EXECUTE 'SELECT data_checksum FROM ' || tabla || 
    ' WHERE id = $1' INTO stored_checksum USING registro_id;
  
  -- Calcular checksum actual
  EXECUTE 'SELECT encode(digest(row_to_json(t)::text, ''sha256''), ''hex'') 
    FROM ' || tabla || ' t WHERE id = $1' 
    INTO calculated_checksum USING registro_id;
  
  RETURN stored_checksum = calculated_checksum;
END;
$$ LANGUAGE plpgsql;
```

**Status:** ✅ APLICAR POST-MVP (opcional)

---

## 📊 CORRECCIÓN 5: RLS Policies (SEGURIDAD)

**Problema:** No hay restricción de acceso por rol a nivel de BD.

**Solución - Crear RLS policies:**

```sql
-- Habilitar RLS
ALTER TABLE residentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE situaciones_criticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos_trabajo ENABLE ROW LEVEL SECURITY;

-- POLÍTICA 1: Educador solo ve residentes asignados
CREATE POLICY "educador_residentes_asignados"
ON residentes
FOR SELECT
USING (
  (SELECT rol FROM perfiles_usuarios WHERE id = auth.uid()) = 'educador'
  AND id IN (
    SELECT rt.residente_id 
    FROM residentes_turnos rt
    WHERE rt.turno_id IN (SELECT id FROM turnos_trabajo)
  )
);

-- POLÍTICA 2: Coordinador ve todos los residentes
CREATE POLICY "coordinador_ve_todos"
ON residentes
FOR SELECT
USING (
  (SELECT rol FROM perfiles_usuarios WHERE id = auth.uid()) = 'coordinador'
);

-- POLÍTICA 3: Educador solo registra novedades de residentes asignados
CREATE POLICY "educador_novedades_propias"
ON novedades
FOR INSERT
WITH CHECK (
  usuario_id = auth.uid()
  AND residente_id IN (
    SELECT rt.residente_id FROM residentes_turnos rt
  )
);

-- POLÍTICA 4: Solo coordinador puede ver todas las novedades
CREATE POLICY "coordinador_ve_todas_novedades"
ON novedades
FOR SELECT
USING (
  (SELECT rol FROM perfiles_usuarios WHERE id = auth.uid()) = 'coordinador'
);

-- POLÍTICA 5: Educador ve novedades de sus residentes
CREATE POLICY "educador_ve_novedades_residentes"
ON novedades
FOR SELECT
USING (
  (SELECT rol FROM perfiles_usuarios WHERE id = auth.uid()) = 'educador'
  AND residente_id IN (
    SELECT rt.residente_id FROM residentes_turnos rt
  )
);

-- Similar para actividades y situaciones críticas...
```

**Status:** ✅ APLICAR EN FASE 2 (2 horas)

---

## 📝 SCRIPT COMPLETO (ORDEN DE EJECUCIÓN)

```sql
-- ============================================
-- FASE 1: Correcciones críticas inmediatas
-- ============================================

-- 1. Cambiar ON DELETE CASCADE → RESTRICT
ALTER TABLE perfiles_usuarios
  DROP CONSTRAINT IF EXISTS perfiles_usuarios_id_fkey,
  ADD CONSTRAINT perfiles_usuarios_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE RESTRICT;

-- ============================================
-- FASE 2: Auditoría y seguridad
-- ============================================

-- 2. Crear tabla audit_log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla_nombre VARCHAR(100) NOT NULL,
  registro_id UUID NOT NULL,
  operacion VARCHAR(20) NOT NULL CHECK (operacion IN ('CREATE', 'UPDATE', 'DELETE')),
  usuario_id UUID NOT NULL REFERENCES perfiles_usuarios(id) ON DELETE RESTRICT,
  datos_antes JSONB NULL,
  datos_despues JSONB NULL,
  fecha_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  direccion_ip INET NULL,
  user_agent TEXT NULL
);

-- 3. Crear índices
CREATE INDEX IF NOT EXISTS idx_audit_tabla_fecha 
  ON audit_log(tabla_nombre, fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_audit_usuario_fecha 
  ON audit_log(usuario_id, fecha_hora DESC);

-- 4. Crear función de auditoría
CREATE OR REPLACE FUNCTION audit_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_antes)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_antes, datos_despues)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_despues)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear triggers
CREATE TRIGGER IF NOT EXISTS audit_novedades 
  AFTER INSERT OR UPDATE OR DELETE ON novedades 
  FOR EACH ROW EXECUTE FUNCTION audit_change();

CREATE TRIGGER IF NOT EXISTS audit_situaciones_criticas 
  AFTER INSERT OR UPDATE OR DELETE ON situaciones_criticas 
  FOR EACH ROW EXECUTE FUNCTION audit_change();

CREATE TRIGGER IF NOT EXISTS audit_actividades_diarias 
  AFTER INSERT OR UPDATE OR DELETE ON actividades_diarias 
  FOR EACH ROW EXECUTE FUNCTION audit_change();

-- 6. Habilitar RLS
ALTER TABLE residentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE novedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE situaciones_criticas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FASE 3: Soft deletes
-- ============================================

-- 7. Agregar columnas deleted_at
ALTER TABLE residentes
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE novedades
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE actividades_diarias
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE situaciones_criticas
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 8. Crear vistas de datos activos
CREATE OR REPLACE VIEW v_residentes_activos AS
SELECT * FROM residentes WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW v_novedades_activas AS
SELECT * FROM novedades WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW v_actividades_activas AS
SELECT * FROM actividades_diarias WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW v_criticas_activas AS
SELECT * FROM situaciones_criticas WHERE deleted_at IS NULL;
```

---

## ✅ CHECKLIST IMPLEMENTACIÓN

### Fase 1: CRÍTICA (30 min)
- [ ] Cambiar ON DELETE CASCADE → RESTRICT
- [ ] Verificar constraint cambió

### Fase 2: IMPORTANTE (3-4 horas)
- [ ] Crear tabla audit_log
- [ ] Crear función audit_change()
- [ ] Crear triggers (novedades, críticas, actividades)
- [ ] Habilitar RLS
- [ ] Crear RLS policies
- [ ] Testear auditoría

### Fase 3: RECOMENDADO (2 horas)
- [ ] Agregar columnas deleted_at
- [ ] Crear vistas de datos activos
- [ ] Crear función soft_delete

### Post-MVP: OPCIONAL (1-2 horas)
- [ ] Agregar checksums
- [ ] Implementar verificación de integridad

---

## 🧪 TESTING

**Verificar auditoría funcionando:**

```sql
-- Crear una novedad de prueba
INSERT INTO novedades (residente_id, usuario_id, tipo_novedad, descripcion)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001',
  'Salud',
  'Prueba de auditoría'
);

-- Ver registro en audit_log
SELECT * FROM audit_log 
WHERE tabla_nombre = 'novedades' 
ORDER BY fecha_hora DESC 
LIMIT 1;

-- Verificar datos_despues contiene el registro
SELECT datos_despues FROM audit_log 
WHERE tabla_nombre = 'novedades' 
ORDER BY fecha_hora DESC 
LIMIT 1;
```

---

## 📋 DOCUMENTACIÓN DE CAMBIOS

**Cambios realizados:**

| Cambio | Tabla | Tipo | Prioridad | Tiempo |
|--------|-------|------|-----------|--------|
| ON DELETE RESTRICT | perfiles_usuarios | Constraint | 🔴 ALTA | 5 min |
| audit_log tabla | Nueva | Tabla | 🔴 ALTA | 30 min |
| audit_change función | Función | Function | 🔴 ALTA | 15 min |
| Triggers auditoría | 3 tablas | Trigger | 🔴 ALTA | 15 min |
| RLS policies | 4 tablas | Policy | 🔴 ALTA | 60 min |
| deleted_at columnas | 4 tablas | Columna | 🟡 MEDIA | 10 min |
| Vistas soft delete | 4 vistas | View | 🟡 MEDIA | 15 min |
| data_checksum | 2 tablas | Columna | 🟢 BAJA | 10 min |

---

## 📞 SOPORTE

**Si algo falla:**

```sql
-- Verificar tabla audit_log existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'audit_log'
);

-- Verificar triggers
SELECT trigger_name, table_name 
FROM information_schema.triggers 
WHERE table_schema = 'public';

-- Verificar constraints
SELECT constraint_name, table_name 
FROM information_schema.table_constraints 
WHERE table_name = 'perfiles_usuarios';

-- Ver últimos registros de auditoría
SELECT * FROM audit_log ORDER BY fecha_hora DESC LIMIT 10;
```

---

## ✅ CONCLUSIÓN

Este archivo contiene TODAS las correcciones necesarias para Argüello Infancias Mobile.

**Implementar en orden:**
1. ✅ Fase 1 (30 min) — Crítica
2. ✅ Fase 2 (3-4 horas) — Importante
3. ✅ Fase 3 (2 horas) — Recomendado
4. ✅ Post-MVP (1-2 horas) — Opcional

**Status:** LISTO PARA IMPLEMENTAR EN SUPABASE

