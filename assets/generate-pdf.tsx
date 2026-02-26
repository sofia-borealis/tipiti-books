import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  Font,
  StyleSheet,
  renderToFile,
  Svg,
  Rect,
  Circle,
  Line,
  Path,
} from "@react-pdf/renderer";
import * as fs from "fs";
import * as path from "path";

// ─── Workaround for react-pdf bug #3277 ─────────────────────────────
// The `render` prop on Text elements triggers a re-layout pass that can
// produce corrupted box dimensions (e.g. -1.97e+21). PDFKit rejects
// these with "unsupported number". We clamp args on the PDFDocument
// prototype methods that receive numeric coordinates.
const MAX_COORD = 32767;
function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(-MAX_COORD, Math.min(MAX_COORD, n));
}

const PDFDoc = require("@react-pdf/pdfkit").default;
for (const method of ["moveTo", "lineTo", "translate"] as const) {
  const orig = PDFDoc.prototype[method];
  PDFDoc.prototype[method] = function (...args: number[]) {
    return orig.apply(this, args.map(clamp));
  };
}
const origBezier = PDFDoc.prototype.bezierCurveTo;
PDFDoc.prototype.bezierCurveTo = function (...args: number[]) {
  return origBezier.apply(this, args.map(clamp));
};
const origTransform = PDFDoc.prototype.transform;
PDFDoc.prototype.transform = function (...args: number[]) {
  return origTransform.apply(this, args.map(clamp));
};

// ─── Font Registration ───────────────────────────────────────────────

const fontsDir = path.join(__dirname, "fonts");

Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(fontsDir, "Inter-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(fontsDir, "Inter-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(fontsDir, "Inter-Bold.ttf"), fontWeight: "bold" },
    { src: path.join(fontsDir, "Inter-Italic.ttf"), fontStyle: "italic" },
  ],
});

Font.register({
  family: "RobotoMono",
  fonts: [{ src: path.join(fontsDir, "RobotoMono-Regular.ttf"), fontWeight: "normal" }],
});

Font.registerHyphenationCallback((word: string) => [word]);

// ─── Color Palette ───────────────────────────────────────────────────

const COLORS = {
  primary: "#1a1a2e",
  accent: "#e94560",
  accentLight: "#fce4ec",
  secondary: "#16213e",
  text: "#1a1a2e",
  textLight: "#555770",
  textMuted: "#8b8da3",
  bg: "#ffffff",
  bgLight: "#f8f9fc",
  bgCode: "#f1f3f8",
  border: "#e2e4ed",
  borderLight: "#eef0f6",
  tableHeader: "#1a1a2e",
  tableHeaderText: "#ffffff",
  tableRowAlt: "#f8f9fc",
  link: "#0066cc",
  success: "#27ae60",
  warning: "#f39c12",
};

