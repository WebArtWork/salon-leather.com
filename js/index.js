// BURGER MENU ====
const iconMenu = document.querySelector(".menu-icon");
const wrapper = document.querySelector(".wrapper");
const active = document.querySelectorAll("._active");
const menu = document.querySelector(".menu");
const search = document.querySelector(".search-wrap-mob");

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    wrapper.classList.toggle("_lock");
    iconMenu.classList.toggle("_active");
    menu.classList.toggle("_active");
    search.classList.toggle("_active");
  });
}

// Show on scroll ====

const scroll =
  window.requestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

const elementsToShow = document.querySelectorAll(".show-on-scroll");

function loop() {
  elementsToShow.forEach(function (element) {
    if (isElementInViewPort(element)) {
      element.classList.add("is-visible");
    } else {
      element.classList.remove("is-visible");
    }
  });
  scroll(loop);
}
loop();

// creating the isElementInViewPort method -->
function isElementInViewPort(el) {
  const rect = el.getBoundingClientRect();
  return (
    (rect.top <= 0 && rect.bottom >= 0) ||
    (rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight)) ||
    (rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight))
  );
}

// Drop down categories in the footer ====
const furnitures = document.querySelector(".furniture__list");
const leathers = document.querySelector(".leather__list");

if (furnitures) {
  const furnitureTitle = document.querySelector(".furniture__title");

  furnitureTitle.addEventListener("click", function (b) {
    furnitures.classList.toggle("_active");
    furnitureTitle.classList.toggle("_icon");
  });
}
if (leathers) {
  const leatherTitle = document.querySelector(".leather__title");

  leatherTitle.addEventListener("click", function (c) {
    leathers.classList.toggle("_active");
    leatherTitle.classList.toggle("_icon");
  });
}

// ==== Making the floating button dissapear on scroll ====
const fab = document.querySelector(".fab");
let scrollPosition = window.scrollY;
window.addEventListener("scroll", function () {
  scrollPosition = window.scrollY;
  if (scrollPosition >= 60) {
    fab.classList.add("_scrolled");
  } else {
    fab.classList.remove("_scrolled");
  }
});

// ==== FAB 2 show on scroll ====
const fabTwo = document.querySelector(".fab-two");
window.addEventListener("scroll", function () {
  scrollPosition = window.scrollY;
  if (scrollPosition >= 60) {
    fabTwo.classList.add("_scroll-up");
  } else {
    fabTwo.classList.remove("_scroll-up");
  }
});

// === FAB 2 scroll to the top ====
if (fabTwo) {
  fabTwo.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });
}

