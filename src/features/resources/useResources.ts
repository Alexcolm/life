import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { fileToDataUrl } from '../../lib/file'
import { fileToCompressedDataUrl } from '../../lib/image'
import { resourcesCollection } from '../../firebase/firestore'
import type { Resource } from '../../types/resource'

const MAX_PDF_DATA_URL_LENGTH = 700_000 // ~500 KB de archivo original en base64

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
      createdAt: serverTimestamp(),
    })
  }

  async function addPdf(nodeId: string, label: string, file: File) {
    const dataUrl = await fileToDataUrl(file)
    if (dataUrl.length > MAX_PDF_DATA_URL_LENGTH) {
      throw new Error('El PDF pesa demasiado (máx. ~500 KB). Subilo a Drive y adjuntá el link en su lugar.')
    }
    await addDoc(resourcesCollection, {
      nodeId,
      type: 'pdf',
      label,
      url: null,
      dataUrl,
      createdAt: serverTimestamp(),
    })
  }

  async function removeResource(id: string) {
    await deleteDoc(doc(resourcesCollection, id))
  }

  return { resources, loading, byNode, addLink, addImage, addPdf, removeResource }
}
