/* ------------------ COMPANY PHONE SETTINGS ------------------ */
const COMPANY_PHONE = "07036924563"; // Display / website use
const WHATSAPP_NUMBER = "2347036924563"; // WhatsApp format (IMPORTANT)

/* ------------------ FORMSPREE ------------------ */
const FORM_ENDPOINT = "https://formspree.io/f/yourFormID";

/* ---------- AUTO APPLY PHONE TO WEBSITE LINKS ---------- */
// Any element with data-phone will become clickable
document.querySelectorAll("[data-phone]").forEach((el) => {
  el.href = `tel:${COMPANY_PHONE}`;
  el.textContent = COMPANY_PHONE;
});

/* ---------- DOM refs ---------- */
const orderModal = document.getElementById("orderModal");
const orderForm = document.getElementById("orderForm");
const serviceInput = document.getElementById("serviceInput");
const orderFeedback = document.getElementById("orderFeedback");
const modalClose = document.getElementById("modalClose");

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

/* ---------- Mobile menu toggle ---------- */
hamburger &&
  hamburger.addEventListener("click", () => {
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.position = "absolute";
    navLinks.style.top = "64px";
    navLinks.style.right = "16px";
    navLinks.style.background = "#fff";
    navLinks.style.padding = "12px";
    navLinks.style.boxShadow = "0 8px 30px rgba(2,6,23,0.08)";
  });

/* ---------- Open / Close modal ---------- */
function openOrderForm(serviceName = "") {
  serviceInput.value = serviceName;
  orderFeedback.textContent = "";
  orderForm.reset();
  orderForm.action = FORM_ENDPOINT;
  orderForm.setAttribute("accept-charset", "utf-8");
  orderModal.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    const first = orderForm.querySelector('input[name="Name"]');
    first && first.focus();
  }, 80);
}

function closeOrderForm() {
  orderModal.setAttribute("aria-hidden", "true");
  orderFeedback.textContent = "";
}

modalClose && modalClose.addEventListener("click", closeOrderForm);
orderModal &&
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) closeOrderForm();
  });

/* ---------- WhatsApp Integration ---------- */
function sendToWhatsApp() {
  const service = document.getElementById("serviceInput").value;
  const name = document.getElementById("orderName").value;
  const email = document.getElementById("orderEmail").value;
  const phone = document.getElementById("orderPhone").value;
  const details = document.getElementById("orderDetails").value;

  const text = `Hello AKAY, I want to place an order.

Service: ${service}
Name: ${name}
Email: ${email}
Phone: ${phone}
Details: ${details}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

/* ---------- Order form submit ---------- */
orderForm &&
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    orderFeedback.style.color = "#0b74da";
    orderFeedback.textContent = "Sending order...";

    const email = orderForm.querySelector('input[name="Email"]').value.trim();
    const name = orderForm.querySelector('input[name="Name"]').value.trim();

    if (!name || !email) {
      orderFeedback.style.color = "crimson";
      orderFeedback.textContent = "Please enter your name and email.";
      return;
    }

    // Send WhatsApp first
    sendToWhatsApp();

    // Then Formspree
    const formData = new FormData(orderForm);
    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          orderFeedback.style.color = "#0b74da";
          orderFeedback.textContent =
            "Order submitted — we will contact you shortly.";
          orderForm.reset();
          setTimeout(closeOrderForm, 1800);
        } else {
          throw new Error("Form error");
        }
      })
      .catch(() => {
        orderFeedback.style.color = "crimson";
        orderFeedback.textContent =
          "Unable to send order right now. Please try again later.";
      });
  });

/* ---------- Contact form (UPDATED → WHATSAPP ONLY) ---------- */
const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

function submitContact(e) {
  e.preventDefault();

  const name = contactForm.querySelector('input[name="name"]').value;
  const email = contactForm.querySelector('input[name="email"]').value;
  const phone = contactForm.querySelector('input[name="phone"]').value;
  const message = contactForm.querySelector('textarea[name="message"]').value;

  const text = `Hello AKAY Support,

Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");

  contactFeedback.style.color = "#0b74da";
  contactFeedback.textContent = "Redirecting to WhatsApp...";

  contactForm.reset();
}

/* ---------- Footer Year ---------- */
document.getElementById("year") &&
  (document.getElementById("year").textContent = new Date().getFullYear());