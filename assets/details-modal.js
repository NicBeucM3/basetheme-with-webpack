class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');
    this.header = document.querySelector('.section-header');
    this.headerDrawer = document.querySelector('header-drawer');

    this.detailsContainer.addEventListener(
      'keyup',
      (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()
    );
    this.summaryToggle.addEventListener(
      'click',
      this.onSummaryClick.bind(this)
    );
    this.querySelector('button[type="button"]').addEventListener(
      'click',
      this.close.bind(this)
    );

    this.summaryToggle.setAttribute('role', 'button');
  }

  isOpen() {
    return this.detailsContainer.hasAttribute('open');
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest('details').hasAttribute('open')
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false);
  }

  open(event) {
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this);

    // if the menu drawer is open when opening search, close the menu drawer
    if (this.headerDrawer.querySelector('details').hasAttribute('open')) {
      this.headerDrawer.closeMenuDrawer(event, this.detailsContainer.querySelector('input:not([type="hidden"])'));
    }

    this.detailsContainer.classList.add('modal-opening');
    event.target.closest('details').setAttribute('open', true);
    document.body.addEventListener('click', this.onBodyClickEvent);
    showFullOverlay(this.header);
    // addScrollbarPadding();
    document.body.classList.add('overflow-hidden');

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.classList.remove('modal-opening');
    setTimeout(() => {
      this.detailsContainer.removeAttribute("open");
    }, 500);

    document.body.removeEventListener('click', this.onBodyClickEvent);
    hideFullOverlay(this.header);
    // removeScrollbarPadding();
    document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('details-modal', DetailsModal);