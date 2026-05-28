import path from 'node:path'
import fs from 'fs-extra'

const OUTPUT_IMAGE_DIR = path.resolve('public/pokemon')
const OUTPUT_DATA_FILE = path.resolve('src/data/pokemon.json')
const OUTPUT_PACKS_FILE = path.resolve('src/data/pokemon-packs.ts')

const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

type PokemonRecord = {
  id: number
  name: string
  displayName: string
  aliases: string[]
  generation: number
  image: string
  dexNumber: number
  dexEntry: string
}

type PokemonPack = {
  id: string
  name: string
  generation: number
  startId: number
  endId: number
}

const GENERATION_PACKS: PokemonPack[] = [
  { id: 'gen-1', name: 'Generation 1', generation: 1, startId: 1, endId: 3 },
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

const MANUAL_ALIASES: Record<string, string[]> = {
  'nidoran-f': ['nidoran female', 'nidoran f', 'nidoran♀', 'nidoran'],
  'nidoran-m': ['nidoran male', 'nidoran m', 'nidoran♂', 'nidoran'],
  'mr-mime': ['mr mime', 'mr. mime', 'mister mime'],
  'mime-jr': ['mime jr', 'mime jr.', 'mime junior'],
  farfetchd: ["farfetch'd", 'far fetched'],
  sirfetchd: ["sirfetch'd", 'sir fetched'],
  flabebe: ['flabébé'],
  'type-null': ['type null'],
  'jangmo-o': ['jangmo o'],
  'hakamo-o': ['hakamo o'],
  'kommo-o': ['kommo o'],
  'tapu-koko': ['tapu koko'],
  'tapu-lele': ['tapu lele'],
  'tapu-bulu': ['tapu bulu'],
  'tapu-fini': ['tapu fini'],
  'mr-rime': ['mr rime', 'mr. rime', 'mister rime'],
  'great-tusk': ['great tusk'],
  'scream-tail': ['scream tail'],
  'brute-bonnet': ['brute bonnet'],
  'flutter-mane': ['flutter mane'],
  'slither-wing': ['slither wing'],
  'sandy-shocks': ['sandy shocks'],
  'iron-treads': ['iron treads'],
  'iron-bundle': ['iron bundle'],
  'iron-hands': ['iron hands'],
  'iron-jugulis': ['iron jugulis'],
  'iron-moth': ['iron moth'],
  'iron-thorns': ['iron thorns'],
  'wo-chien': ['wo chien'],
  'chien-pao': ['chien pao'],
  'ting-lu': ['ting lu'],
  'chi-yu': ['chi yu'],
  'roaring-moon': ['roaring moon'],
  'iron-valiant': ['iron valiant'],
  'walking-wake': ['walking wake'],
  'iron-leaves': ['iron leaves'],
  'gouging-fire': ['gouging fire'],
  'raging-bolt': ['raging bolt'],
  'iron-boulder': ['iron boulder'],
  'iron-crown': ['iron crown'],
}

function getGenerationForId(id: number): number {
  const pack = GENERATION_PACKS.find(
    (pack) => id >= pack.startId && id <= pack.endId,
  )

  if (!pack) {
    throw new Error(`No generation found for Pokémon id ${id}`)
  }

  return pack.generation
}

function titleCasePokemonName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .replace('Nidoran F', 'Nidoran♀')
    .replace('Nidoran M', 'Nidoran♂')
    .replace('Mr Mime', 'Mr. Mime')
    .replace('Mime Jr', 'Mime Jr.')
    .replace('Mr Rime', 'Mr. Rime')
    .replace('Ho Oh', 'Ho-Oh')
    .replace('Porygon Z', 'Porygon-Z')
    .replace('Jangmo O', 'Jangmo-o')
    .replace('Hakamo O', 'Hakamo-o')
    .replace('Kommo O', 'Kommo-o')
}

function normalizeAlias(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/♀/g, ' female')
    .replace(/♂/g, ' male')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function stripAlias(value: string): string {
  return normalizeAlias(value).replace(/\s+/g, '')
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function createAliases(apiName: string, displayName: string): string[] {
  const spacedApiName = apiName.replace(/-/g, ' ')
  const manualAliases = MANUAL_ALIASES[apiName] ?? []

  const candidates = [apiName, spacedApiName, displayName, ...manualAliases]

  const expanded = candidates.flatMap((alias) => [
    normalizeAlias(alias),
    stripAlias(alias),
  ])

  return unique(expanded)
}

async function fetchJson<T>(url: string, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url)

    if (response.ok) {
      return response.json() as Promise<T>
    }

    if (attempt === retries) {
      throw new Error(`Failed request: ${url} - ${response.status}`)
    }

    await sleep(500 * attempt)
  }

  throw new Error(`Failed request: ${url}`)
}

