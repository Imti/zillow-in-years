import { useEffect, useState } from "react"

import { getSalary, setSalary } from "./storage"

function IndexPopup() {
  const [salary, setSalaryState] = useState(0)

  useEffect(() => {
    getSalary().then(setSalaryState)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await setSalary(salary)
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateSalary",
        salary: salary
      })
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your annual salary</label>
      <input
        type="number"
        value={salary}
        onChange={(e) => setSalaryState(Number(e.target.value))}
        placeholder="Enter your annual salary"
      />
      <button type="submit">Save</button>
    </form>
  )
}

export default IndexPopup
