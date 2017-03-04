playshop = Group.create(name: 'PlayShop')

schedule = IceCube::Schedule.new(
  Time.zone.local(2017, 3, 10, 21),
  duration: 1.hour
)
schedule.add_recurrence_rule(IceCube::Rule.weekly)

playshop.events.create(
  name: 'PlayShop LIVE',
  schedule: schedule
)
