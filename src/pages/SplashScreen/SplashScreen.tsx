import logo from '../../assets/logo.png';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-splash-bg z-[5000] animate-in fade-in duration-500">
      <img 
        src={logo} 
        alt="Ideagram Logo" 
        className="w-[230px] h-auto object-contain animate-in zoom-in-95 duration-700" 
      />
    </div>
  );
};

export default SplashScreen;
