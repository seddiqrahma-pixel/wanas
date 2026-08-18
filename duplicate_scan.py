#!/usr/bin/env python3
"""
Wanas Image Duplicate Scanner & Organization Planner
Scans fb_photos/, review/, and products/ for exact duplicates (SHA-256)
and likely-renamed duplicates (same size + similar naming).
"""

import os
import hashlib
import re
from collections import defaultdict
from pathlib import Path

WORKSPACE = Path("/Users/ahmed.alghoraib/Desktop/Wanas")
FOLDERS = {
    "fb_photos": WORKSPACE / "fb_photos",
    "review": WORKSPACE / "review",
    "products": WORKSPACE / "products",
}


def scan_files():
    """Walk all folders, collect .jpg/.png files with size + hash."""
    results = []
    for folder_name, folder_path in FOLDERS.items():
        if not folder_path.exists():
            print(f"WARNING: {folder_path} does not exist")
            continue
        for root, dirs, files in os.walk(folder_path):
            for fname in files:
                if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                    fpath = Path(root) / fname
                    size = fpath.stat().st_size
                    # Compute SHA-256
                    h = hashlib.sha256()
                    with open(fpath, 'rb') as f:
                        while True:
                            chunk = f.read(65536)
                            if not chunk:
                                break
                            h.update(chunk)
                    sha = h.hexdigest()
                    results.append({
                        'path': fpath,
                        'folder': folder_name,
                        'name': fname,
                        'size': size,
                        'sha256': sha,
                    })
    return results


def extract_similar_name_tokens(name: str) -> set:
    """Extract lowercase tokens from filename for similarity matching."""
    # Strip extension
    base = name.rsplit('.', 1)[0].lower()
    # Split on common separators
    tokens = re.split(r'[\s_\-\.]+', base)
    # Filter empty and numeric-only tokens
    tokens = {t for t in tokens if t and not t.isdigit()}
    # Also keep the full base as a token
    tokens.add(base)
    return tokens


def find_likely_renamed_duplicates(files):
    """
    Group files by size (same bytes might mean same photo renamed).
    Within each size group, check for visually similar naming patterns.
    Returns list of (target_file, [suspected_copies]) tuples.
    """
    # Group by size
    by_size = defaultdict(list)
    for f in files:
        by_size[f['size']].append(f)

    likely = []
    for size, group in by_size.items():
        if len(group) < 2:
            continue
        # Within a size group, check name overlap
        for i, a in enumerate(group):
            a_tokens = extract_similar_name_tokens(a['name'])
            for b in group[i+1:]:
                b_tokens = extract_similar_name_tokens(b['name'])
                # Check if they share meaningful tokens
                common = a_tokens & b_tokens
                if len(common) >= 1:
                    likely.append((a, b, common))
    return likely


