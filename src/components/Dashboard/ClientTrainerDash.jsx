import NavBarDash from "./NavBarDash";
import FooterDash from "./FooterDash";
import { Link, NavLink } from "react-router-dom";
import testimg from "../../assets/cardCo1.png";
import { IoIosTrash } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { GrFormView } from "react-icons/gr";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Eye,
  X,
  Mail,
  Phone,
  BookOpenCheck,
  Star,
  MessageSquareText,
  Trophy,
} from "lucide-react";

const rows = [
  {
    id: 1,
    name: "Ali Kamal",
    email: "alikk@gmail.com",
    phone: "01001234567",
    enrolled: 5,
    status: "Active",
    avatar: testimg,
    progress: 80,
    reviewsGiven: 5,
    feedback: "Great explanations!",
  },
  {
    id: 2,
    name: "Mahmoud Gado",
    email: "Mahmoud@gmail.com",
    phone: "01015580843",
    enrolled: 5,
    status: "Active",
    avatar: testimg,
    progress: 80,
    reviewsGiven: 5,
    feedback: "Great explanations!",
  },
  {
    id: 3,
    name: "Ali Kamal",
    email: "alikk@gmail.com",
    phone: "01001234567",
    enrolled: 5,
    status: "Active",
    avatar: testimg,
    progress: 80,
    reviewsGiven: 5,
    feedback: "Great explanations!",
  },
];
// POP-UP CLIENT DETAILS DATA

// --------------------------------------------
const ClientTrainerDash = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearching && inputRef.current) inputRef.current.focus();
  }, [isSearching]);

  // POP-UP CLIENT DETAILS DATA-----------------
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const onView = (client) => {
    setSelected(client);
    setOpen(true);
  };

  // filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  // compute filtered rows based on query (case-insensitive)
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    let result = rows.slice();

    // search by name/email/phone
    if (q) {
      result = result.filter((r) => {
        return (
          (r.name ?? "").toLowerCase().includes(q) ||
          (r.email ?? "").toLowerCase().includes(q) ||
          (r.phone ?? "").toLowerCase().includes(q)
        );
      });
    }

    // category filter: enrolled vs not enrolled
    if (categoryFilter === "enrolled") {
      result = result.filter((r) => Number(r.enrolled) > 0);
    } else if (categoryFilter === "not-enrolled") {
      result = result.filter((r) => Number(r.enrolled) === 0);
    }

    // status filter
    if (statusFilter === "active") {
      result = result.filter((r) => (r.status ?? "").toLowerCase() === "active");
    } else if (statusFilter === "inactive") {
      result = result.filter((r) => (r.status ?? "").toLowerCase() !== "active");
    }

    // sorting
    if (sortBy === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "enrolled-desc") {
      result.sort((a, b) => Number(b.enrolled) - Number(a.enrolled));
    } else if (sortBy === "enrolled-asc") {
      result.sort((a, b) => Number(a.enrolled) - Number(b.enrolled));
    }

    return result;
  }, [query, categoryFilter, statusFilter, sortBy]);
  // --------------------------------------------

  return (
    <>
      <NavBarDash />
      <main className="w-full bg-white  flex flex-col items-center justify-center">
        <section className="w-full block">
          <div className="mx-auto w-[60%]">
            <div className="flex items-center ">
              <span className="flex-1 border-t-2 border-black" />
              <div className="flex ">
                <h2 className="text-[3rem] bebas-regular ">OVERVIEW </h2>
              </div>
              <span className="flex-1 border-t-2 border-black" />
            </div>

            <div className="flex  justify-between mt-[1.5rem] ">
              <div className="">
                <h3 className="text-[18px] poppins-semibold">
                  👨‍🎓 Total Clients: 120
                </h3>
              </div>
              <div className="">
                <h3 className="text-[18px] poppins-semibold">
                  🔥 Active Clients: 85
                </h3>
              </div>
              <div>
                <h3 className="text-[18px] poppins-semibold">
                  💤 Inactive: 35
                </h3>
              </div>
            </div>
          </div>
        </section>
        {/* -------------------------------------------------------- */}
        <section className="w-full ">
          <div className="mx-auto w-[80%] mt-[3rem]">
            <div>
              <div className="mt-[1.75rem] text-[#FF8A1A] bebas-regular text-[2rem] uppercase">
                <h2>Client List</h2>
              </div>
              {/* --------------------------------------------------- */}

              <div className="border-b border-t border-[#808080] mt-[1rem]">
                <div className="flex flex-wrap items-center gap-4 md:gap-8 md:justify-between mb-[1.75rem] mt-4">
                  <div className="inline-block">
                    {isSearching ? (
                      <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => setIsSearching(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setIsSearching(false);
                          if (e.key === "Enter") {
                            setIsSearching(false);
                          }
                        }}
                        placeholder="Search..."
                        className="text-[15px] px-3 py-2 rounded-full border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#FF8211]"
                        aria-label="Search"
                      />
                    ) : (
                      <label
                        role="button"
                        tabIndex={0}
                        className="flex items-center gap-2 text-[15px] cursor-pointer select-none"
                        onClick={() => setIsSearching(true)}
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          setIsSearching(true)
                        }
                      >
                        <IoMdSearch size={25} />
                        <span>Search</span>
                      </label>
                    )}
                  </div>
                  {/* --------------------------------------------- */}
                  <label className="flex items-center gap-2 text-[15px]">
                    <span>📂 Category:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="border-l border-r border-black rounded   text-[18px] outline-none focus:border-black"
                    >
                      <option value="all">All</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="not-enrolled">Not enrolled</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 text-[15px]">
                    <span>📈 Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-l border-r border-black rounded text-[18px] outline-none focus:border-black"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 text-[15px]">
                    <span>📅 Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border-l border-r border-black rounded text-[18px] outline-none focus:border-black"
                    >
                      <option value="name-asc">Name (A–Z)</option>
                      <option value="name-desc">Name (Z–A)</option>
                      <option value="enrolled-desc">Enrolled (High → Low)</option>
                      <option value="enrolled-asc">Enrolled (Low → High)</option>
                    </select>
                  </label>
                </div>
              </div>
              {/* ------------------------------------------------------ */}
              <div className="w-full mt-[31px]">
                <div className="overflow-x-auto">
                  <table className="table w-full min-w-full border border-black border-collapse ">
                    <thead className="border-b  hover:shadow-lg bg-white h-[50px] items-center">
                      <tr className="bebas-bold text-[1.5rem]">
                        <th className="text-center bebas-bold text-[1.5rem] pb-[12px] pt-[9px]">
                          👤 Client Name
                        </th>
                        <th className="text-center bebas-bold text-[1.5rem] pb-[12px] pt-[9px]">
                          📧 Email
                        </th>
                        <th className="text-center bebas-bold text-[1.5rem] pb-[12px] pt-[9px]">
                          📱 Phone
                        </th>
                        <th className="text-center bebas-bold text-[1.5rem] pb-[12px] pt-[9px]">
                          Enrolled Courses
                        </th>
                        <th className="text-center bebas-bold text-[1.5rem] pb-[12px] pt-[9px]">
                          ⏳ Status
                        </th>
                        <th className="text-center bebas-bold text-[1.5rem] pb-[12px] pt-[9px]">
                          ⚙️ Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.map((row) => (
                        <tr
                          key={row.id}
                          className="poppins-regular text-[1.25rem] text-center border-b hover:bg-gray-100 last:border-0 hover:shadow-lg h-[100px]"
                        >
                          <td className=" items-center">{row.name}</td>

                          <td>{row.email}</td>

                          <td>{row.phone}</td>

                          <td className="text-center  ">{row.enrolled}</td>

                          <td className="text-center">{row.status}</td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 me-4 btn btn-link p-0 text-green-600 hover:text-green-800 cursor-pointer"
                              aria-label={`View ${row.name}`}
                              onClick={() => onView(row)}
                            >
                              <GrFormView />
                              View
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 btn btn-link p-0 text-red-600 hover:text-red-800 cursor-pointer"
                              aria-label={`Delete ${row.name}`}
                            >
                              <IoIosTrash />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <DetailsModal
                  open={open}
                  onClose={() => setOpen(false)}
                  row={selected}
                />
              </div>
              <div className="py-6 text-center text-sm font-semibold tracking-wide">
                &laquo;&laquo; PREV | <span className="underline">1</span> | 2 |
                3 | NEXT &raquo;&raquo;
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterDash />
    </>
  );
};

