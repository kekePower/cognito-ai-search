interface PendingRequest<T> {
  promise: Promise<T>
  timestamp: number
}

const pendingRequests = new Map<string, PendingRequest<any>>()
const REQUEST_TIMEOUT = 30000 // 30 seconds

export function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  // Clean up expired requests
  const now = Date.now()
  for (const [k, req] of pendingRequests.entries()) {
    if (now - req.timestamp > REQUEST_TIMEOUT) {
      pendingRequests.delete(k)
    }
  }
  
  // Return existing request if pending
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!.promise
  }
  
  // Create new request
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key)
  })
  
  pendingRequests.set(key, { promise, timestamp: now })
  return promise
}
