<template>
  <svg class="image-filters" aria-hidden="true" width="0" height="0">
    <defs>
      <!-- merch.png: invert only the transparent title and price-label bands.
           The product photos between/below these bands keep their colors. -->
      <filter
        id="session-merch-ink"
        primitiveUnits="objectBoundingBox"
        color-interpolation-filters="sRGB"
        x="0"
        y="0"
        width="100%"
        height="100%"
      >
        <feComponentTransfer in="SourceGraphic" result="inverted">
          <feFuncR type="table" tableValues="1 0" />
          <feFuncG type="table" tableValues="1 0" />
          <feFuncB type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feFlood x="0" y="0" width="1" height="0.154" result="title" />
        <feFlood x="0" y="0.724" width="1" height="0.099" result="prices" />
        <feMerge result="lettering">
          <feMergeNode in="title" />
          <feMergeNode in="prices" />
        </feMerge>
        <feComposite in="inverted" in2="lettering" operator="in" result="ink" />
        <feComposite in="SourceGraphic" in2="lettering" operator="out" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="ink" />
        </feMerge>
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.image-filters {
  position: absolute;
  pointer-events: none;
}
</style>
