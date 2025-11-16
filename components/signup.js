class SignupForm extends HTMLElement {
  #shadow;
  #data;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = [];
    this.render()
  }

  set data(value) {
    this.#data = structuredClone(value)
    this.render()
  }

  get data() {
    return this.#data
  }

  render() {
    let container = document.createElement("div")
    container.className = "formContainer"

    let form = document.createElement("form")
    form.className = "form"

    let emailLabel = document.createElement("label")
    emailLabel.textContent = "email"
    let email = document.createElement("input")
    email.name = "username"
    email.autocomplete = "username"
    email.id = "email"

    let passwordLabel = document.createElement("label")
    passwordLabel.textContent = "password"
    let password = document.createElement("input")
    password.name = "password"
    password.autocomplete = "password"
    password.setAttribute("type", "password")
    password.id = "password"

    let loginButton = document.createElement("button")
    loginButton.textContent = "Login"
    loginButton.id = "login"

    let signupButton = document.createElement("button")
    signupButton .textContent = "Signup"
    signupButton.id = "signup"

    form.addEventListener( "submit", (e) => {
      e.preventDefault()
      let email = e.target.querySelector("#email").value
      let password = e.target.querySelector("#password").value

      if (e.submitter.id == "login") {
        firebaseLoginEP(email, password)
          .then((res) => {
            console.log(res)
          })
      } else if (e.submitter.id == "signup") {
        firebaseSignup(email, password)
          .then((res) => {
            console.log(res)
          })
      }
    })

    form.appendChild(emailLabel)
    form.appendChild(email)
    form.appendChild(passwordLabel)
    form.appendChild(password)
    form.appendChild(loginButton)
    form.appendChild(signupButton)
    container.appendChild(form)

    let container1 = document.createElement("div")
    container1.className = "formContainer"

    let form1 = document.createElement("form")
    form1.className = "form"

    let passwordLabel1 = document.createElement("label")
    passwordLabel1.textContent = "new password"
    let password1 = document.createElement("input")
    password1.setAttribute("type", "password")
    password1.id = "newPassword"

    let loginButton1 = document.createElement("button")
    loginButton1.textContent = "change pass"
    loginButton1.id = "login"

    form1.addEventListener( "submit", (e) => {
      e.preventDefault()
      let password = e.target.querySelector("#newPassword").value
      firebaseChangePassword(password)
        .then((res) => {
          console.log(res)
        })
    })

    form1.appendChild(passwordLabel1)
    form1.appendChild(password1)
    form1.appendChild(loginButton1)
    container1.appendChild(form1)

    this.#shadow.innerHTML = `
      <style>
        .form {
          display:flex;
          flex-direction:column;
        }
      </style>
    `;
    this.#shadow.appendChild(container)
    this.#shadow.appendChild(container1)
  }
}
customElements.define("signup-form", SignupForm);
