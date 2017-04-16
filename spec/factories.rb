# frozen_string_literal: true

FactoryGirl.define do
  sequence(:email) { |n| "user#{n}@example.com" }

  factory :allocation do
    event
    role { create(:role, group: event.group) }
  end

  factory :assignment do
    allocation
    occurrence do
      create(:occurrence, event: create(:event, group: allocation.role.group))
    end
    member { create(:member, group: allocation.role.group) }
  end

  factory :availability do
    member
    occurrence
  end

  factory :event do
    name 'PlayShop LIVE'
    group

    transient do
      start Time.zone.local(2017, 3, 10, 21, 0)
      duration 3600
    end

    schedule do
      IceCube::Schedule.new(start, duration: duration)
    end

    trait :old do
      transient do
        start Time.zone.local(2016, 3, 10, 21, 0)
      end
    end

    trait :weekly do
      after(:build) do |event|
        event.schedule = event.schedule.dup.tap do |schedule|
          schedule.add_recurrence_rule(IceCube::Rule.weekly)
        end
      end
    end

    trait :with_roles do
      after(:create) do |event|
        event.allocations.create(
          role: create(:role, name: 'MC', group: event.group), min: 1, max: 1
        )
        event.allocations.create(
          role: create(:role, name: 'player', group: event.group), max: 4
        )
        event.allocations.create(
          role: create(:role, name: 'muso', group: event.group), max: 1
        )
      end
    end
  end

  factory :group do
    name 'PlayShop'

    trait :with_roles do
      after(:create) do |group|
        create(:role, group: group, name: 'MC')
        create(:role, group: group, name: 'player')
        create(:role, group: group, name: 'muso')
      end
    end

    trait :with_members do
      after(:create) do |group|
        5.times { create(:member, group: group) }
      end
    end
  end

  factory :invitation do
    member
    email { "#{member.name.underscore}@sula.co" }
    admin { create(:administrator, group: member.group) }
  end

  factory :member do
    name 'Matt'
    group

    trait :verified do
      user
    end

    factory :administrator do
      verified
      admin true
    end
  end

  factory :occurrence do
    event
    starts_at { event.schedule.first }
    ends_at { starts_at + event.duration }
  end

  factory :role do
    name 'player'
    group
  end

  factory :user do
    email { generate(:email) }
    password 'p4$$w0rd'
  end
end
