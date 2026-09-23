<script setup lang="ts">
import { vkGroup } from '~/data/site'

interface VkApi {
  Widgets: {
    Group: (elementId: string, options: Record<string, string | number>, groupId: number) => void
  }
}

type WindowWithVk = Window & { VK?: VkApi }

// Inline <script> tags don't run inside Vue templates, so the widget is
// rendered on mount; openapi.js is loaded once and reused on revisits.
onMounted(() => {
  const win = window as WindowWithVk
  const render = () =>
    win.VK?.Widgets.Group(
      'vk_groups',
      {
        mode: 4,
        wide: 1,
        width: 'auto',
        height: 600,
        color1: 'FFFFFF',
        color2: '0A0A0A',
        color3: '0A0A0A',
      },
      vkGroup.id,
    )

  if (win.VK) return render()

  const s = document.createElement('script')
  s.src = 'https://vk.ru/js/api/openapi.js?168'
  s.onload = () => render()
  document.head.appendChild(s)
})
</script>

<template>
  <div id="vk_groups" class="min-h-[600px] bg-canvas [&>iframe]:block" />
</template>
