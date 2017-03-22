# frozen_string_literal: true
playshop = Group.create(name: 'PlayShop')
NAMES = %w(
  Matt Jen Ryan Sam Lori Christine Maddy Janaye Aaron George Maria Jed Harriet
  Stevie Liam Gabby Pippa Oli Tom Austin Callum Sabrina Barney Zoe
)

NAMES.each.with_index(23) do |name, i|
  playshop.members.create!(
    name: name,
    avatar_url: "http://unsplash.it/64/64?image=#{i}"
  )
end

User.create!(email: 'fauxparse@gmail.com', password: 'p4$$w0rd').tap do |matt|
  playshop.members.find_by(name: 'Matt').update!(user: matt, admin: true)
end

schedule = IceCube::Schedule.new(
  Time.zone.local(2017, 3, 10, 21),
  duration: 1.hour
)
schedule.add_recurrence_rule(IceCube::Rule.weekly)

playshop.roles.create(name: 'MC', plural: 'MCs')
playshop.roles.create(name: 'player')
playshop.roles.create(name: 'muso')

playshop.events.create(
  name: 'PlayShop LIVE',
  slug: 'live',
  schedule: schedule
)
