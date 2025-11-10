import { Link, NavLink } from "react-router-dom";
import testimg from "../../assets/cardCo1.png";
import { IoIosTrash } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";

import NavBarDash from "./NavBarDash";
import FooterDash from "./FooterDash.jsx";
const rows = [
  { id: 1, title: "Python Basics", client: "122", status: "Published" },
  { id: 2, title: "Python Basics", client: "122", status: "Draft" },
  { id: 3, title: "Python Basics", client: "122", status: "Published" },
];
const CoursesTrainerDash = () => {
  return (
    <>
      <NavBarDash />
      <main className="w-full bg-white mt-[5.6875rem]">
        <div className="mx-auto w-[60%] ">
          <section>
            <div className="flex items-start justify-between">
              <div className="w-[438px] h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full h-full rounded-full border border-black pl-10 pr-4 outline-none focus:border-[#FF8A1A] focus:border-2   transition-colors"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                  🔍
                </span>
              </div>
              <div className="h-[40px]">
                <Link
                  to="/addcourse"
                  className="inline-flex items-center w-full gap-1 rounded-full bg-[#FF8A1A]  text-[1.375rem] bebas-regular px-4 py-2 text-white hover:bg-[#e6760f] transition-colors"
                >
                  ➕ Add New Course
                </Link>
              </div>
            </div>
          </section>

          <div className="flex items-center mt-[6.125rem] mb-[1rem] gap-4">
            <span className="flex-1 border-t-2 border-black" />
            <div>
              <h2 className="text-[2.625rem] bebas-regular ">Filter</h2>
            </div>
            <span className="flex-1 border-t-2 border-black" />
          </div>
          <section>
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
          </section>
          {/* -------------------------------------------------- */}
          <section>
            <div>
              <div className="mt-[1.75rem] text-[#FF8A1A] bebas-regular text-[2rem] uppercase">
                <h2>Courses List</h2>
              </div>
              {/* <div className="mt-[3rem] overflow-x-auto">
                <table className="w-full border border-black border-collapse text-left">
                  <thead className="bg-white">
                    <tr className="text-[1.5rem] poppins-bold">
                      <th className="pl-[37px]  border-b border-black w-[18%] uppercase tracking-wide">
                        Thumbnail
                      </th>
                      <th className="pr-3 px-4 border-b border-black w-[44%] uppercase tracking-wide">
                        Course Title
                      </th>
                      <th className="py-3 px-4 border-b border-black w-[14%] uppercase tracking-wide">
                        Client
                      </th>
                      <th className="py-3 px-4 border-b border-black w-[10%] uppercase tracking-wide">
                        Status
                      </th>
                      <th className="py-3 px-4 border-b border-black w-[18%] uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="align-middle">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="text-[15px]">
                        <td className="py-5 px-4 border-b border-black">
                          <div className="h-[70px] w-[90px] bg-gray-200  place-items-center ">
                            <img src="" alt="" />
                          </div>
                        </td>
                        <td className="py-5 px-4 border-b border-black">
                          Python Basics
                        </td>
                        <td className="py-5 px-4 border-b border-black">122</td>
                        <td className="py-5 px-4 border-b border-black">
                          Published
                        </td>
                        <td className="py-5 px-4 border-b border-black">
                          <div className="flex items-center gap-3">
                            <button className="text-[#FF8A1A]">✏️ Edit</button>
                            <button className="text-indigo-600">
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
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
              {/* الصفحات */}
              <div className="py-6 text-center text-sm font-semibold tracking-wide">
                &laquo;&laquo; PREV | <span className="underline">1</span> | 2 |
                3 | NEXT &raquo;&raquo;
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
