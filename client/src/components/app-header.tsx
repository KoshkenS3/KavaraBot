import { Menu } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export default function AppHeader({ 
  title = "KAVARA", 
  subtitle,
  onMenuClick,
  showMenu = true 
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/80">{subtitle}</p>
            )}
          </div>
        </div>
        {showMenu && (
          <button className="p-2" onClick={onMenuClick}>
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
}
