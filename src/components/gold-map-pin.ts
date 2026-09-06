export function goldPinSvg(selected = false) {
  const ring = selected
    ? `<circle cx="16" cy="13.4" r="12.4" fill="none" stroke="#3f4c24" stroke-width="1.7" />`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="36" height="45" aria-hidden="true">
  ${ring}
  <path d="M16 2.8c5.7-.2 10.2 3.8 10.5 9.6.3 4.6-2.7 8.8-9.6 9.2C9.8 21.5 5.8 17 6 12.2 6.2 6.8 10.5 3 16 2.8Z" fill="#e9c52d" stroke="#3f4c24" stroke-width="1.7" stroke-linejoin="round"/>
  <circle cx="12.6" cy="10.8" r="0.7" fill="#3f4c24" opacity=".38"/>
  <circle cx="18.8" cy="14.2" r="0.55" fill="#3f4c24" opacity=".3"/>
  <path d="M16 20.6 20.4 30.2h-8.8Z" fill="#f3ebdd" stroke="#3f4c24" stroke-width="1.6" stroke-linejoin="round"/>
</svg>`;
}

export function createGoldPinElement(label: string, selected = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `gold-map-pin${selected ? " is-selected" : ""}`;
  button.setAttribute("aria-label", label);
  button.innerHTML = goldPinSvg(selected);
  return button;
}
