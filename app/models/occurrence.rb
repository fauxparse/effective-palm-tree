# frozen_string_literal: true

class Occurrence < ApplicationRecord
  include TimeRanges

  module MemberAvailability
    def for_member(member)
      id = member.respond_to?(:id) ? member.id : member.to_i
      detect { |a| a.member_id == id } ||
        build(member_id: id, occurrence: proxy_association.owner)
    end
  end

  belongs_to :event
  has_one :group, through: :event
  has_many :allocations, through: :event
  has_many :assignments, dependent: :destroy, autosave: true
  has_many :availability, -> { extending MemberAvailability },
    inverse_of: :occurrence,
    dependent: :destroy,
    autosave: true

  def to_param
    starts_at.strftime('%Y-%m-%d')
  end
end
