import type { RoutePath } from '../types';

export interface SidebarProps {
  activeRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
}

export function Sidebar(_props: SidebarProps): null {
  return null;
}
