# poc-event-bus

Proof of Concept for stand-alone Event Bus (basic vanilla JS PubSub implementation).  

`EventBus.js` is the real implementation which is both a Vue Plugin and an exported JS object, both meant to be the same singleton that provides Pub/Sub functionality globally.

When running the test application, the `EventBus` is installed as a global Vue plugin that exposes the following on the application instance:

```
this.$_eventBus_on(event, callback)
this.$_eventBus_off(event, callback)
this.$_eventBus_once(event, callback)
this.$_eventBus_emit(event, callback)
```

For Vue components, its enough to call `$_eventBus_on` to register an event, developers no longer to need to deregister this event later in the Vue lifecycle because this plugin will automatically do that.  Of course, a developer can still call `$_eventBus_off` to manually deregister their events+callback anytime they wish.

For everything else (ie JS classes), the event bus can be imported and invoked as today.  And just like today there will be no auto-deregister when the JS class importing the event bus is unloaded...

As a vanilla JS import:
```

import { EventBus as Bus } from './utils/EventBus.js'

Bus.$on(eventName{String}, callback{fn})
Bus.$once(eventName{String}, callback{fn})
Bus.$off(eventName{String}, callback{fn})
Bus.$emit(eventName{String}, arg1, arg2, ...)
```

## Running the demo
```
npm run serve
```

This is basic Vue to test/demonstrate that `EventBus.js` works both as a Vue Plugin and JS import simultaneously.  Please open your dev tools and inspect the console while interacting with the interface, which should be self-explanatory.


