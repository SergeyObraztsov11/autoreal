/**
 * Репозиторий отзывов с сайта.
 * Читает и пишет отзывы в файл data/site-reviews.json (пока без БД).
 */
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { nowIso } from '../../shared/time'

export type SiteReviewStatus = 'pending' | 'published' | 'rejected'

export type SiteReview = {
  id: string
  author: string
  rating: number
  text: string
  ip: string
  requestId: string | null
  createdAt: string
  status: SiteReviewStatus
}

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'site-reviews.json')

async function ensureFile() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(filePath, 'utf8')
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeFile(filePath, '[]\n', 'utf8')
      return
    }
    throw error
  }
}

async function readAll(): Promise<SiteReview[]> {
  await ensureFile()
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as unknown
  return Array.isArray(parsed) ? (parsed as SiteReview[]) : []
}

async function writeAll(items: SiteReview[]) {
  await ensureFile()
  await writeFile(filePath, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
}

export const siteReviewRepository = {
  async findAll() {
    return readAll()
  },

  async create(input: {
    author: string
    rating: number
    text: string
    ip: string
    requestId: string | null
  }) {
    const items = await readAll()
    const review: SiteReview = {
      id: randomUUID(),
      author: input.author,
      rating: input.rating,
      text: input.text,
      ip: input.ip,
      requestId: input.requestId,
      createdAt: nowIso(),
      status: 'pending',
    }
    items.push(review)
    await writeAll(items)
    return review
  },
}
