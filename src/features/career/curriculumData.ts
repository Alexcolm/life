export const CURRICULUM_ROOT_TITLE = 'Ingeniería en Informática — Universidad Columbia'

export const CURRICULUM: { curso: string; semestres: { sem: string; materias: string[] }[] }[] = [
  {
    curso: '1er Curso',
    semestres: [
      {
        sem: '1er Semestre',
        materias: [
          'Fundamentos de la Computación',
          'Metodología de la Investigación',
          'Álgebra Lineal',
          'Matemática Básica',
          'Inglés 1',
        ],
      },
      {
        sem: '2do Semestre',
        materias: [
          'Algoritmos 1',
          'Comunicación Escrita y Oral',
          'Probabilidades y Estadística',
          'Matemática Discreta',
          'Cálculo 1',
          'Inglés 2',
        ],
      },
    ],
  },
  {
    curso: '2do Curso',
    semestres: [
      {
        sem: '1er Semestre',
        materias: ['Algoritmos 2', 'Arquitectura de Computadoras', 'Administración', 'Cálculo 2', 'Inglés 3'],
      },
      {
        sem: '2do Semestre',
        materias: [
          'Estructura de Datos',
          'Teoría de la Programación',
          'Principios de Sistemas de Información',
          'Física 1',
          'Inglés 4',
        ],
      },
    ],
  },
  {
    curso: '3er Curso',
    semestres: [
      {
        sem: '1er Semestre',
        materias: [
          'Algoritmos Complejos',
          'Programación 1',
          'Bases de Datos 1',
          'Sistemas Operativos 1',
          'Física 2',
          'Inglés 5',
        ],
      },
      {
        sem: '2do Semestre',
        materias: [
          'Análisis de Sistemas',
          'Bases de Datos 2',
          'Sistemas Operativos 2',
          'Física 3',
          'Optativa 1',
          'Inglés 6',
        ],
      },
    ],
  },
  {
    curso: '4to Curso',
    semestres: [
      {
        sem: '1er Semestre',
        materias: [
          'Redes de Computadoras',
          'Programación 2',
          'Optativa 2',
          'Infraestructura de TI',
          'Física 4',
          'Inglés 7',
        ],
      },
      {
        sem: '2do Semestre',
        materias: [
          'Programación 3',
          'Ingeniería del Software 1',
          'Optativa 3',
          'Proyecto de Investigación',
          'Administración 2',
          'Inglés 8',
        ],
      },
    ],
  },
  {
    curso: '5to Curso',
    semestres: [
      {
        sem: '1er Semestre',
        materias: [
          'Optativa 4',
          'Ingeniería del Software 2',
          'Gabinete de Trabajo de Conclusión de Carrera 1',
          'Optativa 5',
          'Administración 3',
        ],
      },
      {
        sem: '2do Semestre',
        materias: ['Gabinete de Trabajo de Conclusión de Carrera 2'],
      },
    ],
  },
]
