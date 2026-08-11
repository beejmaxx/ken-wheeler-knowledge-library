const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("is-open", !open);
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  toggle?.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}));
document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
  const original = button.textContent;
  try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = "Copied"; }
  catch { button.textContent = "Select"; }
  window.setTimeout(() => { button.textContent = original; }, 1400);
}));
document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced || !("IntersectionObserver" in window)) document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold:.12 });
  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}
