FactoryGirl.define do
  factory :group do
    name 'PlayShop'
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
  end
end
