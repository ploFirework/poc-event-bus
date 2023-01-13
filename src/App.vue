<template>
  <div id="app">
    Parent
    <button @click="register">Register</button>
    <button @click="deregister">Deregister</button>
    <button @click="emit">Emit</button>
    <button @click="addTestComp">Add TestComp</button>
    <button @click="addTestCompNotPlugin">Add TestCompNotPlugin</button>

    <component 
      v-for="c in children" 
      :is="c[0] === 'tc' ? 'TestComp' : 'TestCompNotPlugin'" 
      :title="c[1]" :key="c[1]"
      @destroy="() => destroy(c[1])"></component>
  </div>
</template>

<script>
import TestComp from './TestComp'
import TestCompNotPlugin from './TestCompNotPlugin'

export default {
  data() {
    return {
      counter: 0,
      children: []
    }
  },
  components: { TestComp, TestCompNotPlugin },
  methods: {
    testHandler() {
      console.log('testHandler', this.n)
    },
    register() {
      this.$bus.$on('test', this.testHandler)
    },
    deregister() {
      this.$bus.$off('test', this.testHandler)
    },
    emit() {
      this.$bus.$emit('test')
    },
    addTestComp() {
      this.children.push(['tc', this.counter++])
    },
    addTestCompNotPlugin() {
      this.children.push(['tcnp', this.counter++])
    },
    destroy(i) {
      this.children = this.children.filter(c => c[1]!==i)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>