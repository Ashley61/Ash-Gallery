(function () {
  const lightbox = document.getElementById("lightbox");
  const gallery = document.querySelector("[data-gallery]");

  if (!lightbox || !gallery || typeof GALLERY_DATA === "undefined") {
    return;
  }

  const lightboxImg = lightbox.querySelector(".lightbox__img");
  const lightboxCaption = lightbox.querySelector(".lightbox__caption");
  const btnClose = lightbox.querySelector(".lightbox__close");
  const btnPrev = lightbox.querySelector(".lightbox__nav--prev");
  const btnNext = lightbox.querySelector(".lightbox__nav--next");

  const key = gallery.dataset.gallery;
  const items = GALLERY_DATA[key] || [];

  let currentIndex = 0;
  let lastFocused = null;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  items.forEach(function (item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery__item";
    button.setAttribute("aria-label", "View " + item.title);

    button.innerHTML =
      '<img src="' +
      item.src +
      '" alt="' +
      escapeHtml(item.alt) +
      '" loading="lazy" width="800" height="600">' +
      '<span class="gallery__item-overlay"><span class="gallery__item-title">' +
      escapeHtml(item.title) +
      "</span></span>";

    button.addEventListener("click", function () {
      openLightbox(index, button);
    });

    gallery.appendChild(button);
  });

  function openLightbox(index, trigger) {
    currentIndex = index;
    lastFocused = trigger;

    lightbox.removeAttribute("hidden");
    requestAnimationFrame(function () {
      lightbox.classList.add("is-open");
    });

    showSlide(index);
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";

    function onEnd() {
      lightbox.setAttribute("hidden", "");
      lightbox.removeEventListener("transitionend", onEnd);
      if (lastFocused) lastFocused.focus();
    }

    lightbox.addEventListener("transitionend", onEnd);
  }

  function showSlide(index) {
    const item = items[index];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.title;
    currentIndex = index;
  }

  function showPrev() {
    const next = (currentIndex - 1 + items.length) % items.length;
    showSlide(next);
  }

  function showNext() {
    const next = (currentIndex + 1) % items.length;
    showSlide(next);
  }

  btnClose.addEventListener("click", closeLightbox);
  btnPrev.addEventListener("click", showPrev);
  btnNext.addEventListener("click", showNext);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
})();
