<template>

    <div id="container"></div>
  
</template>

<script>
  import {createElement} from "@bikeshaving/crank";
  import {renderer} from "@bikeshaving/crank/dom";
  export default {
    name: 'ThreeCamera',
    data () {
      return {
      }
    },
    methods: {
    },
    mounted () {
      renderer.render(<div id="hello">Hello world</div>, document.getElementById("container"));
    }
  }
</script>
<style scoped>

</style>
