class InvitationSerializer < ActiveModel::Serializer
  attributes :token, :member_id, :admin_id, :email, :status, :updated_at
end
