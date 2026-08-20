/**
 * Tooltip wrapper — uses CSS hover (no JS needed).
 * direction: "up" (above, default) | "dn" (below, for near top-of-page elements)
 */
function Tooltip({ direction = "up", titleText, titleClass = "green", children, trigger }) {
  return (
    <div className={`tt-wrap ${direction}`}>
      {trigger}
      <div className="tt-box">
        <div className={`tt-title ${titleClass}`}>{titleText}</div>
        {children}
      </div>
    </div>
  );
}

export default Tooltip;
