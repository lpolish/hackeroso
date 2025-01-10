import { User, Item } from '../types'

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

export async function fetchItems(ids: number[]): Promise<Item[]> {
  const items = await Promise.all(
    ids.map(async (id) => {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch item ${id}`)
      }
      return response.json()
    })
  )
  return items
}

