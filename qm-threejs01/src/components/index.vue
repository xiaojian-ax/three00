
<template>
<div>
  <mymenu></mymenu>

<router-view></router-view>
</div>
</template>

<script>
import mymenu from '@/components/menu'
export default{
  components:{
    mymenu
  }
}
</script>