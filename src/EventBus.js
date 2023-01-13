/*
    CT-1516 - Implement of Event Bus (PubSub) in vanilla JS
    - this will be used as both Vue Plugin and a plain exported JS Object 
    
    See https://v3-migration.vuejs.org/breaking-changes/events-api.html

    Vue 3 docs discourages use of Event Bus and we should strive to deprecate these as we
    evolve the application
*/
const events = {}
const events_once = {}

// Subscribe to events
function $on(evt, cb) {
  events[evt] = events[evt] || []
  events[evt].push(cb)
}

// Unsubscribe to events
function $off(evt, cb) {
  if (!Array.isArray(events[evt])) {
    return
  }

  events[evt] = events[evt].filter((fn) => fn !== cb)
}

// Subscribe to events that should only run once
function $once(evt, cb) {
  events_once[evt] = events_once[evt] || []
  events_once[evt].push(cb)
}

// Handle events
function $emit(evt, ...args) {
  if (Array.isArray(events[evt])) {
    events[evt].forEach((fn) => fn(...args))
  }

  if (Array.isArray(events_once[evt])) {
    events_once[evt].forEach((fn) => fn(...args))
    delete events_once[evt]
  }
}

export const EventBus = {
  $on,
  $off,
  $once,
  $emit,
}

export default function install(Vue) {
  // As Vue Plugin, memoize registrations in order to auto-deregister later
  Vue.prototype.$bus = {
    ...EventBus,
    $on: (evt, cb) => {
      console.log(this)
      $on(evt, cb)
      this.eventBus_localEventMem.push([evt, cb])
    }
  }
  
  // As Vue Mixin, auto-deregister EventBus events on destroy
  Vue.mixin({
    data() {
      return {
        eventBus_localEventMem: []
      }
    },
    beforeDestroy() {
      //Automagically deregister 
      this.eventBus_localEventMem.forEach(([evt, cb]) => $off(evt, cb))
    }
  })

}