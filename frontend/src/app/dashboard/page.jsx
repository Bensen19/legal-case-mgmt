"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingCase, setEditingCase] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
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

  const handleCreateCase = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/cases",
        { title, description, lawyer_id: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCases([...cases, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating case", error);
    }
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem.id);
    setEditTitle(caseItem.title);
    setEditDescription(caseItem.description);
  };

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/cases/${editingCase}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCases(cases.map(c => (c.id === editingCase ? response.data : c)));
      setEditingCase(null);
    } catch (error) {
      console.error("Error updating case", error);
    }
  };

  const handleDeleteCase = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(cases.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting case", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name} ({user?.role})</p>
      
      <h2 className="text-xl font-semibold">Cases</h2>
      {cases.length > 0 ? (
        <ul className="bg-white p-4 shadow-lg rounded-lg">
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="border-b p-2 last:border-none">
              {editingCase === caseItem.id ? (
                <form onSubmit={handleUpdateCase}>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)} 
                    className="w-full p-2 border rounded mb-2"
                  ></textarea>
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
                </form>
              ) : (
                <>
                  <strong>{caseItem.title}</strong>: {caseItem.description}
                  <button onClick={() => handleEditCase(caseItem)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                  <button onClick={() => handleDeleteCase(caseItem.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cases found.</p>
      )}
      
      {/* Create Case Form */}
      <h2 className="text-xl font-semibold mt-6">Create a New Case</h2>
      <form onSubmit={handleCreateCase} className="mt-4 p-4 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          placeholder="Case Title"
          className="w-full p-2 border rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Case Description"
          className="w-full p-2 border rounded mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Create Case</button>
      </form>

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
