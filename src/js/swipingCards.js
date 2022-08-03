let IS_MOBILE = false;

//const CARDS_COLORS = ['e24251', 'f7b806', '646155', '53c8e8', '3b3d3d'];

class SwipingCards {
  constructor(canvas) {
    this.canvas = canvas;
    this.touchstartX = 0;
    this.touchendX = 0;
    this.cards = canvas.querySelectorAll(".projects__project-item-card");
    this.cardsLength = this.cards.length;
    this.scaleFactor = 0.5 / this.cardsLength;
    this.stackMargin = 300 / this.cardsLength;
    this.offLimit = 100;

    this.organizeCards(true);
    this.initHandlers();
  }

  initHandlers() {
    this.canvas.addEventListener(
      IS_MOBILE ? "touchstart" : "mousedown",
      (e) => {
        const element = e.target.parentElement.classList.contains("active")
          ? e.target.parentElement
          : e.target.classList.contains("active")
          ? e.target
          : undefined;
        if (element) {
          this.touchstartX = this.getXpos(e);

          element.addEventListener(
            IS_MOBILE ? "touchmove" : "mousemove",
            () => {
              this.moveHandler(e, element).bind(this);
            },
            {
              passive: IS_MOBILE,
            }
          );
          document.addEventListener(
            IS_MOBILE ? "touchend" : "mouseup",
            () => {
              this.releaseHandler(e, element);
            },
            {
              passive: IS_MOBILE,
              once: true,
            }
          );
        }
      },
      { passive: IS_MOBILE }
    );
  }

  moveHandler(e, el) {
    if (Math.abs(this.getXpos(e) - this.touchstartX) < this.offLimit) {
      el.style.transform = `translateY(${
        this.getXpos(e) - this.touchstartX
      }px)`;
    }
  }

  releaseHandler(e, el) {
    this.canvas
      .querySelector(".active")
      .removeEventListener(IS_MOBILE ? "touchmove" : "mousemove", () => {
        this.moveHandler(e, el).bind(this);
      });

    const moveValue = this.getXpos(e) - this.touchstartX;
    if (moveValue === 0) {
      return;
    }
    const lastCard = this.cards[this.cardsLength - 1];
    lastCard.classList.add("swiped");
    if (Math.abs(moveValue) > this.offLimit) {
      // moveValue === 0 => 'tap' touch
      this.swipeCard();
    } else {
      this.resetCard(el);
    }
  }

  getXpos(e) {
    return IS_MOBILE ? e.changedTouches[0].screenY : e.screenY;
  }

  getTransformCSS(index) {
    return `translateY(-${
      this.stackMargin * (this.cardsLength - index)
    }px) scale(${1 - this.scaleFactor * (this.cardsLength - index)})`;
  }

  resetCard(el) {
    el.style.transform = `translateY(0)`;
  }

  swipeCard() {
    const lastCard = this.cards[this.cardsLength - 1];

    lastCard.classList.remove("active");
    lastCard.style.zIndex = 0;
    lastCard.style.transform = this.getTransformCSS(1);
    lastCard.addEventListener(
      "transitionend",
      () => {
        lastCard.classList.remove("swiped");
        this.canvas.prepend(lastCard);
        this.cards = this.canvas.querySelectorAll(
          ".projects__project-item-card"
        );
      },
      { once: true }
    );

    this.organizeCards();
  }

  organizeCards(initialize) {
    let index = initialize ? 0 : 1;
    //let colorIndex = 0;

    this.cards.forEach((c) => {
      index++;

      if (index === this.cardsLength + 1) return; // case when last card is swiped
      if (index === this.cardsLength) c.classList.add("active");

      //   if (initialize) {
      //     c.style.backgroundColor = `#${CARDS_COLORS[colorIndex]}`;
      //     colorIndex = colorIndex === CARDS_COLORS.length - 1 ? 0 : colorIndex + 1;
      //   }

      c.style.zIndex = index;
      c.style.transform = this.getTransformCSS(index);
    });
  }
}

const initSwipingCard = () => {
  const sliders = document.querySelectorAll(".projects__container");

  if (sliders) {
    sliders.forEach((s) => new SwipingCards(s));
  }
};

initSwipingCard();

// document.querySelector('.projects__container').addEventListener('click', (e) => {
//   e.preventDefault();
//   IS_MOBILE = !IS_MOBILE;
//   e.target.innerHTML = `IS_MOBILE = ${IS_MOBILE}`;
//   initSwipingCard();
// });
