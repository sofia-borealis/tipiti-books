-- ============================================================
-- Seed: Libro "Buenas Noches, {name}" con 11 escenas
-- ============================================================

INSERT INTO books (
  slug, title_template, description, style_prompt,
  total_scenes, target_age, default_language,
  generation_engine, total_variants, is_published,
  page_width_mm, page_height_mm, total_pages,
  price_clp, price_usd
) VALUES (
  'buenas-noches',
  'Buenas Noches, {name}',
  'Un cuento mágico de sueños donde {name} es la protagonista. Acompañada por sus amigas del bosque, {name} viaja a través de escenas nocturnas serenas, con acuarelas suaves y pequeños detalles mágicos para buscar. Perfecto para la rutina de dormir de niños 0-3 años.',
  'A watercolor bedtime story illustration in soft pastel colors. Whimsical, peaceful, magical. The main character is positioned on the left or right (never center). Small hidden animals and recurring elements (sleeping mouse, teddy bear, butterfly). Simple, dreamy, suitable for 0-3 year olds. Warm lighting, dreamlike atmosphere. No text or letters in the image.',
  11, '0-3', 'es',
  'flux-kontext-pro', 80, false,
  220, 180, 20,
  29990, 40.00
);

-- Insert all 11 scenes + cover
DO $$
DECLARE
  v_book_id UUID;
BEGIN
  SELECT id INTO v_book_id FROM books WHERE slug = 'buenas-noches';

  -- Scene 0: Cover
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position)
  VALUES (v_book_id, 0,
    'Book cover: {name} sleeping peacefully under a starry night sky, surrounded by clouds. Soft pastel colors, dreamy atmosphere. Title at the top.',
    'medium_shot', 'soft', 'peaceful',
    '{"es": "Buenas Noches, {name}"}',
    'center'
  );

  -- Scene 1: Bedtime begins
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 1,
    '{name} in bedroom with toys scattered around, looking at the window with moonlight. A teddy bear visible on the shelf.',
    'medium_shot', 'warm', 'peaceful',
    '{"es": "Es hora de dormir, {name}. El cielo oscuro nos invita a descansar..."}',
    'left', '{"teddy_bear", "moon"}'
  );

  -- Scene 2: Changing clothes
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 2,
    '{name} putting on pajamas, with a small mouse peeking from behind the dresser. Cozy bedroom setting.',
    'close_up', 'warm', 'playful',
    '{"es": "Nos ponemos nuestro pijama más suavito. ¡Shhhh! Mira, un ratoncito nos observa..."}',
    'right', '{"sleeping_mouse", "teddy_bear"}'
  );

  -- Scene 3: Brushing teeth
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 3,
    '{name} in the bathroom, brushing teeth at the sink. A butterfly flying around the mirror. Bathroom window showing evening sky.',
    'medium_shot', 'soft', 'playful',
    '{"es": "¡Zzzzz zzzzz! Cepillamos nuestros dientes para que brillen. ¿Ves la mariposa en la ventana?"}',
    'left', '{"butterfly", "teddy_bear"}'
  );

  -- Scene 4: Drinking warm milk
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 4,
    '{name} sitting in a cozy corner with a warm mug of milk. A cat curled up nearby, stars visible through the window.',
    'close_up', 'warm', 'peaceful',
    '{"es": "Un vaso de leche tibia nos espera. ¡Muu! Hasta la vaca nos dice que es hora de descansar..."}',
    'right', '{"sleeping_mouse", "stars"}'
  );

  -- Scene 5: Reading bedtime story
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 5,
    '{name} on the bed with parents, reading a picture book. Soft lamplight. Teddy bear and other stuffed animals around.',
    'wide', 'soft', 'peaceful',
    '{"es": "Mamá nos lee un cuento mágico. Nuestros amigos de peluche también escuchan..."}',
    'left', '{"teddy_bear", "butterfly"}'
  );

  -- Scene 6: Tucking in bed
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 6,
    '{name} nestled under a cozy blanket, with the teddy bear tucked beside. Moon visible in window.',
    'close_up', 'soft', 'peaceful',
    '{"es": "Nos arropamos bajo nuestras sábanas suavitas. Nuestro amigo teddy nos acompaña..."}',
    'center', '{"teddy_bear", "moon"}'
  );

  -- Scene 7: Saying goodnight to room
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 7,
    '{name} in bed, waving goodbye to toys and furniture. Soft nightlight glow. Mouse sleeping in corner.',
    'medium_shot', 'soft', 'peaceful',
    '{"es": "Buenas noches, juguetes. Buenas noches, ventana. ¡Que duerman bien todos!"}',
    'right', '{"sleeping_mouse", "teddy_bear", "butterfly"}'
  );

  -- Scene 8: Dream beginning
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 8,
    '{name} sleeping, with dreams floating around as soft clouds. Stars and moon in background. Magical, dreamy colors.',
    'wide', 'soft', 'peaceful',
    '{"es": "Y así comienzan nuestros sueños mágicos... Volamos entre nubes de algodón..."}',
    'center', '{"moon", "stars", "butterfly"}'
  );

  -- Scene 9: Dream adventure
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 9,
    '{name} flying through a starry night sky, surrounded by friendly animals and clouds. Magical, whimsical.',
    'wide', 'dramatic', 'playful',
    '{"es": "¡Splash! Saltamos en charcos de estrellas. Nuestros amigos del bosque nos acompañan..."}',
    'left', '{"sleeping_mouse", "butterfly", "stars"}'
  );

  -- Scene 10: Safe and sound
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position, recurring_elements)
  VALUES (v_book_id, 10,
    '{name} sleeping peacefully in bed, surrounded by protective magical elements. Soft glow. All is calm and safe.',
    'close_up', 'soft', 'peaceful',
    '{"es": "Rodeados de amor y magia, dormimos profundamente. Seguros. Felices."}',
    'center', '{"teddy_bear", "moon", "stars", "butterfly", "sleeping_mouse"}'
  );

  -- Scene 11: Final page (dedication)
  INSERT INTO scenes (book_id, scene_number, visual_description, camera_angle, lighting, emotion, text_narrative, character_position)
  VALUES (v_book_id, 11,
    'Final page: {name} sleeping peacefully under starlight. Space for dedication message.',
    'medium_shot', 'soft', 'peaceful',
    '{"es": "Para {name}, con todo nuestro amor. Que sueñes los sueños más bonitos..."}',
    'center'
  );
END $$;

-- Seed initial discount code
INSERT INTO discount_codes (code, type, value, max_uses, is_active)
VALUES ('TIPITI20', 'percentage', 20.00, 100, true);
