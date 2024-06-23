import { Storage } from "@plasmohq/storage"

export const storage = new Storage()

export async function getSalary(): Promise<number> {
  return (await storage.get("salary")) || 0
}

export async function setSalary(salary: number) {
  await storage.set("salary", salary)
}
