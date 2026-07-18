#!/usr/bin/env python3
"""Small dependency-free structural audit for the static expedition site."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AuditParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.links: list[str] = []
        self.assets: list[str] = []
        self.images = 0
        self.images_without_alt = 0
        self.required_fields = 0
        self.forms = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag == "a" and values.get("href", "").startswith("#"):
            self.links.append((values.get("href") or "")[1:])
        if tag in {"img", "script", "link"}:
            source = values.get("src") or values.get("href")
            if source and not source.startswith(("http:", "https:", "data:", "#")):
                self.assets.append(source)
        if tag == "img":
            self.images += 1
            if "alt" not in values:
                self.images_without_alt += 1
        if tag in {"input", "select", "textarea"} and "required" in values:
            self.required_fields += 1
        if tag == "form":
            self.forms += 1


def main() -> None:
    parser = AuditParser()
    parser.feed((ROOT / "index.html").read_text())

    duplicate_ids = [item for item, count in Counter(parser.ids).items() if count > 1]
    missing_targets = [target for target in parser.links if target and target not in parser.ids]
    missing_assets = [asset for asset in parser.assets if not (ROOT / asset).exists()]

    checks = {
        "duplicate IDs": duplicate_ids,
        "missing anchor targets": missing_targets,
        "missing local assets": missing_assets,
        "images without alt": parser.images_without_alt,
    }

    for label, value in checks.items():
        print(f"{label}: {value or 'none'}")
    print(f"images: {parser.images}")
    print(f"forms: {parser.forms}")
    print(f"required form fields: {parser.required_fields}")

    if duplicate_ids or missing_targets or missing_assets or parser.images_without_alt:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
