/** Tiny entry-point contract: keep editor option metadata out of the eager bundle. */
export const CONFIG_ALIASES = {
  show_cctv_view: ['show_camera_view'],
  show_maintenance_view: ['show_maintenance_summary'],
} as const;
