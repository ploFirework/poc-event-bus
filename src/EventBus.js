/*
    CT-1516 - Implement Event Bus (PubSub) in vanilla JS
    - this will be used as both Vue Plugin and a plain exported JS Object 
    - safe to migrate from Vue 2 to Vue 3

    As a vanilla JS import:

      import { EventBus as Bus } from './utils/EventBus.js'

      Bus.$on(eventName{String}, callback{fn})
      Bus.$once(eventName{String}, callback{fn})
      Bus.$off(eventName{String}, callback{fn})
      Bus.$emit(eventName{String}, arg1, arg2, ...)

    As a Vue Plugin:

      this.$_eventBus_on(eventName{String}, callback{fn})
      this.$_eventBus_once(eventName{String}, callback{fn})
      this.$_eventBus_off(eventName{String}, callback{fn})
      this.$_eventBus_emit(eventName{String}, arg1, arg2, ...)

    ** NOTE ** the plugin version will auto-magically deregister all registered events for
    the given component in the beforeDestroy lifecycle hook, so no need to add that call
    in your component.
    
    See https://v3-migration.vuejs.org/breaking-changes/events-api.html

    Vue 3 docs discourages use of Event Bus and we should strive to deprecate these as we
    evolve the application
*/

// Maps of eventNames to list of callbacks
const events = {}
const events_once = {}

// Subscribe to events
function $on(evt, cb) {
  if (!(cb instanceof Function)) {
    console.warn(`EventBus: attempt register event '${evt}' with non-function '${cb}' `)
    return
  } 
  
  events[evt] = events[evt] || []
  events[evt].push(cb)
}

// Unsubscribe to events
// This method covers both .on and .once
function $off(evt, cb) {
  if (Array.isArray(events[evt])) {
    events[evt] = events[evt].filter((fn) => fn !== cb)
  }

  if (Array.isArray(events_once[evt])) {
    events_once[evt] = events_once[evt].filter((fn) => fn !== cb)
  }
}

// Subscribe to events that should only run once
function $once(evt, cb) {
  if (!(cb instanceof Function)) {
    console.warn(`EventBus: attempt register once-event '${evt}' with non-function '${cb}' `)
    return
  }

  events_once[evt] = events_once[evt] || []
  events_once[evt].push(cb)
}

// Trigger callbacks on events, if there are any
function $emit(evt, ...args) {
  if (Array.isArray(events[evt])) {
    events[evt].forEach((fn) => fn(...args))
  }

  // After all callbacks in events_once have been called, clear them
  // so they cannot be triggered again
  if (Array.isArray(events_once[evt])) {
    events_once[evt].forEach((fn) => fn(...args))
    delete events_once[evt]
  }
}

// Expose event bus functions to non-Vue code (plain JS export)
export const EventBus = {
  $on,
  $off,
  $once,
  $emit,
}

// Expose event bus functions as Vue Plugin
// Create a new registration method that automagically deregisters
export default function install(Vue) {
  Vue.prototype.$bus = EventBus // For backwards compatibility 
  
  // As Vue Mixin, auto-deregister EventBus events on destroy
  Vue.mixin({
    data() {
      return {
        eventBus_events: [],
        eventBus_events_once: []
      }
    },
    methods: {
      // As Vue Plugin, memoize registrations in order to auto-deregister later
      $_eventBus_on(evt, cb) {
        $on(evt, cb)
        this.eventBus_events.push([evt, cb])
      },
      $_eventBus_off(evt, cb) {
        $off(evt, cb)
      },
      $_eventBus_once(evt, cb) {
        $once(evt, cb)
        this.eventBus_events_once.push([evt, cb])
      },
      $_eventBus_emit(evt, ...args) {
        $emit(evt, ...args)
      }
    },
    beforeDestroy() {
      //Automagically deregister 
      this.eventBus_events.forEach(([evt, cb]) => $off(evt, cb))
      this.eventBus_events_once.forEach(([evt, cb]) => $off(evt, cb))
    }
  })

}