import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance"



export default function Comment (comment) {

    const userId = "clw9fwcdv00016ra5cl49bh9f"

    const user = useQuery({
        queryKey: ["user", userId],
        queryFn: () => axiosInstance.get("/get-user",  userId  ),
        enabled: !!userId
    })
    

    return(
        <div>
            <button onClick={() => console.log(user)}>console.log.user</button>
        </div>
    )
}