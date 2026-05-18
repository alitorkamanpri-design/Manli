/* ═══════════════════════════════════════════════
   اسکریپت احراز هویت — مانلی شاپ
   تمام عملکردهای فرم‌های ورود و ثبت‌نام
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   تغییر بین فرم ورود و ثبت‌نام
   ═══════════════════════════════════════════════ */
document.querySelectorAll(".toggle-auth").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-form").classList.toggle("active");
    document.getElementById("register-form").classList.toggle("active");
    document.querySelectorAll(".auth-form input").forEach((input) => {
      input.value = "";
      input.classList.remove("valid", "invalid");
    });
  });
});

/* ═══════════════════════════════════════════════
   نمایش/پنهان کردن رمز عبور
   ═══════════════════════════════════════════════ */
document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = btn.closest(".password-input").querySelector("input");
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "🙈" : "👁️";
  });
});

/* ═══════════════════════════════════════════════
   محاسبه قوت رمز عبور
   ═══════════════════════════════════════════════ */
const passwordInput = document.getElementById("register-password");
const confirmInput = document.getElementById("register-confirm");

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    const pwd = passwordInput.value;
    const strengthFill = document.querySelector(".strength-fill");
    const strengthText = document.querySelector(".strength-text");

    let strength = 0;
    const checks = [
      { test: pwd.length >= 6, weight: 20 },
      { test: pwd.length >= 8, weight: 20 },
      { test: /[a-z]/.test(pwd), weight: 15 },
      { test: /[A-Z]/.test(pwd), weight: 15 },
      { test: /[0-9]/.test(pwd), weight: 15 },
      { test: /[^a-zA-Z0-9]/.test(pwd), weight: 15 },
    ];

    checks.forEach((check) => {
      if (check.test) strength += check.weight;
    });

    let level = "ضعیف";
    let color = "#EF4444";

    if (strength >= 80) {
      level = "بسیار قوی";
      color = "#10B981";
    } else if (strength >= 60) {
      level = "قوی";
      color = "#F59E0B";
    } else if (strength >= 40) {
      level = "متوسط";
      color = "#FBBF24";
    }

    strengthFill.style.width = strength + "%";
    strengthFill.style.background = color;
    strengthText.textContent = "قوت رمز: " + level;
  });
}

/* ═══════════════════════════════════════════════
   اعتبارسنجی ورود
   ═══════════════════════════════════════════════ */
function validateLoginForm() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errors = {};

  if (!email) {
    errors.email = "ایمیل یا شماره موبایل الزامی است";
  } else if (!isValidEmail(email) && !isValidPhone(email)) {
    errors.email = "لطفاً ایمیل یا شماره موبایل صحیح وارد کنید";
  }

  if (!password) {
    errors.password = "رمز عبور الزامی است";
  } else if (password.length < 6) {
    errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
  }

  return errors;
}

/* ═══════════════════════════════════════════════
   اعتبارسنجی ثبت‌نام
   ═══════════════════════════════════════════════ */
function validateRegisterForm() {
  const fullname = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const phone = document.getElementById("register-phone").value.trim();
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-confirm").value;
  const terms = document.getElementById("terms").checked;

  const errors = {};

  if (!fullname) {
    errors.fullname = "نام کامل الزامی است";
  } else if (fullname.length < 3) {
    errors.fullname = "نام باید حداقل ۳ کاراکتر باشد";
  }

  if (!email) {
    errors.email = "ایمیل الزامی است";
  } else if (!isValidEmail(email)) {
    errors.email = "لطفاً ایمیل صحیح وارد کنید";
  }

  if (!phone) {
    errors.phone = "شماره موبایل الزامی است";
  } else if (!isValidPhone(phone)) {
    errors.phone = "لطفاً شماره موبایل صحیح وارد کنید";
  }

  if (!password) {
    errors.password = "رمز عبور الزامی است";
  } else if (password.length < 6) {
    errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
  }

  if (!confirm) {
    errors.confirm = "تأیید رمز عبور الزامی است";
  } else if (password !== confirm) {
    errors.confirm = "رمزهای عبور مطابقت ندارند";
  }

  if (!terms) {
    errors.terms = "شما باید شرایط استفاده را بپذیرید";
  }

  return errors;
}

/* ═══════════════════════════════════════════════
   تابع اعتبارسنجی ایمیل
   ═══════════════════════════════════════════════ */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* ═══════════════════════════════════════════════
   تابع اعتبارسنجی شماره موبایل ایرانی
   ═══════════════════════════════════════════════ */
