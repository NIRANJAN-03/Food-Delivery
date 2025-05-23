//login.js
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
            // ✅ Save user info in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            // ✅ Also store email separately for quick access (used in cart.js)
            localStorage.setItem("userEmail", data.user.email);

            // Fetch order history
            const ordersRes = await fetch(`http://localhost:3000/api/users/orders?email=${email}`);
            const ordersData = await ordersRes.json();

            localStorage.setItem("orders", JSON.stringify(ordersData));

            showUserInfo(data.user, ordersData);
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

// ✅ On page load, restore user info if logged in
window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const orders = JSON.parse(localStorage.getItem("orders"));

    if (user) {
        showUserInfo(user, orders || []);
    }
});

// ✅ Show user info and handle logout
function showUserInfo(user, orders) {
    document.getElementById("login-form").style.display = "none";

    let ordersHTML = "";

    if (!orders || orders.length === 0) {
        ordersHTML = "<p>No orders found.</p>";
    } else {
        orders.forEach(order => {
            ordersHTML += `
                <div>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Total Price:</strong> ₹${order.total_price}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <button id=ord_details> View Details</button>
                </div>
            `;
        });
    }

    document.getElementById("user-profile").innerHTML = `
        <h2>Welcome, ${user.name}!</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <button onclick="toggleOrderHistory()" id="order-history-btn">Order History</button>

        <div id="order-history" style="display: none;">
            ${ordersHTML}
        </div>

        <button id="logout-btn">Logout</button>
    `;

    document.getElementById("user-profile").style.display = "block";

    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("user");
        localStorage.removeItem("orders");
        document.getElementById("login-form").style.display = "block";
        document.getElementById("user-profile").style.display = "none";
    });
}

function toggleOrderHistory() {
    const historyDiv = document.getElementById("order-history");
    const button = document.getElementById("order-history-btn");

    if (historyDiv.style.display === "none") {
        historyDiv.style.display = "block";
        button.textContent = "Hide Order History";
    } else {
        historyDiv.style.display = "none";
        button.textContent = "Order History";
    }
}

