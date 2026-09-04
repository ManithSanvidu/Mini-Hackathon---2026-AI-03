import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

/**
 * StatusUpdateButton
 *
 * Props:
 *  - faultId      {string}   MongoDB _id of the fault record
 *  - currentStatus {string}  Current status value ("Pending" | "In-Progress" | "Repaired")
 *  - onUpdated    {function} Called with the updated fault object after a successful PATCH
 */

const STATUSES = ["Pending", "In-Progress", "Repaired"];



const STATUS_STYLES = {
  Pending: {
    badge: "bg-amber-100 text-amber-700 border-amber-300",
    option: "hover:bg-amber-50 text-amber-700",
  },
  "In-Progress": {
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    option: "hover:bg-blue-50 text-blue-700",
  },
  Repaired: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
    option: "hover:bg-emerald-50 text-emerald-700",
  },
};

export default function StatusUpdateButton({ faultId, currentStatus, onUpdated }) {
  const [selected, setSelected] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSelected(currentStatus);
  }, [currentStatus]);


  const handleSelect = async (newStatus) => {
    setOpen(false);

    // No-op if same status chosen
    if (newStatus === selected) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data } = await api.patch(
        `/api/faults/${faultId}`,
        { status: newStatus }
      );

      setSelected(newStatus);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);

      // Notify parent (Officer Dashboard) with the updated fault object
      if (onUpdated) onUpdated(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to update status. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const badgeClass = STATUS_STYLES[selected]?.badge ?? "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="relative inline-block text-sm font-medium">
      {/* Trigger button */}
      <button
        id={`status-btn-${faultId}`}
        disabled={loading}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
          ${badgeClass}
          ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-sm active:scale-95"}
        `}
        aria-label="Update fault status"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : success ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : null}
        <span>{selected}</span>
        {!loading && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-label="Select status"
          className="absolute z-50 mt-1 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
          {STATUSES.map((status) => (
            <li
              key={status}
              role="option"
              aria-selected={status === selected}
              onClick={() => handleSelect(status)}
              className={`px-4 py-2 cursor-pointer transition-colors duration-150
                ${STATUS_STYLES[status]?.option ?? "hover:bg-gray-50"}
                ${status === selected ? "font-semibold" : "font-normal"}
              `}
            >
              {status}
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="absolute left-0 top-full mt-2 flex items-start gap-1.5 w-64 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 shadow-sm z-50"
        >
          <AlertCircle className="mt-0.5 w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
