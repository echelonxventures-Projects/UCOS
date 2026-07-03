/**
 * UCOS Substrate — Minimal, dependency-free semantic-version support.
 *
 * Supports the subset the substrate needs for registry resolution:
 *   exact   "1.2.3"
 *   caret   "^1.2.3"   (>=1.2.3 <2.0.0 ; for 0.x, ^0.2.3 => >=0.2.3 <0.3.0)
 *   gte     ">=1.2.3"
 *   any     "*" | ""
 */

import type { SemVer, VersionRange } from "../contracts/types.ts";

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}

const VERSION_RE = /^(\d+)\.(\d+)\.(\d+)$/;

export function parseVersion(version: SemVer): ParsedVersion {
  const match = VERSION_RE.exec(version.trim());
  if (!match) {
    throw new Error(`Invalid semantic version: "${version}"`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export function isValidVersion(version: string): boolean {
  return VERSION_RE.test(version.trim());
}

/** Returns -1 if a<b, 0 if equal, 1 if a>b. */
export function compareVersions(a: SemVer, b: SemVer): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (pa.major !== pb.major) return pa.major < pb.major ? -1 : 1;
  if (pa.minor !== pb.minor) return pa.minor < pb.minor ? -1 : 1;
  if (pa.patch !== pb.patch) return pa.patch < pb.patch ? -1 : 1;
  return 0;
}

export function satisfies(version: SemVer, range: VersionRange): boolean {
  const raw = range.trim();
  if (raw === "" || raw === "*") return true;

  if (raw.startsWith("^")) {
    const base = parseVersion(raw.slice(1));
    const v = parseVersion(version);
    if (compareVersions(version, `${base.major}.${base.minor}.${base.patch}`) < 0) return false;
    if (base.major > 0) return v.major === base.major;
    if (base.minor > 0) return v.major === 0 && v.minor === base.minor;
    return v.major === 0 && v.minor === 0 && v.patch === base.patch;
  }

  if (raw.startsWith(">=")) {
    return compareVersions(version, raw.slice(2).trim()) >= 0;
  }

  if (raw.startsWith(">")) {
    return compareVersions(version, raw.slice(1).trim()) > 0;
  }

  if (raw.startsWith("<=")) {
    return compareVersions(version, raw.slice(2).trim()) <= 0;
  }

  if (raw.startsWith("<")) {
    return compareVersions(version, raw.slice(1).trim()) < 0;
  }

  // exact match
  return compareVersions(version, raw) === 0;
}

/** Highest version from the list that satisfies the range, or undefined. */
export function maxSatisfying(versions: readonly SemVer[], range: VersionRange): SemVer | undefined {
  const matching = versions.filter((v) => satisfies(v, range));
  if (matching.length === 0) return undefined;
  return matching.reduce((best, current) => (compareVersions(current, best) > 0 ? current : best));
}
