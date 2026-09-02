document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  const html = document.querySelector('html'),
    globalWrap = document.querySelector('.global-wrap'),
    body = document.querySelector('body'),
    menuToggle = document.querySelector(".hamburger"),
    menuList = document.querySelector(".main-nav"),
    searchOpenIcon = document.querySelector(".icon__search"),
    searchCloseIcon = document.querySelector(".search__close"),
    searchOverlay = document.querySelector(".search__overlay"),
    searchInput = document.querySelector(".search__text"),
    search = document.querySelector(".search"),
    searchBox = document.querySelector(".search__box"),
    toggleTheme = document.querySelector(".toggle-theme"),
    btnScrollToTop = document.querySelector(".top");


  /* =======================================================
  // Menu + Search + Theme Switcher
  ======================================================= */
  menuToggle.addEventListener("click", () => {
    menu();
  });

  searchOpenIcon.addEventListener("click", () => {
    searchOpen();
  });

  searchCloseIcon.addEventListener("click", () => {
    searchClose();
  });

  searchOverlay.addEventListener("click", () => {
    searchClose();
  });


  // Menu
  function menu() {
    menuToggle.classList.toggle("is-open");
    menuList.classList.toggle("is-visible");
  }

  // Search
  function searchOpen() {
    search.classList.add("is-visible");
    body.classList.add("search-is-visible");
    globalWrap.classList.add("is-active");
    menuToggle.classList.remove("is-open");
    menuList.classList.remove("is-visible");
    setTimeout(function () {
      searchInput.focus();
    }, 250);
  }

  function searchClose() {
    search.classList.remove("is-visible");
    body.classList.remove("search-is-visible");
    globalWrap.classList.remove("is-active");
  }

  document.addEventListener('keydown', function(e){
    if (e.key == 'Escape') {
      searchClose();
    }
  });


  // Theme Switcher
  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      darkMode();
    });
  };

  function darkMode() {
    if (html.classList.contains('dark-mode')) {
      html.classList.remove('dark-mode');
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("dark");
    } else {
      html.classList.add('dark-mode');
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("dark", "");
    }
  };


  /* ================================================================
  // Stop Animations During Window Resizing and Switching Theme Modes
  ================================================================ */
  let disableTransition;

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      stopAnimation();
    });
  }

  window.addEventListener("resize", () => {
    stopAnimation();
  });

  function stopAnimation() {
    document.body.classList.add("disable-animation");
    clearTimeout(disableTransition);
    disableTransition = setTimeout(() => {
      document.body.classList.remove("disable-animation");
    }, 100);
  };


  // =====================
  // Simple Jekyll Search
  // =====================
  SimpleJekyllSearch({
    searchInput: document.getElementById("js-search-input"),
    resultsContainer: document.getElementById("js-results-container"),
    json: "/search.json",
    searchResultTemplate: '<a class="search-results__item" href="{url}"><div class="search-results__image"><img src="{image}" alt="{title}"></div> <div class="search-results__content"><time class="search-results__date" datetime="{date}">{date}</time><div class="search-results__title">{title}</div></div></a>',
    noResultsText: '<h4 class="no-results">No results found...</h4>'
  });


  /* =======================
  // Responsive Videos
  ======================= */
  reframe(".post__content iframe:not(.reframe-off), .page__content iframe:not(.reframe-off)");


  /* =======================
  // LazyLoad Images
  ======================= */
  const lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  });


  /* =======================
  // Zoom Image
  ======================= */
  const lightense = document.querySelector(".page__content img, .post__content img, .gallery__image img"),
  imageLink = document.querySelectorAll(".page__content a img, .post__content a img, .gallery__image a img");

  if (imageLink) {
    for (const i = 0; i < imageLink.length; i++) imageLink[i].parentNode.classList.add("image-link");
    for (const i = 0; i < imageLink.length; i++) imageLink[i].classList.add("no-lightense");
  };

  if (lightense) {
    Lightense(".page__content img:not(.no-lightense), .post__content img:not(.no-lightense), .gallery__image img:not(.no-lightense)", {
    padding: 60,
    offset: 30
    });
  };


  /* =======================
  // Convert Hex to RGBA
  ======================= */
  const hex2rgba = (hex, alpha = 0.15) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  };
  const imageCover = document.querySelectorAll('.tag-color-js');


  // Adds a linear gradient to posts
  function linearGradient() {
    for (var i = 0; i < imageCover.length; i++) {
      const dataAttribute = hex2rgba(imageCover[i].getAttribute('data-accent'));
      imageCover[i].style.background= dataAttribute;
    }
  };

  linearGradient();


  /* =======================
  // Copy Code Button
  ======================= */
  document.querySelectorAll('.post__content pre.highlight, .page__content pre.highlight')
  .forEach(function (pre) {
    const button = document.createElement('button');
    const copyText = 'Copy';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = copyText;
    button.addEventListener('click', function () {
      let code = pre.querySelector('code').innerText;
      try {
        code = code.trimEnd();
      } catch (e) {
        code = code.trim();
      }
      navigator.clipboard.writeText(code);
      button.innerText = 'Copied!';
      setTimeout(function () {
        button.blur();
        button.innerText = copyText;
      }, 2e3);
    });
    pre.appendChild(button);
  });


  /* =======================
  // Scroll Top Button
  ======================= */
  btnScrollToTop.addEventListener("click", function () {
    if (window.scrollY != 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  });

});


