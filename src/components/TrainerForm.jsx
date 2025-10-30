import form3 from '../assets/form3.png'
import form2 from '../assets/form2.svg'
import useFormHandler from "./useFormHandler";



const Trainerform = () => {
    const {
        formData,
        errors,
        handleChange,
        handleSubmit,
        showPassword,
        setShowPassword,
        showConfirm,
        setShowConfirm,
    } = useFormHandler();
    return (<>

        <section
            className="w-full h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center relative"
            style={{ backgroundImage: `url(${form3})` }}
        >
            <div
                className="relative w-[45rem] h-full bg-no-repeat bg-center bg-cover rounded-lg shadow-lg p-8 flex flex-col justify-center ms-15"
                style={{ backgroundImage: `url(${form2})` }}
            >


                <div className='w-[100%] flex flex-col justify-center items-center'>

                    <form className="relative z-10 flex flex-col gap-4 w-[50%]">

                        <h2 className="text-2xl font-bold text-white text-center">Trainer Form</h2>


                        <div className="flex flex-col gap-4">
                            
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                          
                            <div>
                                <label
                                    htmlFor="age"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    Age
                                </label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="Enter your age"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.age && (
                                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                                )}
                            </div>

                            
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                                )}
                            </div>

                            
                            <div>
                                <label
                                    htmlFor="dob"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    Date of Birth
                                </label>
                                <input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.dob && (
                                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                                )}
                            </div>

                            
                            <div>
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    Country
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    type="text"
                                    placeholder="Enter your country"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="zip"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    ZIP Code
                                </label>
                                <input
                                    id="zip"
                                    name="zip"
                                    type="text"
                                    placeholder="Enter your ZIP code"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.zip && (
                                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                                )}
                            </div>

                         
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-black poppins-medium"
                                >
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    onChange={handleChange}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-[#FF8211] text-white py-2 rounded transition hover:bg-[#e9750f]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </section>






    </>);
}

export default Trainerform;