"use client"

import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link";
import moment from "moment";
import { useEffect } from "react";


export default function Middle() {

  const queryClient = useQueryClient();

  const getNotifications = useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
  });

  const time = (notification: any) => {
    const time = moment(notification.created_at).format('M/Do/y, h:mm a');
    return time;
  }

  const readNotification = useMutation({
    mutationFn: api.readNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] }),
  });

  useEffect(() => {
      readNotification.mutate();
  }, []);



return (
  <div>
    <h2 className="text-center text-2xl mb-2 border-b-2">Notifications</h2>
    <button onClick={() => time((getNotifications.data[1]))}>test</button>
    {getNotifications.isSuccess ? (
      <div className="flex flex-col gap-2 items-center w-full justify-center mb-52">
        {getNotifications.data.map((notification: any, index: any) => (
          <div key={index} className="flex bg-slate-100 dark:bg-slate-800 px-4 py-2 w-full rounded-full">
            <div className="flex flex-col md:flex-row text-lg font-light w-full">
              <Link href={process.env.NEXT_PUBLIC_BASE_URL + "profilepage/" + notification.userId}
                className="text-red-400 font-semibold hover:underline text-xl mr-2 hover:text-red-500">
                {notification.message.split(" ")[0]}
              </Link>
              {notification.message.split(" ").slice(1).join(" ")}!
              <p className="ml-auto">{time(notification)}</p>
            </div>

          </div>
        ))}
      </div>
    ) : (<p>No notifications!</p>)}
  </div>
)
}
