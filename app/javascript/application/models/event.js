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
  }
}

export default Event
