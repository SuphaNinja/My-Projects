"use client"
import { useEffect, useState, } from "react";
import Home from "./home";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { QueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";

interface UserWithPoints extends User {
  totalPoints: number;
}

export default function Page() {
  const [ searchData, setSearchData ] = useState("");
  const [ sortedUsers, setSortedUsers] = useState<UserWithPoints[]>([]);
  const [ isFollowing, setIsFollowing ] = useState(false);

  const queryClient = useQueryClient();

  const searchUsers = useMutation({
    mutationFn: () => api.searchUsers({ content: searchData }),
  });
  
  const currentUser = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser(),
  });

  const friendList = useQuery({
    queryKey: ["friend"],
    queryFn: () => api.getFriendList(),
  });

  const allUsers = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getAllUsers(),
  });

  const handleChange = (e: any) => {
    setSearchData(e.target.value);
    searchUsers.mutate();
  };
  
  const followUser = useMutation({
    mutationFn: (userId:string) => api.followUser(userId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["friend"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] })
      },
  });

  const followUserFunction = (user: any, currentUserId: any) => {
    followUser.mutate(user.id);
    if (checkFollowStatus(currentUserId, user) === "Unfollow") {
      toast({ variant: "default", title: `Success`, description: `You unfollowed ${user.name}` })
    } else {
      toast({ variant: "default", title: `Success`, description: `You followed ${user.name}` })
    }
    setIsFollowing(!isFollowing);
  };

  const checkFollowStatus = (currentUserId: any, user: any) => {
    const isFollowing = user.followed.some((follow: any) => follow.followingId == currentUserId);
    return isFollowing ? "Unfollow" : "Follow";
  };

  const getTotalPoints = (user:any) => {
    if (!user || !Array.isArray(user.players)) {
      return 0;  
    }
    const totalPoints = user.players.reduce((sum:any, player:any) => {
      return sum + (player.points || 0);
    }, 0);
    return totalPoints;
  };
  
  const calculatePointsForUsers = (users: User[]): UserWithPoints[] => {
    return users.map(user => ({
      ...user,
      totalPoints: getTotalPoints(user)
    }));
  };

  const sortUsersByPoints = (users: User[]): UserWithPoints[] => {
    const usersWithPoints = calculatePointsForUsers(users);
    return usersWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);
  };

  useEffect(() => {
    if(allUsers.isSuccess){
      setSortedUsers(sortUsersByPoints(allUsers.data.allUsers))
    };
  }, [allUsers.isSuccess])

  return (
    <Home>
      <div className="md:grid flex flex-col mt-12 md:mt-0 gap-12 md:gap-0 md:pt-4 md:grid-cols-12">
        <div className="flex px-2 flex-col col-span-3 md:h-screen">
            <p className="text-xl font-semibold">Search for users...</p>
            <Input value={searchData} onChange={handleChange} type="text" placeholder="Search by name or email..."/>
          {searchUsers.data && searchUsers.data.length > 0 ? 
          (
            <div className="overflow-y-auto md:px-2 mt-2 md:h-screen">
              {searchUsers.data.map((user:any, index:any ) => (
                <div key={index} className="grid grid-cols-6 gap-2 p-2 items-center justify-center border rounded-md">
                  <div className="col-span-2 pr-4 h-20 w-full flex items-center justify-center ">
                    <img src={user.image} className="size-full object-cover rounded-full"/>
                  </div>
                  <div className="flex flex-col justify-center gap-2 col-span-2 h-20 w-full">
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p>Total Points: <span className="font-bold text-lg">{getTotalPoints(user)}</span></p>
                  </div>
                  <div className="col-span-2 h-20 flex items-center justify-center w-full">
                    {currentUser ? 
                      <Button onClick={() => followUserFunction(user, currentUser.data.id)}>{checkFollowStatus(currentUser.data.id, user)}</Button> 
                    : 
                      <Button onClick={()=> signIn("github")}>Log in to follow user!</Button>
                    }
                  </div>
                </div>
              ))}
            </div>
          ): 
          null
          }
        </div>
        <div className="col-span-6 border-x md:h-screen">
            <div className="flex w-full flex-col gap-4 justify-center">
              <h2 className="md:text-3xl text-xl underline text-center font-semibold ">Leaderboard</h2>
              {allUsers.isSuccess &&
                <div className="flex w-full flex-col gap-4 justify-center">
                  {sortedUsers.map((user:any, index:number) => (
                  <div key={index} className="grid md:w-2/3 mx-auto grid-cols-6 gap-2 p-2 border items-center justify-center rounded-md">
                    <div className="col-span-2 border-r pr-4 h-20 w-full flex items-center justify-center ">
                      <p className="text-2xl mr-4">{index + 1}.</p>
                      <img src={user.image} className="size-full object-cover rounded-full" />
                    </div>
                    <div className="flex flex-col justify-center gap-2 col-span-2 h-20 w-full">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p>Total Points: <span className="font-bold text-lg">{getTotalPoints(user)}</span></p>
                    </div>
                    <div className="col-span-2 h-20 flex items-center justify-center w-full">
                      {currentUser.isSuccess ?
                        <>
                          {currentUser.data.id !== user.id ?
                              <Button onClick={() => followUserFunction(user, currentUser.data.id)}>{isFollowing ? "follow": "unfollow"}</Button>
                            :
                            <p className="text-lg font-semibold">( You )</p>
                          }
                        </>
                        :
                        <Button onClick={() => signIn("github")}>Log in to follow user!</Button>
                      }
                    </div>
                  </div>
                  ))}
                </div>
              }
            </div>
        </div>
        <div className="col-span-3 md:h-screen md:px-4">
          <h2 className="text-center text-xl font-semibold">FriendsList</h2>
          {friendList.isSuccess && friendList.data.friendList.length > 0 ? 
            <div className="flex w-full flex-col gap-4 justify-center">
              {friendList.data.friendList.map((user: any, index: number) => (
                <div key={index} className="grid w-full mx-auto grid-cols-6 gap-2 p-2 border items-center justify-center rounded-md">
                  <div className="col-span-2 border-r pr-4 h-20 w-full flex items-center justify-center ">
                    <img src={user.image} className="size-full object-cover rounded-full" />
                  </div>
                  <div className="flex flex-col justify-center gap-2 col-span-2 h-20 w-full">
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p>Total Points: <span className="font-bold text-lg">{getTotalPoints(user)}</span></p>
                  </div>
                  <div className="col-span-2 h-20 flex items-center justify-center w-full">
                    {currentUser.isSuccess ?                        
                      <div className="flex flex-col">
                        <Button className="mb-2" onClick={() => followUserFunction(user, currentUser.data.id)}>{checkFollowStatus(currentUser.data.id, user)}</Button>
                        {user.players[user.players.length - 1]?.gameSession?.status === "active" || user.players[user.players.length - 1]?.gameSession?.status === "pending"  ? 
                          <p className="text-center text-sm font-light">In game</p>
                        :
                          <p className="text-center text-sm font-light">Offline/Browsing</p>
                        }
                      </div>
                      :
                      <Button onClick={() => signIn("github")}>Log in to follow user!</Button>
                    }
                  </div>
                </div>
              ))}
            </div>
            :
            <p>Added friends will show up here</p>
          }
        </div>
      </div>
    </Home>
  )
}
