import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  BookOpen, 
  Play, 
  Database, 
  Users, 
  Bot, 
  TrendingUp,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Market Mapping', href: '/market-mapping', icon: Map },
  { name: 'Playbook Generator', href: '/playbook-generator', icon: BookOpen },
  { name: 'Execution Engine', href: '/execution-engine', icon: Play },
  { name: 'Data Integration', href: '/data-integration', icon: Database },
  { name: 'Expert Network', href: '/expert-network', icon: Users },
  { name: 'Agentic AI', href: '/agentic-ai', icon: Bot },
  { name: 'Benchmarking', href: '/benchmarking', icon: TrendingUp },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-white border-r border-gray-200 transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">AFH Accelerator</h1>
              <p className="text-sm text-gray-500">PepsiCo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`
                  mr-3 flex-shrink-0 h-6 w-6
                  ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">AFH Team</p>
              <p className="text-xs text-gray-500">Last sync: 2h ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
