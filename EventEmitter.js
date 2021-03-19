class EventEmitter {
    constructor() {
        this.listeners = new Map()
    }
  
    on(event, listener) {
        const listeners = this.listeners.get(event)
  
        if (listeners) {
            listeners.add(listener)
        } else {
            this.listeners.set(event, new Set([listener]))
        }

        return this
    }
  
    once(event, listener) {
        const self = this
  
        this.on(event, function f(data) {
            self.remove(event, f)
  
            return listener(data)
        })
    }
  
    emit(event, data) {
        const listeners = this.listeners.get(event)
  
        if (listeners) {
            [...listeners].map(listener => listener(data))
        }
    }
  
    remove(event, listener) {
        const listeners = this.listeners.get(event)
  
        listeners.forEach(list => {
            if (list === listener) {
                listeners.delete(list)
            }
        })
    }
}
  
export default EventEmitter
  