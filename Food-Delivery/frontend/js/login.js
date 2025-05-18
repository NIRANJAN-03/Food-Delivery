document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok && data.user) {
          // ✅ Hide form and error
          loginForm.style.display = 'none';
          document.getElementById('error-message').style.display = 'none';

          // ✅ Show user profile
          showUserAccount(data.user.name, data.user.email);
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error.message);
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').style.display = 'block';
      }
    });
  }
});

function showUserAccount(name, email) {
  const container = document.getElementById('user-profile');
  container.style.display = 'block';

  container.innerHTML = `
    <div class="user-profile">
      <h2>Welcome, ${name}</h2>
      <p>Email: ${email}</p>
      <button id="logout-btn" class="btn btn-danger">Logout</button>
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.reload();
  });
}
