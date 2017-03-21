# frozen_string_literal: true
class Availability < ApplicationRecord
  belongs_to :member, inverse_of: :availability
  belongs_to :occurrence, inverse_of: :availability

  before_validation :save_parent, on: :create

  validates :member_id, :occurrence_id, presence: true
  validates :member_id, uniqueness: { scope: :occurrence_id, allow_blank: true }

  private

  def save_parent
    occurrence.save! unless occurrence.persisted?
  end
end
