import { addDoc, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore'
import { careerCollection, goalsCollection, resourcesCollection } from '../../firebase/firestore'
import { CURRICULUM, CURRICULUM_ROOT_TITLE } from './curriculumData'

async function createCareerNode(
  parentId: string | null,
  title: string,
  order: number,
  completed = false,
): Promise<string> {
  const ref = await addDoc(careerCollection, {
    title,
    parentId,
    order,
    completed,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

async function importFresh(): Promise<void> {
  const rootId = await createCareerNode(null, CURRICULUM_ROOT_TITLE, Date.now())

  for (let c = 0; c < CURRICULUM.length; c++) {
    const course = CURRICULUM[c]
    const courseId = await createCareerNode(rootId, course.curso, (c + 1) * 1000)

    for (let s = 0; s < course.semestres.length; s++) {
      const semester = course.semestres[s]
      const semId = await createCareerNode(courseId, semester.sem, (s + 1) * 1000)

      for (let m = 0; m < semester.materias.length; m++) {
        await createCareerNode(semId, semester.materias[m], (m + 1) * 1000)
      }
    }
  }
}

interface OldNode {
  id: string
  title: string
  parentId: string | null
  order: number
  completed: boolean
}

async function migrateFromGoals(oldRoot: OldNode, allOldNodes: OldNode[]): Promise<void> {
  const idMap = new Map<string, string>()

  async function copyNode(oldNode: OldNode, newParentId: string | null) {
    const newId = await createCareerNode(newParentId, oldNode.title, oldNode.order, oldNode.completed)
    idMap.set(oldNode.id, newId)
    const children = allOldNodes.filter((n) => n.parentId === oldNode.id)
    for (const child of children) {
      await copyNode(child, newId)
    }
  }
  await copyNode(oldRoot, null)

  // Migrar recursos adjuntos (apuntaban a los ids viejos en 'goals')
  const resSnap = await getDocs(resourcesCollection)
  for (const resDoc of resSnap.docs) {
    const data = resDoc.data()
    const newNodeId = idMap.get(data.nodeId)
    if (newNodeId) {
      await addDoc(resourcesCollection, { ...data, nodeId: newNodeId })
      await deleteDoc(resDoc.ref)
    }
  }

  // Borrar el árbol viejo de Metas
  await Promise.all(Array.from(idMap.keys()).map((oldId) => deleteDoc(doc(goalsCollection, oldId))))
}

export type CurriculumImportResult = 'already-in-career' | 'migrated' | 'imported'

/** Idempotente: si ya está en Carrera no hace nada, si estaba en Metas lo mueve preservando lo tildado, si no existe lo crea. */
export async function moveOrImportCurriculum(): Promise<CurriculumImportResult> {
  const careerSnap = await getDocs(careerCollection)
  const alreadyInCareer = careerSnap.docs.some((d) => d.data().title === CURRICULUM_ROOT_TITLE)
  if (alreadyInCareer) return 'already-in-career'

  const goalsSnap = await getDocs(goalsCollection)
  const allOldNodes: OldNode[] = goalsSnap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      title: data.title,
      parentId: data.parentId ?? null,
      order: data.order ?? 0,
      completed: !!data.completed,
    }
  })
  const oldRoot = allOldNodes.find((n) => n.title === CURRICULUM_ROOT_TITLE)

  if (oldRoot) {
    await migrateFromGoals(oldRoot, allOldNodes)
    return 'migrated'
  }

  await importFresh()
  return 'imported'
}
