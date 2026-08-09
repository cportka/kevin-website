/**
 * weather-vivarium — a tiny living pixel-art weather diorama for any city.
 *
 * Hand-written declarations (the source is plain ES modules, no build step), so
 * TypeScript and editor tooling get the public surface without a compile stage.
 */

export declare const VERSION: string;

export interface VivariumOptions {
  /** City name to geocode (Open-Meteo). Ignored when `lat`/`lon` are given. */
  city?: string;
  /** Explicit coordinates — skips the geocoding round-trip. */
  lat?: number;
  lon?: number;
  /** IANA zone, e.g. "Asia/Tokyo", so the sun sets at the place's own dusk. */
  timezone?: string;
  country?: string;
  admin1?: string;
  elevation?: number;
  /** City population → urban density (built-up vs nature). */
  population?: number;
  /** Override urbanisation directly: 0 (pastoral) … 1 (metropolis). */
  density?: number;
  /** Force a look. See BIOME_IDS / LANDSCAPE_IDS. */
  biome?: string;
  landscape?: string;
  temperatureUnit?: "fahrenheit" | "celsius" | "auto";
  /** Display size in px — the art is a crisp integer upscale of a 50×50 buffer. */
  size?: number;
  /** Click (or Enter/Space) to zoom to a centred overlay. */
  interactive?: boolean;
  /** Render a single still frame. Defaults to the user's prefers-reduced-motion. */
  reduceMotion?: boolean;
  /** How often to re-fetch weather, in ms. 0 disables refreshing. */
  refreshMs?: number;
  /** Skip marine + air-quality requests (used by dense galleries). */
  minimalData?: boolean;
  /** Minutes since local midnight — overrides "now" (demo scrubber / tests). */
  now?: number;
  seed?: string | number;
  language?: string;
  document?: Document;
}

export interface WeatherState {
  temp: number | null;
  code: number;
  cloud: number;
  windKph: number;
  aqi: number | null;
  waveM: number | null;
  tide: number | null;
  sunrise: number;
  sunset: number;
  [key: string]: unknown;
}

export interface Biome { id: string; name: string; [key: string]: unknown; }
export interface Landscape { id: string; name: string; biome: string; [key: string]: unknown; }
export interface Landmark { id: string; name: string; [key: string]: unknown; }

export interface Place {
  name?: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  elevation?: number | null;
  population?: number | null;
}

export interface Resolution {
  place: Place;
  biome: Biome;
  landscape: Landscape;
  landmark: Landmark | null;
  latitude: number;
  coastal: boolean;
  unit: "fahrenheit" | "celsius";
  cannabis: boolean;
}

export interface Vivarium {
  /** The wrapper element that was mounted (contains the canvas). */
  readonly el: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  /** Resolves once the place is settled (geocoded or explicit). */
  readonly ready: Promise<Place>;
  readonly resolution: Resolution | null;
  readonly weather: WeatherState;
  setWeather(patch: Partial<WeatherState>): void;
  setPlace(place: Place): void;
  refresh(): void;
  renderFrame(n?: number): void;
  /** Minutes since local midnight, or undefined to follow real time. */
  setTimeOverride(minutes?: number): void;
  start(): void;
  stop(): void;
  destroy(): void;
}

/** Mount a living diorama into `target` (an element or a CSS selector). */
export declare function createVivarium(
  target: HTMLElement | string,
  options?: VivariumOptions
): Vivarium | null;

// --- world model ---
export declare function resolveScene(place: Partial<Place>, opts?: Partial<VivariumOptions>): Resolution;
export declare function guessBiome(place: Partial<Place>): string;
export declare function unitForCountry(country?: string): "fahrenheit" | "celsius";
export declare const BIOMES: Record<string, Biome>;
export declare const BIOME_IDS: string[];
export declare function getBiome(id: string): Biome;
export declare const LANDSCAPES: Landscape[];
export declare const LANDSCAPE_IDS: string[];
export declare function getLandscape(id: string): Landscape | null;
export declare function landscapeForBiome(biomeId: string): Landscape | null;
export declare const LANDMARKS: Landmark[];
export declare function getLandmark(id: string): Landmark | null;
export declare function pickLandmark(place: Partial<Place>, landscape?: Landscape | null, biomeId?: string): Landmark | null;

// --- catalog ---
export interface SpriteEntry {
  id: string;
  name: string;
  w: number;
  h: number;
  anchor?: "baseline" | "center";
  layer?: string;
  biomes?: string[];
  tags?: string[];
  rarity?: number;
  draw(P: Painter, x: number, y: number, env: Record<string, unknown>): void;
}
export declare const CATALOG: Record<string, SpriteEntry[]>;
export declare function pools(biomeId: string): Record<string, SpriteEntry[]>;
export declare function forBiome(list: SpriteEntry[], biomeId: string): SpriteEntry[];
export declare function byLayer(list: SpriteEntry[], layer: string): SpriteEntry[];
export declare function counts(): Record<string, number>;

// --- data ---
export declare function geocode(name: string, opts?: { language?: string }): Promise<Place | null>;
export declare function geocodeSuggest(query: string, opts?: { language?: string; count?: number }): Promise<Place[]>;
export declare const GEOCODE_ORIGIN: string;
export declare function fetchWeather(place: Place, state: WeatherState, opts?: Record<string, unknown>): Promise<void>;
export declare function defaultState(): WeatherState;
export declare function modelTide(date?: Date, longitude?: number): number;
export declare const WEATHER_ORIGINS: string[];
export declare function describeWeather(code: number): string;
export declare function weatherCategory(code: number): string;

// --- engine (advanced) ---
export interface Painter {
  readonly ctx: CanvasRenderingContext2D;
  readonly L: number;
  px(x: number, y: number, color: string): void;
  rect(x: number, y: number, w: number, h: number, color: string): void;
  disc(x: number, y: number, r: number, color: string): void;
  line(x0: number, y0: number, x1: number, y1: number, color: string): void;
  glyph(x: number, y: number, ch: string, color: string): void;
  text(x: number, y: number, s: string, color: string): void;
  withAlpha(a: number, fn: () => void): void;
  flip(x: number, w: number, fn: () => void): void;
  clear(): void;
  mix(a: string, b: string, t: number): string;
  clamp(v: number, min: number, max: number): number;
  lerp(a: number, b: number, t: number): number;
}
export declare function createPainter(ctx: CanvasRenderingContext2D, L: number): Painter;
export declare function mix(a: string, b: string, t: number): string;
export declare function clamp(v: number, min: number, max: number): number;
export declare function lerp(a: number, b: number, t: number): number;
export declare function hex(s: string): { r: number; g: number; b: number };
export interface Scene { render(frame: number, nowMinutes: number, dayT: number): void; }
export declare function createScene(P: Painter, world: Record<string, unknown>, opts?: { reduce?: boolean }): Scene;
export declare const EFFECTS: Record<string, (P: Painter, env: Record<string, unknown>) => void>;
export declare const astronomy: Record<string, (...args: never[]) => unknown>;
