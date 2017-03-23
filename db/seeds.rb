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

mc = playshop.roles.create(name: 'MC', plural: 'MCs')
player = playshop.roles.create(name: 'player')
muso = playshop.roles.create(name: 'muso')

live = playshop.events.create(
  name: 'PlayShop LIVE',
  slug: 'live',
  schedule: schedule
)

mcs = live.allocations.create!(role: mc, min: 1, max: 1)
players = live.allocations.create!(role: player, min: 1, max: 4)
musos = live.allocations.create!(role: muso, min: 0, max: 1)

live.occurrences.on(Date.civil(2017, 3, 17)).tap do |show|
  show.save!
  {
    mcs => %w(Matt),
    players => %w(Jen Janaye Aaron Barney),
    musos => %w(Oli)
  }.each do |role, names|
    names.map { |name| Member.find_by(name: name) }.each do |member|
      show.assignments.create!(member: member, allocation: role)
    end
  end
end
