schedule = IceCube::Schedule.new(
  Time.zone.local(2017, 3, 10, 21),
  duration: 1.hour
)
schedule.add_recurrence_rule(IceCube::Rule.weekly)

Event.create(
  name: 'PlayShop LIVE',
  schedule: schedule
)