/* =======================
// Post Table of Contents
// Deliberately its own DOMContentLoaded listener rather than part of the block
// above: listeners run independently, so a throw in the vendored theme code
// cannot stop the TOC from building (and a bug here cannot break the theme).
======================= */
document.addEventListener("DOMContentLoaded", function () {
  'use strict';

  const toc = document.getElementById("js-post-toc"),
    tocContent = document.querySelector(".post__content");

  if (toc && tocContent) {
    const headings = tocContent.querySelectorAll("h1[id], h2[id], h3[id], h4[id]"),
      tocList = toc.querySelector(".post-toc__list"),
      wideQuery = window.matchMedia("(min-width: 1300px)");

    // Short posts don't need a table of contents
    if (headings.length > 2) {
      const tocLinks = {};

      // Posts don't agree on a starting heading level (some open at h1, others
      // at h2 and skip to h4), so indent by the levels actually used, not by tag
      const levels = [];
      headings.forEach(function (heading) {
        const level = Number(heading.tagName.charAt(1));
        if (levels.indexOf(level) === -1) levels.push(level);
      });
      levels.sort(function (a, b) { return a - b; });

      headings.forEach(function (heading) {
        const item = document.createElement("li"),
          link = document.createElement("a"),
          depth = Math.min(levels.indexOf(Number(heading.tagName.charAt(1))), 2);

        item.className = "post-toc__item is-level-" + depth;
        link.className = "post-toc__link";
        link.href = "#" + heading.id;
        link.textContent = heading.textContent;

        item.appendChild(link);
        tocList.appendChild(item);
        tocLinks[heading.id] = link;
      });

      toc.hidden = false;

      // Expanded as a rail on wide screens, collapsed as a bar on narrow ones
      function syncTocState(event) {
        toc.open = event.matches;
      }

      syncTocState(wideQuery);
      wideQuery.addEventListener("change", syncTocState);

      // Collapse the bar again after jumping to a section
      tocList.addEventListener("click", function (e) {
        if (e.target.closest(".post-toc__link") && !wideQuery.matches) {
          toc.open = false;
        }
      });

      // Keep the active entry visible inside the rail, never scrolling the page
      function revealInRail(link) {
        if (!wideQuery.matches) return;

        const railBox = toc.getBoundingClientRect(),
          linkBox = link.getBoundingClientRect();

        if (linkBox.top < railBox.top) {
          toc.scrollTop -= railBox.top - linkBox.top;
        } else if (linkBox.bottom > railBox.bottom) {
          toc.scrollTop += linkBox.bottom - railBox.bottom;
        }
      }

      // Highlight the section currently being read
      const tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const link = tocLinks[entry.target.id];
          if (!link) return;

          for (const id in tocLinks) tocLinks[id].classList.remove("is-active");
          link.classList.add("is-active");
          revealInRail(link);
        });
      }, {
        rootMargin: "-80px 0px -70% 0px"
      });

      headings.forEach(function (heading) {
        tocObserver.observe(heading);
      });
    }
  }

});