export function ensure<T>(value: T | undefined, message: string): T {
  if (!value) {
    throw new Error(message)
  }
  return value
}

// Helper function for sorting directories
export function comparePaths(uriA: string, uriB: string): number {
  // Assumes that last part of every uri is a file
  const partsA = uriA.split('/')
  const partsB = uriB.split('/')
  const minLength = Math.min(partsA.length, partsB.length)

  for (let i = 0; i < minLength; i++) {
    const partA = partsA[i]
    const partB = partsB[i]

    if (partA !== partB) {
      const isALast = i === partsA.length - 1
      const isBLast = i === partsB.length - 1

      if (isALast && !isBLast) {
        return 1 // A is file and B is directory -> B comes first
      }
      if (!isALast && isBLast) {
        return -1 // A is directory and B is file -> A comes first
      }

      // Both are files or both are directories -> Alphabetical sorting
      return partA.localeCompare(partB)
    }
  }

  // If one path is prefix of other then shorter path comes first
  return partsA.length - partsB.length
}
