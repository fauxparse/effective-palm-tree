require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { create(:user, email: 'ripley@sula.co') }

  it { is_expected.to be_valid }
  it { is_expected.to validate_presence_of :email }
  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
end
