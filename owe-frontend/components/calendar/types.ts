export interface MonthTaskRow {
  task_id: string
  user_id: string
  task_name: string
  category: string
  is_done: boolean | null
  date: string | null
  note: string | null
  image_url: string | null
}

export interface DaySummary {
  proofCount: number
  hasImage: boolean
  doneCount: number
  imageUrls: string[]
}

export type DaySummaryMap = Record<string, DaySummary>
