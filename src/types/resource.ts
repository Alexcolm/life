export type ResourceType = 'link' | 'image' | 'pdf'

export interface Resource {
  id: string
  nodeId: string // id de la meta o materia a la que está adjunto
  type: ResourceType
  label: string
  url: string | null // para type 'link'
  dataUrl: string | null // para type 'image' | 'pdf'
  createdAt: number
}
