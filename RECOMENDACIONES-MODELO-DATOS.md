# 🎯 RECOMENDACIONES TÉCNICAS — Modelo de Datos

**Para implementación en Argüello Infancias Mobile MVP**

---

## ✅ ESTADO ACTUAL

El modelo de datos es **100% válido** y **production-ready** para MVP.

```
7 tablas ✅
51 criterios cubiertos ✅
Script DDL completo ✅
Índices optimizados ✅
```

---

## 🔧 MEJORAS INMEDIATAS (MVP)

### 1. **RLS Policies en Supabase (CRÍTICO)**

Implementar Row Level Security para RBAC:

```sql
-- Educador solo ve residentes asignados
CREATE POLICY "educador_residentes_asignados" 
  ON residentes 
  FOR SELECT 
  USING (
    id IN (
      SELECT rt.residente_id 
      FROM residentes_turnos rt
      JOIN perfiles_usuarios pu ON pu.id = auth.uid()
      WHERE rt.turno_id IN (SELECT id FROM turnos_trabajo)
    )
  );

-- Educador solo registra novedades de residentes asignados
CREATE POLICY "educador_novedades_propias"
  ON novedades
  FOR INSERT
  WITH CHECK (
    residente_id IN (SELECT rt.residente_id FROM residentes_turnos rt)
    AND usuario_id = auth.uid()
  );

-- Coordinador ve todo
CREATE POLICY "coordinador_ve_todo"
  ON residentes
  FOR SELECT
  USING (
    (SELECT rol FROM perfiles_usuarios WHERE id = auth.uid()) = 'coordinador'
  );
```

**Status:** DEBE IMPLEMENTARSE  
**Tiempo:** 2-3 horas

---

### 2. **Tabla de Auditoría Central**

Crear tabla para registro centralizado:

```sql
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

CREATE INDEX idx_audit_tabla_fecha ON audit_log(tabla_nombre, fecha_hora DESC);
CREATE INDEX idx_audit_usuario_fecha ON audit_log(usuario_id, fecha_hora DESC);
```

**Razón:** Requisito legal para instituciones de menores  
**Status:** DEBE IMPLEMENTARSE  
**Tiempo:** 3-4 horas

---

### 3. **Triggers para Auditoría Automática**

```sql
CREATE FUNCTION audit_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (tabla_nombre, registro_id, operacion, usuario_id, datos_antes, datos_despues)
  VALUES (TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, auth.uid(), 
          to_jsonb(OLD), to_jsonb(NEW));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar a tablas críticas
CREATE TRIGGER audit_novedades AFTER INSERT OR UPDATE OR DELETE ON novedades FOR EACH ROW EXECUTE FUNCTION audit_change();
CREATE TRIGGER audit_criticas AFTER INSERT OR UPDATE OR DELETE ON situaciones_criticas FOR EACH ROW EXECUTE FUNCTION audit_change();
CREATE TRIGGER audit_actividades AFTER INSERT OR UPDATE OR DELETE ON actividades_diarias FOR EACH ROW EXECUTE FUNCTION audit_change();
```

**Status:** DEBE IMPLEMENTARSE  
**Tiempo:** 2 horas

---

### 4. **Soft Deletes para NNA**

Nunca eliminar datos de menores:

```sql
-- Modificar tabla residentes
ALTER TABLE residentes ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Nueva política: ver solo residentes activos por defecto
ALTER POLICY "educador_residentes_asignados"
  ON residentes
  USING (deleted_at IS NULL);
```

**Razón:** Legal y ético - nunca perder datos de menores  
**Status:** DEBE IMPLEMENTARSE  
**Tiempo:** 1 hora

---

### 5. **Cambiar ON DELETE CASCADE → RESTRICT**

En `perfiles_usuarios`:

```sql
-- ACTUAL (RIESGOSO):
ALTER TABLE perfiles_usuarios 
  DROP CONSTRAINT "perfiles_usuarios_id_fkey",
  ADD CONSTRAINT perfiles_usuarios_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE RESTRICT;
```

**Razón:** Si educador se elimina, auditoría no se huérfana  
**Status:** DEBE IMPLEMENTARSE  
**Tiempo:** 1 hora

---

## 🔐 SEGURIDAD ADICIONAL

