<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <div class="floatable-bordered">
          <h2 style="text-align: center">{{ headerText }}</h2>
          <br>
        </div>
        <div class="floatable-bordered floatable-bordered-bottom">
          <br>
          <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
              <slot></slot>
            </div>
          </div>
        </div>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['headerText']
}
</script>

<style>
  .floatable-bordered {
      background-color: white;
      border-width: 1px 1px 0px 1px; 
      border-color: #ddd; 
      border-style: solid;
  }
  .floatable-bordered.floatable-bordered-bottom {
      border-width: 1px
  }
</style>
