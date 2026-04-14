import { Home, PlusCircle, Bell, User } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { useUnviewedCount } from '@/hooks';

const Footer = () => {
  const { data: countData } = useUnviewedCount();
  const unviewedCount = countData?.count || 0;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: PlusCircle, label: 'New Post', path: '/create-post' },
    { icon: Bell, label: 'Alerts', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <footer className="w-full bg-white border-t border-neutral-50 px-2 py-2 pb-safe z-30 flex justify-center">
      <div className="w-full max-w-[600px] flex justify-around">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 min-w-[64px] transition-colors py-4 ${isActive ? 'text-primary-300' : 'text-neutral-400'
              }`
            }
          >
            <div className="relative">
              <Icon size={24} />
              {label === 'Alerts' && (
                <div className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-brand-red text-white text-[10px] font-bold rounded-full border-2 border-white transition-transform ${unviewedCount > 0 ? 'scale-100' : 'scale-0'}`}>
                  {unviewedCount > 99 ? '99+' : unviewedCount}
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
