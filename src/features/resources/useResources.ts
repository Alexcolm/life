import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { resourcesCollection } from '../../firebase/firestore'
import { fileToCompressedDataUrl } from '../../lib/image'
import { deleteLocalFile, saveLocalFile } from '../../lib/localFiles'
import type { Resource } from '../../types/resource'

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(resourcesCollection, orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setResources(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            nodeId: data.nodeId,
            type: data.type,
            label: data.label,
            url: data.url ?? null,
            dataUrl: data.dataUrl ?? null,
            localOnly: !!data.localOnly,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          } as Resource
        }),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function byNode(nodeId: string): Resource[] {
    return resources.filter((r) => r.nodeId === nodeId)
  }

  async function addLink(nodeId: string, label: string, url: string) {
    await addDoc(resourcesCollection, {
      nodeId,
      type: 'link',
      label,
      url,
      dataUrl: null,
      localOnly: false,
      createdAt: serverTimestamp(),
    })
  }

  async function addImage(nodeId: string, label: string, file: File) {
    const dataUrl = await fileToCompressedDataUrl(file)
    await addDoc(resourcesCollection, {
      nodeId,
      type: 'image',
      label,
      url: null,
      dataUrl,
      localOnly: false,
      createdAt: serverTimestamp(),
    })
  }

  async function addPdf(nodeId: string, label: string, file: File) {
    // El PDF se guarda en el disco de este dispositivo (IndexedDB), no en Firestore:
    // no sincroniza a otros dispositivos, pero no tiene límite práctico de tamaño.
    const ref = await addDoc(resourcesCollection, {
      nodeId,
      type: 'pdf',
      label,
      url: null,
      dataUrl: null,
      localOnly: true,
      createdAt: serverTimestamp(),
    })
    await saveLocalFile(ref.id, file)
  }

  async function removeResource(resource: Resource) {
    await deleteDoc(doc(resourcesCollection, resource.id))
    if (resource.localOnly) {
      await deleteLocalFile(resource.id)
    }
  }

  return { resources, loading, byNode, addLink, addImage, addPdf, removeResource }
}
