# frozen_string_literal: true

class AllocationSerializer < ActiveModel::Serializer
  attributes :id, :role_id, :min, :max
end
