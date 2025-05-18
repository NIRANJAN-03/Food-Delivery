document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // Hide login form
            document.getElementById("login-form").style.display = "none";

            // Fetch user order history
            const ordersRes = await fetch(`http://localhost:3000/api/users/orders?email=${email}`);
            const ordersData = await ordersRes.json();

            let ordersHTML = "";

            if (ordersData.length === 0) {
                ordersHTML = "<p>No orders found.</p>";
            } else {
                ordersData.forEach(order => {
                    ordersHTML += `
                        <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                            <p><strong>Order ID:</strong> ${order.id}</p>
                            <p><strong>Total Price:</strong> ₹${order.total_price}</p>
                            <p><strong>Status:</strong> ${order.status}</p>
                        </div>
                    `;
                });
            }

            // Show user info
            document.getElementById("user-profile").innerHTML = `
           <h2>Welcome, ${data.user.name}!</h2>
           <p><strong>Email:</strong> ${data.user.email}</p>
           <h3>Your Orders:</h3>
            ${ordersHTML}
          <button id="logout-btn">Logout</button>
`;
            document.getElementById("logout-btn").addEventListener("click", function (e) {
              e.preventDefault();  // prevent default behavior if any
    // Show login form again
    document.getElementById("login-form").style.display = "block";
    // Hide user profile
    document.getElementById("user-profile").style.display = "none";
    // Clear error message if any
    document.getElementById("error-message").style.display = "none";

    // Optionally clear form fields
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
});

            document.getElementById("user-profile").style.display = "block";

        } else {
            document.getElementById("error-message").textContent = data.message || "Login failed";
            document.getElementById("error-message").style.display = "block";
        }

    } catch (err) {
        console.error("Login error:", err);
        document.getElementById("error-message").textContent = "An error occurred.";
        document.getElementById("error-message").style.display = "block";
    }
});
