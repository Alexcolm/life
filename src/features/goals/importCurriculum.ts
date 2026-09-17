import { addDoc, serverTimestamp } from 'firebase/firestore'
import { goalsCollection } from '../../firebase/firestore'
import { CURRICULUM, CURRICULUM_ROOT_TITLE } from './curriculumData'

async function createGoal(parentId: string | null, title: string, order: number): Promise<string> {
  const ref = await addDoc(goalsCollection, {
    title,
    parentId,
    order,
    completed: false,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/** Crea de una sola vez el árbol completo carrera → curso → semestre → materia. */
export async function importCurriculum(): Promise<void> {
  const rootId = await createGoal(null, CURRICULUM_ROOT_TITLE, Date.now())

  for (let c = 0; c < CURRICULUM.length; c++) {
    const course = CURRICULUM[c]
    const courseId = await createGoal(rootId, course.curso, (c + 1) * 1000)

    for (let s = 0; s < course.semestres.length; s++) {
      const semester = course.semestres[s]
      const semId = await createGoal(courseId, semester.sem, (s + 1) * 1000)

      for (let m = 0; m < semester.materias.length; m++) {
        await createGoal(semId, semester.materias[m], (m + 1) * 1000)
      }
    }
  }
}
