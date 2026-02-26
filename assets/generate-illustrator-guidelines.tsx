import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  renderToFile,
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
  accent: "#5B7E6B", // sage green for illustrator doc
  accentDark: "#3D5C4A",
  accentLight: "#EAF2EC",
  heading: "#2D2424",
  divider: "#D4DDCE",
  tagBg: "#EAF2EC",
  tagText: "#3D5C4A",
  warmBg: "#FFF8F0",
  warmBorder: "#E8D5C4",
  terracotta: "#C0785C",
  terracottaLight: "#F5E6DC",
  redBg: "#F5E0E0",
  redText: "#8B3F3F",
  redBorder: "#D4A0A0",
  tableBorder: "#D4DDCE",
  tableHeaderBg: "#E2EBE5",
  tableAltBg: "#F5F9F6",
  white: "#FFFFFF",
  ruleRed: "#C85A5A",
  ruleRedBg: "#FDF2F2",
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
    fontSize: 9.5,
    lineHeight: 1.55,
  },
  // Cover
  coverPage: {
    flexDirection: "column",
    backgroundColor: C.accentDark,
    padding: 0,
    fontFamily: "Inter",
    justifyContent: "center",
    alignItems: "center",
  },
  coverTag: {
    fontSize: 10,
    color: C.white,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: C.white,
    textAlign: "center",
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 15,
    color: C.white,
    opacity: 0.85,
    textAlign: "center",
    marginBottom: 30,
  },
  coverDivider: {
    width: 50,
    height: 2,
    backgroundColor: C.white,
    opacity: 0.4,
    marginBottom: 30,
  },
  coverDetail: {
    fontSize: 10,
    color: C.white,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 360,
  },
  // Section number badge
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginTop: 20,
  },
  sectionNumber: {
    backgroundColor: C.accent,
    color: C.white,
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginRight: 8,
  },
  sectionLabel: {
    fontSize: 9,
    color: C.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: C.heading,
    marginBottom: 12,
  },
  // H2
  h2: {
    fontSize: 13,
    fontWeight: "bold",
    color: C.accent,
    marginBottom: 8,
    marginTop: 14,
  },
  // H3
  h3: {
    fontSize: 11,
    fontWeight: "semibold",
    color: C.heading,
    marginBottom: 6,
    marginTop: 10,
  },
  // Body
  body: {
    fontSize: 9.5,
    lineHeight: 1.55,
    color: C.text,
    marginBottom: 6,
  },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  // Bullet
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 9.5,
    color: C.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: C.text,
  },
  // Sub-bullet
  subBulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 18,
  },
  subBulletDot: {
    width: 12,
    fontSize: 8,
    color: C.textLight,
  },
  // Number item
  numberRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  numberLabel: {
    width: 18,
    fontSize: 9.5,
    fontWeight: "semibold",
    color: C.accent,
  },
  // Blockquote
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    paddingLeft: 12,
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 12,
    backgroundColor: C.accentLight,
    borderRadius: 2,
  },
  blockquoteText: {
    fontSize: 9.5,
    fontStyle: "italic",
    color: C.textLight,
    lineHeight: 1.5,
  },
  // Table
  table: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.tableBorder,
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: C.tableHeaderBg,
    borderBottomWidth: 1,
    borderBottomColor: C.tableBorder,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.tableBorder,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: C.tableAltBg,
    borderBottomWidth: 1,
    borderBottomColor: C.tableBorder,
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableCellHeader: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: C.accentDark,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 9,
    color: C.text,
    paddingHorizontal: 8,
    paddingVertical: 5,
    lineHeight: 1.4,
  },
  // Rule card (for Reglas Inquebrantables)
  ruleCard: {
    backgroundColor: C.ruleRedBg,
    borderLeftWidth: 3,
    borderLeftColor: C.ruleRed,
    borderRadius: 3,
    padding: 10,
    marginBottom: 6,
  },
  ruleNumber: {
    fontSize: 9,
    fontWeight: "bold",
    color: C.ruleRed,
    marginBottom: 2,
  },
  ruleText: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: C.text,
  },
  // Callout
  callout: {
    backgroundColor: C.warmBg,
    borderWidth: 1,
    borderColor: C.warmBorder,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  calloutLabel: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: C.terracotta,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginVertical: 12,
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
    fontSize: 7.5,
    color: C.textLight,
    paddingTop: 6,
  },
  // Phase card
  phaseCard: {
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: C.accentLight,
    borderRadius: 3,
    padding: 8,
  },
  phaseBadge: {
    backgroundColor: C.accent,
    color: C.white,
    fontSize: 8,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  phaseText: {
    flex: 1,
    fontSize: 9,
    color: C.text,
    lineHeight: 1.4,
  },
  // Naming convention code block
  codeBlock: {
    backgroundColor: "#F0F0EC",
    borderRadius: 3,
    padding: 10,
    marginBottom: 8,
  },
  codeLine: {
    fontSize: 8.5,
    fontFamily: "Courier",
    color: C.text,
    lineHeight: 1.6,
  },
});

