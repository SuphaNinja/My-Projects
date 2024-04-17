"use client"
import PageStructure from "./main-components/PageStructure";
import Left from "./pages/homepage/Left";
import Middle from "./pages/homepage/Middle";
import Right from "./pages/homepage/Right";

const HomePage = () => {
    return (
        <PageStructure left={<Left />} middle={<Middle />} right={<Right />} />
    )

}

export default HomePage;