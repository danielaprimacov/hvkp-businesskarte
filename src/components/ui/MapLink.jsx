function MapLink({ address, children, className, style }) {
  const handleClick = (event) => {
    // keep the tab behavior consistent
    event.preventDefault();

    const encoded = encodeURIComponent(address);
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);

    // iOS → Apple Maps; Android → geo: (opens default maps app);
    // Desktop → Google Maps in browser
    const url = isIOS
      ? `https://maps.apple.com/?q=${encoded}`
      : isAndroid
      ? `geo:0,0?q=${encoded}`
      : `https://www.google.com/maps/search/?api=1&query=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Fallback href (works if JS is disabled)
  const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <a
      href={fallback}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-label={`Open ${address} in maps`}
    >
      {children}
    </a>
  );
}

export default MapLink;
