# frozen_string_literal: true
class AssignmentSerializer < ActiveModel::Serializer
  attributes :id, :member_id, :allocation_id, :confirmed

  def confirmed
    object.confirmed?
  end
end
