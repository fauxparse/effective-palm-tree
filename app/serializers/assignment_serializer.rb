# frozen_string_literal: true
class AssignmentSerializer < ActiveModel::Serializer
  attributes :member_id, :confirmed

  def confirmed
    object.confirmed?
  end
end
