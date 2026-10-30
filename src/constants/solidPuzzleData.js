// Content and tuning for the About page "Build Something SOLID" puzzle.
//
// Geometry is authoritative in the GLB (public/models/scs-solid-puzzle.glb, trimmed
// from the Spline export by scripts/extract-solid-puzzle-model.mjs). Each piece's
// target transform (the finished wall) is read from its node at runtime, so the
// only per-piece placement data kept here are the *start* positions.
// Units are Spline units, as in the export; the GLB root's 0.01 scale is ignored.

export const SOLID_MODEL_URL = "/models/scs-solid-puzzle.glb";

// Original scene look (Scene Layout.txt)
export const SOLID_SCENE = {
  background: "#3d1653",
  hemisphere: { color: "#ebebeb", intensity: 2.36 },
  directional: { color: "#dda6f6", intensity: 2.2, position: [200, 300, 300] },
  cameraZ: 558.55,
};

// Stable ids, GLB node names, and all copy. `description` is the original Spline
// card copy (read back from the 3D text meshes); `detail` is supporting text.
// Entries marked `copy: "new"` had no original text and are drafted replacements.
export const SOLID_PIECES = [
  {
    id: "s",
    meshName: "S Piece",
    chip: "S",
    letter: "S",
    kicker: "Single Responsibility Principle",
    title: "Single Responsibility",
    description:
      "Each part has one clear job. That means simpler updates and fewer issues down the road.",
    detail:
      "A class or module should have one clearly defined responsibility, and therefore only one reason to change.",
    color: "#c365ff",
  },
  {
    id: "o",
    meshName: "O Piece",
    chip: "O",
    letter: "O",
    kicker: "Open/Closed Principle",
    title: "Open / Closed",
    description:
      "We build so new ideas can be added without breaking what already works. That keeps progress fast and safe.",
    detail:
      "Software components should be open for extension but closed for modification. New behavior arrives by adding code, not by rewriting code that already works.",
    color: "#7215c7",
  },
  {
    id: "l",
    meshName: "L Piece",
    chip: "L",
    letter: "L",
    kicker: "Liskov Substitution Principle",
    title: "Liskov Substitution",
    description:
      "Each piece fits and swaps in seamlessly. Things stay consistent, flexible, and dependable.",
    detail:
      "Subclasses and implementations should be usable in place of their base types without breaking the behavior callers expect.",
    color: "#a00adc",
  },
  {
    id: "i",
    meshName: "I Piece",
    chip: "I",
    letter: "I",
    kicker: "Interface Segregation Principle",
    title: "Interface Segregation",
    description:
      "We only include what’s needed — nothing extra. That keeps connections clean and builds quick.",
    detail:
      "Clients shouldn’t be forced to depend on methods or interfaces they never use. Small, focused interfaces beat one large catch-all.",
    color: "#c936cb",
  },
  {
    id: "d",
    meshName: "D Piece",
    chip: "D",
    letter: "D",
    kicker: "Dependency Inversion Principle",
    title: "Dependency Inversion",
    description:
      "Big-picture logic stays separate from small details. That makes upgrades smooth and changes stress-free.",
    detail:
      "High-level and low-level modules should both depend on abstractions rather than on concrete implementations.",
    color: "#eb6ae6",
  },
  {
    id: "logo",
    meshName: "SOLID Piece",
    chip: "Logo",
    letter: null, // shows the 3D logo cube instead of a letter tile
    kicker: "The brand piece",
    title: "Solid Code Solutions",
    description:
      "Five principles, one dependable structure. It’s the idea our name is built on, and how we approach every application and website we ship.",
    detail:
      "Each principle solves a different problem. Fitted together they keep software flexible as you grow and steady when things change.",
    color: "#7e2eae",
    copy: "new",
  },
  {
    id: "corner",
    meshName: "Corner Piece",
    chip: "Extra",
    letter: "+",
    kicker: "Supporting piece",
    title: "Extra Corner Piece",
    description:
      "This is just a filler corner piece to keep things extra SOLID.",
    detail:
      "It isn’t a sixth principle. It’s the small supporting piece that makes the wall complete. Dependable software works the same way: the details that look minor are often what hold everything together.",
    color: "#8f45bf",
    copy: "original description, new supporting text",
  },
];

export const SOLID_PIECE_BY_ID = Object.fromEntries(
  SOLID_PIECES.map((p) => [p.id, p]),
);

// Interaction tuning
export const PUZZLE = {
  snapRadius: 75, // release this close to the outline to lock in (units)
  highlightRadius: 190, // outline starts brightening inside this distance
  liftZ: 45, // dragged pieces rise toward the camera
  dragScale: 1.035,
  snapSeconds: 0.34,
  floatAmplitude: 9,
  floatSpeed: 0.9,
  jitter: { wide: 12, tall: 8 },
  edgeMargin: 14, // keep dragged pieces this far inside the stage
};

// Stage framing.
//
// wide (tablet/desktop): the camera fits `w` x `h` units centred (ox, oy) from
// the wall centre. Start positions are predefined arrangements (offsets from the
// wall centre) with seeded jitter. The frame is close to square so the board
// still reads well beside the info column on desktop: pieces sit in side
// columns (x ±326..±560, room for the 190-wide pieces) and in top/bottom bands
// (room for the 381-wide I piece and the 190-tall D piece), clear of the wall,
// each other and their float travel.
//
// tall (phones): pieces are shelf-packed into a tray under the wall, in a
// seeded order. When a piece is placed the rest re-pack upward and the stage
// shrinks, so the remaining pieces stay close to the wall. The camera is width
// fitted and anchored to the top of the stage.
export const LAYOUTS = {
  wide: {
    box: { w: 1120, h: 900, ox: 0, oy: 0 },
    arrangements: [
      {
        s: [-445, 150],
        corner: [-445, -170],
        l: [445, 150],
        o: [445, -170],
        i: [0, 335],
        logo: [445, 385],
        d: [0, -340],
      },
      {
        l: [-445, 150],
        o: [-445, -170],
        s: [445, 150],
        corner: [445, -170],
        i: [0, 335],
        logo: [-445, 385],
        d: [0, -340],
      },
      {
        o: [-445, 170],
        s: [-445, -150],
        corner: [445, 170],
        l: [445, -150],
        d: [0, 340],
        i: [0, -335],
        logo: [-445, -385],
      },
    ],
  },
  tall: {
    box: { w: 700 },
    // Approximate full height before the model loads (units)
    initialH: 1160,
    tray: {
      width: 640, // usable row width
      topPad: 44, // stage edge above the wall
      wallGap: 64, // wall bottom to first tray row
      gap: 30, // between pieces in a row
      rowGap: 34, // between rows
      bottomPad: 36, // last row to stage edge
    },
  },
};
