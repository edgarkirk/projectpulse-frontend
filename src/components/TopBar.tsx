import './TopBar.css';

export interface TopBarProps {
  applicationName?: string;
}

export const TopBar = ({ applicationName = 'ProjectPulse' }: TopBarProps) => {
  return (
    <header className="pp-topnav">
      <div className="pp-topnav__brand">{applicationName}</div>
    </header>
  );
};
