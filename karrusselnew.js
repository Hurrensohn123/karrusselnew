$("[carousel='component']").each(function () {
  let componentEl = $(this);
  let wrapEl = componentEl.find("[carousel='wrap']");
  let itemEl = wrapEl.children().children();
  let panelEl = componentEl.find("[carousel='panel']");
  let nextEl = componentEl.find("[carousel='next']");
  let prevEl = componentEl.find("[carousel='prev']");

  let rotateAmount = 360 / itemEl.length;
  let zTranslate = 2 * Math.tan((rotateAmount / 2) * (Math.PI / 180));
  let negTranslate = `calc(var(--3d-carousel-item-width) / -${zTranslate} - var(--3d-carousel-gap))`;
  let posTranslate = `calc(var(--3d-carousel-item-width) / ${zTranslate} + var(--3d-carousel-gap))`;

  wrapEl.css("--3d-carousel-z", negTranslate);
  wrapEl.css("perspective", posTranslate);
  
  // **Neuer Effekt: Slider erst nach 3,5 Sekunden einblenden**
  gsap.fromTo(wrapEl, { opacity: 0 }, { opacity: 1, delay: 3.5, duration: 1 });

  itemEl.each(function (index) {
    $(this).css("transform", `rotateY(${rotateAmount * index}deg) translateZ(${posTranslate})`);
  });

  // **ScrollTrigger für Mobilgeräte aktiviert**
  gsap.to(wrapEl, {
    "--3d-carousel-rotate": -(360 - rotateAmount),
    duration: 30,
    ease: "none",
    scrollTrigger: {
      trigger: componentEl,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true, // Wichtig für Mobile
      onUpdate: (self) => console.log("Scroll Fortschritt:", self.progress) // Debugging
    }
  });

  let activePanel;
  let animating = false;

  function makePanelActive(activeItem) {
    activePanel = activeItem;
    nextEl.toggleClass("is-disabled", !activePanel.next().length);
    prevEl.toggleClass("is-disabled", !activePanel.prev().length);
  }
  
  makePanelActive(panelEl.first());

  function scrollToActive() {
    animating = true;
    $("html, body").animate({ scrollTop: activePanel.offset().top }, 600, () => {
      animating = false;
    });
  }

  panelEl.each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top center",
      end: "bottom center",
      onToggle: ({ isActive }) => {
        if (isActive) makePanelActive($(this));
      }
    });
  });

  nextEl.on("click", function () {
    if (activePanel.next().length && !animating) {
      makePanelActive(activePanel.next());
      scrollToActive();
    }
  });

  prevEl.on("click", function () {
    if (activePanel.prev().length && !animating) {
      makePanelActive(activePanel.prev());
      scrollToActive();
    }
  });
});