// === Contacts scroll to the footer ====
const contacts = document.querySelector("#contacts-btn");
if (!active) {
  contacts.addEventListener("click", () => {
    window.scrollTo(0, document.body.scrollHeight);
  });
} else if (active) {
  contacts.addEventListener("click", () => {
    wrapper.classList.remove("_lock");
    setTimeout(() => {
      menu.classList.remove("_active");
      iconMenu.classList.remove("_active");
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 600);
  });
}

// ==== SWIPER ====

function swiper() {
  const swiper = new Swiper(".swiper", {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 50,
    direction: "horizontal",
    loop: true,
    grabCursor: true,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // No slider if there are less photos
    watchOverflow: true,
  });

  let slideImg = document.querySelectorAll(".swiper-slide");
  let slider = document.querySelector(".swiper");
  let bg = document.querySelector(".background");

  for (let i = 0; i < slideImg.length; i++) {
    slideImg[i].addEventListener("click", function () {
      slider.classList.add("_full-screen");
      bg.classList.add("_cover");
      slideImg[i].classList.add("swiper-slide-active");
      console.log(slideImg[i]);
    });
  }

  bg.addEventListener("click", function () {
    bg.classList.remove("_cover");
    slider.classList.remove("_full-screen");
  });
}

addEventListener("DOMContentLoaded", (event) => {
  swiper();
});

function get_cookie(name) {
  return document.cookie.split(";").some((c) => {
    return c.trim().startsWith(name + "=");
  });
}

function delete_cookie(name, path, domain) {
  if (get_cookie(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

// === Get cart from cookie ====
function getCart() {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  if (
    ca.find((e) => {
      return e.indexOf("waw_cart=") != -1;
    })
  ) {
    return JSON.parse(
      ca[ca.findIndex((c) => c.indexOf("waw_cart") != -1)].split("=")[1]
    );
  } else return {};
}

// ==== Set cart to cookie ====
function setCart(value) {
  localStorage.setItem("waw_cart", JSON.stringify(value));
  delete_cookie("waw_cart");
  document.cookie = "waw_cart=" + JSON.stringify(value) + "; path=/;";
}

// ==== Get cart from localStorage ====
if (
  document.cookie.indexOf("waw_cart") == -1 &&
  localStorage.getItem("waw_cart")
) {
  setCart(JSON.parse(localStorage.getItem("waw_cart")));
  if (location.pathname == "/cart") location.reload();
}

// === Get wish list from cookie ====
function getWish() {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  if (
    ca.find((e) => {
      return e.indexOf("waw_wishlist=") != -1;
    })
  ) {
    let wish_list = ca
      .find((e) => {
        return e.indexOf("waw_wishlist=") != -1;
      })
      .trim();
    return wish_list.split("=")[1].split(",");
  } else return [];
}

// ==== Set wish list to cookie ====
function setWish(value) {
  localStorage.setItem("waw_wishlist", value.join(","));
  delete_cookie("waw_wishlist");
  document.cookie = "waw_wishlist=" + value.join(",") + "; path=/;";
}

// ==== Get wish list from localStorage ====
if (
  document.cookie.indexOf("waw_wishlist") == -1 &&
  localStorage.getItem("waw_wishlist")
) {
  document.cookie = "waw_wishlist=" + localStorage.getItem("waw_wishlist");
  location.reload();
}

// ==== Adding a product to the wish list ====
function addToWish(product_id, target, event) {
  let wish = getWish();
  if (location.pathname == "/wishlist") {
    target.querySelector("#background").style.fill = "transparent";
    wish.splice(
      wish.findIndex((p) => {
        return p == product_id;
      }),
      1
    );
    setWish(wish);
    document.querySelector('[data-product="' + product_id + '"').remove();
  } else {
    if (
      !wish.find((p) => {
        return p == product_id;
      })
    ) {
      wish.push(product_id);
      setWish(wish);
      if (location.pathname.indexOf("/p") != -1)
        target.querySelector("#background").style.fill = "#ffffff";
      else target.querySelector("#background").style.fill = "#ac4a4a";
    } else {
      wish.splice(
        wish.findIndex((p) => {
          return p == product_id;
        }),
        1
      );
      setWish(wish);
      target.querySelector("#background").style.fill = "transparent";
    }
  }
  event.preventDefault();
  return false;
}

// ==== Open material collections on product page ====
function changeMaterial(target) {
  target.parentElement.querySelector(".active").classList.remove("active");
  target.classList.add("active");
  document
    .querySelector(".active[data-material-collections]")
    .classList.remove("active");
  document
    .querySelector(
      '[data-material-collections="' + target.dataset.material + '"]'
    )
    .classList.add("active");
}

// ==== Open collection link or description on product page ====
function openCollection(target) {
  if (target.dataset.link) {
    window.open(target.dataset.link, "_blank").focus();
  } else
    document.querySelector(
      '.modal[data-collection="' + target.dataset.collection + '"]'
    ).style.display = "block";
}

// ==== Close collection modal on product page ====
function closeModal(target) {
  if (target.classList.contains("modal")) target.style.display = "none";
  if (target.classList.contains("close"))
    target.closest(".modal").style.display = "none";
}

// ==== Hover over a color ====
for (let color of document.querySelectorAll(".collection__colors .color")) {
  color.addEventListener("mouseover", () => {
    if (window.innerWidth > 768) {
      const container = color.querySelector(".color__container");
      container.style.display = "block";
      const left = container.getBoundingClientRect().left;
      if (left < 20) {
        color.querySelector(".color__card").style.left =
          Math.abs(left) + 20 + "px";
      }
      const right = container.getBoundingClientRect().right;
      if (right > window.innerWidth - 20) {
        color.querySelector(".color__card").style.right =
          Math.abs(window.innerWidth - right - 20) + "px";
      }
      container.style.opacity = 1;
    }
  });
  color.addEventListener("mouseout", () => {
    const container = color.querySelector(".color__container");
    container.style.display = "none";
    container.style.opacity = 0;
  });
}

// ==== Choice the product color ====
function choiceColor(target, price, thumbs, product_id) {
  for (let color of document.querySelectorAll("[data-color]")) {
    color?.classList.remove("active");
  }
  target.classList.add("active");
  document.getElementById("color_id").value = target.dataset.color;
  var product = product_id + "_C_" + target.dataset.color;
  var cart = getCart();
  if (cart[product]) document.querySelector("[data-buy").innerText = "В кошику";
  else document.querySelector("[data-buy").innerText = "Купити";
  document.querySelector(".product__price").innerHTML = price + " грн.";
  document.querySelector(".swiper-wrapper").innerHTML = "";
  for (let thumb of thumbs.split(",")) {
    const img = document.createElement("img");
    img.src = thumb;
    const box = document.createElement("div");
    box.classList.add("swiper-img-box");
    box.appendChild(img);
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.appendChild(box);
    document.querySelector(".swiper-wrapper").appendChild(slide);
  }
  swiper();
}

// ==== Star rating display ====
for (let rating of document.querySelectorAll(".rating")) {
  rating.querySelector(".rating_active").style.width =
    rating.dataset.rating / 0.05 + "%";
}

// ==== Send review to the server ====
function sendReview(event, product) {
  event.preventDefault();
  var error = false;
  if (!event.target.name.value.trim()) {
    document.getElementById("error_name").innerText = "Введіть ім'я";
    if (!error) error = true;
  } else document.getElementById("error_name").innerText = "";
  if (!event.target.email.value.trim()) {
    document.getElementById("error_email").innerText =
      "Введіть електронну пошту";
    if (!error) error = true;
  } else document.getElementById("error_email").innerText = "";
  if (!event.target.content.value.trim()) {
    document.getElementById("error_content").innerText = "Введіть відгук";
    if (!error) error = true;
  } else document.getElementById("error_content").innerText = "";
  if (
    !event.target.rating.value ||
    Number(event.target.rating.value) < 1 ||
    Number(event.target.rating.value) > 5
  ) {
    document.getElementById("error_rating").innerText = "Оберіть оцінку";
    if (!error) error = true;
  } else document.getElementById("error_rating").innerText = "";
  if (!error) {
    var form = {};
    form.name = event.target.name.value.trim();
    form.email = event.target.email.value.trim();
    form.content = event.target.content.value.trim();
    form.rating = Number(event.target.rating.value);
    form.product = product;
    fetch("/review/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) event.target.reset();
        else
          document.getElementById("error_submit").innerText =
            "Щось пішло не так...";
      });
  }
}

// ==== Adding a product to the cart ====
async function addToCart(product_id, target) {
  var product = product_id;
  var cart = getCart();
  if (document.getElementById("color_id")) {
    const color_id = document.getElementById("color_id").value;
    if (color_id) {
      if (cart[product_id]) delete cart[product_id];
      product += "_C_" + color_id;
    }
  }
  if (!cart[product]) {
    cart[product] = 1;
    setCart(cart);
    target.innerText = "В кошику";
    return false;
  } else window.location.replace("/cart");
}

// ==== Product Anchor ====
const anchorLinks = document.querySelectorAll(".product__nav-links a");

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
