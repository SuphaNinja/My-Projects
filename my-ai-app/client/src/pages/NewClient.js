import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useEffect, useState } from "react";
import axios from "axios"




export default function NewClient() {

    const [formData, setFormData] = useState({
        age: 15,
        gender: "Male",
        currentWeight:"",
        weightGoal: "",
        goalDuration: "",
        description: "",
        currentlyTraining: "",
        maxTraining: ""
    });

    const infoString = `
    Age: ${formData.age}, Gender: ${formData.gender}, Current Weight: ${formData.currentWeight}kg, 
    WeightGoal: ${formData.weightGoal}kg, Time to complete goal: ${formData.goalDuration}, Currently training: ${formData.currentlyTraining}, 
    Maximum days a week to train: ${formData.maxTraining}, Description of the goal im trying to achieve: ${formData.description}`;

    const generateAiAnswer = useMutation({
        mutationFn: (infoString) => axiosInstance.post("/test", { prompt: infoString })
    });


    const createGuide = useMutation({
        mutationFn: () => axiosInstance.post("/create-new-guide", JSON.parse(generateAiAnswer.data.data.success[0].message.content))
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        generateAiAnswer.mutate(infoString); 
    };

   /*  useEffect(() => {
        if (generateAiAnswer.isSuccess && generateAiAnswer?.data?.data?.success[0]?.message?.content) {
            try {
                const parsedData = JSON.parse(generateAiAnswer.data.data.success[0].message.content);
                console.log('Parsed Data:', parsedData); // Debugging: Log parsed data to check format
                createGuide.mutate(parsedData);
            } catch (error) {
                console.error('Error parsing AI response JSON:', error);
            }
        }
    }, [generateAiAnswer.isSuccess]); */
    
    

    return (
        <div className="flex items-center md:mx-60 jusitfy-center">
            <div className="bg-slate-500 flex md:mt-0 mt-16 flex-col w-full h-full">
                <button onClick={createGuide.mutate}>testcreate</button>
                <button onClick={() => console.log(infoString)}>console.log formadata</button>
                <button onClick={() => console.log(JSON.parse(generateAiAnswer.data.data.success[0].message.content))}>parse</button>
                <button onClick={() => console.log(generateAiAnswer)}>consolelog whole response</button>
                <button onClick={() => console.log(generateAiAnswer.data.data.success[0].message.content)}>console log message.content</button>
                <form onSubmit={handleSubmit} className="text-white p-6 grid grid-cols-4 gap-2">
                    <h1 className="text-center col-span-4 md:text-2xl fontsemibold text-xl">Reach Your goals!</h1>
                    <div className="col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Currently training</label>
                        <select
                            name="currentlyTraining"
                            value={formData.currentlyTraining}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="0_days_a_week">0 days a week</option>
                            <option value="1-3_days_a_week">1-3 days a week</option>
                            <option value="3-5_days_a_week">3-5 days a week</option>
                            <option value="more_than_5_days_a_week">More than 5 days a week</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Maximum training days per week</label>
                        <select
                            name="maxTraining"
                            value={formData.maxTraining}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="1-3_days_a_week">1-3 days a week</option>
                            <option value="3-5_days_a_week">3-5 days a week</option>
                            <option value="more_than_5_days_a_week">More than 5 days a week</option>
                        </select>
                    </div>
                    <div className="col-span-1 ">
                        <label htmlFor="age" className="block text-sm font-medium text-white mb-2">Age</label>
                        <input
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            min="15"
                            max="80"
                            className="md:w-1/2 p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label htmlFor="gender" className="block text-sm font-medium text-white mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="md:w-2/3 bg-slate-800 p-2 border-2 border-gray-300 rounded-lg"
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="col-span-2 ">
                        <label htmlFor="goal" className="block text-white">Goal Duration</label>
                        <select
                            name="goalDuration"
                            value={formData.goalDuration}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                        >
                            <option value="">Select Duration</option>
                            <option value="less_than_a_month">Less than a month</option>
                            <option value="1-3_months">1-3 months</option>
                            <option value="3-6_months">3-6 months</option>
                            <option value="6_months_to_1_year">6 months - 1 year</option>
                            <option value="more_than_a_year">More than a year</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Current Weight</label>
                        <select
                            name="currentWeight"
                            value={formData.currentWeight}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                        >
                            <option value="" disabled>Select your weight</option>
                            {Array.from({ length: 66 }, (_, i) => i + 45).map((weight) => (
                                <option key={weight} value={weight}>{weight} kg</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Weight goal</label>
                        <select
                            name="weightGoal"
                            value={formData.weightGoal}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                        >
                            <option value="" disabled>Select your desired weight</option>
                            {Array.from({ length: 66 }, (_, i) => i + 45).map((weight) => (
                                <option key={weight} value={weight}>{weight} kg</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-4 ">
                        <label htmlFor="description" className="block text-white">Description</label>
                        <textarea
                            name="description"
                            placeholder="Write a short description of what you would like to achieve..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full h-24 p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white resize-none"
                            rows="4"
                        ></textarea>
                    </div>
                    <button  type="submit" className="col-span-4 w-full md:w-1/2 py-2 rounded-lg mx-auto bg-slate-700 hover:bg-slate-800 hover:underline font-semibold transition-all">Start your journey!</button>
                </form>
            </div>
        </div>
    );
}


