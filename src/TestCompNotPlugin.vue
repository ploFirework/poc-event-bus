<template>
    <div style="margin:20px; padding:20px; border:solid 1px red;">
        Using vanilla JS obj {{ title }}
        <button @click="register">Register</button>
        <button @click="registerOnce">Register Once</button>
        <button @click="deregister">Deregister</button>
        <button @click="emit">Emit</button>
        <button @click="$emit('destroy')">Destroy Me</button>
        I will NOT self-deregister because I'm using plain JS import (no lifecycle hook)
    </div>
</template>

<script>
import { EventBus } from './EventBus'

export default {
    props: ['title'],
    methods: {
        testHandler() {
            console.log('testHandler', this.title)
        },
        register() {
            EventBus.$on('test', this.testHandler)
        },
        registerOnce() {
            EventBus.$once('test', this.testHandler)
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