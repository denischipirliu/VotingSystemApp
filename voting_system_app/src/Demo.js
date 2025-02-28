import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/demo")
            .then((response) => response.json())
            .then((data) => setMessage(data.demoString))
            .catch((error) => console.error("Error fetching message:", error));
    }, []);

    return (
        <div>
            <h1>Backend Message:</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
