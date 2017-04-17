# frozen_string_literal: true

class MemberSerializer < ActiveModel::Serializer
  attributes :id, :name, :admin, :avatar_url, :slug, :registered
  belongs_to :group
  has_many :pending_invitations, key: :invitations

  def registered
    object.user_id.present?
  end
end
