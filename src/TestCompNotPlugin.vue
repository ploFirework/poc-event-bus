<template>
    <div style="margin:20px; padding:20px; border:solid 1px red;">
        Using vanilla JS obj {{ title }}
        <button @click="register">Register</button>
        <button @click="deregister">Deregister</button>
        <button @click="emit">Emit</button>
        <button @click="$emit('destroy')">Destroy Me</button>
    </div>
</template>

<script>
import { EventBus } from './EventBus'

export default {
    props: ['title'],
    data() {
        return {
            n: this.title
        }
    },
    methods: {
        testHandler() {
            console.log('testHandler', this.n)
        },
        register() {
            EventBus.$on('test', this.testHandler)
        },
        deregister() {
            EventBus.$off('test', this.testHandler)
        },
        emit() {
            EventBus.$emit('test')
        }
    } 
}
</script>

<style lang="scss" scoped>

</style>