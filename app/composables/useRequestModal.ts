const MODAL_TITLE = 'Заказать звонок'

export function useRequestModal() {
  const open = useState('request-modal-open', () => false)
  const title = useState('request-modal-title', () => MODAL_TITLE)

  function show() {
    title.value = MODAL_TITLE
    open.value = true
  }

  function hide() {
    open.value = false
  }

  return { open, title, show, hide }
}
