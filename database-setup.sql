-- =====================================================
-- Beerzen Database Setup
-- =====================================================
-- Este script configura la base de datos para beerzen.com.ar
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  empresa TEXT,
  cargo TEXT,
  direccion TEXT,
  notas TEXT,
  foto_tarjeta_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índice para mejorar performance en consultas por usuario
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 4. Crear política: Los usuarios solo pueden ver sus propios contactos
CREATE POLICY "Users can view their own contacts"
  ON contacts
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Crear política: Los usuarios pueden insertar sus propios contactos
CREATE POLICY "Users can insert their own contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Crear política: Los usuarios pueden actualizar sus propios contactos
CREATE POLICY "Users can update their own contacts"
  ON contacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Crear política: Los usuarios pueden eliminar sus propios contactos
CREATE POLICY "Users can delete their own contacts"
  ON contacts
  FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Storage Bucket Setup
-- =====================================================
-- Nota: Los buckets se deben crear desde la interfaz de Supabase Storage
-- o usando el siguiente comando SQL:

-- 1. Crear bucket 'contact-cards' (ejecutar en SQL Editor si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-cards', 'contact-cards', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear política de storage: Los usuarios pueden subir sus propias imágenes
CREATE POLICY "Users can upload their own images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'contact-cards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Crear política de storage: Los usuarios pueden ver sus propias imágenes
CREATE POLICY "Users can view their own images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'contact-cards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Crear política de storage: Los usuarios pueden eliminar sus propias imágenes
CREATE POLICY "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'contact-cards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Crear política de storage: Permitir acceso público a las imágenes
CREATE POLICY "Public access to images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'contact-cards');

-- =====================================================
-- Verificación
-- =====================================================
-- Verificar que la tabla fue creada
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'contacts';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'contacts';

-- Verificar bucket
SELECT * FROM storage.buckets WHERE id = 'contact-cards';