// --- Helpers ---
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>{"\u2022"}</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const BulletBold = ({ label, text }: { label: string; text: string }) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>{"\u2022"}</Text>
    <Text style={s.bulletText}>
      <Text style={s.bold}>{label}</Text> {text}
    </Text>
  </View>
);

const SubBullet = ({ children }: { children: React.ReactNode }) => (
  <View style={s.subBulletRow}>
    <Text style={s.subBulletDot}>{"\u2013"}</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const NumberItem = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <View style={s.numberRow}>
    <Text style={s.numberLabel}>{n}.</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const Divider = () => <View style={s.divider} />;

const SectionHeader = ({ num, label, title }: { num: number; label: string; title: string }) => (
  <View>
    <View style={s.sectionBadge}>
      <Text style={s.sectionNumber}>{num}</Text>
      <Text style={s.sectionLabel}>{label}</Text>
    </View>
    <Text style={s.sectionTitle}>{title}</Text>
  </View>
);

// Table helpers
type Row = string[];
const Table = ({
  headers,
  rows,
  colWidths,
}: {
  headers: string[];
  rows: Row[];
  colWidths: string[];
}) => (
  <View style={s.table}>
    <View style={s.tableHeaderRow}>
      {headers.map((h, i) => (
        <Text key={i} style={[s.tableCellHeader, { width: colWidths[i] }]}>
          {h}
        </Text>
      ))}
    </View>
    {rows.map((row, ri) => (
      <View
        key={ri}
        style={
          ri === rows.length - 1
            ? s.tableRowLast
            : ri % 2 === 1
              ? s.tableRowAlt
              : s.tableRow
        }
      >
        {row.map((cell, ci) => (
          <Text key={ci} style={[s.tableCell, { width: colWidths[ci] }]}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const RuleCard = ({ num, text }: { num: number; text: string }) => (
  <View style={s.ruleCard} wrap={false}>
    <Text style={s.ruleNumber}>REGLA {num}</Text>
    <Text style={s.ruleText}>{text}</Text>
  </View>
);

const PhaseCard = ({ num, text }: { num: number; text: string }) => (
  <View style={s.phaseCard} wrap={false}>
    <Text style={s.phaseBadge}>FASE {num}</Text>
    <Text style={s.phaseText}>{text}</Text>
  </View>
);

// --- Document ---
const IllustratorGuidelines = () => (
  <Document
    title="Lineamientos para Ilustradora - Tipiti Books"
    author="Tipiti Books"
    subject="FLUX Kontext Max Training Reference Images"
    language="es"
  >
    {/* Cover */}
    <Page size="A4" style={s.coverPage}>
      <View style={{ alignItems: "center" }}>
        <Text style={s.coverTag}>Tipiti Books</Text>
        <Text style={s.coverTitle}>Lineamientos{"\n"}para Ilustradora</Text>
        <Text style={s.coverSubtitle}>
          Imagenes de Referencia para Entrenamiento{"\n"}de Modelo FLUX Kontext Max
        </Text>
        <View style={s.coverDivider} />
        <Text style={s.coverDetail}>
          Este documento es la guia para la ilustradora contratada. Las imagenes
          que cree serviran como referencia visual para entrenar un modelo de IA
          que luego generara todas las variantes del personaje automaticamente.
        </Text>
      </View>
    </Page>

    {/* Content */}
    <Page size="A4" style={s.page}>
      {/* 1. Resumen */}
      <SectionHeader num={1} label="Contexto" title="Resumen del Proyecto" />

      <Text style={s.body}>
        <Text style={s.bold}>Tipiti Books</Text> es una marca chilena de libros
        infantiles personalizados. Cada libro tiene un personaje principal (nino
        o nina) que el comprador configura para que se parezca al destinatario
        del regalo. El estilo visual es{" "}
        <Text style={s.bold}>acuarela pintada a mano</Text>, calido y tierno,
        con calidad de libro infantil editorial premium.
      </Text>

      <View style={s.callout} wrap={false}>
        <Text style={s.calloutLabel}>Tu rol</Text>
        <Text style={s.body}>
          Crear las imagenes de referencia "maestras" que definiran el estilo
          visual de toda la marca. Estas imagenes se usaran para entrenar un
          modelo de IA que generara variantes del personaje (distintos tonos de
          piel, colores de pelo, etc.) manteniendo tu estilo artistico.
        </Text>
      </View>

      <View style={s.callout} wrap={false}>
        <Text style={s.calloutLabel}>Por que importa</Text>
        <Text style={s.body}>
          Si tus imagenes son consistentes y de alta calidad, el modelo aprendera
          tu estilo y lo replicara fielmente en las ~80 variantes de cada libro.
          Si hay inconsistencias, el modelo las amplificara.
        </Text>
      </View>

      <Divider />

      {/* 2. Estilo Artistico */}
      <SectionHeader num={2} label="Direccion visual" title="Estilo Artistico — La Biblia Visual" />

      <Text style={s.h2}>Lo que queremos</Text>
      <Table
        headers={["Elemento", "Descripcion"]}
        colWidths={["25%", "75%"]}
        rows={[
          ["Tecnica", "Acuarela sobre papel — con pinceladas visibles, bordes suaves, manchas de color naturales"],
          ["Paleta", "Pasteles calidos: rosa viejo, amarillo suave, verde salvia, azul empolvado, terracota suave. Base crema/off-white"],
          ["Textura", "Visible — se debe notar la fibra del papel y las capas de acuarela. Nada liso ni digital"],
          ["Iluminacion", "Calida, como luz de lampara de noche. Dorados suaves, sombras delicadas"],
          ["Emocion", 'Tierno, acogedor, como un abrazo. Que transmita la sensacion de "hora de dormir"'],
          ["Detalle", "Rico en pequenos detalles encantadores (peluches, animalitos, objetos curiosos) pero sin saturar"],
          ["Calidad", 'Nivel de libro infantil publicado por editorial premium (no "sketch" ni "boceto")'],
        ]}
      />

      <Text style={s.h2}>Lo que NO queremos</Text>
      <Table
        headers={["Evitar", "Por que"]}
        colWidths={["40%", "60%"]}
        rows={[
          ["3D / Pixar / Disney CGI", "Queremos acuarela artesanal, no animacion digital"],
          ["Anime / Manga", "No es el estilo de la marca"],
          ["Clipart / Vectorial plano", "Necesitamos textura y profundidad"],
          ["Fotorrealismo", "Es un libro infantil, no una foto"],
          ["Colores primarios saturados", "Nada de rojo puro, azul electrico, amarillo chillon"],
          ["Lineas negras gruesas (comic)", "Queremos bordes suaves y difuminados, propios de acuarela"],
          ["Fondo blanco puro", "Siempre fondo crema/papel acuarela con textura"],
          ["Texto dentro de la imagen", "NUNCA — el texto se agrega despues digitalmente"],
        ]}
      />

      <Text style={s.h2}>Artistas de Referencia</Text>
      <BulletBold
        label="Oliver Jeffers"
        text="— Lost and Found, Here We Are: acuarela emocional, suelta, con personalidad"
      />
      <BulletBold
        label="Benji Davies"
        text="— The Storm Whale: acuarela con atmosferas calidas y profundidad"
      />
      <BulletBold
        label="Jon Klassen"
        text="— I Want My Hat Back: simplicidad expresiva, ojos como puntos"
      />
      <BulletBold
        label="Isabelle Arsenault"
        text="— Colette's Lost Pet: paleta pastel, textura de papel real"
      />
      <Text style={[s.body, { fontStyle: "italic", marginTop: 4 }]}>
        No queremos copiar a ninguno — queremos un estilo propio para Tipiti
        Books que viva en ese mismo universo visual.
      </Text>

      <Divider />

      {/* 3. El Personaje */}
      <SectionHeader num={3} label="Personaje" title="El Personaje — Especificaciones Tecnicas" />

      <Text style={s.h2}>3.1 Anatomia Base</Text>
      <Text style={s.body}>
        El personaje es un <Text style={s.bold}>toddler</Text> (nino/a de ~2-3
        anos) con las siguientes caracteristicas FIJAS:
      </Text>

      <Table
        headers={["Caracteristica", "Especificacion"]}
        colWidths={["25%", "75%"]}
        rows={[
          ["Edad visual", "2-3 anos (toddler, proporciones de bebe grande)"],
          ["Proporciones", "Cabeza grande respecto al cuerpo (~1/3 de la altura total), extremidades cortas y redondeadas"],
          ["Ojos", "Dos puntitos negros redondos. SIN iris, SIN color, SIN brillo. Solo dos puntos negros solidos"],
          ["Nariz", "Apenas sugerida — un puntito o pequena curva"],
          ["Boca", 'Pequena, simple, expresiva. Puede ser una linea curva, una "u", o una "o" pequena'],
          ["Mejillas", "Ligeramente rosadas (rubor de acuarela)"],
          ["Manos", "Simplificadas, redondeadas, sin dedos muy definidos"],
          ["Vestimenta", 'Pijama comodo y suelto (el primer libro es "Buenas Noches")'],
        ]}
      />

      <Text style={s.h2}>3.2 Variantes del Personaje</Text>
      <Text style={s.body}>
        El comprador configura su personaje eligiendo entre estas opciones:
      </Text>

      <Table
        headers={["Atributo", "Opciones"]}
        colWidths={["25%", "75%"]}
        rows={[
          ["Genero", "Nino (pelo corto), Nina (pelo largo)"],
          ["Tono de piel", "Claro (palido/rosado), Mate (oliva/medio), Oscuro (marron profundo calido)"],
          ["Color de pelo", "Castano, Pelirrojo, Negro. Para piel clara y mate tambien: Rubio"],
          ["Tipo de pelo", "Liso, Ondulado"],
          ["Lentes", "Si (redondos pequenos), No"],
        ]}
      />

      <View style={s.callout} wrap={false}>
        <Text style={s.calloutLabel}>Nota biologica</Text>
        <Text style={s.body}>
          Para piel oscura, solo se ofrece pelo negro (no rubio ni pelirrojo).
          Para piel clara y mate se ofrecen los 4 colores.
        </Text>
      </View>

      <Text style={s.h2}>3.3 Variante Base para Ilustrar</Text>
      <View style={[s.callout, { borderWidth: 1, borderColor: C.accent, backgroundColor: C.accentLight }]} wrap={false}>
        <Text style={s.calloutLabel}>Variante principal</Text>
        <Text style={s.body}>
          Nina, piel mate (oliva), pelo castano ondulado, sin lentes.{"\n"}
          Pijama celeste claro con estrellitas blancas.
        </Text>
      </View>

      <Text style={s.h3}>Variantes adicionales minimas a ilustrar:</Text>
      <NumberItem n={1}>
        <Text style={s.bold}>Nino</Text>, piel clara, pelo rubio liso, sin lentes — pijama verde suave
      </NumberItem>
      <NumberItem n={2}>
        <Text style={s.bold}>Nina</Text>, piel oscura, pelo negro ondulado, sin lentes — pijama rosa viejo
      </NumberItem>
      <NumberItem n={3}>
        <Text style={s.bold}>Nino</Text>, piel mate, pelo negro liso, con lentes redondos — pijama amarillo suave
      </NumberItem>
      <NumberItem n={4}>
        <Text style={s.bold}>Nina</Text>, piel clara, pelo pelirrojo liso, con lentes redondos — pijama lavanda
      </NumberItem>

      <Divider />

      {/* 4. Entregables */}
      <SectionHeader num={4} label="Entregables" title="Que Necesitamos que Ilustres" />

      {/* 4.1 Portrait */}
      <Text style={s.h2}>4.1 PORTRAIT (Money Shot)</Text>
      <Text style={[s.body, { fontStyle: "italic" }]}>
        1 por variante — Un retrato frontal del personaje que define su identidad
        visual PARA SIEMPRE.
      </Text>
      <BulletBold label="Vista:" text="Frontal (mirando al espectador)" />
      <BulletBold label="Encuadre:" text="Desde el pecho hacia arriba" />
      <BulletBold label="Expresion:" text="Calida, amigable, levemente sonolienta (es hora de dormir)" />
      <BulletBold label="Fondo:" text="Neutro, crema calido con textura de acuarela (sin elementos de escena)" />
      <BulletBold label="Resolucion:" text="Minimo 2048 x 2048 px" />
      <BulletBold label="Formato:" text="PNG con fondo (NO transparente)" />
      <BulletBold label="Cantidad:" text="5 portraits (1 base + 4 variantes)" />

      {/* 4.2 Character Sheet */}
      <Text style={s.h2}>4.2 CHARACTER SHEET</Text>
      <Text style={[s.body, { fontStyle: "italic" }]}>
        1 por variante — Lamina con 4 vistas del mismo personaje para que el modelo
        entienda como se ve desde distintos angulos.
      </Text>
      <Text style={s.h3}>Las 4 vistas:</Text>
      <NumberItem n={1}>
        <Text style={s.bold}>Frontal</Text> — mirando de frente (puede ser igual al portrait pero de cuerpo entero)
      </NumberItem>
      <NumberItem n={2}>
        <Text style={s.bold}>Lateral</Text> — perfil (mirando a la derecha)
      </NumberItem>
      <NumberItem n={3}>
        <Text style={s.bold}>Tres cuartos (3/4)</Text> — girado ~45 grados respecto al frontal
      </NumberItem>
      <NumberItem n={4}>
        <Text style={s.bold}>Cuerpo completo</Text> — de pie, mostrando proporciones y vestimenta completa
      </NumberItem>
      <BulletBold label="Formato:" text="Las 4 vistas en UNA SOLA imagen (model sheet). Fondo neutro crema." />
      <BulletBold label="Resolucion:" text="Minimo 4096 x 2048 px (horizontal)" />
      <BulletBold label="Cantidad:" text="5 character sheets" />

      {/* 4.3 Setting Sheet */}
      <Text style={s.h2}>4.3 SETTING SHEET</Text>
      <Text style={[s.body, { fontStyle: "italic" }]}>
        1 por libro — Lamina con 3 vistas del ambiente/escenario. Para "Buenas Noches":
        la habitacion del nino/a.
      </Text>
      <Text style={s.h3}>Las 3 vistas:</Text>
      <NumberItem n={1}>
        <Text style={s.bold}>Frontal</Text> — vista principal de la habitacion (desde la puerta)
      </NumberItem>
      <NumberItem n={2}>
        <Text style={s.bold}>Lateral</Text> — misma habitacion desde el costado de la cama
      </NumberItem>
      <NumberItem n={3}>
        <Text style={s.bold}>Detalle</Text> — close-up de un rincon con elementos recurrentes
      </NumberItem>

      <View style={s.callout} wrap={false}>
        <Text style={s.calloutLabel}>Elementos obligatorios</Text>
        <Text style={s.body}>
          SIN personaje en la escena (habitacion vacia). Debe incluir: cama con
          almohadas y cobija suave, ventana con estrellas/luna, lampara de noche
          encendida (luz calida), peluches, libros apilados, un ratoncito dormido
          en algun rincon (easter egg recurrente).
        </Text>
      </View>
      <BulletBold label="Resolucion:" text="Minimo 4096 x 2048 px" />
      <BulletBold label="Cantidad:" text='1 setting sheet para "Buenas Noches"' />

      {/* 4.4 Escenas */}
      <Text style={s.h2}>4.4 ESCENAS DE REFERENCIA</Text>
      <Text style={[s.body, { fontStyle: "italic" }]}>
        3 escenas completas (personaje + ambiente) que muestren como se ve una
        pagina final del libro.
      </Text>

      <Text style={s.h3}>Composicion:</Text>
      <Bullet>Formato horizontal (ratio ~22:18, similar al libro impreso)</Bullet>
      <Bullet>El personaje debe estar a la IZQUIERDA o DERECHA, nunca en el centro exacto</Bullet>
      <Bullet>Dejar espacio vacio (~25% de la imagen) donde ira el texto</Bullet>
      <Bullet>Incluir al menos un "easter egg": animalito escondido, peluche, mariposa, etc.</Bullet>

      <Text style={s.h3}>Las 3 escenas (variante base):</Text>
      <NumberItem n={1}>
        El personaje sentado en la cama con un peluche, bostezando. Luz calida de lampara.
      </NumberItem>
      <NumberItem n={2}>
        El personaje mirando por la ventana las estrellas, de espaldas/perfil. Luz de luna azulada.
      </NumberItem>
      <NumberItem n={3}>
        El personaje dormido, acurrucado con una cobija suave. Iluminacion tenue, sensacion de paz.
      </NumberItem>
      <BulletBold label="Resolucion:" text="Minimo 5197 x 2126 px (300 DPI para impresion 22x18 cm)" />
      <BulletBold label="Cantidad:" text="3 escenas" />

      {/* 4.5 Style References */}
      <Text style={s.h2}>4.5 STYLE REFERENCES</Text>
      <Text style={[s.body, { fontStyle: "italic" }]}>
        3-5 imagenes que muestren tu estilo artistico sin personaje ni escena. Pueden ser:
      </Text>
      <Bullet>Texturas de acuarela sobre papel</Bullet>
      <Bullet>Objetos sueltos pintados en tu estilo (peluche, taza de leche, luna, estrellas, flores)</Bullet>
      <Bullet>Patrones decorativos para guardas del libro</Bullet>
      <Bullet>Detalles de tus pinceladas caracteristicas</Bullet>
      <BulletBold label="Resolucion:" text="Minimo 2048 x 2048 px" />
      <BulletBold label="Cantidad:" text="3-5 imagenes" />

      <Divider />

      {/* 5. Resumen de Entregables */}
      <SectionHeader num={5} label="Resumen" title="Resumen de Entregables" />

      <Table
        headers={["Entregable", "Cant.", "Resolucion minima", "Formato"]}
        colWidths={["35%", "12%", "35%", "18%"]}
        rows={[
          ["Portraits (money shots)", "5", "2048 x 2048 px", "PNG"],
          ["Character Sheets (4 vistas)", "5", "4096 x 2048 px", "PNG"],
          ["Setting Sheet (3 vistas)", "1", "4096 x 2048 px", "PNG"],
          ["Escenas completas", "3", "5197 x 2126 px", "PNG"],
          ["Style references", "3-5", "2048 x 2048 px", "PNG"],
          ["TOTAL DE ARCHIVOS", "17-19", "", ""],
        ]}
      />

      <Divider />

      {/* 6. Reglas Inquebrantables */}
      <SectionHeader num={6} label="Critico" title="Reglas Inquebrantables" />
      <Text style={[s.body, { marginBottom: 8 }]}>
        Estas reglas deben respetarse en TODAS las imagenes sin excepcion:
      </Text>

      <RuleCard
        num={1}
        text='NUNCA incluir texto, letras, palabras o numeros dentro de la imagen. El texto se agrega despues digitalmente. Si estas tentada de escribir el nombre del nino o "Buenas Noches" — NO lo hagas.'
      />
      <RuleCard
        num={2}
        text="Los ojos siempre son dos puntitos negros. Sin iris, sin color, sin brillo, sin pupilas detalladas. Dos puntos negros redondos y nada mas."
      />
      <RuleCard
        num={3}
        text="Consistencia entre vistas. El mismo personaje debe tener exactamente las mismas proporciones, colores, y detalles en el portrait, el character sheet, y las escenas."
      />
      <RuleCard
        num={4}
        text="Fondo siempre con textura. Nunca blanco puro. Siempre crema/off-white con textura visible de papel acuarela."
      />
      <RuleCard
        num={5}
        text="Sin bordes ni marcos. Las imagenes llegan hasta el borde (bleed). No agregar marcos, bordes, lineas divisorias, ni decoraciones alrededor."
      />
      <RuleCard
        num={6}
        text="La imagen debe ser 100% tuya. No usar imagenes de stock, assets de terceros, ni generaciones de IA como base. Necesitamos ilustraciones originales para entrenar el modelo legalmente."
      />

      <Divider />

      {/* 7. Proceso de Trabajo */}
      <SectionHeader num={7} label="Proceso" title="Proceso de Trabajo Sugerido" />

      <PhaseCard
        num={1}
        text="Variante base: Crear el portrait y character sheet de la variante base (nina mate, pelo castano ondulado). Enviar para revision antes de continuar."
      />
      <PhaseCard
        num={2}
        text='Setting: Crear el setting sheet de "Buenas Noches". Enviar para revision.'
      />
      <PhaseCard
        num={3}
        text="Escenas: Crear las 3 escenas completas con la variante base. Enviar para revision."
      />
      <PhaseCard
        num={4}
        text="Variantes adicionales: Crear portraits y character sheets de las 4 variantes adicionales."
      />
      <PhaseCard
        num={5}
        text="Style references: Crear las 3-5 imagenes de estilo/textura."
      />

      <View style={s.callout} wrap={false}>
        <Text style={s.calloutLabel}>Revisiones</Text>
        <Text style={s.body}>
          Incluimos 2 rondas de revision por fase. Los ajustes tipicos seran de
          proporciones, paleta de colores, y nivel de detalle.
        </Text>
      </View>

      <Divider />

      {/* 8. Especificaciones Tecnicas */}
      <SectionHeader num={8} label="Tecnico" title="Especificaciones Tecnicas para Entrega" />

      <BulletBold label="Formato de archivo:" text="PNG (sin compresion lossy)" />
      <BulletBold label="Espacio de color:" text="sRGB para imagenes digitales. Si puedes entregar tambien version CMYK, ideal (para impresion)" />
      <BulletBold label="Resolucion minima:" text="300 DPI en tamano de impresion (22 x 18 cm para escenas)" />

      <Text style={s.h3}>Naming convention:</Text>
      <View style={s.codeBlock}>
        <Text style={s.codeLine}>portrait-[variante].png</Text>
        <Text style={s.codeLine}>  ej: portrait-girl-medium-brown-wavy.png</Text>
        <Text style={s.codeLine}> </Text>
        <Text style={s.codeLine}>charsheet-[variante].png</Text>
        <Text style={s.codeLine}>  ej: charsheet-boy-light-blonde-straight.png</Text>
        <Text style={s.codeLine}> </Text>
        <Text style={s.codeLine}>setting-buenas-noches-[vista].png</Text>
        <Text style={s.codeLine}>  ej: setting-buenas-noches-all.png</Text>
        <Text style={s.codeLine}> </Text>
        <Text style={s.codeLine}>scene-buenas-noches-[numero].png</Text>
        <Text style={s.codeLine}>  ej: scene-buenas-noches-01.png</Text>
        <Text style={s.codeLine}> </Text>
        <Text style={s.codeLine}>style-ref-[numero].png</Text>
        <Text style={s.codeLine}>  ej: style-ref-01.png</Text>
      </View>

      <Divider />

      {/* 9. Contexto */}
      <SectionHeader num={9} label="Contexto IA" title="Contexto sobre el Entrenamiento del Modelo" />

      <Text style={s.body}>Para que entiendas como se usaran tus imagenes:</Text>

      <NumberItem n={1}>
        Tus <Text style={s.bold}>portraits y character sheets</Text> se usaran
        para entrenar al modelo FLUX Kontext Max a "entender" tu estilo de
        personaje. Luego, el modelo generara ~80 variantes (distintas
        combinaciones de piel, pelo, lentes) replicando tu estilo.
      </NumberItem>
      <NumberItem n={2}>
        Tu <Text style={s.bold}>setting sheet</Text> se usara como referencia de
        ambiente. El modelo lo usa para mantener el escenario consistente en
        todas las paginas.
      </NumberItem>
      <NumberItem n={3}>
        Tus <Text style={s.bold}>escenas completas</Text> le ensenan al modelo
        como componer una pagina final: donde va el personaje, como interactua
        con el ambiente, donde queda el espacio para texto.
      </NumberItem>
      <NumberItem n={4}>
        Tus <Text style={s.bold}>style references</Text> le ensenan la textura y
        tecnica de acuarela para que no derive hacia estilos digitales.
      </NumberItem>

      <View style={[s.blockquote, { marginTop: 10 }]} wrap={false}>
        <Text style={s.blockquoteText}>
          Cuanto mas consistente y de alta calidad sea tu trabajo, mejor sera el
          resultado del modelo. Por eso las reglas de consistencia son tan
          estrictas — no es perfeccionismo, es necesidad tecnica.
        </Text>
      </View>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Text style={[s.body, { fontStyle: "italic", color: C.textLight, textAlign: "center" }]}>
          Tipiti Books — Libros que abrazan.
        </Text>
      </View>

      {/* Footer */}
      <View style={s.footer} fixed>
        <View style={s.footerLine} />
        <Text style={s.footerText}>Tipiti Books — Illustrator Guidelines</Text>
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
  const output = "./Tipiti-Books-Illustrator-Guidelines.pdf";
  await renderToFile(<IllustratorGuidelines />, output);
  console.log(`PDF saved to ${output}`);
})();
