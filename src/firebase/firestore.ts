import { collection } from 'firebase/firestore'
import { db } from './config'

export const tasksCollection = collection(db, 'tasks')
export const goalsCollection = collection(db, 'goals')
export const eventsCollection = collection(db, 'events')
export const routinesCollection = collection(db, 'routines')
export const routineCompletionsCollection = collection(db, 'routineCompletions')
export const nutritionLogsCollection = collection(db, 'nutritionLogs')
export const notesCollection = collection(db, 'notes')
export const booksCollection = collection(db, 'books')
export const careerCollection = collection(db, 'career')
export const resourcesCollection = collection(db, 'resources')
export const scheduleCollection = collection(db, 'schedule')
