playshop = Group.create(name: 'PlayShop')

%w(
  Matt Jen Ryan Sam Lori Christine Maddy Janaye Aaron George Maria Jed Harriet
  Stevie Liam Gabby Pippa Oli Tom Austin Karin Callum Sabrina Barney Zoe
).each { |name, admin| playshop.members.create!(name: name, admin: admin) }

User.create!(email: 'fauxparse@gmail.com', password: 'p4$$w0rd').tap do |matt|
  playshop.members.find_by(name: 'Matt').update!(user: matt, admin: true)
end

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
