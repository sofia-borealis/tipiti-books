import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  renderToFile,
  Link,
} from "@react-pdf/renderer";

// --- Fonts ---
Font.register({
  family: "Inter",
  fonts: [
    { src: "./fonts/Inter-Regular.ttf", fontWeight: "normal" },
    { src: "./fonts/Inter-Bold.ttf", fontWeight: "bold" },
    { src: "./fonts/Inter-SemiBold.ttf", fontWeight: "semibold" },
    { src: "./fonts/Inter-Italic.ttf", fontStyle: "italic" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

// --- Colors ---
const C = {
  bg: "#FFFDF9",
  text: "#3B2F2F",
  textLight: "#6B5B5B",
  accent: "#C0785C",       // terracotta
  accentLight: "#F5E6DC",
  heading: "#2D2424",
  divider: "#E8D5C4",
  tagBg: "#F0E4D7",
  tagText: "#8B6B50",
  greenBg: "#E8F0E4",
  greenText: "#4A6B3F",
  redBg: "#F5E0E0",
  redText: "#8B3F3F",
  white: "#FFFFFF",
};

// --- Styles ---
const s = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: C.bg,
    paddingTop: 50,
    paddingBottom: 65,
    paddingHorizontal: 50,
    fontFamily: "Inter",
    color: C.text,
    fontSize: 10,
    lineHeight: 1.6,
  },
  // Cover page
  coverPage: {
    flexDirection: "column",
    backgroundColor: C.accent,
    padding: 0,
    fontFamily: "Inter",
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: C.white,
    textAlign: "center",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 16,
    color: C.white,
    opacity: 0.85,
    textAlign: "center",
    marginBottom: 40,
  },
  coverTagline: {
    fontSize: 13,
    color: C.white,
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },
  coverDivider: {
    width: 60,
    height: 2,
    backgroundColor: C.white,
    opacity: 0.5,
    marginVertical: 20,
  },
  // Section title (big)
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: C.heading,
    marginBottom: 16,
    marginTop: 8,
  },
  // H2
  h2: {
    fontSize: 14,
    fontWeight: "bold",
    color: C.accent,
    marginBottom: 8,
    marginTop: 16,
  },
  // H3
  h3: {
    fontSize: 11,
    fontWeight: "semibold",
    color: C.heading,
    marginBottom: 6,
    marginTop: 12,
  },
  // Body
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: C.text,
    marginBottom: 6,
  },
  bodyBold: {
    fontWeight: "bold",
  },
  bodyItalic: {
    fontStyle: "italic",
  },
  // Bullet list
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 14,
    fontSize: 10,
    color: C.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: C.text,
  },
  // Numbered list
  numberRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  numberLabel: {
    width: 20,
    fontSize: 10,
    fontWeight: "semibold",
    color: C.accent,
  },
  // Blockquote
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 10,
    backgroundColor: C.accentLight,
    borderRadius: 2,
    paddingRight: 12,
  },
  blockquoteText: {
    fontSize: 10,
    fontStyle: "italic",
    color: C.textLight,
    lineHeight: 1.5,
  },
  // Tag / badge
  tag: {
    backgroundColor: C.tagBg,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  tagText: {
    fontSize: 8,
    color: C.tagText,
    fontWeight: "semibold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Positive / Negative cards
  positiveCard: {
    backgroundColor: C.greenBg,
    borderRadius: 4,
    padding: 12,
    marginBottom: 6,
  },
  negativeCard: {
    backgroundColor: C.redBg,
    borderRadius: 4,
    padding: 12,
    marginBottom: 6,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginVertical: 14,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 25,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLine: {
    height: 0.5,
    backgroundColor: C.divider,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 8,
    color: C.textLight,
    paddingTop: 6,
  },
  // Link
  link: {
    color: C.accent,
    textDecoration: "underline",
  },
});

// --- Helpers ---
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>{"\u2022"}</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const BulletBold = ({
  label,
  text,
}: {
  label: string;
  text: string;
}) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>{"\u2022"}</Text>
    <Text style={s.bulletText}>
      <Text style={s.bodyBold}>{label}</Text> {text}
    </Text>
  </View>
);

