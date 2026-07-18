#!/usr/bin/env bash
#
# run-tests.sh — self-contained test suite for the kevin-website static site.
#
# Enforces the Portka standard version sync (SemVer + package.json / CHANGELOG / README agree),
# then validates the built site: every locally-referenced asset resolves on disk, required SEO /
# social / accessibility meta is present, there's exactly one <h1>, and no Carrd export cruft
# survived the rebuild.
#
# Usage:  bash tests/run-tests.sh   (or: npm test)
# Exit:   0 if nothing FAILed, 1 otherwise. Missing optional tools SKIP, never fail.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT" || { echo "cannot cd to repo root: $ROOT" >&2; exit 1; }

PASS=0; FAIL=0; SKIP=0
pass() { printf '  \033[32mPASS\033[0m  %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; FAIL=$((FAIL + 1)); }
skip() { printf '  \033[33mSKIP\033[0m  %s\n' "$1"; SKIP=$((SKIP + 1)); }
section() { printf '\n\033[1m%s\033[0m\n' "$1"; }

have_py=1; command -v python3 >/dev/null 2>&1 || have_py=0

# --- 1. Version source of truth is valid SemVer ---------------------------------------
section "Versioning — SemVer + sync"
PKG_VER=""
if [[ $have_py -eq 1 && -f package.json ]]; then
  PKG_VER="$(python3 -c 'import json;print(json.load(open("package.json")).get("version",""))' 2>/dev/null)"
fi
if [[ -z "$PKG_VER" ]]; then
  fail "package.json version not found"
elif [[ "$PKG_VER" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]]; then
  pass "package.json version is valid SemVer: $PKG_VER"
else
  fail "package.json version is not valid SemVer: '$PKG_VER'"
fi

# --- 2. CHANGELOG top version agrees --------------------------------------------------
if [[ -f CHANGELOG.md ]]; then
  CL_VER="$(grep -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+[^]]*\]' CHANGELOG.md | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+[0-9A-Za-z.+-]*')"
  if [[ -z "$CL_VER" ]]; then
    fail "CHANGELOG.md has no '## [x.y.z]' release heading"
  elif [[ "$CL_VER" == "$PKG_VER" ]]; then
    pass "CHANGELOG top version matches package.json ($CL_VER)"
  else
    fail "CHANGELOG top version ($CL_VER) != package.json ($PKG_VER)"
  fi
else
  fail "CHANGELOG.md missing"
fi

# --- 3. README **Version:** line agrees (only if present) -----------------------------
if [[ -f README.md ]] && grep -qiE '\*\*Version:\*\*' README.md; then
  RM_VER="$(grep -iE '\*\*Version:\*\*' README.md | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+[0-9A-Za-z.+-]*')"
  if [[ "$RM_VER" == "$PKG_VER" ]]; then
    pass "README version line matches package.json ($RM_VER)"
  else
    fail "README version ($RM_VER) != package.json ($PKG_VER)"
  fi
else
  skip "README has no **Version:** line (optional)"
fi

# --- 4. index.html exists + required meta ---------------------------------------------
section "index.html — required meta & structure"
if [[ ! -f index.html ]]; then
  fail "index.html missing"
else
  check_contains() { # pattern, label
    if grep -qiE "$1" index.html; then pass "$2"; else fail "$2 (pattern: $1)"; fi
  }
  check_contains '<html[^>]*lang=' 'has <html lang>'
  check_contains 'name=["'\'']viewport["'\'']' 'has viewport meta'
  check_contains '<title>[^<]+</title>' 'has non-empty <title>'
  check_contains 'name=["'\'']description["'\''][^>]*content=' 'has meta description'
  check_contains 'rel=["'\'']canonical["'\'']' 'has canonical link'
  check_contains 'name=["'\'']theme-color["'\'']' 'has theme-color'
  check_contains 'property=["'\'']og:title["'\'']' 'has og:title'
  check_contains 'property=["'\'']og:image["'\'']' 'has og:image'
  check_contains 'name=["'\'']twitter:card["'\'']' 'has twitter:card'
  check_contains 'application/ld\+json' 'has JSON-LD structured data'
  check_contains 'rel=["'\'']icon["'\'']' 'has favicon link'
  check_contains 'apple-touch-icon' 'has apple-touch-icon'

  # exactly one <h1>
  H1=$(grep -oiE '<h1[ >]' index.html | wc -l | tr -d ' ')
  if [[ "$H1" == "1" ]]; then pass "exactly one <h1>"; else fail "expected exactly one <h1>, found $H1"; fi

  # JSON-LD must be valid JSON
  if [[ $have_py -eq 1 ]]; then
    if python3 - <<'PY'
import re, json, sys
html = open("index.html", encoding="utf-8").read()
blocks = re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', html, re.S|re.I)
if not blocks:
    sys.exit(1)
for b in blocks:
    json.loads(b)
PY
    then pass "JSON-LD parses as valid JSON"; else fail "JSON-LD is missing or invalid JSON"; fi
  else
    skip "python3 absent — JSON-LD parse check"
  fi

  # No Carrd export cruft should survive the rewrite.
  if grep -qiE 'togglePopupKH|qweoqwup|carrd' index.html; then
    fail "Carrd export cruft found in index.html"
  else
    pass "no Carrd export cruft in index.html"
  fi
fi

# --- 5. Referenced local assets resolve on disk ---------------------------------------
section "Asset integrity — referenced local files exist"
if [[ $have_py -eq 1 && -f index.html ]]; then
  MISSING="$(python3 - <<'PY'
import re, os, sys
roots = ["index.html", "404.html", "weather.html"]
css = "assets/css/style.css"
if os.path.exists(css): roots.append(css)
refs = set()
for path in roots:
    if not os.path.exists(path): continue
    txt = open(path, encoding="utf-8").read()
    # href/src/srcset in HTML, url() in CSS
    for m in re.findall(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', txt):
        refs.add(m)
    for m in re.findall(r'srcset\s*=\s*["\']([^"\']+)["\']', txt):
        for part in m.split(","):
            u = part.strip().split(" ")[0]
            if u: refs.add(u)
    for m in re.findall(r'url\(\s*["\']?([^)"\']+)["\']?\s*\)', txt):
        refs.add(m)
# The site serves at the custom-domain root (kevinhaulihan.online); the BASE
# strip below is kept for compatibility with any legacy subpath references.
BASE = "kevin-website/"
missing = []
for r in sorted(refs):
    if re.match(r'^(https?:)?//', r): continue
    if r.startswith(("data:", "mailto:", "tel:", "#", "javascript:")): continue
    clean = r.split("#")[0].split("?")[0]
    if clean.startswith("/"):
        clean = clean[1:]
        if clean.startswith(BASE):
            clean = clean[len(BASE):]
    if not clean: continue   # site root ("/" or "/kevin-website/")
    if not os.path.exists(clean):
        missing.append(r)
print("\n".join(missing))
PY
)"
  if [[ -z "$MISSING" ]]; then
    pass "all locally-referenced assets exist"
  else
    fail "missing referenced assets:"; while IFS= read -r m; do [ -n "$m" ] && echo "        - $m"; done <<< "$MISSING"
  fi
else
  skip "python3 absent or no index.html — asset integrity check"
fi

# --- 6. Inline-script CSP hash agrees with the script content --------------------------
section "CSP — inline script hash consistency"
if [[ $have_py -eq 1 && -f index.html ]]; then
  if python3 - <<'PY2'
import re, hashlib, base64, sys, os
# Every root HTML page: its bare inline <script> bodies must each match a
# CSP sha256 hash in that same page's policy (and counts must agree).
for path in [f for f in ("index.html", "404.html", "weather.html") if os.path.exists(f)]:
    html = open(path, encoding="utf-8").read()
    # inline scripts = <script> tags with no src and no type attribute
    inlines = re.findall(r'<script>(.*?)</script>', html, re.S)
    csp = re.search(r'http-equiv="Content-Security-Policy"\s+content="([^"]+)"', html)
    hashes = re.findall(r"'sha256-([A-Za-z0-9+/=]+)'", csp.group(1)) if csp else []
    if not inlines and not hashes:
        continue  # no inline scripts, no hashes — consistent
    if len(inlines) != len(hashes):
        sys.exit(1)
    for body in inlines:
        d = base64.b64encode(hashlib.sha256(body.encode()).digest()).decode()
        if d not in hashes:
            sys.exit(1)
PY2
  then pass "every inline <script> matches a CSP sha256 hash"; else fail "inline <script> content does not match the CSP sha256 hash(es)"; fi
else
  skip "python3 absent — CSP hash check"
fi

# --- 7. Every data-API origin the JS fetches is allowed by the CSP --------------------
section "CSP connect-src covers every API origin the scripts fetch"
if [[ $have_py -eq 1 && -f index.html ]]; then
  BAD="$(python3 - <<'PY2'
import re, os
# hosts a given local JS file fetches (weather/marine/air-quality/tide services)
def hosts_in(js):
    hs = set()
    if os.path.exists(js):
        txt = open(js, encoding="utf-8").read()
        for h in re.findall(r'https://([a-z0-9.-]*(?:open-meteo\.com|tidesandcurrents\.noaa\.gov))', txt):
            hs.add("https://" + h)
    return hs

# For each page: the union of hosts fetched by the local JS *it loads* must be
# covered by *its own* connect-src. A page that loads no such JS is exempt.
problems = []
for path in [f for f in ("index.html", "404.html", "weather.html") if os.path.exists(f)]:
    html = open(path, encoding="utf-8").read()
    needed = set()
    for s in re.findall(r'<script[^>]*\bsrc\s*=\s*["\']([^"\']+)["\']', html):
        s = s.split("#")[0].split("?")[0]
        if s.startswith("assets/js/") and s.endswith(".js"):
            needed |= hosts_in(s)
    if not needed:
        continue
    csp = re.search(r'http-equiv="Content-Security-Policy"\s+content="([^"]+)"', html)
    policy = csp.group(1) if csp else ""
    cs = re.search(r'connect-src([^;]*)', policy)
    allowed = set(re.findall(r'https://[a-z0-9.-]+', cs.group(1))) if cs else set()
    for h in sorted(needed):
        if h not in allowed:
            problems.append(path + " -> " + h)
print("\n".join(problems))
PY2
)"
  if [[ -z "$BAD" ]]; then
    pass "connect-src allows every data-API origin the scripts fetch"
  else
    fail "CSP connect-src is missing origins the JS fetches:"; while IFS= read -r h; do [ -n "$h" ] && echo "        - $h"; done <<< "$BAD"
  fi
else
  skip "python3 absent — CSP connect-src check"
fi

# --- 8. Crawl / AI-readiness files present --------------------------------------------
section "Crawl / AI-readiness / brand files"
for f in CNAME robots.txt sitemap.xml llms.txt site.webmanifest favicon.svg .well-known/security.txt .nojekyll; do
  if [[ -e "$f" ]]; then pass "present: $f"; else fail "missing: $f"; fi
done

# --- Summary --------------------------------------------------------------------------
printf '\nSummary: %d passed, %d failed, %d skipped\n' "$PASS" "$FAIL" "$SKIP"
[[ "$FAIL" -eq 0 ]]
