/**
 * Репозиторий заявок на обратный звонок.
 * Читает и пишет заявки в файл data/requests.json (пока без БД).
 */
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { nowIso } from '../../shared/time'

export type CallbackRequestStatus = 'new' | 'called' | 'done' | 'spam'

export type CallbackRequest = {
  id: string
  name: string
  phone: string
  phoneDigits: string
  title: string | null
  ip: string
  requestId: string | null
  createdAt: string
  status: CallbackRequestStatus
}

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'requests.json')

/**
 * Гарантирует, что каталог data и файл requests.json существуют.
 * Получает: ничего.
 * Делает: создаёт папку/файл с пустым массивом [], если их ещё нет.
 * Возвращает: Promise<void>.
 */
async function ensureFile() {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeFile(filePath, '[]\n', 'utf8')
      return
    }
    throw error
  }
}

/**
 * Читает все заявки из JSON-файла.
 * Получает: ничего.
 * Делает: открывает requests.json и парсит массив.
 * Возвращает: массив CallbackRequest (или [] при битых данных).
 */
async function readAll(): Promise<CallbackRequest[]> {
  await ensureFile()
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as unknown
  return Array.isArray(parsed) ? (parsed as CallbackRequest[]) : []
}

/**
 * Перезаписывает весь список заявок в JSON-файл.
 * Получает: items — полный актуальный массив заявок.
 * Делает: сериализует массив с отступами и сохраняет на диск.
 * Возвращает: Promise<void>.
 */
async function writeAll(items: CallbackRequest[]) {
  await ensureFile()
  await writeFile(filePath, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
}

export const callbackRequestRepository = {
  /**
   * Возвращает все сохранённые заявки.
   * Получает: ничего.
   * Делает: читает файл целиком.
   * Возвращает: Promise<CallbackRequest[]>.
   */
  async findAll() {
    return readAll()
  },

  /**
   * Ищет незакрытую заявку с таким же номером телефона.
   * Получает: phoneDigits — телефон в виде 11 цифр (7XXXXXXXXXX).
   * Делает: ищет запись со status === "new" и тем же phoneDigits.
   * Возвращает: заявку или null, если активной нет.
   */
  async findNewByPhoneDigits(phoneDigits: string) {
    const items = await readAll()
    return items.find(item => item.phoneDigits === phoneDigits && item.status === 'new') ?? null
  },

  /**
   * Создаёт новую заявку и сохраняет её в файл.
   * Получает: данные заявки (имя, телефон, ip, requestId и т.д.).
   * Делает: добавляет запись со status "new" и новым id (UUID).
   * Возвращает: созданный объект CallbackRequest.
   */
  async create(input: {
    name: string
    phone: string
    phoneDigits: string
    title: string | null
    ip: string
    requestId: string | null
  }) {
    const items = await readAll()
    const request: CallbackRequest = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      phoneDigits: input.phoneDigits,
      title: input.title,
      ip: input.ip,
      requestId: input.requestId,
      createdAt: nowIso(),
      status: 'new',
    }
    items.push(request)
    await writeAll(items)
    return request
  },
}