// ─── Styles ──────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: COLORS.bg,
    paddingTop: 50,
    paddingBottom: 65,
    paddingHorizontal: 45,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: COLORS.text,
    lineHeight: 1.55,
  },

  // Cover
  coverPage: {
    flexDirection: "column",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  coverBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 30,
  },
  coverBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#a0a4c0",
    textAlign: "center",
    marginBottom: 40,
  },
  coverDivider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.accent,
    marginBottom: 40,
    borderRadius: 2,
  },
  coverMeta: {
    fontSize: 10,
    color: "#7a7ea0",
    textAlign: "center",
    marginBottom: 4,
  },

  // TOC
  tocPage: {
    flexDirection: "column",
    backgroundColor: COLORS.bg,
    paddingTop: 50,
    paddingBottom: 65,
    paddingHorizontal: 45,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: COLORS.text,
    lineHeight: 1.55,
  },
  tocTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  tocSection: {
    marginBottom: 18,
  },
  tocDocTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 6,
  },
  tocItem: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingLeft: 10,
  },
  tocItemText: {
    fontSize: 9.5,
    color: COLORS.textLight,
    flex: 1,
  },

  // Document separator
  docSeparator: {
    flexDirection: "column",
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  docSepNumber: {
    fontSize: 60,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 10,
    opacity: 0.3,
  },
  docSepTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  docSepSubtitle: {
    fontSize: 11,
    color: "#8a8eb0",
    textAlign: "center",
    maxWidth: 400,
  },

  // Headers
  h1: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 22,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  h2: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  h3: {
    fontSize: 12,
    fontWeight: 600,
    color: COLORS.secondary,
    marginTop: 14,
    marginBottom: 6,
  },
  h4: {
    fontSize: 10.5,
    fontWeight: 600,
    color: COLORS.textLight,
    marginTop: 10,
    marginBottom: 5,
  },

  // Body text
  paragraph: {
    fontSize: 9.5,
    marginBottom: 7,
    lineHeight: 1.6,
    color: COLORS.text,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  inlineCode: {
    fontFamily: "RobotoMono",
    fontSize: 8,
    fontStyle: "normal",
    backgroundColor: COLORS.bgCode,
    color: COLORS.accent,
  },

  // Blockquotes
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    marginLeft: 0,
    borderRadius: 2,
  },
  blockquoteText: {
    fontSize: 9,
    color: COLORS.textLight,
    fontStyle: "italic",
    lineHeight: 1.55,
  },

  // Code blocks
  codeBlock: {
    backgroundColor: COLORS.bgCode,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    marginTop: 2,
  },
  codeText: {
    fontFamily: "RobotoMono",
    fontSize: 7.5,
    color: COLORS.text,
    lineHeight: 1.5,
  },

  // Lists
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  listBullet: {
    width: 14,
    fontSize: 9.5,
    color: COLORS.accent,
  },
  listContent: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.55,
  },
  listItemNested: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 18,
  },

  // Tables
  table: {
    marginBottom: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.tableRowAlt,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.tableHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableCell: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 8,
    lineHeight: 1.4,
  },
  tableCellHeader: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.tableHeaderText,
  },

  // Horizontal rule
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginVertical: 14,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 25,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  footerBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  footerLeft: {
    fontSize: 7.5,
    color: COLORS.textMuted,
  },
  footerRight: {
    fontSize: 7.5,
    color: COLORS.textMuted,
  },

  // Header
  headerBar: {
    position: "absolute",
    top: 20,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 6,
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: COLORS.borderLight,
  },
  headerText: {
    fontSize: 7,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

// ─── Markdown Parser ─────────────────────────────────────────────────

interface ParsedBlock {
  type:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "paragraph"
    | "blockquote"
    | "code"
    | "table"
    | "list"
    | "hr"
    | "empty";
  content: string;
  rows?: string[][];
  items?: { text: string; nested?: { text: string }[] }[];
  lang?: string;
}

function parseMarkdown(md: string): ParsedBlock[] {
  const lines = md.split("\n");
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim()) || /^\*\*\*+\s*$/.test(line.trim())) {
      blocks.push({ type: "hr", content: "" });
      i++;
      continue;
    }

    // Headers
    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", content: line.replace(/^####\s+/, "").replace(/\*\*/g, "") });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", content: line.replace(/^###\s+/, "").replace(/\*\*/g, "") });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", content: line.replace(/^##\s+/, "").replace(/\*\*/g, "") });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", content: line.replace(/^#\s+/, "").replace(/\*\*/g, "") });
      i++;
      continue;
    }

    // Code blocks
    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", content: codeLines.join("\n"), lang });
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|[\s-:|]+\|\s*$/.test(lines[i + 1])) {
      const rows: string[][] = [];
      // Header row
      rows.push(
        line
          .split("|")
          .filter((c) => c.trim() !== "")
          .map((c) => c.trim())
      );
      i++; // skip separator
      i++;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(
          lines[i]
            .split("|")
            .filter((c) => c.trim() !== "")
            .map((c) => c.trim())
        );
        i++;
      }
      blocks.push({ type: "table", content: "", rows });
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", content: quoteLines.join(" ") });
      continue;
    }

    // Lists
    if (/^\s*[-*]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
      const items: { text: string; nested: { text: string }[] }[] = [];
      while (i < lines.length && (/^\s*[-*]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i]))) {
        const currentLine = lines[i];
        const indent = currentLine.search(/\S/);
        const text = currentLine.replace(/^\s*[-*]\s+/, "").replace(/^\s*\d+\.\s+/, "");

        if (indent >= 2 && items.length > 0) {
          items[items.length - 1].nested.push({ text });
        } else {
          items.push({ text, nested: [] });
        }
        i++;

        // Check for continuation lines (indented non-list text)
        while (
          i < lines.length &&
          lines[i].trim() !== "" &&
          !/^\s*[-*]\s/.test(lines[i]) &&
          !/^\s*\d+\.\s/.test(lines[i]) &&
          !lines[i].startsWith("#") &&
          !lines[i].startsWith(">") &&
          !lines[i].startsWith("```") &&
          !lines[i].includes("|") &&
          /^\s{2,}/.test(lines[i])
        ) {
          if (indent >= 2 && items.length > 0 && items[items.length - 1].nested.length > 0) {
            items[items.length - 1].nested[items[items.length - 1].nested.length - 1].text +=
              " " + lines[i].trim();
          } else if (items.length > 0) {
            items[items.length - 1].text += " " + lines[i].trim();
          }
          i++;
        }
      }
      blocks.push({ type: "list", content: "", items });
      continue;
    }

    // Paragraph (collect consecutive non-empty non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^\s*[-*]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i].trim()) &&
      !/^\*\*\*+\s*$/.test(lines[i].trim()) &&
      !(lines[i].includes("|") && i + 1 < lines.length && /^\s*\|[\s-:|]+\|/.test(lines[i + 1] || ""))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", content: paraLines.join(" ") });
    }
  }

  return blocks;
}

