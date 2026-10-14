<template>
   <div class="card">
      <span class="card-title">Title</span>
   </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

$duration: 200ms;
$colors: ('text': #333333);

.card {
   color: map.get($colors, 'text');
   transition: color $duration, outline-color $duration;

   @if $duration > 100ms {
      opacity: 1;
   } @else {
      opacity: 0.5;
   }
}

:deep(.card-title) {
   font-weight: 400;
}
</style>
