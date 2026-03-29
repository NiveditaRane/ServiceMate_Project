import React, { useState } from "react";
import toast from "react-hot-toast";

const ProviderDashboard = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: "AC Repair", location: "Mangalore", status: "pending" },
    { id: 2, title: "Plumbing Work", location: "Udupi", status: "pending" },
    { id: 3, title: "Electric Repair", location: "Bangalore", status: "pending" },
    { id: 4, title: "Washing Machine Repair", location: "Mysore", status: "pending" },
    { id: 5, title: "Fridge Service", location: "Chennai", status: "pending" },
    { id: 6, title: "Fan Installation", location: "Hyderabad", status: "pending" }
  ]);

  const handleAccept = (id) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, status: "accepted" } : job
    ));
    toast.success("Job Accepted ✅");
  };

  const handleReject = (id) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, status: "rejected" } : job
    ));
    toast.error("Job Rejected ❌");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        👨‍🔧 Provider Dashboard
      </h1>

      <hr className="border-slate-700 mb-6" />

      <h2 className="text-xl mb-4 text-gray-300">Assigned Jobs</h2>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-slate-800 p-5 rounded-xl shadow-lg mb-4 
          hover:scale-[1.02] transition transform duration-300"
        >
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-gray-400">📍 {job.location}</p>

          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${job.status === "accepted" ? "bg-green-500/20 text-green-400" :
                job.status === "rejected" ? "bg-red-500/20 text-red-400" :
                "bg-yellow-500/20 text-yellow-400"}`}>
              {job.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => handleAccept(job.id)}
              disabled={job.status === "accepted"}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg 
              hover:scale-105 transition transform duration-200 disabled:opacity-50"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(job.id)}
              disabled={job.status === "rejected"}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg 
              hover:scale-105 transition transform duration-200 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderDashboard;