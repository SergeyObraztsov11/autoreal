/**
 * При старте сервера чистит лог-файлы старше срока хранения.
 */
import { pruneOldLogs } from '../utils/logger'

export default defineNitroPlugin(() => {
  void pruneOldLogs(true)
})
