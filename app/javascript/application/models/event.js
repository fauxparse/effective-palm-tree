const Event = {
  AVAILABLE: true,
  UNAVAILABLE: false,
  UNKNOWN: null,

  cycleAvailability: (availability) => {
    if (availability === Event.AVAILABLE) {
      return Event.UNAVAILABLE
    } else if (availability === Event.UNAVAILABLE) {
      return Event.UNKNOWN
    } else {
      return Event.AVAILABLE
    }
  },

  availableClass: (availability) => {
    if (availability === Event.AVAILABLE) {
      return 'available'
    } else if (availability === Event.UNAVAILABLE) {
      return 'unavailable'
    } else {
      return 'unknown'
    }
  }
}

export default Event