async function downloadFile(url: string, outputPath: string, retries = 3) {
  if (await fs.pathExists(outputPath)) {
    return
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url)

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      await fs.writeFile(outputPath, Buffer.from(arrayBuffer))
      return
    }

    if (attempt === retries) {
      throw new Error(`Failed download: ${url} - ${response.status}`)
    }

    await sleep(500 * attempt)
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  let nextIndex = 0

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1

      await worker(items[currentIndex], currentIndex)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runWorker()))
}

type PokemonApiResponse = {
  id: number
  name: string
}

type PokemonSpeciesFlavorText = {
  flavor_text: string
  language: {
    name: string
  }
  version: {
    name: string
  }
}

type PokemonSpeciesApiResponse = {
  flavor_text_entries: PokemonSpeciesFlavorText[]
}

const MAIN_SERIES_VERSIONS = new Set([
  'red',
  'blue',
  'yellow',
  'gold',
  'silver',
  'crystal',
  'ruby',
  'sapphire',
  'emerald',
  'firered',
  'leafgreen',
  'diamond',
  'pearl',
  'platinum',
  'heartgold',
  'soulsilver',
  'black',
  'white',
  'black-2',
  'white-2',
  'x',
  'y',
  'omega-ruby',
  'alpha-sapphire',
  'sun',
  'moon',
  'ultra-sun',
  'ultra-moon',
  'sword',
  'shield',
  'scarlet',
  'violet',
])

function normalizeDexEntry(value: string) {
  return value.replace(/[\f\n\r]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function getDexEntry(species: PokemonSpeciesApiResponse) {
  const englishEntries = species.flavor_text_entries.filter(
    (entry) => entry.language.name === 'en',
  )
  const preferredEntry =
    englishEntries.find((entry) => MAIN_SERIES_VERSIONS.has(entry.version.name)) ??
    englishEntries[0]

  return normalizeDexEntry(
    preferredEntry?.flavor_text ?? 'Dex entry unavailable.',
  )
}

async function buildPokemonRecord(id: number): Promise<PokemonRecord> {
  const [pokemon, species] = await Promise.all([
    fetchJson<PokemonApiResponse>(`${POKEAPI_BASE}/pokemon/${id}`),
    fetchJson<PokemonSpeciesApiResponse>(`${POKEAPI_BASE}/pokemon-species/${id}`),
  ])

  const displayName = titleCasePokemonName(pokemon.name)

  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName,
    aliases: createAliases(pokemon.name, displayName),
    generation: getGenerationForId(pokemon.id),
    image: `/pokemon/${pokemon.id}.png`,
    dexNumber: pokemon.id,
    dexEntry: getDexEntry(species),
  }
}

async function downloadPokemonImage(id: number) {
  const imageUrl = `${SPRITE_BASE}/${id}.png`
  const outputPath = path.join(OUTPUT_IMAGE_DIR, `${id}.png`)

  await downloadFile(imageUrl, outputPath)
}

function generatePacksFile() {
  return `export type PokemonPack = {
  id: string
  name: string
  generation: number
  startId: number
  endId: number
}

export const pokemonPacks: PokemonPack[] = ${JSON.stringify(
    GENERATION_PACKS,
    null,
    2,
  )}
`
}

async function main() {
  const maxPokemonId = GENERATION_PACKS[GENERATION_PACKS.length - 1].endId
  const ids = Array.from({ length: maxPokemonId }, (_, index) => index + 1)

  await fs.ensureDir(OUTPUT_IMAGE_DIR)
  await fs.ensureDir(path.dirname(OUTPUT_DATA_FILE))
  await fs.ensureDir(path.dirname(OUTPUT_PACKS_FILE))

  const records: PokemonRecord[] = []

  console.log(`Generating ${ids.length} Pokémon...`)

  await runWithConcurrency(ids, 8, async (id) => {
    console.log(`Processing #${id}`)

    const [record] = await Promise.all([
      buildPokemonRecord(id),
      downloadPokemonImage(id),
    ])

    records[id - 1] = record
  })

  await fs.writeJson(OUTPUT_DATA_FILE, records, { spaces: 2 })
  await fs.writeFile(OUTPUT_PACKS_FILE, generatePacksFile())

  console.log('')
  console.log('Done!')
  console.log(`Images: ${OUTPUT_IMAGE_DIR}`)
  console.log(`Data: ${OUTPUT_DATA_FILE}`)
  console.log(`Packs: ${OUTPUT_PACKS_FILE}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
