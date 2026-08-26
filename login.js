"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("loginForm");

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const rememberMe =
    document.getElementById("rememberMe");

  const submitButton =
    document.getElementById("loginSubmit");

  const message =
    document.getElementById("loginMessage");


  function showMessage(text, type) {

    if (!message) {
      return;
    }

    message.textContent = text;

    message.className =
      `login-message show ${type}`;

  }


  function clearMessage() {

    if (!message) {
      return;
    }

    message.textContent = "";

    message.className =
      "login-message";

  }


  function setError(input, text) {

    if (!input) {
      return;
    }

    const field =
      input.closest(".login-field");

    const error =
      document.getElementById(
        `${input.id}Error`
      );

    if (error) {
      error.textContent = text;
    }

    if (field) {
      field.classList.add("has-error");
      field.classList.remove("has-success");
    }

  }


  function clearError(input) {

    if (!input) {
      return;
    }

    const field =
      input.closest(".login-field");

    const error =
      document.getElementById(
        `${input.id}Error`
      );

    if (error) {
      error.textContent = "";
    }

    if (field) {
      field.classList.remove("has-error");
    }

  }


  function isValidEmail(value) {

    if (
      !value ||
      value.length > 254
    ) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value);

  }


  function getSavedUser() {

    try {

      const saved =
        localStorage.getItem(
          "civaUserProfile"
        );

      if (!saved) {
        return null;
      }

      return JSON.parse(saved);

    } catch (error) {

      return null;

    }

  }


  document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            document.getElementById(
              button.dataset.target
            );

          if (!target) {
            return;
          }

          const shouldShow =
            target.type === "password";

          target.type =
            shouldShow
              ? "text"
              : "password";

          button.textContent =
            shouldShow
              ? "Hide"
              : "Show";

          button.setAttribute(
            "aria-label",
            shouldShow
              ? "Hide password"
              : "Show password"
          );

        }
      );

    });


  [ emailInput, passwordInput ]
    .forEach(input => {

      if (!input) {
        return;
      }

      input.addEventListener(
        "input",
        () => {

          clearError(input);
          clearMessage();

        }
      );

    });


  if (form) {

    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const email =
          emailInput.value
            .trim()
            .toLowerCase();

        const password =
          passwordInput.value;


        clearMessage();
        clearError(emailInput);
        clearError(passwordInput);


        let valid = true;


        if (!isValidEmail(email)) {

          setError(
            emailInput,
            "Please enter a valid email address."
          );

          valid = false;

        }


        if (
          !password ||
          password.length < 8 ||
          password.length > 128
        ) {

          setError(
            passwordInput,
            "Please enter your password."
          );

          valid = false;

        }


        if (!valid) {

          showMessage(
            "Please fix the highlighted fields.",
            "error"
          );

          return;

        }


        const user =
          getSavedUser();


        if (!user) {

          showMessage(
            "No CIVA account was found on this device. Please create an account first.",
            "error"
          );

          return;

        }


        const savedEmail =
          typeof user.email === "string"
            ? user.email
              .trim()
              .toLowerCase()
            : "";


        if (
          !savedEmail ||
          savedEmail !== email
        ) {

          showMessage(
            "The email address does not match the account on this device.",
            "error"
          );

          return;

        }


        showMessage(
          "This frontend version cannot verify passwords yet. Secure authentication will be connected when the backend is added.",
          "error"
        );

      }
    );

  }

});