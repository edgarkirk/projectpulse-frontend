import type { RouteName } from '../types';

export interface SidebarProps {
  activeRoute: RouteName;
  onNavigate: (route: RouteName) => void;
}

export const Sidebar = () => {
  return <nav>Sidebar</nav>;
};
