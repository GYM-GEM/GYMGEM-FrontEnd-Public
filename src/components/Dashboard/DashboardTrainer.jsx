import NavBarDash from "./NavBarDash.jsx";
import FooterDash from "./FooterDash.jsx";
const DashboardTrainer = () => {
  return (
    <>
      <NavBarDash />

      <main className="bg-white  w-full">
        <div className="w-[80%] mx-auto flex ">
          {/* ------------------------------------- */}
          <div className="w-[75%] float-start  ">
            <section className="flex flex-col items-center mt-[2rem] pr-[3.18rem]  ">
              <div className="w-full ">
                <div className="w-full">
                  <h1 className="text-[2.625rem] bebas-regular text-center ">
                    Stats Cards
                  </h1>
                </div>
                <div className="w-full flex justify-between items-center mt-[1rem] ">
                  <div className="w-[30%] h-[207px] border-1 hover:shadow-lg p-[2.5rem]  rounded-lg text-center">
                    <div>
                      <h3 className="text-[1.5rem] bebas-regular text-[#FF8211]">
                        👨‍🎓 Total Subs
                      </h3>
                    </div>
                    <div className="pt-[1.75rem]">
                      <h3 className="text-[2.625rem] bebas-regular">250</h3>
                    </div>
                  </div>
                  <div className="w-[30%] h-[207px] border-1 hover:shadow-lg p-[2.5rem]  rounded-lg text-center">
                    <div>
                      <h3 className="text-[1.5rem] bebas-regular text-[#FF8211]">
                        👨‍🎓 Total Subs
                      </h3>
                    </div>
                    <div className="pt-[1.75rem]">
                      <h3 className="text-[2.625rem] bebas-regular">250</h3>
                    </div>
                  </div>
                  <div className="w-[30%] h-[207px] border-1 hover:shadow-lg p-[2.5rem]  rounded-lg text-center">
                    <div>
                      <h3 className="text-[1.5rem] bebas-regular text-[#FF8211]">
                        👨‍🎓 Total Subs
                      </h3>
                    </div>
                    <div className="pt-[1.75rem]">
                      <h3 className="text-[2.625rem] bebas-regular">250</h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* ------------------------------------- */}
            <section className="flex flex-col items-center pr-[3.18rem]">
              <div className="w-full ">
                {/* --------------------الخط ----------------- */}
                <div className="flex items-center ">
                  <span className="flex-1 border-t-2 border-black" />
                  <div>
                    <h2 className="text-[2.625rem] bebas-regular ">
                      TOP COURSES
                    </h2>
                  </div>
                  <span className="flex-1 border-t-2 border-black" />
                </div>
                {/* --------------------الخط ----------------- */}

                <div className="w-full mt-[1.5rem] mb-[3rem] ">
                  <table className="mx-auto w-[503px] h-[207px] border border-black border-collapse text-center">
                    <thead>
                      <tr>
                        <th className=" bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          COURSES TITLE
                        </th>
                        <th className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          CLIENT
                        </th>
                        <th className="bebas-regular text-[1.375rem]">
                          REVENUE
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          BOX
                        </td>
                        <td className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          24
                        </td>
                        <td className="bebas-regular text-[1.375rem]">$24</td>
                      </tr>
                      <tr>
                        <td className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          BOX
                        </td>
                        <td className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          24
                        </td>
                        <td className="bebas-regular text-[1.375rem]">$24</td>
                      </tr>
                      <tr>
                        <td className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          BOX
                        </td>
                        <td className="bebas-regular text-[1.375rem] border-r border-black last:border-r-0">
                          24
                        </td>
                        <td className="bebas-regular text-[1.375rem]">$24</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            {/* ------------------------------------- */}
            <section className="flex flex-col items-center pr-[3.18rem]">
              <div className="w-full ">
                <div className="flex items-center ">
                  <span className="flex-1 border-t-2 border-black" />
                  <div className="">
                    <h2 className="text-[2.625rem] bebas-regular ">
                      Recent Courses
                    </h2>
                  </div>
                  <span className="flex-1 border-t-2 border-black " />
                </div>
                <div className="w-full mt-[3rem] mb-[3rem] ">
                  <div className=" mb-[2rem] ">
                    <h2 className="text-[1.375rem] bebas-bold ">
                      📚 Recently Added
                    </h2>
                  </div>
                  <div>
                    <ul className="list-disc list-inside *:mb-[1rem] *:text-[1.375rem] *:bebas-regular">
                      <li>Intro to HTML (Published)</li>
                      <li>JavaScript Crash Course (Draft)</li>
                      <li>Django Advanced (Published)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* ------------------------------------- */}
          <div className="w-[25%] float-end border-l-3  h-h-[full] ">
            <aside className="pt-[7.0625rem] pl-[1.375rem] ">
              <div className="relative max-w-md">
                <div
                  className="
      relative p-[3.125rem] pt-[4.25rem]
      border-r-3 border-b-3 border-black
      before:content-[''] before:absolute before:top-0 before:left-[3rem] before:right-0
      before:h-[3px] before:bg-black
      after:content-[''] after:absolute after:left-0 after:top-[0.3rem] after:bottom-0
      after:w-[3px] after:bg-black
    "
                >
                  <div className="">
                    <div className="mb-[6px]">
                      <p className="text-[1.75rem] bebas-regular">
                        NAME: ALI KAMAL
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[1.75rem] bebas-regular">
                        TOTAL COURSES: 8
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="absolute -top-5 left-[0.5rem] px-1 bg-white text-[#FF8211] bebas-regular text-[1.75rem]">
                    PROFILE
                  </span>
                </div>
              </div>
              {/* ------------------------------------- */}

              <div className="relative max-w-3xl ">
                <div
                  className="
      relative p-10 pt-16  mt-[6.8125rem]
    border-r-3 border-b-3 border-black
      before:content-[''] before:absolute before:top-0 before:left-[2rem] before:right-0
      before:h-[3px] before:bg-black
      after:content-[''] after:absolute after:left-0 after:top-[0.4rem] after:bottom-0
      after:w-[3px] after:bg-black
    "
                >
                  <div className="">
                    <div>
                      <a
                        href="#"
                        className="text-[1.75rem] bebas-regular block"
                      >
                        📚 VIEW MY COURSES
                      </a>
                    </div>

                    <div className="text-[1.75rem] bebas-regular">
                      <a
                        href="#"
                        className="text-[1.75rem] bebas-regular block"
                      >
                        🧾 TRANSACTIONS
                      </a>
                    </div>
                  </div>

                  <span className="absolute -top-5 left-2 px-1 bg-white text-[#FF8211] bebas-regular text-[1.75rem] ">
                    QUICK PANEL
                  </span>
                </div>
              </div>
            </aside>
          </div>
          {/* ------------------------------------- */}
        </div>
      </main>
      <FooterDash />
    </>
  );
};

export default DashboardTrainer;
