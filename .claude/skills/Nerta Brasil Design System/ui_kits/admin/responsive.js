// Shared responsive helper — breakpoints follow the brand guide.
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
