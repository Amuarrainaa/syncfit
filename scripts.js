// scripts.js

// Función para manejar el formulario de registro
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Registrando usuario:", { name, email, password });
    alert("Usuario registrado correctamente.");
  });
  
  // Función para manejar el formulario de inicio de sesión
  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log("Iniciando sesión para:", { email, password });
    alert("Inicio de sesión exitoso.");
  });
  
  // Función para manejar el formulario de suscripción
  document.getElementById('subscription-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const paymentMethod = document.getElementById('payment-method').value;
    console.log("Suscribiéndose con método de pago:", paymentMethod);
    alert("Suscripción realizada correctamente.");
  });
  