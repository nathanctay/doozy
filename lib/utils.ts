import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
}

export function formatTimeRange(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const startFormatted = formatTime(startTime)

  const endFormatted = formatTime(endTime)

  return `${formatDate(startTime)} ${startFormatted} - ${endFormatted}`;
}


export function getEventStatus(startTime: string, endTime: string) {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (now < start) {
    return "upcoming"
  } else if (now > end) {
    return "ended"
  } else {
    return "ongoing"
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  let result = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return result
}

