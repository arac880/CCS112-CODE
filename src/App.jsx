import React, { useState } from "react";
import PatientManagement from "./components/PatientManagement";
import MedicalRecords from "./components/MedicalRecords";
import "./App.css";

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="container">
      <h1>🩺 Mapatay Medical Clinic</h1>
      <p className="subtitle">Patient Records Management System</p>
      <div className="grid">
        <PatientManagement onSelectPatient={setSelectedPatient} />
        <MedicalRecords patient={selectedPatient} />
      </div>
    </div>
  );
}

export default App;
