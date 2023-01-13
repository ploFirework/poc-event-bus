<template>
    <div style="margin:20px; padding:20px; border:solid 1px red;">
        TestComp {{ title }}
        <button @click="register">Register</button>
        <button @click="deregister">Deregister</button>
        <button @click="emit">Emit</button>
        <button @click="$emit('destroy')">Destroy Me</button>
    </div>
</template>

<script>
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
                this.$bus.$on('test', this.testHandler)
            },
            deregister() {
                this.$bus.$off('test', this.testHandler)
            },
            emit() {
                this.$bus.$emit('test')
            },
        }
        
        
    }
</script>

<style lang="scss" scoped>

</style>