import './TopBar.css';

export const TopBar = (): JSX.Element => {
  return (
    <header className="pp-topnav">
      <div className="pp-topnav__brand" role="heading" aria-level={1}>
        ProjectPulse
      </div>
    </header>
  );
};
