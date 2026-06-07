export type PokemonPack = {
  id: string
  name: string
  generation: number
  startId: number
  endId: number
}

export const pokemonPacks: PokemonPack[] = [
  {
    id: 'gen-1',
    name: 'Generation 1',
    generation: 1,
    startId: 1,
    endId: 151,
  },
  {
    id: 'gen-2',
    name: 'Generation 2',
    generation: 2,
    startId: 152,
    endId: 251,
  },
  {
    id: 'gen-3',
    name: 'Generation 3',
    generation: 3,
    startId: 252,
    endId: 386,
  },
  {
    id: 'gen-4',
    name: 'Generation 4',
    generation: 4,
    startId: 387,
    endId: 493,
  },
  {
    id: 'gen-5',
    name: 'Generation 5',
    generation: 5,
    startId: 494,
    endId: 649,
  },
  {
    id: 'gen-6',
    name: 'Generation 6',
    generation: 6,
    startId: 650,
    endId: 721,
  },
  {
    id: 'gen-7',
    name: 'Generation 7',
    generation: 7,
    startId: 722,
    endId: 809,
  },
  {
    id: 'gen-8',
    name: 'Generation 8',
    generation: 8,
    startId: 810,
    endId: 905,
  },
  {
    id: 'gen-9',
    name: 'Generation 9',
    generation: 9,
    startId: 906,
    endId: 1025,
  },
]
