"use client";
import { useState } from "react";

export default function Home() {
    const [counter, setCounter] = useState(0);

    const increment = () => {
        setCounter(counter + 1);
        console.log("how many");
    };

    return (
        <div>
            <span> {counter} </span>
            <button onClick={increment}> look at me</button>
        </div>
    );
}
