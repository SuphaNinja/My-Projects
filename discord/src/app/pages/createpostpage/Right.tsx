import LeftSection from "@/app/main-components/LeftSection";
import RightSection from "@/app/main-components/RightSection";
import { UserWithAccount } from "@/lib/types";


export default function Right({ currentUser, }: { currentUser: UserWithAccount }) {
    
    return (
        <RightSection>
            <h2>home right section</h2>
        </RightSection>
    );
}