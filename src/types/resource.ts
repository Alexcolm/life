export type ResourceType = 'link' | 'image' | 'pdf'

export interface Resource {
  id: string
  nodeId: string // id de la meta o materia a la que está adjunto
  type: ResourceType
  label: string
  url: string | null // para type 'link'
  dataUrl: string | null // para type 'image' (comprimida, sí sincroniza vía Firestore)
  localOnly: boolean // true para 'pdf': el archivo vive en IndexedDB de este dispositivo, no en Firestore
  createdAt: number
}
