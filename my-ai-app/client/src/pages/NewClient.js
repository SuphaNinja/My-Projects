import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useEffect, useState } from "react";
import axios from "axios"
import SubmitButton from "../components/ui/SubmitButton";



export default function NewClient() {

    const [formData, setFormData] = useState({
        age: 15,
        gender: "Male",
        currentWeight:"",
        weightGoal: "",
        goalDuration: "",
        description: "",
        currentlyTraining: "",
        maxTraining: "",
        trainerId: ""
    });

    const infoString = `
    Age: ${formData.age}, Gender: ${formData.gender}, Current Weight: ${formData.currentWeight}kg, 
    WeightGoal: ${formData.weightGoal}kg, Time to complete goal: ${formData.goalDuration}, Currently training: ${formData.currentlyTraining}, 
    Maximum days a week to train: ${formData.maxTraining}, Description of the goal im trying to achieve: ${formData.description}`;

    const generateAiAnswer = useMutation({
        mutationFn: (infoString) => axiosInstance.post("/test", { prompt: infoString, trainerId: formData.trainerId })
    });

    const trainers = useQuery({
        queryKey: ["trainers"],
        queryFn: () => axiosInstance.get("/get-all-trainers")
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

    return (
        <div className="flex items-center pb-32 md:mt-16 md:mx-60 jusitfy-center">
            <div className="bg-slate-500  md:rounded-md flex md:mt-0 mt-16 flex-col w-full h-full">
                <form onSubmit={handleSubmit} className="text-white p-6 grid grid-cols-4 gap-2">
                    <h1 className="text-center col-span-4 md:text-2xl fontsemibold text-xl">Reach Your goals!</h1>
                    {generateAiAnswer.isError && <p className="text-red-700 col-span-4 font-bold text-center text-xl">Something went wrong, please try again later!</p>}
                    {generateAiAnswer?.data?.data?.success && <p className="text-green-600 col-span-4 font-bold text-center text-xl">{generateAiAnswer?.data?.data?.success}</p>}
                    {generateAiAnswer?.data?.data?.error && <p className="text-red-700 col-span-4 font-bold text-center text-xl">{generateAiAnswer?.data?.data?.error}</p>}
                    {generateAiAnswer.isSuccess && !generateAiAnswer?.data?.data?.error ? (
                        <div></div>
                    ) : 
                    <>
                    <div className="col-span-4 md:col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Currently training</label>
                        <select
                            name="currentlyTraining"
                            value={formData.currentlyTraining}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="">Select Frequency</option>
                            <option value="0_days_a_week">0 days a week</option>
                            <option value="1-3_days_a_week">1-3 days a week</option>
                            <option value="3-5_days_a_week">3-5 days a week</option>
                            <option value="more_than_5_days_a_week">More than 5 days a week</option>
                        </select>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Maximum training days per week</label>
                        <select
                            name="maxTraining"
                            value={formData.maxTraining}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="">Select Frequency</option>
                            <option value="1-3_days_a_week">1-3 days a week</option>
                            <option value="3-5_days_a_week">3-5 days a week</option>
                            <option value="more_than_5_days_a_week">More than 5 days a week</option>
                        </select>
                    </div>
                    <div className="col-span-2 md:col-span-1 ">
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
                            disabled={generateAiAnswer.isPending}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label htmlFor="gender" className="block text-sm font-medium text-white mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="md:w-2/3 bg-slate-800 p-2 border-2 border-gray-300 rounded-lg"
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <label htmlFor="goal" className="block text-white">Goal Duration</label>
                        <select
                            name="goalDuration"
                            value={formData.goalDuration}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
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
                            <div className="col-span-4 md:col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Current Weight</label>
                        <select
                            name="currentWeight"
                            value={formData.currentWeight}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="" disabled>Select your weight</option>
                            {Array.from({ length: 66 }, (_, i) => i + 45).map((weight) => (
                                <option key={weight} value={weight}>{weight} kg</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">Weight goal</label>
                        <select
                            name="weightGoal"
                            value={formData.weightGoal}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="" disabled>Select your desired weight</option>
                            {Array.from({ length: 66 }, (_, i) => i + 45).map((weight) => (
                                <option key={weight} value={weight}>{weight} kg</option>
                            ))}
                        </select>
                    </div>
                    {trainers.isSuccess && 
                        <div className="col-span-4 md:col-span-2">
                            <label htmlFor="trainer" className="block text-sm font-medium  text-white mb-2">
                                Choose a Trainer
                            </label>
                            <select
                                name="trainerId"
                                value={formData.trainerId}
                                onChange={handleChange}
                                className="w-full flex p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white"
                                required
                                disabled={generateAiAnswer.isPending}
                            >
                                <option value="">Choose your trainer</option>
                                {Object.values(trainers.data.data.success).map((trainer) => (
                                    <option key={trainer.id} value={trainer.id }>
                                        <p className="">{trainer.firstName} {trainer.lastName}<span> <p className="ml-auto">{trainer.clients.length} <span>Active clients</span></p></span></p>
                                    </option>
                                ))}
                            </select>
                        </div>
                        }
                    <div className="col-span-4 ">
                        <label htmlFor="description" className="block text-white">Description</label>
                        <textarea
                            name="description"
                            placeholder="Write a short description of what you would like to achieve..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                            className="w-full h-24 p-2 border-2 border-gray-300 rounded-lg bg-slate-800 text-white resize-none"
                            rows="4"
                        ></textarea>
                    </div></>
                    }
                    <SubmitButton apiInfo={generateAiAnswer} />
                    
                </form>
            </div>
        </div>
    );
};





