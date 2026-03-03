import re
from pathlib import Path
from dataclasses import dataclass
from config import settings


@dataclass
class Chunk:
    text: str
    metadata: dict  # title, source_file, heading_breadcrumb


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML frontmatter and return (metadata_dict, body)."""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            fm_lines = parts[1].strip().split("\n")
            meta = {}
            for line in fm_lines:
                if ":" in line:
                    key, _, val = line.partition(":")
                    meta[key.strip()] = val.strip().strip('"').strip("'")
            return meta, parts[2]
    return {}, content


def split_by_headings(body: str) -> list[tuple[str, str]]:
    """Split markdown body into (heading_breadcrumb, section_text) pairs."""
    sections = []
    current_heading = "Introduction"
    current_lines = []

    for line in body.split("\n"):
        heading_match = re.match(r"^(#{1,3})\s+(.+)", line)
        if heading_match:
            if current_lines:
                text = "\n".join(current_lines).strip()
                if text:
                    sections.append((current_heading, text))
            current_heading = heading_match.group(2).strip("*").strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines:
        text = "\n".join(current_lines).strip()
        if text:
            sections.append((current_heading, text))

    return sections


def chunk_text(text: str, max_chars: int = None, overlap: int = None) -> list[str]:
    """Split text into overlapping chunks by character count."""
    max_chars = max_chars or settings.CHUNK_SIZE
    overlap = overlap or settings.CHUNK_OVERLAP
    if len(text) <= max_chars:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + max_chars
        # Try to break at a sentence boundary
        if end < len(text):
            last_period = text.rfind(".", start, end)
            last_newline = text.rfind("\n", start, end)
            break_at = max(last_period, last_newline)
            if break_at > start:
                end = break_at + 1
        chunks.append(text[start:end].strip())
        start = end - overlap
    return chunks


def chunk_markdown_file(filepath: Path) -> list[Chunk]:
    """Parse a markdown file and return semantic chunks with metadata."""
    content = filepath.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(content)
    title = frontmatter.get("title", filepath.stem)
    source = filepath.name

    sections = split_by_headings(body)
    chunks = []
    for heading, section_text in sections:
        # Remove mermaid blocks and code fences for cleaner embeddings
        clean = re.sub(r"```mermaid[\s\S]*?```", "", section_text)
        clean = re.sub(r"```[\s\S]*?```", "[code example]", clean)
        clean = clean.strip()
        if not clean or len(clean) < 50:
            continue

        for piece in chunk_text(clean):
            chunks.append(Chunk(
                text=piece,
                metadata={
                    "title": title,
                    "source_file": source,
                    "heading": heading,
                    "breadcrumb": f"{title} > {heading}",
                },
            ))
    return chunks
