import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


export default function Notifications({ currentUser }) {

    const queryClient = useQueryClient();

    function formatTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return `${interval} years ago`;
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return `${interval} months ago`;
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return `${interval} days ago`;
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return `${interval} hours ago`;
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return `${interval} minutes ago`;
        }

        return `${Math.floor(seconds)} seconds ago`;
    }


    const readNotification = useMutation({
        mutationFn: (notificationId) => axiosInstance.post("update-notification", { notificationId })
    });

    const handleRead = (notificationId) => {
        readNotification.mutate(notificationId);
        queryClient.invalidateQueries(["currentUser"]);
        toast("Notification marked as read.")
    }

    if (currentUser.notifications.length < 1) {
        <p>No new notifications</p>
    }

    return (
        <div className="max-h-[250px] flex flex-col gap-2">
            {currentUser.notifications.map((notification, index) => (
                <div key={index} className="py-2 px-4 bg-slate-800/50 rounded-md">
                    <div className="flex gap-2 items-center">
                        {notification.read ?
                            <p><EyeIcon width={20} /></p>
                            :
                            <button onClick={() => handleRead(notification.id)}><EyeSlashIcon width={20} /> </button>
                        }
                        <p className="first-letter:uppercase">{notification.message}!</p>
                        <p className="text-xs ml-auto text-slate-300">{formatTimeAgo(notification.created_at)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}


