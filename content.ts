import { calculateYears } from "./calculateYears"
import { getSalary } from "./storage"

async function replaceHousePrices() {
  const salary = await getSalary()
  const priceElements = document.querySelectorAll(
    '.property-pill[data-test="property-marker"]'
  )

  priceElements.forEach((element) => {
    const innerDivs = element.querySelectorAll("div")
    if (!innerDivs) return

    const divWithPrice = innerDivs[innerDivs.length - 1]

    let originalPrice = element.getAttribute("data-original-price")

    console.log(originalPrice)

    if (!originalPrice) {
      originalPrice = divWithPrice.textContent.trim()
      element.setAttribute("data-original-price", originalPrice)
    }

    if (!originalPrice.endsWith("years")) {
      const years = calculateYears(originalPrice, salary)
      divWithPrice.textContent = years > 60 ? "Never" : `${years} years`
    }
  })
}

function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        const addedNodes = mutation.addedNodes
        for (let node of addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (element.classList.contains("property-pill")) {
              shouldUpdate = true
              break
            }
          }
        }
      }
      if (shouldUpdate) break
    }
    if (shouldUpdate) {
      replaceHousePrices()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function initializeExtension() {
  replaceHousePrices()
  observePageChanges()

  // Set up an interval to check for new elements
  const checkInterval = setInterval(() => {
    const pills = document.querySelectorAll(
      '.property-pill[data-test="property-marker"]'
    )
    if (pills.length > 0) {
      replaceHousePrices()
      clearInterval(checkInterval)
    }
  }, 1000) // Check every second

  // Clear the interval after 10 seconds to prevent it from running indefinitely
  setTimeout(() => clearInterval(checkInterval), 10000)
}

// Run the initialization
initializeExtension()

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateSalary") {
    replaceHousePrices()
  }
})
