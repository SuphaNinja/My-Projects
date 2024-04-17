"use client";

import api from "@/lib/axios";
import Left from "../Left";
import Middle from "../Middle";
import Right from "../Right";
import PageStructure from "@/app/main-components/PageStructure";


const postPage = () => {


    return (
        <PageStructure
            left={<Left />}
            middle={<Middle />}
            right={<Right />}
        />
    );
};

export default postPage;