function DetailsModal({ open, onClose, row }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !row) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl  bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Client Details</h2>
          <button
            className=" p-1 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3 text-base">
          <KV
            icon={<span className="text-xl">👤</span>}
            k="Name"
            v={row.name}
          />
          <KV icon={<Mail className="h-5 w-5" />} k="Email" v={row.email} />
          <KV icon={<Phone className="h-5 w-5" />} k="Phone" v={row.phone} />
          <KV
            icon={<BookOpenCheck className="h-5 w-5" />}
            k="Enrolled"
            v={`${row.enrolled} course(s)`}
          />
          <KV
            icon={<Trophy className="h-5 w-5" />}
            k="Progress"
            v={(row.progress ?? 0) + "%"}
          />
          <KV
            icon={<Star className="h-5 w-5" />}
            k="Reviews Given"
            v={String(row.reviewsGiven ?? 0)}
          />
          <KV
            icon={<MessageSquareText className="h-5 w-5" />}
            k="Feedback"
            v={row.feedback ?? "—"}
          />
          <KV k="Status" v={row.status} />
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full  bg-orange-400 text-white py-2.5 font-medium hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function KV({ icon, k, v }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-0.5 text-gray-700">{icon}</div>}
      <div className="flex-1">
        <div className="text-sm text-gray-500">{k}</div>
        <div className="text-gray-900 font-medium">{v}</div>
      </div>
    </div>
  );
}

export default ClientTrainerDash;
