playshop = Group.create(name: 'PlayShop')

{
  'Matt' => true,
  'Jen' => false,
  'Ryan' => false,
  'Sam' => true,
  'Lori' => true,
  'Christine' => false,
  'Maddy' => true,
  'Janaye' => false,
  'Aaron' => false,
  'George' => false,
  'Maria' => false,
  'Jed' => false,
  'Harriet' => false,
  'Stevie' => false,
  'Liam' => false,
  'Gabby' => false,
  'Pippa' => false,
  'Oli' => false,
  'Tom' => false,
  'Austin' => false,
  'Karin' => false,
  'Callum' => false,
  'Sabrina' => false,
  'Barney' => false,
  'Zoe' => false
}.each { |name, admin| playshop.members.create(name: name, admin: admin) }

schedule = IceCube::Schedule.new(
  Time.zone.local(2017, 3, 10, 21),
  duration: 1.hour
)
schedule.add_recurrence_rule(IceCube::Rule.weekly)

playshop.events.create(
  name: 'PlayShop LIVE',
  slug: 'live',
  schedule: schedule
)
