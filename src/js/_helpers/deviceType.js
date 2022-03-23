const deviceType = {
  isMobile: () => window.innerWidth < 650,
  isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: () => window.innerWidth >= 1024,
  isNotDesktop: () => window.innerWidth < 1024,
};
