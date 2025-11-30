import { useState } from "react";
import { useForm } from "react-hook-form";
import form3 from "../../assets/form3.png";
import form2 from "../../assets/form2.svg";
import { useToast } from "../../context/ToastContext";

const Traineeform = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const { showToast } = useToast();

    const onSubmit = (data) => {
        console.log("Trainee Form Data:", data);
        showToast("Trainee form submitted successfully!", { type: "success" });
    };


    const [selectedCountry, setSelectedCountry] = useState("");

    const countries = {
        Egypt: ["Cairo", "Giza", "Alexandria", "Mansoura", "Aswan", "Luxor", "Tanta"],
        SaudiArabia: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina", "Khobar"],
        UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah"],
        USA: [
            "California",
            "Texas",
            "Florida",
            "New York",
            "Illinois",
            "Washington",
            "Ohio",
        ],
        Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
        UK: ["England", "Scotland", "Wales", "Northern Ireland"],
        France: ["Île-de-France", "Provence-Alpes-Côte d’Azur", "Normandy", "Brittany"],
        Germany: ["Bavaria", "Berlin", "Hamburg", "Hesse", "Saxony"],
        Italy: ["Lombardy", "Rome", "Sicily", "Veneto", "Tuscany"],
        Spain: ["Madrid", "Barcelona", "Valencia", "Andalusia", "Galicia"],
        India: ["Delhi", "Mumbai", "Karnataka", "Tamil Nadu", "Gujarat"],
        China: ["Beijing", "Shanghai", "Guangdong", "Zhejiang", "Sichuan"],
        Japan: ["Tokyo", "Osaka", "Hokkaido", "Kyoto", "Fukuoka"],
        Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
        Brazil: ["São Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais"],
        Mexico: ["Mexico City", "Jalisco", "Nuevo León", "Yucatán"],
        SouthAfrica: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Limpopo"],
        Nigeria: ["Lagos", "Abuja", "Kano", "Rivers", "Ogun"],
        Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
        Indonesia: ["Jakarta", "Bali", "Surabaya", "Bandung", "Medan"],
        Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Kazan"],
        Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"],
        SouthKorea: ["Seoul", "Busan", "Incheon", "Daegu"],
        Pakistan: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
    };


    return (
        <>
            <section
                className="w-full h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center relative"
                style={{ backgroundImage: `url(${form3})` }}
            >
                <div
                    className="relative w-[45rem] h-full bg-no-repeat bg-center bg-cover rounded-lg shadow-lg p-8 flex flex-col justify-center ms-15"
                    style={{ backgroundImage: `url(${form2})` }}
                >
                    <div className="w-[100%] flex flex-col justify-center items-center">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="relative z-10 flex flex-col gap-4 w-[50%]"
                        >

                            <h2 className="bebas-bold text-[2.5rem] text-[#FF8211] text-center">
                                Trainee Form
                            </h2>

                            {/* ================= Name ================= */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    placeholder="Enter your name"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters",
                                        },
                                    })}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* ================= Age ================= */}
                            {/* <div>
                <label
                  htmlFor="age"
                  className="font-bebas text-md  font-medium text-black poppins-medium"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Minimum age is 18" },
                    max: { value: 70, message: "Maximum age is 70" },
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div> */}

                            {/* ================= Gender ================= */}
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    {...register("gender", {
                                        required: "Please select your gender",
                                    })}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>

                            {/* ================= Date of Birth ================= */}
                            <div>
                                <label
                                    htmlFor="dob"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    Date of Birth
                                </label>
                                <input
                                    id="dob"
                                    type="date"
                                    {...register("dob", {
                                        required: "Date of birth is required",
                                    })}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.dob && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.dob.message}
                                    </p>
                                )}
                            </div>

                            {/* ================= Country ================= */}
                            <div>
                                <label
                                    htmlFor="country"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    Country
                                </label>
                                <select
                                    id="country"
                                    {...register("country", { required: "Country is required" })}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    

                                    {Object.keys(countries).map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>

                                {errors.country && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.country.message}
                                    </p>
                                )}
                            </div>
                            {/* ================= State ================= */}
                            <div>
                                <label
                                    htmlFor="state"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    State
                                </label>
                                <select
                                    id="state"
                                    {...register("state", { required: "State is required" })}
                                    disabled={!selectedCountry}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">
                                        {selectedCountry
                                            ? "Select your state"
                                            : "Select a country first"}
                                    </option>
                                    {selectedCountry &&
                                        countries[selectedCountry].map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                </select>
                                {errors.state && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.state.message}
                                    </p>
                                )}
                            </div>

                            {/* ================= ZIP Code ================= */}
                            <div>
                                <label
                                    htmlFor="zip"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    ZIP Code
                                </label>
                                <input
                                    id="zip"
                                    placeholder="Enter your ZIP code"
                                    {...register("zip", {
                                        required: "ZIP code is required",
                                        pattern: {
                                            value: /^[0-9]{4,6}$/,
                                            message: "Invalid ZIP code format",
                                        },
                                    })}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.zip && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.zip.message}
                                    </p>
                                )}
                            </div>

                            {/* ================= Phone ================= */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="font-bebas text-md font-medium text-black poppins-medium"
                                >
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10,15}$/,
                                            message: "Phone must be 10–15 digits",
                                        },
                                    })}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>

                            {/* ================= Submit ================= */}
                            <button
                                type="submit"
                                className="w-full py-2 rounded-[0.5rem] bg-[#FF8211] text-white font-bebas text-[22px]  transition hover:bg-[#e9750f]"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Traineeform;