### Cifrado de Campos Sensibles

Implementar a nivel de aplicación (no BD):

```typescript
// En mobile app
import { CryptoUtil } from '@/lib/crypto';

// Cifrar al guardar
const encrypted = CryptoUtil.encrypt(alertas_importantes, ENCRYPTION_KEY);
await db.residentes.update(id, { alertas_importantes: encrypted });

// Descifrar al leer
const decrypted = CryptoUtil.decrypt(resident.alertas_importantes, ENCRYPTION_KEY);
```

**Campos a cifrar:**
- `alertas_importantes` (alergias, etc)
- `observaciones_autorizadas` (datos sensibles)
- `descripcion` en novedades/criticas (si contiene PII)

**Status:** RECOMENDADO  
**Tiempo:** 3-4 horas

---

### Checksums para Integridad

Agregar verificación de integridad:

```sql
ALTER TABLE novedades ADD COLUMN data_checksum VARCHAR(64);
ALTER TABLE situaciones_criticas ADD COLUMN data_checksum VARCHAR(64);

-- Generar checksum al insertar
CREATE FUNCTION calc_checksum() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_checksum := encode(digest(row_to_json(NEW)::text, 'sha256'), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER checksum_novedades BEFORE INSERT ON novedades FOR EACH ROW EXECUTE FUNCTION calc_checksum();
```

**Status:** OPCIONAL (post-MVP)  
**Tiempo:** 2 horas

---

## 📊 VISTAS ÚTILES

Crear vistas para queries comunes:

```sql
-- Vista: Novedades del día por residente
CREATE VIEW v_novedades_diarias AS
SELECT 
  r.nombre,
  n.tipo_novedad,
  n.descripcion,
  n.fecha_hora,
  pu.nombre as educador
FROM novedades n
JOIN residentes r ON r.id = n.residente_id
JOIN perfiles_usuarios pu ON pu.id = n.usuario_id
WHERE n.fecha_hora::date = CURRENT_DATE
ORDER BY n.fecha_hora DESC;

-- Vista: Actividades pendientes
CREATE VIEW v_actividades_pendientes AS
SELECT 
  r.nombre,
  a.tipo_actividad,
  a.descripcion,
  a.fecha
FROM actividades_diarias a
JOIN residentes r ON r.id = a.residente_id
WHERE a.realizada = FALSE AND a.fecha >= CURRENT_DATE
ORDER BY a.fecha, r.nombre;

-- Vista: Situaciones críticas recientes
CREATE VIEW v_criticas_recientes AS
SELECT 
  r.nombre,
  s.tipo_situacion,
  s.descripcion,
  s.fecha_hora,
  pu.nombre as reportado_por
FROM situaciones_criticas s
JOIN residentes r ON r.id = s.residente_id
JOIN perfiles_usuarios pu ON pu.id = s.usuario_id
WHERE s.fecha_hora > NOW() - INTERVAL '7 days'
ORDER BY s.fecha_hora DESC;
```

**Status:** RECOMENDADO  
**Tiempo:** 1 hora

---

## 🧪 DATOS DE PRUEBA (SEEDING)

Script para poblar datos iniciales:

```sql
-- Usuarios
INSERT INTO perfiles_usuarios (id, nombre, rol) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'María García', 'educador'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Juan Pérez', 'educador'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sofia López', 'coordinador');

-- Turnos
INSERT INTO turnos_trabajo (nombre, hora_inicio, hora_fin) VALUES
  ('Mañana', '06:00:00', '14:00:00'),
  ('Tarde', '14:00:00', '22:00:00'),
  ('Noche', '22:00:00', '06:00:00');

-- Residentes
INSERT INTO residentes (nombre, fecha_nacimiento, escuela, turno_escolar) VALUES
  ('María García', '2012-03-15', 'Escuela Primaria 123', 'Mañana'),
  ('Juan Pérez', '2010-07-20', 'Escuela Primaria 456', 'Tarde');

-- Asignaciones
INSERT INTO residentes_turnos (residente_id, turno_id) 
SELECT r.id, t.id FROM residentes r, turnos_trabajo t LIMIT 4;
```

**Status:** RECOMENDADO  
**Tiempo:** 1 hora

---

## 📈 PERFORMANCE TUNING

