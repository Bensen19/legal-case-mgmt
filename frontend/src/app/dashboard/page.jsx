"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchCases(token);
  }, []);

  const fetchCases = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/cases", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(response.data);
    } catch (error) {
      console.error("Error fetching cases", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name} ({user?.role})</p>
      <h2 className="text-xl font-semibold mb-2">Cases</h2>
      {cases.length > 0 ? (
        <ul className="bg-white p-4 shadow-lg rounded-lg">
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="border-b p-2 last:border-none">
              <strong>{caseItem.title}</strong>: {caseItem.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cases found.</p>
      )}

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

