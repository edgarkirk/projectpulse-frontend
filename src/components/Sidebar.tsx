export type RouteHash = '#/dashboard' | '#/projects';

export interface SidebarProps {
  activeRoute: RouteHash;
  onNavigate: (route: RouteHash) => void;
}

export function Sidebar(_props: SidebarProps): null {
  return null;
}
