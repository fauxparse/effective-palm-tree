FactoryGirl.define do
  factory :event do
    name 'PlayShop LIVE'

    transient do
      start Time.zone.local(2017, 3, 10, 21, 00)
    end

    recurrence do
      Montrose.daily.starting(start).total(1)
    end

    trait :old do
      transient do
        start Time.zone.local(2016, 3, 10, 21, 00)
      end
    end

    trait :weekly do
      after(:build) do |event|
        event.recurrence = event.recurrence.merge(Montrose.every(:week))
      end
    end

    trait :repeating do
      after(:build) do |event|
        event.recurrence = Montrose::Recurrence.new(
          event.recurrence.to_h.except(:total)
        )
      end
    end
  end
end
