import React from "react"

const PurchaseRequest: React.FC = () => {
  const handleSubmit = async () => {
    const data = {
      username: "asdf",
      phoneNumber: "1234567822",
      email: "asdf@asdf.com",
    }

    try {
      const response = await fetch("http://localhost:1337", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      console.log("Success:", result)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div>
      <button onClick={handleSubmit}>Submit Purchase Request</button>
    </div>
  )
}

export default PurchaseRequest
