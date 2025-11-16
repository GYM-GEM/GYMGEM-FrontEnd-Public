import NavTraineDash from "./NavTraineDash";
import FooterDash from "./../FooterDash";
const CoursesTraineDash = () => {
  return (
    <>
      <NavTraineDash />
      <main>
        <div className="bg-background text-foreground min-h-screen">
          <div className="w-[80%] mx-auto px-4 py-12">
            <div className="mb-8">
              <h1 className="font-bebas text-4xl text-center text-[#ff8211]">
                Your Enrolled Courses
              </h1>
              <p className="mt-2 text-center text-muted-foreground">
                Browse and manage the courses you are enrolled in.
              </p>
            </div>
          </div>
        </div>
      </main>
      <FooterDash />
    </>
  );
};

export default CoursesTraineDash;
