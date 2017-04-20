class InvitationSerializer < ActiveModel::Serializer
  attributes :token, :member_id, :admin_id, :email, :status, :updated_at
  has_one :member
  has_one :admin
  has_one :group
end
