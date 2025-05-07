import React, { useState, useEffect } from "react";

const MedicalRecords = ({ patient }) => {
  const [records, setRecords] = useState([]);
  const [visitDate, setVisitDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("medicalRecords")) || [];
    if (patient) {
      const filtered = all.filter((r) => r.patient_id === patient.id);
      setRecords(filtered);
    }
  }, [patient]);

  const updateStorage = (updated) => {
    const all = JSON.parse(localStorage.getItem("medicalRecords")) || [];
    const other = all.filter((r) => r.patient_id !== patient.id);
    const merged = [...other, ...updated];
    localStorage.setItem("medicalRecords", JSON.stringify(merged));
    setRecords(updated);
  };

  const handleSubmit = () => {
    if (!visitDate || !diagnosis || !prescription) return;

    if (editId) {
      updateStorage(
        records.map((r) =>
          r.id === editId
            ? { ...r, visit_date: visitDate, diagnosis, prescription }
            : r
        )
      );
      setEditId(null);
    } else {
      updateStorage([
        ...records,
        {
          id: Date.now(),
          patient_id: patient.id,
          visit_date: visitDate,
          diagnosis,
          prescription,
        },
      ]);
    }

    setVisitDate("");
    setDiagnosis("");
    setPrescription("");
  };

  const handleEdit = (r) => {
    setVisitDate(r.visit_date);
    setDiagnosis(r.diagnosis);
    setPrescription(r.prescription);
    setEditId(r.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      updateStorage(records.filter((r) => r.id !== id));
    }
  };

  if (!patient)
    return (
      <div className="card">
        <p>Select a patient to view records.</p>
      </div>
    );

  return (
    <div className="card">
      <h2>
        Medical Records for {patient.first_name} {patient.last_name}
      </h2>
      <div className="form-group">
        <input
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prescription"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
        />
        <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
      </div>

      {/* 🗂️ Table View */}
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Visit Date</th>
            <th>Diagnosis</th>
            <th>Prescription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.visit_date}</td>
              <td>{r.diagnosis}</td>
              <td>{r.prescription}</td>
              <td>
                <button onClick={() => handleEdit(r)}>✏️ Edit</button>{" "}
                <button onClick={() => handleDelete(r.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalRecords;
