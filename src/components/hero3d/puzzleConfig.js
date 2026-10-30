// Values come from the original Spline export (docs/references/spline-hero-section).
// Units are Spline units; the GLB root's 0.01 scale is intentionally ignored.

export const MODEL_URL = "/models/scs-hero-puzzle.glb";

// Orthographic camera, decomposed from the exported camera matrix
export const CAMERA = {
  position: [-601.89, 778.5, 399.64],
  quaternion: [
    -0.24752938545971648, -0.36800859277823605, -0.10225845446831419,
    0.8904168054709374,
  ],
  zoom: 0.66,
  near: -100000,
  far: 100000,
};

// Below this width the camera zooms out so the puzzle keeps some breathing room
export const ZOOM_REFERENCE_WIDTH = 440;

export const BACKGROUND = "#000000";

// Logo cube travels straight down along Y into the missing slot.
// Its x/z already line up with the slot in the export.
export const LOGO_START_Y = 210;
export const LOGO_END_Y = -48.41; // slot centre (-60.77) minus the Cube child's -12.36 offset
export const SNAP_DISTANCE = 45; // auto-snap once this close to the slot while dragging
export const RELEASE_SNAP_PROGRESS = 0.55; // releasing past this fraction of the path snaps in

export const LIGHTS = {
  hemisphere: { color: "#cebede", groundColor: "#3a3046", intensity: 1.7 },
  directional: {
    color: "#7f2492",
    intensity: 3.14,
    position: [0, 510.24, 125.11],
  },
  // Spline spot lights aim down their local -Y axis; these targets are where
  // that axis meets the floor, right around the base of the cube.
  spots: [
    {
      color: "#c77eed",
      intensity: 6.65,
      distance: 2000,
      position: [-581.57, 451.51, -201.63],
      target: [-66, -241.7, -201.6],
    },
    {
      color: "#d64cd3",
      intensity: 5.64,
      distance: 1680,
      position: [406.16, 482.93, 170.52],
      target: [46, -241.7, -172],
    },
  ],
};

// Logo cube vertical gradient ("Gradient Contrast 04" in Spline)
export const LOGO_GRADIENT = { top: "#8f2bff", bottom: "#3d0985" };

// Solved-state colours, keyed by the piece's position signs in the cube group.
// Read off the "Puzzle After" reference.
export const MAGENTA = "#ff2bf4";
export const VIOLET = "#a01cff";
export const ORCHID = "#d43cff";
export const SOLVED_PIECE_COLORS = {
  "+,+,-": MAGENTA,
  "+,-,-": VIOLET,
  "-,+,-": VIOLET,
  "-,-,-": MAGENTA,
  "+,+,+": MAGENTA,
  "+,-,+": ORCHID,
  "-,-,+": VIOLET,
};

export const SOLVE_TRANSITION_SECONDS = 1.1;

// Idle bob of the logo cube before it is dragged
export const IDLE_FLOAT = { amplitude: 10, speed: 1.8 };

// "Drag down" hint: bobs opposite the logo cube (same speed, mirrored), with the
// label raised above the arrow for breathing room. Colours follow the site's
// fuchsia accents; the font is the site's logo font (Rajdhani Bold).
export const INDICATOR = {
  font: "/fonts/rajdhani-bold.woff",
  label: "DRAG DOWN",
  labelY: 66, // label centre above the arrow's origin (arrow top sits near 12)
  fontSize: 25,
  arrowColor: "#e879f9",
  textColor: "#f5d0fe",
  glowColor: "#d946ef",
  lift: 50, // raises arrow and label together: ~3rem on desktop (48px / 0.66 zoom)
  floatScale: 1.1, // bob amplitude relative to the logo cube's
};

// Once solved: spins around Y with a back-ease (winds up the wrong way, whips
// round, overshoots and settles), hopping up mid-spin, then a gentle bob
export const SPIN_SECONDS = 1.6;
export const SPIN_TURNS = 3;
export const SPIN_BACK = 1.2; // wind-up/overshoot strength (~2.6% of the spin each way, ~30° at 3 turns)
export const SPIN_HOP = 80; // peak extra height reached mid-spin
export const ASSEMBLY_LIFT = 30; // resting height above the floor once settled
export const ASSEMBLY_FLOAT = { amplitude: 10, speed: 1.4 };

// Rounded-hexagon bubbles that drift up across the whole view once solved
export const BUBBLES = { count: 26, color: "#d0307a" };
