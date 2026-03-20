import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function Appshell({ children }) {
  return (
    <div className="appshell">
      <Sidebar />
      <div className="main-column">
        <TopNavbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
