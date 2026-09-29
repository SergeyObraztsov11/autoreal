<template>
  <div class="flex min-h-screen flex-col bg-canvas text-ink">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <MobileCallButton />
    <RequestModal />
    <ReviewModal />
  </div>
</template>
