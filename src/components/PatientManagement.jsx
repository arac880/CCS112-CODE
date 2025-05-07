import React, { useState, useEffect } from "react";

const PatientManagement = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    setPatients(stored);
  }, []);

  const updateStorage = (updated) => {
    localStorage.setItem("patients", JSON.stringify(updated));
    setPatients(updated);
  };

  const handleSubmit = () => {
    if (!firstName || !lastName) return;

    if (editId) {
      updateStorage(
        patients.map((p) =>
          p.id === editId ? { ...p, first_name: firstName, last_name: lastName } : p
        )
      );
      setEditId(null);
    } else {
      updateStorage([
        ...patients,
        { id: Date.now(), first_name: firstName, last_name: lastName },
      ]);
    }

    setFirstName("");
    setLastName("");
  };

  const handleEdit = (id) => {
    const p = patients.find((x) => x.id === id);
    setFirstName(p.first_name);
    setLastName(p.last_name);
    setEditId(id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this patient and all their records?")) {
      updateStorage(patients.filter((x) => x.id !== id));
      const records = JSON.parse(localStorage.getItem("medicalRecords")) || [];
      localStorage.setItem(
        "medicalRecords",
        JSON.stringify(records.filter((r) => r.patient_id !== id))
      );
    }
  };

  return (
    <div className="card">
      <h2>Patient Management</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
      </div>

      <table className="patient-table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>{p.first_name}</td>
              <td>{p.last_name}</td>
              <td>
                <button onClick={() => handleEdit(p.id)}>✏️</button>
                <button onClick={() => handleDelete(p.id)}>🗑️</button>
                <button onClick={() => onSelectPatient(p)}>📋</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientManagement;
