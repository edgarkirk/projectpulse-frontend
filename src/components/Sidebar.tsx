export type SidebarRoute = 'dashboard' | 'projects';

export interface SidebarProps {
  activeRoute: SidebarRoute;
  onNavigate: (route: SidebarRoute) => void;
}

export function Sidebar({ activeRoute, onNavigate }: SidebarProps): JSX.Element {
  void activeRoute;
  void onNavigate;
  throw new Error('TODO: implement Sidebar');
}
