const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: "cart-update",
  quantityUpdate: "quantity-update",
  variantChange: "variant-change",
};

const SWIPER_DEFAULT_PARAMS = {
  navigation: true,
  scrollbar: true,
  rewind: true,
  grabCursor: true,
  spaceBetween: 16,
  slidesPerView: 1,
  injectStyles: [
  `
  .swiper-button-next:after, .swiper-button-prev:after {
    font-size: 16px;
  }
  .swiper-button-next, .swiper-button-prev {
    width: var(--swiper-navigation-size);
  }
  `,
  ],
};
