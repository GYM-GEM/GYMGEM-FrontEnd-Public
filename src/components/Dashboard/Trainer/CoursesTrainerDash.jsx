import { Link } from "react-router-dom";
import testimg from "../../../assets/cardCo1.png";
import testimg2 from "../../../assets/Sports Nutrition for Weight Loss.jpg";
import testimg3 from "../../../assets/Fat Burning Cardio Workouts.jpg";
import testimg4 from "../../../assets/Muscle Building.jpg";

import { IoIosTrash } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NavBarDash from "./NavBarDash.jsx";
import FooterDash from "../FooterDash.jsx";
const initialRows = [
  {
    id: 1,
    title: "30-Day Full Body Toning Challenge",
    client: "580",
    status: "Published",
    category: "Strength Training",
    img: testimg,
  },
  {
    id: 2,
    title: "Muscle Building Basics for Beginners",
    client: "315",
    status: "Published",
    category: "Bodybuilding",
    img: testimg4,
  },
  {
    id: 3,
    title: "Fat Burning Cardio Workouts",
    client: "920",
    status: "Published",
    category: "Cardio",
    img: testimg3,
  },
  {
    id: 4,
    title: "Morning Yoga and Flexibility Flow",
    client: "155",
    status: "Draft",
    category: "Flexibility & Mobility",
    img: testimg,
  },
  {
    id: 5,
    title: "Sports Nutrition for Weight Loss",
    client: "450",
    status: "Published",
    category: "Nutrition",
    img: testimg2,
  },
];
const CoursesTrainerDash = () => {
  const [filters, setFilters] = useState({
    category: "All",
    status: "Published",
    sort: "Newest",
  });
  const [query, setQuery] = useState("");
  // stateful rows so we can edit/delete
  const [rows, setRows] = useState(initialRows);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // editing state
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // effect: reset page when filters/search changes
  useEffect(() => {
    setPage(1);
  }, [filters, query]);

  const filteredRows = useMemo(() => {
    let list = [...rows];

    const q = (query || "").trim().toLowerCase();

    if (q) {
      list = list.filter((r) => {
        return (
          (r.title || "").toLowerCase().includes(q) ||
          (String(r.client) || "").toLowerCase().includes(q) ||
          (r.category || "").toLowerCase().includes(q)
        );
      });
    }

    if (filters.category !== "All") {
      list = list.filter((r) => (r.category || "") === filters.category);
    }
    if (filters.status) {
      list = list.filter((r) => r.status === filters.status);
    }
    switch (filters.sort) {
      case "Newest":
        list.sort((a, b) => b.id - a.id);
        break;
      case "Oldest":
        list.sort((a, b) => a.id - b.id);
        break;
      case "Title (A–Z)":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [rows, filters, query]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(offset, offset + pageSize);

  // ensure page is in range when data changes
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  

  // listen for newly created courses dispatched from AddCourse page
  useEffect(() => {
    const handler = (e) => {
      const item = e?.detail;
      if (!item) return;
      setRows((rs) => [item, ...rs]);
      setPage(1);
    };
    window.addEventListener('courseCreated', handler);
    return () => window.removeEventListener('courseCreated', handler);
  }, []);

  // pick up newCourse passed via navigation state from AddCourse form
  const location = useLocation();
  useEffect(() => {
    const newCourse = location?.state?.newCourse;
    if (newCourse) {
      setRows((rs) => [newCourse, ...rs]);
      setPage(1);
      try {
        // clear history state so refresh doesn't re-add
        window.history.replaceState({}, document.title);
      } catch (e) {}
    }
  }, [location?.state]);

  return (
    <>
      <NavBarDash />
      <main className="bg-background text-foreground min-h-screen pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <section className="mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-[60%] relative">
                <input
                  type="search"
                  placeholder="Search courses, clients or category"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-12 rounded-full border border-muted bg-background/60 px-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-[#ff8211] transition"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  🔍
                </span>
              </div>

              <div className="w-full sm:w-auto">
                <Link
                  to="/addcourse"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff8211] text-white px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:scale-105 transition"
                >
                  ➕ Add New Course
                </Link>
              </div>
            </div>
          </section>

          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-muted" />
            <h2 className="font-bebas text-2xl px-4">Filter</h2>
            <span className="flex-1 h-px bg-muted" />
          </div>
          {/* <section>
            <div className="border-b border-[#808080] py-3">
              <div className="flex flex-wrap items-center gap-4 md:gap-8 md:justify-between mb-[1.75rem]">
                <label className="flex items-center gap-2 text-[15px]">
                  <span>📂 Category:</span>
                  <select className="border-l border-r border-black rounded   text-[18px] outline-none focus:border-black">
                    <option>All</option>
                    <option>Web</option>
                    <option>Mobile</option>
                    <option>Data</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-[15px]">
                  <span>📈 Status:</span>
                  <select className="border-l border-r border-black rounded text-[18px] outline-none focus:border-black">
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Archived</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-[15px]">
                  <span>📅 Sort by:</span>
                  <select className="border-l border-r border-black rounded text-[18px] outline-none focus:border-black">
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Title (A–Z)</option>
                  </select>
                </label>
              </div>
            </div>
          </section> */}
          {/* -------------------------------------------------- */}
          {/* <section>
            <div>
              <div className="mt-[1.75rem] text-[#FF8A1A] bebas-regular text-[2rem] uppercase">
                <h2>Courses List</h2>
              </div>

              <div className="w-full mt-[31px]">
                <div className="overflow-x-auto">
                  <table className="table w-full min-w-full ">
                    <thead className="border-b ">
                      <tr className="bebas-regular text-[1.375rem]">
                        <th className="text-start bebas-regular text-[1.375rem] pb-[12px]">
                          Thumbnail
                        </th>
                        <th className="text-start bebas-regular text-[1.375rem] pb-[12px]">
                          Course Title
                        </th>
                        <th className="text-start bebas-regular text-[1.375rem] pb-[12px]">
                          Client
                        </th>
                        <th className="text-start bebas-regular text-[1.375rem] pb-[12px]">
                          Status
                        </th>
                        <th className="text-center bebas-regular text-[1.375rem] pb-[12px]">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div className="avatar">
                              <div className=" h-[110px] w-[131px]  flex items-center justify-center  ">
                                <img src={testimg} alt="dd" />
                              </div>
                            </div>
                          </td>

                          <td>{row.title}</td>
                          <td>{row.client}</td>
                          <td>{row.status}</td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 me-4 btn btn-link p-0 text-blue-600 hover:text-blue-800 cursor-pointer"
                              aria-label={`Edit ${row.title}`}
                            >
                              <MdOutlineEdit />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 btn btn-link p-0 text-red-600 hover:text-red-800  cursor-pointer"
                              aria-label={`Delete ${row.title}`}
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
              </div>
              <div className="py-6 text-center text-sm font-semibold tracking-wide">
                <div className="inline-flex items-center gap-3">
                  <button
                    className="px-3 py-1 rounded border border-border bg-background/60"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    PREV
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded ${p === page ? 'underline' : ''}`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    className="px-3 py-1 rounded border border-border bg-background/60"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          </section> */}
          <section>
            <div className="border-b border-[#808080] py-3">
              <div className="flex flex-wrap items-center gap-4 md:gap-8 md:justify-between mb-[1.75rem]">
                <label className="flex items-center gap-2 text-[15px]">
                  <span>📂 Category:</span>
                  <select
                    className="border-l border-r border-black rounded   text-[18px] outline-none focus:border-black"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, category: e.target.value }))
                    }
                  >
                    <option>All</option>
                    <option>Strength Training</option>
                    <option>Bodybuilding</option>
                    <option>Cardio</option>
                    <option>Flexibility & Mobility</option>
                    <option>Nutrition</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-[15px]">
                  <span>📈 Status:</span>
                  <select
                    className="border-l border-r border-black rounded text-[18px] outline-none focus:border-black"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Archived</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-[15px]">
                  <span>📅 Sort by:</span>
                  <select
                    className="border-l border-r border-black rounded text-[18px] outline-none focus:border-black"
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, sort: e.target.value }))
                    }
                  >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Title (A–Z)</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section>
            <div>
              <div className="mt-6 text-primary font-bebas text-2xl uppercase">
                <h2>Courses List</h2>
              </div>

              <div className="w-full mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full bg-surface rounded-lg shadow-sm">
                    <thead className="bg-background/40">
                      <tr className="text-sm text-muted-foreground">
                        <th className="px-4 py-3 text-left">Thumbnail</th>
                        <th className="px-4 py-3 text-left">Course Title</th>
                        <th className="px-4 py-3 text-left">Client</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleRows.map((row) => (
                        <tr key={row.id} className="border-b last:border-b-0">
                          <td className="px-4 py-4">
                            <div className="h-28 w-36 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                              <img
                                src={row.img}
                                alt={row.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            {editingId === row.id ? (
                              <input
                                className="w-full rounded border border-border px-2 py-1 bg-background text-foreground"
                                value={editValues.title || ""}
                                onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
                              />
                            ) : (
                              row.title
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {editingId === row.id ? (
                              <input
                                className="w-24 rounded border border-border px-2 py-1 bg-background text-foreground"
                                value={editValues.client || ""}
                                onChange={(e) => setEditValues((v) => ({ ...v, client: e.target.value }))}
                              />
                            ) : (
                              row.client
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {editingId === row.id ? (
                              <select
                                className="rounded border border-border px-2 py-1 bg-background text-foreground"
                                value={editValues.status || row.status}
                                onChange={(e) => setEditValues((v) => ({ ...v, status: e.target.value }))}
                              >
                                <option>Published</option>
                                <option>Draft</option>
                                <option>Archived</option>
                              </select>
                            ) : (
                              row.status
                            )}

                          </td>

                          <td className="px-4 py-4 text-center">
                            <div className="inline-flex items-center gap-4">
                              {editingId === row.id ? (
                                <>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm text-green-600 hover:underline"
                                    onClick={async () => {
                                      // save
                                      try {
                                        const payload = { ...editValues };
                                        const res = await fetch(`/api/courses/${row.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify(payload),
                                        });
                                        if (!res.ok) {
                                          // fallback: update local state
                                          setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...payload } : r)));
                                        } else {
                                          const updated = await res.json();
                                          setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...updated } : r)));
                                        }
                                      } catch (e) {
                                        setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...editValues } : r)));
                                      }
                                      setEditingId(null);
                                      setEditValues({});
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditValues({});
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                    aria-label={`Edit ${row.title}`}
                                    onClick={() => {
                                      setEditingId(row.id);
                                      setEditValues({ title: row.title, client: row.client, status: row.status });
                                    }}
                                  >
                                    <MdOutlineEdit />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
                                    aria-label={`Delete ${row.title}`}
                                    onClick={async () => {
                                      const ok = window.confirm(`Delete course \"${row.title}\"?`);
                                      if (!ok) return;
                                      try {
                                        const res = await fetch(`/api/courses/${row.id}`, { method: 'DELETE' });
                                        if (res.ok) {
                                          setRows((rs) => rs.filter((r) => r.id !== row.id));
                                        } else {
                                          // fallback remove locally
                                          setRows((rs) => rs.filter((r) => r.id !== row.id));
                                        }
                                      } catch (e) {
                                        setRows((rs) => rs.filter((r) => r.id !== row.id));
                                      }
                                    }}
                                  >
                                    <IoIosTrash />
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="py-6 text-center text-sm font-semibold tracking-wide">
                <div className="inline-flex items-center gap-3">
                  <button
                    className="px-3 py-1 rounded border border-border bg-background/60"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    PREV
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded ${p === page ? 'underline' : ''}`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    className="px-3 py-1 rounded border border-border bg-background/60"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FooterDash />
    </>
  );
};

export default CoursesTrainerDash;
