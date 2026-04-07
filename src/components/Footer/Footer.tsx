import { Home, PlusCircle, Settings, User } from 'react-feather';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: PlusCircle, label: 'New Post', path: '/create-post' },
    { icon: Settings, label: 'Settings', path: '/settings' },
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
            <Icon size={24} />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
