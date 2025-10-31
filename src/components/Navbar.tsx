import { Shield, Settings } from 'lucide-react';
import { WalletButton } from './WalletButton';

interface NavbarProps {
  onNavigate: (page: 'landing' | 'admin') => void;
  currentPage: 'landing' | 'admin' | 'quest';
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
            >
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">Web3 Security Quests</span>
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('landing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'landing'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Quests
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>

          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
