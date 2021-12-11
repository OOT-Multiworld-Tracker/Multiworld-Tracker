export class Subscription {
    constructor (events) {
        this.events = {}
        
        events.forEach((event) => {
            this.events[event] = []
        })
    }

    subscribeMany (events, callback) {
        events.forEach(event => this.subscribe(event, callback)) // Subscribe to all the events.
    }

    subscribe (event, callback) {
        if (this.events[event]) this.events[event].push(callback) // Add the callback to the event array.
        else console.error('Failure registering invalid event type')
    }

    unsubscribeMany (events, callback) {
        events.forEach(event => this.unsubscribe(event, callback)) // Unsubscribe to all the events.
    }

    unsubscribe (event, callback) {
        this.events[event] = this.events[event].splice(this.events[event].indexOf(callback), 1) // Remove the callback from the event array.
    }

    call (event, ...args) {
        this.events[event].forEach(callback => callback(...args)) // Call all the callbacks in the event array.
    }
}
