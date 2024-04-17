import PageStructure from "@/app/main-components/PageStructure";
import Left from "./Left";
import Middle from "./Middle";



export default function NotificationPage() {
    return (
        <PageStructure left={<Left/>} middle={<Middle/>}/>
    )
}