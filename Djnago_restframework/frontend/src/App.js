import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:8000/api";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" });
  const [userId, setUserId] = useState("");
  const [singleUser, setSingleUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/get-users`);
    const data = await res.json();
    setUsers(data);
  };

  const createUser = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API_BASE}/create-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.status === 201) {
      setUsers(data);
      setForm({ firstname: "", lastname: "", email: "" });
      setMessage("✅ User created successfully!");
    } else {
  // Handle validation errors (e.g. { email: ["Already exists"] })
  let errMsg = "Unknown error";

  if (data.detail?.message) {
    errMsg = data.detail.message;
  } else if (typeof data === "object") {
    // Extract first error message from the object
    const allErrors = Object.values(data).flat();
    errMsg = allErrors.join(", ");
  }

  setMessage(`❌ ${errMsg}`);
}
};

  const fetchUserById = async () => {
    setMessage("");
    setSingleUser(null);
    if (!userId) {
      setMessage("Please enter a user ID");
      return;
    }

    const res = await fetch(`${API_BASE}/get-users/${userId}`);
    const data = await res.json();

    if (res.status === 200) {
      setSingleUser(data);
    } else {
      setMessage(`❌ ${data.detail?.message || "User not found"}`);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const res = await fetch(`${API_BASE}/delete-user/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.status === 200) {
      setMessage(`🗑️ ${data.detail.message}`);
      fetchUsers();
      if (singleUser && singleUser.id === id) setSingleUser(null);
    } else {
      setMessage(`❌ ${data.detail?.message || "Error deleting user"}`);
    }
  };

  return (
    <div className="container">
      <h1>User Manager</h1>
      {message && <div className="message">{message}</div>}

      <section className="form-section">
        <h2>Create User</h2>
        <form onSubmit={createUser}>
          <input
            placeholder="First Name"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            required
          />
          <input
            placeholder="Last Name"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <button type="submit">Add User</button>
        </form>
      </section>

      <section className="form-section">
        <h2>Get User by ID</h2>
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button onClick={fetchUserById}>Fetch</button>

        {singleUser && (
          <div className="user-card">
            <h3>User #{singleUser.id}</h3>
            <p>
              <strong>Name:</strong> {singleUser.firstname}{" "}
              {singleUser.lastname}
            </p>
            <p>
              <strong>Email:</strong> {singleUser.email}
            </p>
          </div>
        )}
      </section>

      <section className="list-section">
        <h2>All Users</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id}>
              <span>
                {user.firstname} {user.lastname} ({user.email})
              </span>
              <button onClick={() => deleteUser(user.id)}>❌ Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
