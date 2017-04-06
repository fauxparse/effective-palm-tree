# frozen_string_literal: true

class MemberSerializer < ActiveModel::Serializer
  attributes :id, :name, :admin, :avatar_url
  belongs_to :group
end
