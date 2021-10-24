export class Subscription {
    constructor (events) {
        this.events = {}
        
        events.forEach((event) => {
            this.events[event] = []
        })
    }

    subscribe (event, callback) {
        this.events[event].push(callback) // Add the callback to the event array.
    }

    unsubscribe (event, callback) {
        this.events[event] = this.events[event].splice(this.events[event].indexOf(callback), 1) // Remove the callback from the event array.
    }

    call (event, ...args) {
        this.events[event].forEach(callback => callback(...args)) // Call all the callbacks in the event array.
    }
}
