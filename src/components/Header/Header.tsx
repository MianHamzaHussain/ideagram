const FilterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top: Long left, Knob right */}
    <path d="M5 8H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M19 6V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Middle: Knob left, Long right */}
    <path d="M5 12V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M9 14H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Bottom: Long left, Knob right */}
    <path d="M5 20H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M19 18V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white z-20">
      <button className="text-neutral-800 hover:bg-neutral-50 rounded-full transition-colors active:scale-95 flex items-center justify-center w-6 h-6">
        <FilterIcon />
      </button>
      <h1 className="heading-s text-neutral-900">Reports</h1>
      <button className="text-neutral-800 hover:bg-neutral-50 rounded-full transition-colors active:scale-95 flex items-center justify-center w-6 h-6">
        <SearchIcon />
      </button>
    </header>
  );
};

export default Header;