function isValidPhone(phone) {
  const phoneRegex = /^(\+98|0)9\d{9}$/;
  return phoneRegex.test(phone);
}

/* ═══════════════════════════════════════════════
   نمایش خطاهای اعتبارسنجی
   ═══════════════════════════════════════════════ */
function displayErrors(form, errors) {
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    const errorMsg = input.closest(".form-group")?.querySelector(".error-msg");
    if (errorMsg) {
      if (errors[input.name]) {
        errorMsg.textContent = errors[input.name];
        input.classList.add("invalid");
        input.classList.remove("valid");
      } else if (input.value && !errors[input.name]) {
        errorMsg.textContent = "";
        input.classList.add("valid");
        input.classList.remove("invalid");
      }
    }
  });
}

/* ═══════════════════════════════════════════════
   فرم ورود — ارسال
   ═══════════════════════════════════════════════ */
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const errors = validateLoginForm();

  if (Object.keys(errors).length > 0) {
    displayErrors(document.getElementById("login-form"), errors);
    showToast("❌ لطفاً خطاهای فرم را اصلاح کنید");
    return;
  }

  // شبیه‌سازی ورود
  showToast("⏳ در حال بررسی...");
  setTimeout(() => {
    const email = document.getElementById("login-email").value.trim();
    const phone = document.getElementById("login-email").value.trim();

    // تشخیص مدیر
    let userType = "customer";
    if (
      email === "admin" ||
      phone === "09000000000" ||
      phone === "۰۹۰۰۰۰۰۰۰۰۰"
    ) {
      userType = "admin";
    }

    localStorage.setItem("user_logged_in", "true");
    localStorage.setItem("user_type", userType);
    showToast("✅ خوش آمدید! درحال انتقال...");
    setTimeout(() => {
      const redirectUrl = userType === "admin" ? "Admin.html" : "Dasbord.html";
      window.location.href = redirectUrl;
    }, 1500);
  }, 1500);
});

/* ═══════════════════════════════════════════════
   فرم ثبت‌نام — ارسال
   ═══════════════════════════════════════════════ */
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const errors = validateRegisterForm();

  if (Object.keys(errors).length > 0) {
    displayErrors(document.getElementById("register-form"), errors);
    showToast("❌ لطفاً خطاهای فرم را اصلاح کنید");
    return;
  }

  // شبیه‌سازی ثبت‌نام
  showToast("⏳ در حال ایجاد حساب...");
  setTimeout(() => {
    const userData = {
      name: document.getElementById("register-name").value,
      email: document.getElementById("register-email").value,
      phone: document.getElementById("register-phone").value,
      logged_in: true,
      type: "customer",
    };
    localStorage.setItem("user_data", JSON.stringify(userData));
    localStorage.setItem("user_logged_in", "true");
    localStorage.setItem("user_type", "customer");
    showToast("✅ ثبت‌نام موفق! خوش آمدید!");
    setTimeout(() => {
      window.location.href = "Dasbord.html";
    }, 1500);
  }, 2000);
});

/* ═══════════════════════════════════════════════
   رویداد خودکار نمایش/پنهان خطا
   ═══════════════════════════════════════════════ */
document.querySelectorAll(".auth-form input").forEach((input) => {
  input.addEventListener("blur", () => {
    const form = input.closest(".auth-form");
    const formType = form.id === "login-form" ? "login" : "register";
    const errors =
      formType === "login" ? validateLoginForm() : validateRegisterForm();
    displayErrors(form, errors);
  });

  input.addEventListener("input", () => {
    const errorMsg = input.closest(".form-group")?.querySelector(".error-msg");
    if (errorMsg && !input.value) {
      errorMsg.textContent = "";
      input.classList.remove("valid", "invalid");
    }
  });
});

/* ═══════════════════════════════════════════════
   Toast Notification
   ═══════════════════════════════════════════════ */
function showToast(msg, duration = 3000) {
  const container = document.querySelector(".toast-container");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add("removing");
    setTimeout(() => el.remove(), 300);
  }, duration);
}

/* ═══════════════════════════════════════════════
   Keyboard shortcuts
   ═══════════════════════════════════════════════ */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const activeForm = document.querySelector(".auth-form.active");
    const submitBtn = activeForm.querySelector(".btn-submit");
    if (document.activeElement !== submitBtn) {
      submitBtn.click();
    }
  }
});

console.log("✅ Auth system loaded successfully");
