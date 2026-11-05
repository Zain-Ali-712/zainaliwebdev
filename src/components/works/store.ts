/** Mutable state shared between the scroll-driven DOM and the R3F scene (no React re-renders per frame). */
export type TheatreStore = {
  progress: number; // 0..1 of the pinned section
  intro: number; // 0..1 intro phase (WORKS zoom)
  active: number; // float index of the project at the front
  pointer: { x: number; y: number }; // -1..1
  hoverPanel: boolean;
  visible: boolean;
};

export const createStore = (): TheatreStore => ({
  progress: 0,
  intro: 0,
  active: 0,
  pointer: { x: 0, y: 0 },
  hoverPanel: false,
  visible: false,
});
