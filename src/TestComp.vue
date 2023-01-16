<template>
    <div style="margin:20px; padding:20px; border:solid 1px red;">
        Using Vue plugin {{ title }}
        <button @click="register">Register</button>
        <button @click="registerOnce">Register Once</button>
        <button @click="deregister">Deregister</button>
        <button @click="emit">Emit</button>
        <button @click="$emit('destroy')">Destroy Me</button>
    </div>
</template>

<script>
    export default {
        props: ['title'],
        methods: {
            testHandler() {
                console.log('testHandler', this.title)
            },
            register() {
                this.$_eventBus_on('test', this.testHandler)
            },
            registerOnce() {
                this.$_eventBus_once('test', this.testHandler)
            },
            deregister() {
                this.$_eventBus_off('test', this.testHandler)
            },
            emit() {
                this.$_eventBus_emit('test')
            },
        }
        
        
    }
</script>

<style lang="scss" scoped>

</style>