const NumberItem = ({
  n,
  children,
}: {
  n: number;
  children: React.ReactNode;
}) => (
  <View style={s.numberRow}>
    <Text style={s.numberLabel}>{n}.</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const Divider = () => <View style={s.divider} />;

const SubBullet = ({ children }: { children: React.ReactNode }) => (
  <View style={[s.bulletRow, { paddingLeft: 20 }]}>
    <Text style={[s.bulletDot, { fontSize: 8 }]}>{"\u2013"}</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

// --- Document ---
const BrandBrief = () => (
  <Document
    title="Brief para Disenador - Identidad de Marca Tipiti Books"
    author="Tipiti Books"
    subject="Brand Identity Brief"
    language="es"
  >
    {/* Cover Page */}
    <Page size="A4" style={s.coverPage}>
      <View style={{ alignItems: "center" }}>
        <Text style={s.coverTitle}>Tipiti Books</Text>
        <Text style={s.coverSubtitle}>Brief de Identidad de Marca</Text>
        <View style={s.coverDivider} />
        <Text style={s.coverTagline}>Libros que abrazan.</Text>
      </View>
    </Page>

    {/* Content Pages */}
    <Page size="A4" style={s.page}>
      {/* Tag */}
      <View style={s.tag}>
        <Text style={s.tagText}>Para uso en Fiverr</Text>
      </View>

      <View style={s.blockquote}>
        <Text style={s.blockquoteText}>
          Copia y pega este documento como descripcion del proyecto al contratar
          un disenador de identidad de marca.
        </Text>
      </View>

      {/* --- Sobre el Proyecto --- */}
      <Text style={s.sectionTitle}>Sobre el Proyecto</Text>

      <Text style={s.body}>
        <Text style={s.bodyBold}>Tipiti Books</Text> es una plataforma web
        chilena de libros infantiles personalizados con ilustraciones estilo
        acuarela de alta calidad. Cada libro permite que el comprador configure
        un personaje (nino o nina) que se parece al destinatario, y recibe un
        libro impreso premium con empaque de regalo.
      </Text>

      <Text style={s.body}>
        Nuestro posicionamiento:{" "}
        <Text style={s.bodyBold}>
          "Un Wonderbly para Latinoamerica, powered by AI."
        </Text>{" "}
        Ofrecemos calidad artistica de nivel internacional a un precio accesible
        (~$40 USD), con una experiencia de regalo premium.
      </Text>

      <Divider />

      {/* --- Que Necesitamos --- */}
      <Text style={s.sectionTitle}>Que Necesitamos</Text>

      <Text style={s.body}>
        Buscamos un disenador que cree la{" "}
        <Text style={s.bodyBold}>identidad de marca completa</Text> de Tipiti
        Books. Los entregables son:
      </Text>

      {/* 1. Logotipo */}
      <Text style={s.h2}>1. Logotipo</Text>
      <BulletBold
        label="Logotipo principal"
        text="(horizontal y vertical)"
      />
      <BulletBold
        label="Isotipo / simbolo"
        text="(para favicon, avatar de redes sociales, icono de app)"
      />
      <BulletBold
        label="Variaciones:"
        text="version a color, version monocromatica (blanco sobre fondo oscuro y negro sobre fondo claro)"
      />
      <BulletBold
        label="Formatos de entrega:"
        text="AI/EPS (vectorial editable), SVG, PNG con transparencia (minimo 2000px), PDF"
      />

      {/* 2. Tipografia */}
      <Text style={s.h2}>2. Tipografia</Text>
      <BulletBold
        label="Tipografia principal"
        text="(para el logo y titulos/headings del sitio web)"
      />
      <BulletBold
        label="Tipografia secundaria"
        text="(para cuerpo de texto del sitio web, descripciones de producto)"
      />
      <BulletBold
        label="Tipografia complementaria"
        text="(para textos dentro de los libros infantiles — debe ser legible, redondeada, amigable)"
      />
      <Bullet>
        Especificar nombre de la fuente, tamanos recomendados, y peso (bold,
        regular, light)
      </Bullet>
      <Bullet>
        Preferencia por fuentes Google Fonts o que tengan licencia comercial
        incluida
      </Bullet>

      {/* 3. Paleta de Colores */}
      <Text style={s.h2}>3. Paleta de Colores</Text>
      <BulletBold
        label="Colores primarios"
        text="(2-3 colores principales de la marca)"
      />
      <BulletBold
        label="Colores secundarios"
        text="(2-3 colores de soporte)"
      />
      <BulletBold
        label="Colores de acento"
        text="(para CTAs, botones, highlights)"
      />
      <BulletBold label="Codigos:" text="HEX, RGB, y CMYK para cada color" />
      <Bullet>
        Debe funcionar tanto en web (pantalla) como en impresion (libros,
        empaque)
      </Bullet>

      {/* 4. Guia de Uso de Marca */}
      <Text style={s.h2}>4. Guia de Uso de Marca (Brand Guidelines)</Text>
      <Text style={s.body}>Documento PDF de 5-10 paginas con:</Text>
      <SubBullet>
        Logo: usos correctos e incorrectos, espacios de respeto, tamano minimo
      </SubBullet>
      <SubBullet>Paleta de colores con codigos</SubBullet>
      <SubBullet>Tipografias con jerarquia visual</SubBullet>
      <SubBullet>
        Ejemplos de aplicacion: tarjeta de presentacion, avatar de redes, header
        del sitio web, etiqueta de empaque
      </SubBullet>
      <SubBullet>Tono visual general de la marca</SubBullet>

      <Divider />

      {/* --- Estilo y Direccion Creativa --- */}
      <Text style={s.sectionTitle}>Estilo y Direccion Creativa</Text>

      {/* Lo que somos */}
      <View style={s.positiveCard} wrap={false}>
        <Text style={s.h3}>Lo que somos</Text>
        <BulletBold
          label="Calido, tierno, artesanal"
          text="— como un abrazo de acuarela"
        />
        <BulletBold
          label="Premium pero accesible"
          text="— no somos lujo frio, somos regalo con corazon"
        />
        <BulletBold
          label="Infantil pero sofisticado"
          text="— los padres se enamoran del diseno, los ninos del personaje"
        />
        <BulletBold
          label="Hecho a mano"
          text="— pinceladas visibles, textura de papel, nada plastico ni digital"
        />
        <BulletBold
          label="Latinoamericano y orgulloso"
          text="— colores calidos, diversidad de pieles y pelo"
        />
      </View>

      {/* Lo que NO somos */}
      <View style={s.negativeCard} wrap={false}>
        <Text style={s.h3}>Lo que NO somos</Text>
        <Bullet>
          Corporativo, frio, geometrico, minimalista extremo
        </Bullet>
        <Bullet>
          Estilo Pixar/Disney 3D, plastico, brillante
        </Bullet>
        <Bullet>
          Infantil generico tipo "guarderia" con colores primarios saturados
        </Bullet>
        <Bullet>
          "AI slop" — nada que parezca generado por IA sin curacion
        </Bullet>
      </View>

      {/* Paleta orientativa */}
      <Text style={s.h2}>Paleta orientativa</Text>
      <Text style={[s.body, { fontStyle: "italic", marginBottom: 8 }]}>
        No obligatoria — el disenador puede proponer alternativas.
      </Text>
      <BulletBold
        label="Tonos pastel calidos:"
        text="rosa viejo, amarillo suave, verde salvia, azul empolvado"
      />
      <BulletBold
        label="Acentos terrosos:"
        text="terracota suave, mostaza, marron chocolate"
      />
      <BulletBold
        label="Base:"
        text="crema/off-white (como papel acuarela), con un oscuro calido para texto (no negro puro)"
      />

      {/* Referencias */}
      <Text style={s.h2}>Referencias de inspiracion</Text>
      <BulletBold
        label="Oliver Jeffers"
        text="— acuarela, suelto, emocional"
      />
      <BulletBold
        label="Rifle Paper Co."
        text="— paleta pastel, floral, premium"
      />
      <BulletBold
        label="Bonton"
        text="— calido, regalo con identidad"
      />
      <Bullet>
        La marca Wonderbly como referencia de producto (pero nosotros somos mas
        calidos y artesanales)
      </Bullet>

      {/* Sobre el nombre */}
      <Text style={s.h2}>Sobre el nombre "Tipiti"</Text>
      <Bullet>
        El nombre evoca ternura y tiene sonoridad infantil (ti-pi-ti)
      </Bullet>
      <Bullet>
        Puede ser "Tipiti Books" o solo "tipiti" como marca — el disenador puede
        explorar ambas opciones
      </Bullet>
      <Bullet>
        El logo puede incluir un pequeno elemento ilustrado (un animalito, una
        estrella, una pincelada) pero NO es obligatorio — preferimos algo limpio
        que combine bien con las ilustraciones de los libros
      </Bullet>

      <Divider />

      {/* --- Audiencia --- */}
      <Text style={s.sectionTitle}>Audiencia</Text>
      <BulletBold
        label="Compradores:"
        text="Padres, abuelos, tios, amigos — personas de 25-45 anos que buscan un regalo especial para un nino/a de 0-6 anos"
      />
      <BulletBold
        label="Mercado:"
        text="Chile inicialmente, expandiendo a Latinoamerica"
      />
      <BulletBold
        label="Contexto:"
        text="Regalos de cumpleanos, Navidad, baby shower, nacimiento, Dia del Nino"
      />
      <BulletBold
        label="Canales:"
        text="Sitio web (mobile-first), Instagram, TikTok"
      />

      <Divider />

      {/* --- Aplicaciones --- */}
      <Text style={s.sectionTitle}>Aplicaciones de la Marca</Text>
      <Text style={s.body}>La identidad se usara en:</Text>

      <NumberItem n={1}>
        <Text style={s.bodyBold}>Sitio web</Text> (tipitibooks.com) — landing
        page, tienda, checkout
      </NumberItem>
      <NumberItem n={2}>
        <Text style={s.bodyBold}>Libros impresos</Text> — portada,
        contraportada, lomo
      </NumberItem>
      <NumberItem n={3}>
        <Text style={s.bodyBold}>Empaque de regalo</Text> — caja, etiqueta,
        tarjeta de dedicatoria
      </NumberItem>
      <NumberItem n={4}>
        <Text style={s.bodyBold}>Redes sociales</Text> — avatar, stories, posts
      </NumberItem>
      <NumberItem n={5}>
        <Text style={s.bodyBold}>Emails transaccionales</Text> — confirmacion
        de pedido, envio
      </NumberItem>
      <NumberItem n={6}>
        <Text style={s.bodyBold}>Stickers/sellos</Text> — para el empaque
        artesanal
      </NumberItem>

      <Divider />

      {/* --- Info Adicional --- */}
      <Text style={s.sectionTitle}>Informacion Adicional</Text>
      <BulletBold label="Presupuesto:" text="[A COMPLETAR]" />
      <BulletBold label="Plazo:" text="[A COMPLETAR]" />
      <BulletBold
        label="Idioma de comunicacion:"
        text='Espanol (pero la marca se llama "Tipiti Books" en ingles porque apuntamos a expansion internacional)'
      />
      <BulletBold
        label="Formato de entrega final:"
        text="Archivos editables (AI/EPS) + exportaciones (PNG, SVG, PDF) + guia de marca en PDF"
      />

      <View style={{ marginTop: 20 }} />
      <View style={s.blockquote}>
        <Text
          style={[
            s.blockquoteText,
            { textAlign: "center", fontStyle: "italic" },
          ]}
        >
          Tipiti Books — Libros que abrazan.
        </Text>
      </View>

      {/* Footer */}
      <View style={s.footer} fixed>
        <View style={s.footerLine} />
        <Text style={s.footerText}>Tipiti Books — Brand Identity Brief</Text>
        <Text
          style={s.footerText}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

(async () => {
  const output = "./Tipiti-Books-Brand-Brief.pdf";
  await renderToFile(<BrandBrief />, output);
  console.log(`PDF saved to ${output}`);
})();
