class Occurrence < ApplicationRecord
  include TimeRanges

  belongs_to :event
  has_one :group, through: :event
  has_many :availability, dependent: :destroy, autosave: true do
    def build(attrs = {})
      super.tap { |a| a.occurrence = proxy_association.owner }
    end

    def for_member(member)
      id = member.respond_to?(:id) ? member.id : member.to_i
      detect { |a| a.member_id == id } || build(member_id: id)
    end
  end

  def to_param
    starts_at.strftime('%Y-%m-%d')
  end
end