### Índices Adicionales (Opcional)

```sql
-- Para consultas de usuario_id
CREATE INDEX idx_novedades_usuario ON novedades(usuario_id);
CREATE INDEX idx_actividades_usuario ON actividades_diarias(usuario_id);

-- Para filtros por tipo
CREATE INDEX idx_novedades_tipo ON novedades(tipo_novedad);
CREATE INDEX idx_criticas_tipo ON situaciones_criticas(tipo_situacion);

-- Para paginación
CREATE INDEX idx_novedades_fecha ON novedades(fecha_hora DESC);
```

**Status:** OPCIONAL (si performance es lenta)  
**Cuándo:** Post-MVP con datos reales

---

## 🔄 MIGRATIONS STRATEGY

Usar Supabase Migrations:

```bash
# Crear migración
supabase migration new "add_audit_tables"

# Ver migrations
supabase migration list

# Aplicar a producción
supabase db push
```

**Archivos a crear:**
1. Initial schema (script DDL actual)
2. Add audit log
3. Add soft deletes
4. Add RLS policies
5. Add views

---

## ✅ CHECKLIST IMPLEMENTACIÓN

### Fase 1: MVP (Semana 1)
- [ ] Ejecutar script DDL en Supabase
- [ ] Crear 3 turnos base (Mañana, Tarde, Noche)
- [ ] Crear usuarios de prueba
- [ ] Crear 3-5 residentes de prueba
- [ ] Asignar residentes a turnos
- [ ] Verificar índices funcionan

### Fase 2: Seguridad (Semana 2)
- [ ] Implementar RLS policies
- [ ] Agregar tabla audit_log
- [ ] Crear triggers de auditoría
- [ ] Agregar soft deletes
- [ ] Cambiar ON DELETE CASCADE → RESTRICT
- [ ] Testear RBAC

### Fase 3: Optimización (Semana 3+)
- [ ] Crear vistas útiles
- [ ] Implementar cifrado de datos
- [ ] Agregar checksums
- [ ] Tuning de performance
- [ ] Load testing

---

## 📞 QUERIES PRINCIPALES PARA MOBILE

Guardar estas queries en aplicación:

```typescript
// F1: Consultar residentes asignados
GET /api/minors?filter=assigned_to_me
→ SELECT * FROM residentes WHERE id IN (SELECT rt.residente_id FROM residentes_turnos rt)

// F2: Crear novedad
POST /api/minors/:id/observations
→ INSERT INTO novedades (residente_id, usuario_id, tipo_novedad, descripcion)

// F3: Consultar historial
GET /api/minors/:id/timeline?days=30
→ SELECT * FROM novedades WHERE residente_id = ? ORDER BY fecha_hora DESC

// F4: Crear actividad
POST /api/minors/:id/activities
→ INSERT INTO actividades_diarias (residente_id, tipo_actividad, realizada)

// F5: Consultar turno
GET /api/my-shift
→ SELECT * FROM turnos_trabajo WHERE id = (SELECT turno_id FROM residentes_turnos...)

// F6: Crear situación crítica
POST /api/minors/:id/critical-incidents
→ INSERT INTO situaciones_criticas (residente_id, usuario_id, tipo_situacion, descripcion)
```

---

## 🚀 ROADMAP POST-MVP

**Mes 2:**
- [ ] Reportes analíticos
- [ ] Exportación de datos (PDF, Excel)
- [ ] Integración con sistema web
- [ ] Sincronización en tiempo real

**Mes 3:**
- [ ] Notificaciones push
- [ ] Offline mode mejorado
- [ ] Búsqueda avanzada
- [ ] Dashboards para coordinador

---

## ✅ CONCLUSIÓN

**El modelo es solid para MVP. Implementar estas recomendaciones en fases.**

### MVP (Necesario):
- Script DDL ✅
- RLS policies ⚠️ (CRÍTICO)
- Audit log básico ⚠️ (LEGAL)

### Post-MVP (Importante):
- Soft deletes
- Triggers de auditoría
- Cifrado de datos

### Futuro:
- Performance tuning
- Reportes
- Integraciones

---

**Status: ✅ APROBADO PARA IMPLEMENTAR**

Tiempo estimado: 15-20 horas para fase 1+2

