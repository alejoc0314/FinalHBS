function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  if (email === "alejoc0314@gmail.com" && password === "1234") {
    alert("Inicio sesion exitoso");
    window.location.href = "/home";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

cerrar = () => {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    window.location.href = '/';
  }
}

const boton = document.querySelector('#botoncerrar');
boton.addEventListener('click', cerrar);