// ─── Inline Formatting ───────────────────────────────────────────────

function renderInlineText(text: string, baseStyle: any = {}): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Regex to match: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`([^`]+?)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const cleanText = text.replace(/📋|⬜|✅|❌|🤖|💡|⚡/g, "");

  while ((match = regex.exec(cleanText)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      nodes.push(
        <Text key={key++} style={baseStyle}>
          {cleanText.substring(lastIndex, match.index)}
        </Text>
      );
    }

    if (match[1]) {
      // Bold
      nodes.push(
        <Text key={key++} style={[baseStyle, s.bold]}>
          {match[2]}
        </Text>
      );
    } else if (match[3]) {
      // Italic
      nodes.push(
        <Text key={key++} style={[baseStyle, s.italic]}>
          {match[4]}
        </Text>
      );
    } else if (match[5]) {
      // Inline code
      nodes.push(
        <Text key={key++} style={s.inlineCode}>
          {match[6]}
        </Text>
      );
    } else if (match[7]) {
      // Link
      nodes.push(
        <Link key={key++} src={match[9]}>
          <Text style={[baseStyle, { color: COLORS.link, textDecoration: "underline" }]}>
            {match[8]}
          </Text>
        </Link>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleanText.length) {
    nodes.push(
      <Text key={key++} style={baseStyle}>
        {cleanText.substring(lastIndex)}
      </Text>
    );
  }

  return nodes.length > 0 ? nodes : [<Text key="0" style={baseStyle}>{cleanText}</Text>];
}

// ─── Block Renderers ─────────────────────────────────────────────────

function RenderBlock({ block, idx }: { block: ParsedBlock; idx: number }): React.ReactElement | null {
  switch (block.type) {
    case "h1":
      return (
        <View wrap={false} key={idx}>
          <Text style={s.h1}>{block.content}</Text>
        </View>
      );
    case "h2":
      return (
        <View wrap={false} key={idx}>
          <Text style={s.h2}>{block.content}</Text>
        </View>
      );
    case "h3":
      return (
        <View wrap={false} key={idx} minPresenceAhead={30}>
          <Text style={s.h3}>{block.content}</Text>
        </View>
      );
    case "h4":
      return (
        <View wrap={false} key={idx} minPresenceAhead={25}>
          <Text style={s.h4}>{block.content}</Text>
        </View>
      );

    case "paragraph":
      return (
        <Text style={s.paragraph} key={idx}>
          {renderInlineText(block.content)}
        </Text>
      );

    case "blockquote":
      return (
        <View style={s.blockquote} key={idx} wrap={false}>
          <Text style={s.blockquoteText}>{renderInlineText(block.content, s.blockquoteText)}</Text>
        </View>
      );

    case "code":
      return (
        <View style={s.codeBlock} key={idx}>
          <Text style={s.codeText}>{block.content}</Text>
        </View>
      );

    case "table":
      if (!block.rows || block.rows.length === 0) return null;
      const colCount = block.rows[0].length;
      return (
        <View style={s.table} key={idx}>
          {block.rows.map((row, ri) => {
            const isHeader = ri === 0;
            const rowStyle = isHeader ? s.tableRowHeader : ri % 2 === 0 ? s.tableRowAlt : s.tableRow;
            const cellStyle = isHeader ? s.tableCellHeader : s.tableCell;
            return (
              <View style={rowStyle} key={ri} wrap={false}>
                {row.map((cell, ci) => (
                  <View style={[cellStyle, { flex: 1 }]} key={ci}>
                    <Text style={{ fontSize: 8, color: isHeader ? COLORS.tableHeaderText : COLORS.text }}>
                      {renderInlineText(cell, { fontSize: 8 })}
                    </Text>
                  </View>
                ))}
                {/* Pad if fewer cells */}
                {row.length < colCount &&
                  Array.from({ length: colCount - row.length }).map((_, pi) => (
                    <View style={[cellStyle, { flex: 1 }]} key={`pad-${pi}`}>
                      <Text style={{ fontSize: 8 }}> </Text>
                    </View>
                  ))}
              </View>
            );
          })}
        </View>
      );

    case "list":
      if (!block.items) return null;
      return (
        <View key={idx} style={{ marginBottom: 6 }}>
          {block.items.map((item, li) => (
            <View key={li}>
              <View style={s.listItem}>
                <Text style={s.listBullet}>{"  \u2022"}</Text>
                <Text style={s.listContent}>{renderInlineText(item.text)}</Text>
              </View>
              {item.nested &&
                item.nested.map((sub, si) => (
                  <View style={s.listItemNested} key={si}>
                    <Text style={[s.listBullet, { color: COLORS.textMuted }]}>{"\u2013"}</Text>
                    <Text style={s.listContent}>{renderInlineText(sub.text)}</Text>
                  </View>
                ))}
            </View>
          ))}
        </View>
      );

    case "hr":
      return <View style={s.hr} key={idx} />;

    default:
      return null;
  }
}

// ─── Document Section Renderer ───────────────────────────────────────

function DocSection({
  blocks,
  docLabel,
}: {
  blocks: ParsedBlock[];
  docLabel: string;
}) {
  return (
    <Page size="A4" style={s.page}>
      {/* Header */}
      <View style={s.headerBar} fixed>
        <View style={s.headerBorder} />
        <Text style={s.headerText}>Tipiti Books</Text>
        <Text style={s.headerText}>{docLabel}</Text>
      </View>

      {/* Content */}
      {blocks.map((block, idx) => (
        <RenderBlock block={block} idx={idx} key={idx} />
      ))}

      {/* Footer - border as View to avoid react-pdf render bug #3277 */}
      <View style={s.footer} fixed>
        <View style={s.footerBorder} />
        <Text style={s.footerLeft}>Tipiti Books - Documentacion Tecnica</Text>
        <Text
          style={s.footerRight}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}

// ─── Cover Page ──────────────────────────────────────────────────────

function CoverPage() {
  return (
    <Page size="A4" style={s.coverPage}>
      {/* Logo area */}
      <View style={s.coverBadge}>
        <Text style={s.coverBadgeText}>Documentacion Tecnica</Text>
      </View>

      <Text style={s.coverTitle}>Tipiti Books</Text>
      <Text style={s.coverSubtitle}>
        Plataforma de libros infantiles personalizados con IA
      </Text>

      <View style={s.coverDivider} />

      <Text style={[s.coverMeta, { fontSize: 11, color: "#a0a4c0", marginBottom: 12 }]}>
        Documentos incluidos:
      </Text>
      <Text style={s.coverMeta}>1. PDR - Product Definition Report v2.0</Text>
      <Text style={s.coverMeta}>2. Tech Spec - Especificaciones Tecnicas v1.0</Text>
      <Text style={s.coverMeta}>3. Image Generation Guidelines v2.0</Text>

      <View style={{ marginTop: 50 }}>
        <Text style={[s.coverMeta, { fontSize: 9 }]}>Fecha: Febrero 2026</Text>
        <Text style={[s.coverMeta, { fontSize: 9 }]}>Estado: Aprobado / Borrador</Text>
      </View>
    </Page>
  );
}

// ─── Table of Contents ───────────────────────────────────────────────

function TOCPage({ docs }: { docs: { title: string; blocks: ParsedBlock[] }[] }) {
  return (
    <Page size="A4" style={s.tocPage}>
      <Text style={s.tocTitle}>Contenido</Text>
      {docs.map((doc, di) => {
        const headings = doc.blocks.filter(
          (b) => b.type === "h1" || b.type === "h2"
        );
        return (
          <View style={s.tocSection} key={di}>
            <Text style={s.tocDocTitle}>
              {di + 1}. {doc.title}
            </Text>
            {headings.map((h, hi) => (
              <View style={s.tocItem} key={hi}>
                <Text style={s.tocItemText}>
                  {h.type === "h1" ? "" : "    "}{h.content}
                </Text>
              </View>
            ))}
          </View>
        );
      })}

      {/* Footer - border as View to avoid react-pdf render bug #3277 */}
      <View style={s.footer} fixed>
        <View style={s.footerBorder} />
        <Text style={s.footerLeft}>Tipiti Books - Documentacion Tecnica</Text>
        <Text
          style={s.footerRight}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}

// ─── Section Divider Page ────────────────────────────────────────────

function DividerPage({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle: string;
}) {
  return (
    <Page size="A4" style={s.docSeparator}>
      <Text style={s.docSepNumber}>0{number}</Text>
      <Text style={s.docSepTitle}>{title}</Text>
      <Text style={s.docSepSubtitle}>{subtitle}</Text>
    </Page>
  );
}

// ─── Main Document ───────────────────────────────────────────────────

function TipitiDocsDocument({
  docs,
}: {
  docs: { title: string; subtitle: string; label: string; blocks: ParsedBlock[] }[];
}) {
  return (
    <Document
      title="Tipiti Books - Documentacion Tecnica"
      author="Tipiti Books"
      subject="PDR, Tech Spec, Image Generation Guidelines"
      language="es"
    >
      <CoverPage />
      <TOCPage docs={docs} />

      {docs.map((doc, di) => (
        <React.Fragment key={di}>
          <DividerPage number={di + 1} title={doc.title} subtitle={doc.subtitle} />
          <DocSection blocks={doc.blocks} docLabel={doc.label} />
        </React.Fragment>
      ))}
    </Document>
  );
}

// ─── Main ────────────────────────────────────────────────────────────

(async () => {
  const baseDir = __dirname;

  console.log("Reading markdown files...");

  const pdrContent = fs.readFileSync(path.join(baseDir, "PDR-tipiti-books.md"), "utf-8");
  const techSpecContent = fs.readFileSync(path.join(baseDir, "TECH-SPEC-tipiti-books.md"), "utf-8");
  const imageGuidelinesContent = fs.readFileSync(
    path.join(baseDir, "TIPITI-IMAGE-GENERATION-GUIDELINES.md"),
    "utf-8"
  );

  console.log("Parsing markdown...");

  const docs = [
    {
      title: "Product Definition Report",
      subtitle: "PDR v2.0 - Modelo de pre-generacion por variantes",
      label: "PDR v2.0",
      blocks: parseMarkdown(pdrContent),
    },
    {
      title: "Technical Specifications",
      subtitle: "Tech Spec v1.0 - Stack, arquitectura, base de datos y APIs",
      label: "Tech Spec v1.0",
      blocks: parseMarkdown(techSpecContent),
    },
    {
      title: "Image Generation Guidelines",
      subtitle: "v2.0 - Pipeline de pre-generacion, prompts y QA",
      label: "Image Guidelines v2.0",
      blocks: parseMarkdown(imageGuidelinesContent),
    },
  ];

  console.log(
    `Parsed: PDR=${docs[0].blocks.length} blocks, Tech=${docs[1].blocks.length} blocks, Image=${docs[2].blocks.length} blocks`
  );

  const outputPath = path.join(baseDir, "Tipiti-Books-Documentacion-Tecnica.pdf");

  console.log("Generating PDF...");
  await renderToFile(<TipitiDocsDocument docs={docs} />, outputPath);
  console.log(`PDF saved to: ${outputPath}`);
})();
