-- ============================================================
-- Tipiti Books — Initial Schema Migration
-- ============================================================
-- 8 tables: books, scenes, character_variants, variant_pages,
--           orders, discount_codes, subscribers, accessories
-- ============================================================

-- ============================================================
-- 1. TRIGGER FUNCTION (updated_at)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- 2.1 books — Catalog of customizable books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_template TEXT NOT NULL,
  description TEXT,
  style_prompt TEXT NOT NULL,
  style_lora_url TEXT,
  style_reference_urls JSONB,
  total_scenes INTEGER NOT NULL DEFAULT 11,
  target_age TEXT DEFAULT '0-3',
  default_language TEXT DEFAULT 'es',
  available_languages TEXT[] DEFAULT '{"es"}',
  generation_engine TEXT DEFAULT 'flux-kontext-pro',
  total_variants INTEGER DEFAULT 80,
  approved_variants INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  page_width_mm INTEGER DEFAULT 220,
  page_height_mm INTEGER DEFAULT 180,
  total_pages INTEGER DEFAULT 20,
  cover_template_url TEXT,
  price_clp INTEGER NOT NULL,
  price_usd DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2.2 scenes — Scenes/spreads of a book
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  scene_number INTEGER NOT NULL,
  visual_description TEXT NOT NULL,
  camera_angle TEXT DEFAULT 'medium_shot',
  lighting TEXT DEFAULT 'warm',
  emotion TEXT DEFAULT 'peaceful',
  suggested_seed INTEGER,
  recurring_elements TEXT[],
  character_position TEXT DEFAULT 'left',
  text_position TEXT DEFAULT 'top_left',
  text_position_secondary TEXT,
  text_narrative JSONB NOT NULL,
  setting_sheet_url TEXT,
  setting_reference_urls JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(book_id, scene_number)
);

CREATE TRIGGER scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2.3 character_variants — Pre-generated character combinations (~80 per book)
CREATE TABLE character_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  gender TEXT NOT NULL,
  hair_color TEXT NOT NULL,
  hair_type TEXT NOT NULL,
  skin_tone TEXT NOT NULL,
  has_glasses BOOLEAN NOT NULL DEFAULT FALSE,
  eye_style TEXT DEFAULT 'black_dots',
  portrait_url TEXT,
  character_sheet_urls JSONB,
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
);

CREATE INDEX idx_variant_lookup
  ON character_variants(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
  WHERE status = 'approved';

CREATE TRIGGER character_variants_updated_at
  BEFORE UPDATE ON character_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2.4 variant_pages — Pre-generated pages per variant (11 per variant)
CREATE TABLE variant_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES character_variants(id) ON DELETE CASCADE NOT NULL,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_url_hires TEXT,
  prompt_used TEXT NOT NULL,
  seed_used INTEGER,
  generation_model TEXT NOT NULL,
  generation_cost DECIMAL(6,4),
  reference_images_used JSONB,
  status TEXT DEFAULT 'generated',
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(variant_id, scene_id)
);

-- 2.5 discount_codes (must be before orders due to FK)
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_discount_code ON discount_codes(code);

-- 2.6 orders — Customer orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES character_variants(id) NOT NULL,
  book_id UUID REFERENCES books(id) NOT NULL,
  discount_code_id UUID REFERENCES discount_codes(id),
  child_name TEXT NOT NULL,
  dedication TEXT,
  language TEXT DEFAULT 'es',
  second_language TEXT,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT,
  shipping_address JSONB NOT NULL,
  shipping_city TEXT,
  shipping_region TEXT,
  shipping_country TEXT DEFAULT 'CL',
  payment_provider TEXT DEFAULT 'flow',
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount_paid DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CLP',
  print_file_url TEXT,
  print_status TEXT DEFAULT 'pending',
  shipping_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  status TEXT DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2.7 subscribers — Newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_subscriber_email ON subscribers(email);

-- 2.8 accessories — Optional character accessories (V2)
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  image_layer_url TEXT,
  premium_price INTEGER,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- books: published books visible to all
CREATE POLICY "books_public_read" ON books
  FOR SELECT USING (is_published = true);

CREATE POLICY "books_admin_all" ON books
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- scenes: scenes of published books are public
CREATE POLICY "scenes_public_read" ON scenes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM books WHERE books.id = scenes.book_id AND books.is_published = true)
  );

CREATE POLICY "scenes_admin_all" ON scenes
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- character_variants: only approved variants of published books
CREATE POLICY "variants_public_read" ON character_variants
  FOR SELECT USING (
    status = 'approved' AND
    EXISTS (SELECT 1 FROM books WHERE books.id = character_variants.book_id AND books.is_published = true)
  );

CREATE POLICY "variants_admin_all" ON character_variants
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- variant_pages: only pages of approved variants
CREATE POLICY "pages_public_read" ON variant_pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM character_variants cv
      WHERE cv.id = variant_pages.variant_id
      AND cv.status = 'approved'
      AND EXISTS (SELECT 1 FROM books WHERE books.id = cv.book_id AND books.is_published = true)
    )
  );

CREATE POLICY "pages_admin_all" ON variant_pages
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- orders: admin only
CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- discount_codes: admin only
CREATE POLICY "discount_codes_admin_all" ON discount_codes
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- subscribers: admin only
CREATE POLICY "subscribers_admin_all" ON subscribers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- accessories: admin only
CREATE POLICY "accessories_admin_all" ON accessories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
