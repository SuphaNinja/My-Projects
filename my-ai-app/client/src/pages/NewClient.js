import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useEffect, useState } from "react";
import axios from "axios"
import SubmitButton from "../components/ui/SubmitButton";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { CustomSelect } from "src/components/ui/CustomSelect";
import { cn } from "src/lib/utils";




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
        mutationFn: (infoString) => axiosInstance.post("/create-guide", { prompt: infoString, trainerId: formData.trainerId })
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
        <div className="flex items-center md:mt-16 h-screen jusitfy-center">
            <div className="md:rounded-md flex  md:mt-0 md:w-2/3 w-full mx-auto mt-32 flex-col h-full">
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-4 gap-2">
                    <h1 className="text-center col-span-4 md:text-2xl fontsemibold text-xl">Reach Your goals!</h1>
                    {generateAiAnswer.isError && <p className="text-red-700 col-span-4 font-bold text-center text-xl">Something went wrong, please try again later!</p>}
                    {generateAiAnswer?.data?.data?.success && <p className="text-green-600 col-span-4 font-bold text-center text-xl">{generateAiAnswer?.data?.data?.success}</p>}
                    {generateAiAnswer?.data?.data?.error && <p className="text-red-700 col-span-4 font-bold text-center text-xl">{generateAiAnswer?.data?.data?.error}</p>}
                    {generateAiAnswer.isSuccess && !generateAiAnswer?.data?.data?.error ? (<div></div>) 
                    : 
                    <>
                    <div className="col-span-4 md:col-span-2">
                        <Label htmlFor="currentlyTraining">Currently training</Label>
                        <select
                            name="currentlyTraining"
                            value={formData.currentlyTraining}
                            onChange={handleChange}
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
                        <Label htmlFor="maxTraining">Maximum training days per week</Label>
                        <select
                            name="maxTraining"
                            value={formData.maxTraining}
                            onChange={handleChange}
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
                        <Label htmlFor="age">Age</Label>
                        <Input
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            min="15"
                            max="99"
                            required
                            disabled={generateAiAnswer.isPending}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <Label htmlFor="goalDuration">Goal Duration</Label>
                        <select
                            name="goalDuration"
                            value={formData.goalDuration}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="">Select Duration</option>
                            <option value="less_than_a_month">Less than a month</option>
                            <option value="1-3_months">1-3 months</option>
                            <option value="3-6_months">3-6 months</option>
                            <option value="6_months_to_1_year">6 months - 1 year</option>
                            <option value="more_than_a_year">More than a year</option>
                        </select>
                    </div>
                    <div className="col-span-4 md:col-span-1">
                        <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                        <Input
                            name="currentWeight"
                            type="number"
                            value={formData.currentWeight}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                        />
                    </div>
                    <div className="col-span-4 md:col-span-1">
                        <Label htmlFor="weightGoal" >Desired weight (kg)</Label>
                        <Input
                            name="weightGoal"
                            type="number"
                            value={formData.weightGoal}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                        />
                    </div>
                    {trainers.isSuccess && 
                    <div className="col-span-4 md:col-span-2">
                        <Label htmlFor="trainerId">Choose a Trainer</Label>
                        <select
                            name="trainerId"
                            value={formData.trainerId}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                        >
                            <option value="">Pick one</option>
                            {Object.values(trainers.data.data.success).map((trainer) => (
                                <option key={trainer.id} value={trainer.id}>
                                    {trainer.firstName} {trainer.lastName} - {trainer.clients.length} Active clients
                                </option>
                            ))}
                        </select>
                    </div>
                    }
                    <div className="col-span-4 ">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Write a short description of what you would like to achieve..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={generateAiAnswer.isPending}
                            rows="4"
                        ></Textarea>
                    </div>
                    </>
                    }
                    <SubmitButton apiInfo={generateAiAnswer} />
                </form>
            </div>
        </div>
    );
};





