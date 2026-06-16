// Shared responsive helper for the storefront screens.
// Breakpoints follow the brand guide: 2-col mobile → 3-col desktop.
window.useIsMobile = function (bp) {
  const limit = bp || 760;
  const get = () => (typeof window !== 'undefined' ? window.innerWidth < limit : false);
  const [m, setM] = React.useState(get);
  React.useEffect(() => {
    const on = () => setM(get());
    window.addEventListener('resize', on);
    on();
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
};
