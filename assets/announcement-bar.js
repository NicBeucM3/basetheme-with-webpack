class AnnouncementBar extends HTMLElement {
  constructor() {
    super();

    this.checkState();
    const isDismissable = this.getAttribute("data-dismiss-enabled") === "true";
    this.sectionId = this.dataset.sectionId;
    this.announcements = this.querySelectorAll("[data-announcement]");
    this.numAnnouncements = this.announcements.length;
    this.announcementsArray = Array.from(this.announcements);
    this.shouldCycle = this.announcements.length > 1;

    if (isDismissable) {
      this.dismissBtn = this.querySelector("[data-announcement-dismiss]");
    }

    if (this.getShouldSetHeight()) {
      this.setHeight();
    }

    if (this.shouldCycle && !Shopify.designMode) {
      this.currentIndex = 0;
      this.cycleInterval = null;
      this.cycleDuration = this.getAttribute("data-announcement-duration")
        ? parseInt(this.getAttribute("data-announcement-duration"), 10)
        : 10000;
      this.cycleAnnouncements();
    }

    if (isDismissable && this.dismissBtn) {
      this.dismissBtn.addEventListener("click", this.destroy.bind(this));
    }

    document.documentElement.style.setProperty(
      "--announcement-height",
      `${this.offsetHeight}px`
    );
    window.addEventListener("resize", this.onResize.bind(this));

    if (Shopify.designMode) {
      document.addEventListener("shopify:block:select", this.onBlockSelect.bind(this));
      document.addEventListener("shopify:block:deselect", this.onBlockDeselect.bind(this));
    }
  }

  onBlockSelect(event) {
    if (event.detail.sectionId !== this.sectionId) return;
    const targetAnnouncement = this.querySelector(`#announcement-${event.detail.blockId}`);
    if (targetAnnouncement) {
      this.showAnnouncement(targetAnnouncement);
    }
  }

  onBlockDeselect(event) {
    if (event.detail.sectionId !== this.sectionId) return;
    const targetAnnouncement = this.querySelector(`.announcement-bar__announcement:first-child`);
    if (targetAnnouncement) {
      this.showAnnouncement(targetAnnouncement);
    }
  }

  showAnnouncement(el) {
    this.announcements && this.announcements.forEach((announcement) => {
      announcement.classList.remove("visible");
      announcement.setAttribute("aria-hidden", "true");
    });
    el.classList.add("visible");
    el.setAttribute("aria-hidden", "false");
  }

  checkState() {
    if (!sessionStorage.getItem("show_announcements")) {
      sessionStorage.setItem("show_announcements", "true");
      this.show();
    } else if (sessionStorage.getItem("show_announcements") === "true") {
      this.show();
    }
  }

  cycleAnnouncements() {
    this.cycleInterval = setInterval(() => {
      this.announcements.forEach((announcement) => {
        announcement.classList.remove("visible");
        announcement.setAttribute("aria-hidden", "false");
      });
      setTimeout(() => {
        this.announcements[this.currentIndex].classList.add("visible");
        this.announcements[this.currentIndex].setAttribute(
          "aria-hidden",
          "true"
        );
      }, 500);
      this.currentIndex = (this.currentIndex + 1) % this.numAnnouncements;
    }, this.cycleDuration);
  }

  setHeight() {
    const announcementHeights = this.announcementsArray.map(
      (el) => el.offsetHeight
    );
    const newHeight = Math.max(...announcementHeights) + 12;
    this.style.setProperty("--height", `${newHeight}px`);
  }

  onResize() {
    if (this.getShouldSetHeight()) {
      this.setHeight();
      document.documentElement.style.setProperty(
        "--announcement-height",
        `${this.offsetHeight}px`
      );
    }
  }

  destroy() {
    if (Shopify.designMode) return;
    sessionStorage.setItem("show_announcements", "false");
    this.classList.add('hidden');
    if (this.cycleInterval) clearInterval(this.cycleInterval);
    window.removeEventListener("resize", this.onResize);
  }

  show() {
    this.classList.remove('hidden');
  }

  getShouldSetHeight() {
    return this.announcementsArray.some(
      (el) => el.offsetHeight !== this.offsetHeight
    );
  }

  disconnectedCallback() {
    if (this.cycleInterval) clearInterval(this.cycleInterval);
    window.removeEventListener("resize", this.onResize);
  }
}

customElements.define("announcement-bar", AnnouncementBar);