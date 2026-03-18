export type ScoreStatus = 'good' | 'yellow' | 'orange' | 'red' | 'muted';

function clamp01to10(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(10, Math.max(0, value));
}

/**
 * Maps a 0-10 score to a status bucket.
 * If `invert` is true, lower numbers are treated as "better" (e.g. stress).
 */
export function scoreStatus(
  score: number | null | undefined,
  opts?: { invert?: boolean }
): ScoreStatus {
  if (score === null || score === undefined) return 'muted';
  const s = clamp01to10(score);
  const normalized = opts?.invert ? 10 - s : s;

  if (normalized >= 8) return 'good';
  if (normalized >= 6) return 'yellow';
  if (normalized >= 4) return 'orange';
  return 'red';
}

export function statusTextClass(status: ScoreStatus): string {
  switch (status) {
    case 'good':
      return 'text-success';
    case 'yellow':
      return 'text-streak';
    case 'orange':
      return 'text-warning';
    case 'red':
      return 'text-destructive';
    case 'muted':
    default:
      return 'text-muted-foreground';
  }
}

export function statusBgClass(status: ScoreStatus): string {
  switch (status) {
    case 'good':
      return 'bg-success text-success-foreground';
    case 'yellow':
      return 'bg-streak text-streak-foreground';
    case 'orange':
      return 'bg-warning text-warning-foreground';
    case 'red':
      return 'bg-destructive text-destructive-foreground';
    case 'muted':
    default:
      return 'bg-muted text-muted-foreground';
  }
}

