class InvitationSerializer < ActiveModel::Serializer
  attributes :id, :member_id, :admin_id, :email, :status, :updated_at
end
