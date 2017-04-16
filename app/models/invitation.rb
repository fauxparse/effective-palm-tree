class Invitation < ApplicationRecord
  belongs_to :member
  belongs_to :admin, class_name: 'Member'

  enum status: {
    pending: 'pending',
    accepted: 'accepted',
    declined: 'declined'
  }

  before_validation :generate_token, unless: :token?

  validates :email,
    email: { strict_mode: true },
    presence: true

  validates :token,
    presence: true,
    uniqueness: true

  validates :status, uniqueness: { scope: :member_id }, if: :pending?

  validate :from_admin, if: %i[admin]
  validate :same_group, if: %i[member admin]

  private

  def generate_token
    loop do
      self.token = Clearance::Token.new
      break unless Invitation.where(token: token).exists?
    end
  end

  def from_admin
    errors.add(:admin_id, :must_be_admin) unless admin.admin?
  end

  def same_group
    errors.add(:member_id, :invalid_group) unless same_group?
  end

  def same_group?
    member.group_id == admin.group_id
  end
end
