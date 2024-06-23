export function calculateYears(priceString: string, salary: number): number {
  if (priceString.endsWith("years")) {
    return parseInt(priceString)
  }

  const affordabilityRatio = 1 // Adjust as needed

  // Remove any non-numeric characters except for '.' and convert to lowercase
  const cleanPrice = priceString.replace(/[^0-9.kmb]/gi, "").toLowerCase()

  let price: number

  if (cleanPrice.includes("k")) {
    price = parseFloat(cleanPrice) * 1000
  } else if (cleanPrice.includes("m")) {
    price = parseFloat(cleanPrice) * 1000000
  } else if (cleanPrice.includes("b")) {
    price = parseFloat(cleanPrice) * 1000000000
  } else {
    price = parseFloat(cleanPrice)
  }

  if (isNaN(price) || salary <= 0) {
    return 0 // Return 0 if price is invalid or salary is 0 or negative
  }

  const affordablePrice = salary * affordabilityRatio
  return Math.ceil(price / affordablePrice)
}