def main():
    print("=" * 70)
    print("WANAS IMAGE DUPLICATE SCAN REPORT")
    print("=" * 70)
    print()

    files = scan_files()
    print(f"Total image files scanned: {len(files)}")
    print()

    # --- EXACT DUPLICATES (by SHA-256) ---
    by_hash = defaultdict(list)
    for f in files:
        by_hash[f['sha256']].append(f)

    exact_dup_clusters = {h: grp for h, grp in by_hash.items() if len(grp) > 1}
    unique_hashes = len(by_hash) - len(exact_dup_clusters)
    duplicate_files = sum(len(grp) - 1 for grp in exact_dup_clusters.values())

    print("-" * 70)
    print("SECTION 1: EXACT DUPLICATES (SHA-256 match — identical bytes)")
    print("-" * 70)
    print(f"Total unique images (by hash): {unique_hashes}")
    print(f"Total duplicate files (extra copies): {duplicate_files}")
    print()

    if exact_dup_clusters:
        for idx, (sha, group) in enumerate(exact_dup_clusters.items(), 1):
            print(f"  CLUSTER {idx} — Hash: {sha[:16]}... ({len(group)} files)")
            # Pick canonical: prefer the one in a non-review folder, or shortest path
            canonical = None
            for f in sorted(group, key=lambda x: (
                0 if x['folder'] != 'review' else 1,
                len(str(x['path']))
            )):
                canonical = f
                break
            for f in group:
                marker = " <-- CANONICAL (keep)" if f == canonical else ""
                print(f"    {f['folder']}/{f['name']}  [{f['size']:,} bytes]{marker}")
            print()
    else:
        print("  No exact SHA-256 duplicates found.")
        print()

    # --- LIKELY RENAMED DUPLICATES ---
    likely = find_likely_renamed_duplicates(files)

    print("-" * 70)
    print("SECTION 2: LIKELY RENAMED / COPIED DUPLICATES")
    print("(Same file size + shared name tokens — possibly same photo)")
    print("-" * 70)
    if likely:
        # Group by file pairs for readability
        seen_pairs = set()
        for a, b, common in likely:
            pair_key = tuple(sorted([str(a['path']), str(b['path'])]))
            if pair_key in seen_pairs:
                continue
            seen_pairs.add(pair_key)
            tokens_str = ", ".join(sorted(common)) if common else "(no token overlap)"
            print(f"  {a['folder']}/{a['name']} ({a['size']:,} bytes)")
            print(f"    vs")
            print(f"  {b['folder']}/{b['name']} ({b['size']:,} bytes)")
            print(f"    Shared tokens: {tokens_str}")
            print()
    else:
        print("  No likely-renamed duplicates detected by token matching.")
        print()

    # --- FB_PHOTOS vs REVIEW CROSS-MATCH ---
    print("-" * 70)
    print("SECTION 3: FB_PHOTOS ↔ REVIEW CROSS-MATCH")
    print("-" * 70)

    fb_files = [f for f in files if f['folder'] == 'fb_photos']
    review_files = [f for f in files if f['folder'] == 'review']

    # 3a: Exact hash match between fb_photos and review
    fb_by_hash = {f['sha256']: f for f in fb_files}
    review_by_hash = {f['sha256']: f for f in review_files}
    shared_hashes = set(fb_by_hash.keys()) & set(review_by_hash.keys())

    if shared_hashes:
        print("  EXACT HASH MATCHES (SHA-256 identical):")
        for sha in shared_hashes:
            fb = fb_by_hash[sha]
            rv = review_by_hash[sha]
            print(f"    fb_photos: {fb['name']} == review: {rv['name']}")
            print(f"      Both {fb['size']:,} bytes, hash {sha[:16]}...")
        print()
    else:
        print("  No exact SHA-256 matches between fb_photos and review.")
        print()

    # 3b: Same size matches between fb_photos and review
    fb_sizes = {f['size']: f for f in fb_files}
    review_sizes = {f['size']: f for f in review_files}
    shared_sizes = set(fb_sizes.keys()) & set(review_sizes.keys())

    if shared_sizes:
        print("  SAME SIZE MATCHES (possible renamed copies):")
        for size in sorted(shared_sizes):
            fb = fb_sizes[size]
            rv = review_sizes[size]
            fb_tokens = extract_similar_name_tokens(fb['name'])
            rv_tokens = extract_similar_name_tokens(rv['name'])
            common = fb_tokens & rv_tokens
            if common:
                print(f"    fb_photos: {fb['name']} <-> review: {rv['name']}")
                print(f"      Size: {size:,} bytes, Shared tokens: {', '.join(sorted(common))}")
            else:
                print(f"    fb_photos: {fb['name']} <-> review: {rv['name']}")
                print(f"      Size: {size:,} bytes (no token overlap — different photos at same size)")
        print()
    else:
        print("  No same-size matches between fb_photos and review.")
        print()

    # --- PRODUCT FOLDER INTEGRITY CHECK ---
    print("-" * 70)
    print("SECTION 4: PRODUCT FOLDER INTEGRITY CHECK")
    print("-" * 70)

    product_folders = sorted([d for d in (WORKSPACE / "products").iterdir() if d.is_dir()])
    issues = []

    for pf in product_folders:
        name = pf.name
        has_main = (pf / "main.jpg").exists()
        has_main_png = (pf / "main.png").exists()
        has_main_any = has_main or has_main_png
        has_root_jpg = any((pf / f).exists() for f in [f"{name}.jpg", f"{name}.png"])

        # Gallery images
        gallery_expected = {'g1.jpg', 'g2.jpg', 'g3.jpg', 'g4.jpg'}
        gallery_present = set()
        for gf in gallery_expected:
            if (pf / gf).exists():
                gallery_present.add(gf)
        missing_gallery = gallery_expected - gallery_present

        print(f"  {name}/")
        print(f"    main.jpg: {'✓' if has_main else '✗ MISSING'}")
        print(f"    root .jpg: {'✓' if has_root_jpg else '✗ MISSING'}")
        if missing_gallery:
            print(f"    gallery missing: {', '.join(sorted(missing_gallery))}")
        else:
            print(f"    gallery: ✓ all 4 present (g1-g4)")
        print(f"    total files: {len(list(pf.glob('*.jpg')) + list(pf.glob('*.png')))}")
        print()

        if not has_main_any:
            issues.append(f"  MISSING main.jpg: {name}/")
        if missing_gallery:
            issues.append(f"  MISSING gallery: {name}/ — {', '.join(sorted(missing_gallery))}")

    if issues:
        print("  ISSUES FOUND:")
        for issue in issues:
            print(issue)
    else:
        print("  All product folders have main.jpg + full gallery.")
    print()

    # --- IMAGE INVENTORY ---
    print("-" * 70)
    print("SECTION 5: COMPLETE IMAGE INVENTORY")
    print("-" * 70)

    for folder_name in ["fb_photos", "review", "products"]:
        folder_files = [f for f in files if f['folder'] == folder_name]
        if folder_name == "products":
            # Group by product subfolder
            by_product = defaultdict(list)
            for f in folder_files:
                rel = f['path'].relative_to(WORKSPACE / "products")
                product = rel.parts[0]
                by_product[product].append(f)

            for product in sorted(by_product.keys()):
                pf_files = sorted(by_product[product], key=lambda x: x['name'])
                print(f"  products/{product}/")
                for f in pf_files:
                    print(f"    {f['name']}  [{f['size']:,} bytes]  hash={f['sha256'][:12]}...")
                print()
        else:
            folder_files.sort(key=lambda x: x['name'])
            for f in folder_files:
                print(f"  {folder_name}/{f['name']}  [{f['size']:,} bytes]  hash={f['sha256'][:12]}...")
            print()

    # --- SUGGESTED CLEAN STRUCTURE ---
    print("-" * 70)
    print("SECTION 6: SUGGESTED CLEAN FOLDER STRUCTURE")
    print("-" * 70)
    print("""
  WANAS/
  ├── images/                    # Single curated image source
  │   ├── product_photos/
  │   │   ├── p_jar_100/
  │   │   │   ├── main.jpg        (from products/p_jar_100/main.jpg)
  │   │   │   └── gallery/
  │   │   │       ├── g1.jpg
  │   │   │       ├── g2.jpg
  │   │   │       ├── g3.jpg
  │   │   │       └── g4.jpg
  │   │   ├── p_jar_150/ ... (same pattern)
  │   │   ├── p_jar_250/ ...
  │   │   ├── p_jar_380/ ...
  │   │   ├── p_lantern/ ...
  │   │   ├── p_wave/ ...
  │   │   ├── p_wool_ball/ ...
  │   │   └── p_wardrobe_diffuser/ ...
  │   │
  │   ├── review_photos/         # Clean canonical images from review/
  │   │   ├── 1_amber_jar.jpg
  │   │   ├── 2_rose_candle.jpg
  │   │   ├── 3_cloud_candle.jpg
  │   │   ├── 4_flower_bouquet.jpg
  │   │   ├── 5_soap_rose.jpg
  │   │   ├── 6_floral_candle.jpg
  │   │   ├── 7_candle_bouquet.jpg
  │   │   ├── 8_wax_tablet.jpg
  │   │   ├── 9_date_candle.jpg
  │   │   ├── 10_mosque_candle.jpg
  │   │   └── 11_coffee_cup_candle.jpg
  │   │
  │   └── fb_source/             # Cleaned Facebook origin photos
  │       └── fb_photos_clean/   # De-duplicated, renamed consistently
  │
  ├── fb_photos/                 # RETAIN as-is for reference (or archive)
  ├── review/                    # RETAIN as-is for reference (or archive)
  └── products/                  # Can be restructured or retained
""")

    print("-" * 70)
    print("SUMMARY")
    print("-" * 70)
    print(f"  Total image files scanned:      {len(files)}")
    print(f"  Unique images (by SHA-256):    {unique_hashes}")
    print(f"  Exact duplicate files:          {duplicate_files}")
    print(f"  Likely-renamed duplicates:      {len(likely)} pairs detected")
    print(f"  Exact fb_photos↔review matches: {len(shared_hashes)}")
    print(f"  Same-size fb_photos↔review:     {len(shared_sizes)}")
    print(f"  Product folder issues:          {len(issues)}")
    print()
    print("Report generated successfully.")


if __name__ == "__main__":
    main()
